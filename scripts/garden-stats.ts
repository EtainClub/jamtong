/**
 * 정원 지표 — Firestore에 남은 기록으로 본다 (docs/garden-game.md §3.11).
 *
 *   pnpm garden:stats            최근 14일
 *   pnpm garden:stats --days 30
 *
 * 무엇을 볼 수 있고 무엇을 볼 수 없나:
 *   - 볼 수 있다: 정원 수와 마지막 활동, 광장 기록판(날마다 뽑힌 수·정원지기 수),
 *     거대 잡초 물결마다의 결과·걸린 시간·모인 사람, 꽃밭, 초대, 공개 정원,
 *     잼 분포, 방(공개·가림), 1촌 수 분포, 방명록 수, 공개 장부와 공개 문서의 어긋남(docs/garden-miniroom.md §8).
 *   - 볼 수 없다: 재방문율(D1·D7), 하루 세션 수, 근거 열람률. 이것은 계측 이벤트
 *     (src/lib/analytics.ts)로만 보인다 — Firestore에는 "언제 왔는가"의 이력이 없고
 *     정원 문서의 updatedAt은 마지막 한 번뿐이다.
 *
 * 읽기만 한다. 관리자 키(sa.json)가 필요하다 — 개인 정원(users/{uid}/garden)은 본인만 읽는다.
 * 사람을 되짚을 값(uid·정원 이름)은 찍지 않는다. 숫자만 낸다.
 */
import { readFileSync } from "node:fs";

import type { Firestore, Timestamp } from "firebase-admin/firestore";

import { BLOOM_CARE, kstDay, RAID_HP_MIN, RAID_LIFE, RAID_MIN_FIGHTERS, RAID_SHARDS, RAID_USES_PER_PERSON } from "../src/features/garden/rules";
import { raidStars } from "../src/features/garden/raid/rules";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const KST = 9 * HOUR;

function arg(name: string, fallback: number): number {
  const i = process.argv.indexOf(name);
  const v = i >= 0 ? Number(process.argv[i + 1]) : NaN;
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

const DAYS = arg("--days", 14);
const NOW = Date.now();
const SINCE = NOW - DAYS * DAY;

function ms(t: Timestamp | number | null | undefined): number | null {
  if (t === null || t === undefined) return null;
  return typeof t === "number" ? t : t.toMillis();
}

function median(xs: number[]): number | null {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function pct(n: number, d: number): string {
  return d ? `${Math.round((n / d) * 100)}%` : "-";
}

function kstTime(t: number): string {
  return new Date(t + KST).toISOString().slice(5, 16).replace("T", " ");
}

function title(s: string) {
  console.log(`\n── ${s} ${"─".repeat(Math.max(0, 50 - s.length * 2))}`);
}

// ── 개인 정원 ──────────────────────────────────────────────────────

async function gardens(db: Firestore): Promise<Array<{ uid: string; share?: { id?: string | null; on?: boolean }; updatedAt: number }>> {
  title("개인 정원 (계정에 올라간 것만)");
  const snap = await db.collectionGroup("garden").get();
  const states = snap.docs.filter((d) => d.id === "state").map((d) => d.data());

  const last = states.map((s) => ms(s.updatedAt) ?? 0);
  const dexSize = states.map((s) => Object.keys((s.dex as Record<string, unknown>) ?? {}).length);
  const harvested = dexSize.filter((n) => n > 0).length;
  const invited = states.filter((s) => s.invite?.by).length;
  const shared = states.filter((s) => s.share?.on).length;
  const planted = states.filter((s) => (s.beds as unknown[] | undefined)?.some(Boolean)).length;

  console.log(`정원 ${states.length} · 한 번이라도 거둔 정원 ${harvested} (${pct(harvested, states.length)})`);
  console.log(
    `마지막 활동 — 24시간 안 ${last.filter((t) => t > NOW - DAY).length} · 7일 안 ${last.filter((t) => t > NOW - 7 * DAY).length} · 그 전 ${last.filter((t) => t <= NOW - 7 * DAY).length}`,
  );
  console.log(`지금 텃밭에 심긴 정원 ${planted} · 공개 중 ${shared} · 초대 링크를 받아들인 정원 ${invited}`);

  console.log(`도감 품종 수 — ${histogram(dexSize, [0, 1, 10, 40, 100], "종")}`);

  // 잼 분포 — 가구 값을 맞출 근거(docs/garden-miniroom.md §6.2, §8의 5).
  const jam = states.map((s) => Number(s.jam) || 0);
  console.log(`잼 — ${histogram(jam, [0, 100, 500, 1500, 5000, 20000], "")} · 중앙값 ${median(jam) ?? "-"}`);

  return snap.docs
    .filter((d) => d.id === "state")
    .map((d) => ({ uid: d.ref.parent.parent?.id ?? "", share: d.get("share") as { id?: string | null; on?: boolean } | undefined, updatedAt: ms(d.get("updatedAt")) ?? 0 }));
}

function histogram(xs: number[], buckets: number[], unit: string): string {
  return buckets
    .map((lo, i) => {
      const hi = buckets[i + 1] ?? Infinity;
      const n = xs.filter((x) => x >= lo && x < hi).length;
      return `${lo}${hi === Infinity ? "+" : `–${hi - 1}`}${unit} ${n}`;
    })
    .join(" · ");
}

// ── 광장 기록판 ────────────────────────────────────────────────────

async function plaza(db: Firestore) {
  title(`광장 기록판 (최근 ${DAYS}일)`);
  const from = kstDay(SINCE);
  const snap = await db.collection("plazaDays").where("__name__", ">=", from).get();
  const days = snap.docs.map((d) => ({ day: d.id, pulls: d.get("pulls") ?? 0, gardeners: d.get("gardeners") ?? 0 }));
  if (days.length === 0) return console.log("기록 없음");
  for (const d of days) console.log(`${d.day}  정원지기 ${String(d.gardeners).padStart(4)}  뽑힌 잡초 ${String(d.pulls).padStart(6)}`);
  const g = days.map((d) => d.gardeners);
  console.log(`하루 정원지기 중앙값 ${median(g)} · 최대 ${Math.max(...g)}`);
  console.log("(정원지기 = 그날 잡초를 한 포기라도 뽑은 사람. 광장에 왔다가 뽑지 않은 사람은 세지 않는다)");
}

// ── 거대 잡초 ──────────────────────────────────────────────────────

interface Wave {
  id: string;
  wave: number;
  spawnedAt: number | null;
  defeatedAt: number | null;
  hp: number;
  hits: number;
  fighters: number;
  /** 한 사람이 넣은 센 값. */
  each: number[];
  /** 한 사람이 쓴 기력(2.0 이전 표식은 센 값과 같다)과 건 지원 수. */
  uses: number[];
  aids: number[];
  /** 물결 문서에 직접 오른 몫 — 칸 이전(2026-11-06 전) 화면의 옛 길로 들어온 것. */
  legacy: number;
}

async function raids(db: Firestore) {
  title(`거대 잡초 (최근 ${DAYS}일)`);
  const fromDay = Math.floor((SINCE + KST) / DAY);
  const snap = await db.collection("plazaRaids").where("__name__", ">=", `${fromDay}`).get();

  const waves: Wave[] = await Promise.all(
    snap.docs.map(async (d) => {
      const [shards, fighters] = await Promise.all([d.ref.collection("shards").get(), d.ref.collection("fighters").get()]);
      const sum = (k: string) => shards.docs.reduce((n, s) => n + ((s.get(k) as number | undefined) ?? 0), 0);
      return {
        id: d.id,
        wave: Number(d.id.split("-")[1] ?? 0),
        spawnedAt: ms(d.get("spawnedAt")),
        defeatedAt: ms(d.get("defeatedAt")),
        hp: d.get("hp") ?? 0,
        hits: (d.get("hits") ?? 0) + sum("hits"),
        fighters: (d.get("fighters") ?? 0) + sum("fighters"),
        each: fighters.docs.map((f) => (f.get("hits") as number | undefined) ?? 0),
        uses: fighters.docs.map((f) => (f.get("uses") as number | undefined) ?? ((f.get("hits") as number | undefined) ?? 0)),
        aids: fighters.docs.map((f) => (f.get("aids") as number | undefined) ?? 0),
        legacy: d.get("hits") ?? 0,
      };
    }),
  );
  if (waves.length === 0) return console.log("물결 없음");
  waves.sort((a, b) => (a.spawnedAt ?? 0) - (b.spawnedAt ?? 0));

  console.log(`지금 규칙: 체력 ${RAID_HP_MIN} (= ${RAID_MIN_FIGHTERS}명 몫) · ${RAID_LIFE / HOUR}시간 뒤 도망 · 칸 ${RAID_SHARDS}`);
  console.log("");
  for (const w of waves) {
    const end = w.defeatedAt ?? (w.spawnedAt !== null && NOW >= w.spawnedAt + RAID_LIFE ? w.spawnedAt + RAID_LIFE : null);
    const result = w.defeatedAt ? "쓰러짐" : end ? "도망  " : "싸우는 중";
    const minutes = end && w.spawnedAt ? Math.round((end - w.spawnedAt) / 60_000) : null;
    // 빈틈 비율: 빈틈의 한 번은 두 번으로 세므로 (센 값 − 쓴 기력) = 빈틈에 쓴 기력. 표식에 새 필드를 두지 않고 셈한다.
    const used = w.uses.reduce((a, b) => a + b, 0);
    const gapUses = w.each.reduce((a, b, i) => a + Math.max(0, b - w.uses[i]), 0);
    const supporters = w.aids.filter((a) => a > 0).length;
    const supportOnly = w.aids.filter((a, i) => a > 0 && w.uses[i] === 0).length;
    const stars = raidStars(w.spawnedAt, w.defeatedAt);
    console.log(
      `${w.id}  ${w.spawnedAt ? kstTime(w.spawnedAt) : "?"}  ${result}  ${minutes === null ? "   -" : String(minutes).padStart(4)}분  ` +
        `${String(w.fighters).padStart(3)}명  ${w.hits}/${w.hp}  ${stars ? "★".repeat(stars).padEnd(3) : "   "}  ` +
        `빈틈 ${pct(gapUses, used).padStart(4)}  지원 ${supporters}명(지원만 ${supportOnly})  기력 다 쓴 사람 ${w.uses.filter((u) => u >= RAID_USES_PER_PERSON).length}` +
        (w.legacy ? `  옛 길 ${w.legacy}` : ""),
    );
  }

  // 물결이 생기기 전(2026-11-05 전)의 문서는 id가 날짜 번호뿐이고 체력 규칙도 달랐다. 판단에서 뺀다.
  const legacy = waves.filter((w) => !w.id.includes("-")).length;
  const current = waves.filter((w) => w.id.includes("-"));
  const ended = current.filter((w) => w.defeatedAt || (w.spawnedAt !== null && NOW >= w.spawnedAt + RAID_LIFE));
  const won = ended.filter((w) => w.defeatedAt);
  const toKill = won.filter((w) => w.spawnedAt).map((w) => Math.round((w.defeatedAt! - w.spawnedAt!) / 60_000));
  const escapedShort = ended.filter((w) => !w.defeatedAt && w.fighters > 0 && w.fighters < RAID_MIN_FIGHTERS).length;

  console.log("");
  if (legacy) console.log(`(물결 이전의 옛 문서 ${legacy}개는 아래 요약에서 뺐다)`);
  console.log(`끝난 물결 ${ended.length} · 쓰러뜨림 ${won.length} (${pct(won.length, ended.length)})`);
  console.log(`쓰러뜨리기까지 중앙값 ${median(toKill) ?? "-"}분 · 쓰러뜨린 물결의 인원 중앙값 ${median(won.map((w) => w.fighters)) ?? "-"}명`);
  console.log(`도망간 물결 중 때린 사람이 ${RAID_MIN_FIGHTERS}명보다 적었던 것 ${escapedShort} · 아무도 안 때린 것 ${ended.filter((w) => w.fighters === 0).length}`);
  console.log(
    `물결별 등장 — ${[1, 2, 3, 4, 5].map((n) => `${n}번 ${current.filter((w) => w.wave === n).length}`).join(" · ")}`,
  );

  // 거대 잡초 2.0(docs/garden-miniroom.md §8의 5). 체력 RAID_HP_MIN 이상인 물결만 빈틈이 있다.
  const v2 = ended.filter((w) => w.hp >= RAID_HP_MIN);
  if (v2.length) {
    const used = v2.reduce((n, w) => n + w.uses.reduce((a, b) => a + b, 0), 0);
    const gap = v2.reduce((n, w) => n + w.each.reduce((a, b, i) => a + Math.max(0, b - w.uses[i]), 0), 0);
    const starOf = v2.filter((w) => w.defeatedAt).map((w) => raidStars(w.spawnedAt, w.defeatedAt));
    console.log(
      `2.0 물결 ${v2.length} · 처치 ${pct(starOf.length, v2.length)} (70% 아래로 내려가거나 도망 30%를 넘으면 체력을 되돌린다) · ` +
        `쓴 기력 중 빈틈 ${pct(gap, used)} · ★★★ ${starOf.filter((n) => n === 3).length} · ★★ ${starOf.filter((n) => n === 2).length} · ★ ${starOf.filter((n) => n === 1).length}`,
    );
    console.log(`물결당 지원한 사람 중앙값 ${median(v2.map((w) => w.aids.filter((a) => a > 0).length)) ?? "-"} · 지원만 한 사람이 있던 물결 ${v2.filter((w) => w.aids.some((a, i) => a > 0 && w.uses[i] === 0)).length}`);
  }
  // 옛 길(물결 문서 직접 +1)이 칸 도입 뒤에도 쓰였는가. 0이 이어지면 규칙의 그 길을 지운다(배포 메모).
  const sinceShards = current.filter((w) => (w.spawnedAt ?? 0) >= Date.parse("2026-11-07T00:00:00+09:00"));
  console.log(`옛 길(물결 문서 hits)로 들어온 물결 — 11-07 이후 ${sinceShards.filter((w) => w.legacy > 0).length}/${sinceShards.length}`);
  console.log("");
  console.log(`필요 인원(RAID_MIN_FIGHTERS) 판단: 쓰러뜨림 비율이 높고 처치 시간이 짧으며 인원 중앙값이 ${RAID_MIN_FIGHTERS}보다 넉넉하면 올린다.`);
  console.log("도망이 많고 그 대부분이 인원 부족이면 그대로 두거나 사람을 모으는 장치(같이 잡자)부터 본다.");
}

// ── 꽃밭·초대·공개 정원 ────────────────────────────────────────────

async function community(db: Firestore) {
  title("꽃밭");
  const blooms = await db.collection("blooms").get();
  const care = blooms.docs.map((d) => (d.get("care") as number | undefined) ?? 0);
  const bloomed = blooms.docs.filter((d) => d.get("bloomedAt")).length;
  const keepers = new Set(blooms.docs.map((d) => d.get("ownerUid")).filter(Boolean)).size;
  const near = care.filter((c, i) => !blooms.docs[i].get("bloomedAt") && c >= BLOOM_CARE * 0.75).length;
  console.log(`가꿈이 있는 업적 ${blooms.size} · 만개 ${bloomed} · 피기 직전(75%+) ${near} · 가꿈 합계 ${care.reduce((a, b) => a + b, 0)}`);
  console.log(`정원지기 자리 ${blooms.docs.filter((d) => d.get("ownerUid")).length} · 서로 다른 정원지기 ${keepers}명`);

  title("초대·공개 정원");
  const [codes, gardensSnap] = await Promise.all([db.collection("inviteCodes").get(), db.collection("gardens").get()]);
  const joined = codes.docs.map((d) => (d.get("joined") as number | undefined) ?? 0);
  console.log(`초대 코드 ${codes.size} · 친구가 첫 열매까지 간 초대 ${joined.reduce((a, b) => a + b, 0)} · 한 명 이상 데려온 코드 ${joined.filter((n) => n > 0).length}`);
  console.log(`공개 정원 ${gardensSnap.size}`);
}

// ── 방·1촌 (docs/garden-miniroom.md §5, §8의 2·5) ──────────────────

async function rooms(db: Firestore, states: Awaited<ReturnType<typeof gardens>>) {
  title(`방과 1촌 (방명록은 최근 ${DAYS}일)`);
  const docs = (await db.collection("gardens").get()).docs;
  const hidden = docs.filter((d) => d.get("hidden") === true);
  const withRoom = docs.filter((d) => d.get("hidden") !== true && d.get("room"));
  console.log(`공개 문서 ${docs.length} · 열린 방 ${docs.length - hidden.length} (방을 꾸민 것 ${withRoom.length}) · 가린 방 ${hidden.length}`);

  // 1촌 수와 방명록은 방마다 서버가 센다(문서를 받지 않는다). 컬렉션 하나 안의 조건이라 자동 색인으로 된다.
  const since = new Date(SINCE);
  const per = await Promise.all(
    docs.map(async (d) => {
      const [il, gb] = await Promise.all([
        d.ref.collection("ilchon").count().get(),
        d.ref.collection("guestbook").where("at", ">=", since).count().get(),
      ]);
      return { ilchon: il.data().count, guestbook: gb.data().count };
    }),
  );
  const friends = per.map((p) => p.ilchon);
  console.log(`1촌 수 — ${histogram(friends, [0, 1, 3, 10, 30, 50], "명")} · 1촌이 하나라도 있는 방 ${friends.filter((n) => n > 0).length}`);
  console.log(`방명록 — 최근 ${DAYS}일 ${per.reduce((n, p) => n + p.guestbook, 0)}장 · 받은 방 ${per.filter((p) => p.guestbook > 0).length}`);

  // §8의 2: 공개를 켠 장부와 공개 문서의 어긋남. 사람을 되짚을 값(uid·공개 id)은 찍지 않는다.
  const byId = new Map(docs.map((d) => [d.id, d]));
  const on = states.filter((s) => s.share?.on && s.share.id);
  const ids = new Map<string, number>();
  for (const s of on) ids.set(s.share!.id!, (ids.get(s.share!.id!) ?? 0) + 1);
  const missing = on.filter((s) => !byId.has(s.share!.id!));
  const foreign = on.filter((s) => byId.has(s.share!.id!) && byId.get(s.share!.id!)!.get("ownerUid") !== s.uid);
  console.log(
    `공개를 켠 장부 ${on.length} · 서로 다른 공개 id ${ids.size} · 같은 id를 둘 이상이 가진 것 ${[...ids.values()].filter((n) => n > 1).length}`,
  );
  console.log(`  그중 공개 문서가 없는 장부 ${missing.length} · 문서가 다른 계정 것인 장부 ${foreign.length}`);
  console.log(
    `  문서가 없는 장부의 마지막 활동 — 7일 안 ${missing.filter((s) => s.updatedAt > NOW - 7 * DAY).length} · 그 전 ${missing.filter((s) => s.updatedAt <= NOW - 7 * DAY).length}`,
  );
  console.log("  (문서가 다른 계정 것 = 로그아웃·계정 바꾸기로 공개 id가 새 계정에 딸려 간 것. 새 화면은 새 id를 만든다 — share.ts)");
}

async function main() {
  readFileSync("sa.json", "utf8");
  const appMod = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  appMod.initializeApp({ credential: appMod.cert("sa.json") });
  const db = getFirestore();

  console.log(`잼통 정원 지표 · ${kstTime(NOW)} KST · 최근 ${DAYS}일`);
  const states = await gardens(db);
  await plaza(db);
  await raids(db);
  await community(db);
  await rooms(db, states);

  console.log("\n재방문율·하루 세션 수·근거 열람률은 여기서 보이지 않는다 — 계측 이벤트(analytics.ts)로 본다.");
}

main().catch((error) => {
  if ((error as NodeJS.ErrnoException).code === "ENOENT") {
    console.error("sa.json(서비스 계정 키)이 없다. 저장소 루트에 두고 다시 돌린다.");
  } else {
    console.error(error);
  }
  process.exit(1);
});

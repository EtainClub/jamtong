/**
 * 정원 지표 — Firestore에 남은 기록으로 본다 (docs/garden-game.md §3.11).
 *
 *   pnpm garden:stats            최근 14일
 *   pnpm garden:stats --days 30
 *
 * 무엇을 볼 수 있고 무엇을 볼 수 없나:
 *   - 볼 수 있다: 정원 수와 마지막 활동, 광장 기록판(날마다 뽑힌 수·정원지기 수),
 *     거대 잡초 물결마다의 결과·걸린 시간·모인 사람, 꽃밭, 초대, 공개 정원.
 *   - 볼 수 없다: 재방문율(D1·D7), 하루 세션 수, 근거 열람률. 이것은 계측 이벤트
 *     (src/lib/analytics.ts)로만 보인다 — Firestore에는 "언제 왔는가"의 이력이 없고
 *     정원 문서의 updatedAt은 마지막 한 번뿐이다.
 *
 * 읽기만 한다. 관리자 키(sa.json)가 필요하다 — 개인 정원(users/{uid}/garden)은 본인만 읽는다.
 * 사람을 되짚을 값(uid·정원 이름)은 찍지 않는다. 숫자만 낸다.
 */
import { readFileSync } from "node:fs";

import type { Firestore, Timestamp } from "firebase-admin/firestore";

import { BLOOM_CARE, kstDay, RAID_HP_MIN, RAID_LIFE, RAID_MIN_FIGHTERS, RAID_SHARDS } from "../src/features/garden/rules";

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

async function gardens(db: Firestore) {
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

  const buckets = [0, 1, 10, 40, 100];
  const row = buckets.map((lo, i) => {
    const hi = buckets[i + 1] ?? Infinity;
    const n = dexSize.filter((x) => x >= lo && x < hi).length;
    return `${lo}${hi === Infinity ? "+" : `–${hi - 1}`}종 ${n}`;
  });
  console.log(`도감 품종 수 — ${row.join(" · ")}`);
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
  /** 한 사람이 때린 수. */
  each: number[];
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
    const top = Math.max(0, ...w.each);
    console.log(
      `${w.id}  ${w.spawnedAt ? kstTime(w.spawnedAt) : "?"}  ${result}  ${minutes === null ? "   -" : String(minutes).padStart(4)}분  ` +
        `${String(w.fighters).padStart(3)}명  ${w.hits}/${w.hp}방  가장 많이 때린 한 사람 ${top}`,
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
    `물결별 등장 — ${[1, 2, 3].map((n) => `${n}번 ${current.filter((w) => w.wave === n).length}`).join(" · ")}`,
  );
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

async function main() {
  readFileSync("sa.json", "utf8");
  const appMod = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  appMod.initializeApp({ credential: appMod.cert("sa.json") });
  const db = getFirestore();

  console.log(`잼통 정원 지표 · ${kstTime(NOW)} KST · 최근 ${DAYS}일`);
  await gardens(db);
  await plaza(db);
  await raids(db);
  await community(db);

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

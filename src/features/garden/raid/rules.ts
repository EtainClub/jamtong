import {
  hash,
  MINUTE,
  RAID_AID_COOLDOWN,
  RAID_AID_COOLDOWN_ITEM,
  RAID_BOX,
  RAID_BOX_FAST_PERENNIAL,
  RAID_KINDS,
  RAID_USES_PER_PERSON,
  raidFormsCleared,
  rng,
  type RaidAidId,
  type RaidKindId,
  type RaidPhase,
  type RaidWave,
} from "../rules";

/**
 * 거대 잡초 2.0의 화면 쪽 규칙 — 아이템·보상·뿌리 조각·박제·포자. 순수 함수만 둔다(raid.test.ts).
 * 설계는 docs/garden-miniroom.md §7.3·§7.4.
 *
 * ★ 여기 있는 것은 모두 내 정원 장부와 손맛에만 닿는다. 센 값(hits)·기력(uses)·빈틈은
 *   ../rules.ts와 firestore.rules가 정한다. 그래서 아이템은 기다림·묶임·콤보 같은 손맛만 바꾸고,
 *   "기력을 더 주는" 아이템은 만들지 않는다 — 규칙이 산 것을 볼 수 없어서, 만들면 혼자 잡는 길이 열린다.
 * ★ 무작위는 없다. 보상은 물결 문서의 두 시각(태어난 때·쓰러진 때)과 내 표식에서 정해진다.
 * ★ 수치는 모두 첫 실험값이다. 고칠 때는 여기 한 군데만 고친다.
 */

// ── 아이템 (§7.3) ────────────────────────────────────────────────────

/**
 * 싸움 도구 — 필살기 셋(../rules.ts의 FINISHERS) 말고 여섯. 모두 잼, 정해진 값, 하루 상한.
 * wave: 쓰면 그 물결 동안 켜진다. aid: 그 지원의 기다림을 줄인다.
 */
export type KitId = "drumstick" | "rib" | "battery" | "glove" | "clock" | "juice";

export interface KitItem {
  label: string;
  icon: string;
  price: number;
  perDay: number;
  hint: string;
  group: "aid" | "hold";
  /** 줄여 주는 지원. */
  aid?: RaidAidId;
  /** 쓰면 그 물결 동안 켜진다(장갑은 반격 한 번에 하나씩 쓰인다). */
  wave: boolean;
}

export const KIT: Record<KitId, KitItem> = {
  drumstick: { label: "북채", icon: "🥢", price: 30, perDay: 3, group: "aid", aid: "drum", wave: true, hint: "응원 북의 기다림이 60초에서 20초로 — 물결 하나 동안." },
  rib: { label: "우산살", icon: "🌂", price: 30, perDay: 3, group: "aid", aid: "umbrella", wave: true, hint: "큰 우산의 기다림이 60초에서 20초로 — 물결 하나 동안." },
  battery: { label: "건전지", icon: "🔋", price: 30, perDay: 3, group: "aid", aid: "torch", wave: true, hint: "손전등의 기다림이 60초에서 20초로 — 물결 하나 동안." },
  glove: { label: "가죽 장갑", icon: "🧤", price: 25, perDay: 5, group: "hold", wave: false, hint: "반격에 맞아도 한 번은 묶이지 않아요. 맞는 순간 저절로 하나 써요." },
  clock: { label: "자명종", icon: "⏰", price: 15, perDay: 3, group: "hold", wave: true, hint: "물결 하나 동안, 다음 빈틈 1분 전마다 화면이 울려요(탭이 열려 있을 때)." },
  juice: { label: "잼 주스", icon: "🧃", price: 20, perDay: 3, group: "hold", wave: true, hint: "콤보가 끊기는 쉼이 2.5초에서 6초로 — 물결 하나 동안." },
};

export const KIT_ORDER: KitId[] = ["drumstick", "rib", "battery", "glove", "clock", "juice"];

/** 잼 주스를 마시면 콤보가 끊기는 쉼. 기본은 raidPlay.ts의 COMBO_GAP(2.5초). */
export const COMBO_GAP_JUICE = 6_000;
/** 자명종이 울리는 때 — 다음 빈틈의 이만큼 전. */
export const ALARM_LEAD = MINUTE;

export interface KitLedger {
  have: Partial<Record<KitId, number>>;
  day: string;
  bought: Partial<Record<KitId, number>>;
  /** 켜 둔 물결. 값이 지금 물결 id면 그 아이템이 켜져 있다. */
  on: Partial<Record<KitId, string>>;
}

export function freshKit(): KitLedger {
  return { have: {}, day: "", bought: {}, on: {} };
}

export function normalizeKit(raw: Partial<KitLedger> | undefined): KitLedger {
  const obj = <T,>(v: unknown): T => (v && typeof v === "object" ? (v as T) : ({} as T));
  return { have: obj(raw?.have), day: typeof raw?.day === "string" ? raw.day : "", bought: obj(raw?.bought), on: obj(raw?.on) };
}

/** 이 물결에 켜져 있는가. */
export function kitOn(kit: KitLedger, id: KitId, raid: string | null): boolean {
  return raid !== null && kit.on[id] === raid;
}

/** 내 지원 기다림 — 그 지원의 아이템이 이 물결에 켜져 있으면 짧다. */
export function aidCooldown(kit: KitLedger, aid: RaidAidId, raid: string | null): number {
  const item = KIT_ORDER.find((id) => KIT[id].aid === aid);
  return item && kitOn(kit, item, raid) ? RAID_AID_COOLDOWN_ITEM : RAID_AID_COOLDOWN;
}

// ── 보상 (§7.4) ──────────────────────────────────────────────────────

/** 빠른 처치 ★ — 태어나서 쓰러지기까지 이 분 안이면 ★★★, 다음 것 안이면 ★★, 그 밖 ★. */
export const STAR_MINUTES = [30, 90] as const;
/** ★마다의 뿌리 조각(인덱스 = 별 수). */
export const STAR_ROOTS = [0, 1, 2, 3] as const;
/** 기력을 다 썼다(끝까지). */
export const ROOTS_FULL = 1;
/** 지원을 이만큼 걸었다(응원단). */
export const CHEER_MIN = 3;
export const ROOTS_CHEER = 1;
/** 도망갔지만 쳤다 — 빈손은 아니게. */
export const ROOTS_ESCAPE = 1;

/**
 * 빠른 처치 ★. 물결 문서의 두 시각에서만 정해지므로 모두 같고 속일 수 없다. 아직 안 쓰러졌으면 0.
 * 쓰러진 시각은 한 번 찍히면 바뀌지 않으므로 별도 바뀌지 않는다.
 */
export function raidStars(spawnedAt: number | null, defeatedAt: number | null): 0 | 1 | 2 | 3 {
  if (spawnedAt === null || defeatedAt === null) return 0;
  const minutes = (defeatedAt - spawnedAt) / MINUTE;
  return minutes <= STAR_MINUTES[0] ? 3 : minutes <= STAR_MINUTES[1] ? 2 : 1;
}

/** 상자의 다년생 확률. ★★★이면 오른다(공개). */
export function boxPerennial(stars: number): number {
  return stars >= 3 ? RAID_BOX_FAST_PERENNIAL : RAID_BOX.odds[1].p;
}

export interface MyPart {
  /** 넣은 값(물결 내내 쌓인다). 3.0에서는 기력이 형태마다 다시 차므로, 들었는지는 이것으로 본다. */
  hits: number;
  /** 쓴 기력 — 3.0 물결에서는 마지막으로 든 형태에서 쓴 것. */
  uses: number;
  /** 건 지원 수. */
  aids: number;
}

/** 이 물결에 든 사람인가 — 한 번이라도 쳤거나 지원했다. */
export function tookPart(me: MyPart): boolean {
  return me.hits > 0 || me.uses > 0 || me.aids > 0;
}

export interface RaidLoot {
  /** 상자를 받는가(쓰러뜨렸고 들었다). */
  box: boolean;
  /** 상자의 다년생 확률. */
  perennial: number;
  roots: number;
  /** 무엇으로 받았는지(화면에 그대로 적는다). */
  lines: Array<{ label: string; roots: number }>;
}

/**
 * 이 물결의 ★과 상자 — 3.0 물결은 넘긴 형태 수가 ★이고, 1형만 넘겨도 상자가 확정이다(2·3형이 도망가도 받는다).
 * 2.0 물결은 쓰러뜨려야 상자이고 ★은 걸린 시간이다.
 */
export function raidOutcome(r: RaidWave, phase: RaidPhase): { won: boolean; stars: 0 | 1 | 2 | 3 } {
  const cleared = raidFormsCleared(r, phase);
  if (cleared === null) return { won: phase === "defeated", stars: phase === "defeated" ? raidStars(r.spawnedAt, r.defeatedAt) : 0 };
  const stars = Math.max(0, Math.min(3, cleared)) as 0 | 1 | 2 | 3;
  return { won: phase !== "active" && stars >= 1, stars };
}

/**
 * 한 물결의 보상. 쓰러뜨렸으면 상자·★ 조각·끝까지·응원단, 도망갔으면 친 사람에게 조각 하나.
 * 들지 않았으면 아무것도 없다. 장부(raids·loot.fled)가 물결마다 한 번만 받게 한다.
 */
export function raidLoot(phase: "defeated" | "escaped", stars: number, me: MyPart): RaidLoot {
  const none: RaidLoot = { box: false, perennial: boxPerennial(0), roots: 0, lines: [] };
  if (!tookPart(me)) return none;
  if (phase === "escaped") {
    return me.hits > 0 || me.uses > 0 ? { ...none, roots: ROOTS_ESCAPE, lines: [{ label: "도망갔지만 쳤어요", roots: ROOTS_ESCAPE }] } : none;
  }
  const lines: RaidLoot["lines"] = [{ label: `처치 ${"★".repeat(stars)}`, roots: STAR_ROOTS[stars] ?? 1 }];
  if (me.uses >= RAID_USES_PER_PERSON) lines.push({ label: `끝까지(기력 ${RAID_USES_PER_PERSON})`, roots: ROOTS_FULL });
  if (me.aids >= CHEER_MIN) lines.push({ label: `응원단(지원 ${CHEER_MIN}번 이상)`, roots: ROOTS_CHEER });
  return { box: true, perennial: boxPerennial(stars), roots: lines.reduce((n, l) => n + l.roots, 0), lines };
}

// ── 표본과 박제 ──────────────────────────────────────────────────────

/** 같은 종류의 표본 조각 이만큼이면 그 악초의 박제(방 전시품)가 확정이다. */
export const SAMPLES_PER_TROPHY = 3;
/** 여섯 박제를 다 모으면 받는 벽지(room/catalog.ts). */
export const TROPHY_WALLPAPER = "wp-guard";

/** 박제 전시품 id. 종류마다 하나. */
export function trophyId(kind: RaidKindId): string {
  return `t:${kind}`;
}

export function isRaidKind(id: unknown): id is RaidKindId {
  return typeof id === "string" && RAID_KINDS.some((k) => k.id === id);
}

/**
 * 표본 하나를 더한다. 셋이 되면 그 종류의 박제를 받는다(already에 이미 있으면 다시 주지 않는다).
 * 돌려주는 trophy는 이번에 새로 생긴 박제의 종류.
 */
export function addSample(
  samples: Partial<Record<RaidKindId, number>>,
  kind: RaidKindId,
  already: ReadonlySet<RaidKindId>,
): { samples: Partial<Record<RaidKindId, number>>; trophy: RaidKindId | null } {
  const n = Math.min(SAMPLES_PER_TROPHY, (samples[kind] ?? 0) + 1);
  const next = { ...samples, [kind]: n };
  return { samples: next, trophy: n >= SAMPLES_PER_TROPHY && !already.has(kind) ? kind : null };
}

export interface LootLedger {
  /** 도망간 물결에서 조각을 받은 물결(raidKey). 쓰러뜨린 물결은 상자 장부(raids)가 맡는다. */
  fled: number[];
  /** 물결(raidKey)마다 내가 든 형태(1–3). 형태 보상은 그 형태에 든 사람만 받는다. */
  parts: Record<string, number[]>;
  /** 물결(raidKey)마다 받은 잼 보상 — 0=참여, 1–3=그 형태 격파. */
  paid: Record<string, number[]>;
  /** 종류마다 모은 표본 조각(SAMPLES_PER_TROPHY까지). */
  samples: Partial<Record<RaidKindId, number>>;
  /** 고른 필살기 연출(전리품 상점). null이면 기본. */
  fx: string | null;
}

export function freshLoot(): LootLedger {
  return { fled: [], parts: {}, paid: {}, samples: {}, fx: null };
}

export function normalizeLoot(raw: Partial<LootLedger> | undefined): LootLedger {
  return {
    fled: Array.isArray(raw?.fled) ? raw.fled.filter((n): n is number => typeof n === "number") : [],
    parts: numberLists(raw?.parts),
    paid: numberLists(raw?.paid),
    samples: raw?.samples && typeof raw.samples === "object" ? raw.samples : {},
    fx: typeof raw?.fx === "string" ? raw.fx : null,
  };
}

function numberLists(raw: unknown): Record<string, number[]> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, number[]> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(v)) out[k] = v.filter((n): n is number => typeof n === "number");
  }
  return out;
}

/** 물결마다 적는 장부를 최근 것만 남긴다(열쇠가 클수록 최근이다). */
export function trimLedger(map: Record<string, number[]>): Record<string, number[]> {
  const keys = Object.keys(map).sort((a, b) => Number(b) - Number(a)).slice(0, LEDGER_KEEP);
  return Object.fromEntries(keys.map((k) => [k, map[k]]));
}

// ── 잼 보상 (3.1, docs/garden-raid-boss.md §9) ───────────────────────

/**
 * 거대 잡초의 잼. 참여 300, 1형 격파 700, 2형 1,500, 3형 2,500 — 처음부터 끝까지 함께하면 5,000.
 * 형태 보상은 그 형태에서 한 번이라도 쳤거나 지원한 사람만 받는다(늦게 와도 그 뒤 형태는 받는다).
 * 참여 보상은 든 형태가 하나라도 넘어갔거나 물결이 끝나면 받는다 — 놓쳐도 빈손은 아니게.
 * 장부(loot.paid)가 물결마다 한 번만 주게 한다. 형태가 넘어가는 즉시 싸움터에서 받을 수 있다.
 */
export const RAID_JAM = { base: 300, forms: [700, 1_500, 2_500] } as const;
export const RAID_JAM_MAX = RAID_JAM.base + RAID_JAM.forms.reduce((a, b) => a + b, 0);

export interface JamLine {
  /** 0=참여, 1–3=그 형태 격파. */
  id: number;
  label: string;
  jam: number;
}

/**
 * 지금 받을 수 있는 잼 줄. cleared=넘어간 형태 수(0–3), ended=물결이 끝났다, parts=내가 든 형태, paid=이미 받은 것.
 */
export function raidJamLines(cleared: number, ended: boolean, parts: readonly number[], paid: readonly number[]): JamLine[] {
  const lines: JamLine[] = [];
  if (parts.length === 0) return lines;
  if (!paid.includes(0) && (ended || cleared >= 1)) lines.push({ id: 0, label: "참여", jam: RAID_JAM.base });
  for (let form = 1; form <= Math.min(3, cleared); form++) {
    if (parts.includes(form) && !paid.includes(form)) lines.push({ id: form, label: `${form}형 격파`, jam: RAID_JAM.forms[form - 1] });
  }
  return lines;
}

// ── 포자 (§7.2 ③) ────────────────────────────────────────────────────

/** 체력이 절반이 되면 광장 칸에 돋는 포자 잡초 수. */
export const SPORE_COUNT = 6;
/** 포자를 다 뽑으면 다음 빈틈 동안 문지르기 절반. */
export const SPORE_AT = 0.5;

/**
 * 포자가 돋는 칸(광장 칸 번호). 물결 id에서 정하므로 모두 같은 칸을 본다. 서버에는 아무것도 없다 —
 * 뽑은 것은 이 기기에서만 세고, 효과도 내 손맛뿐이다.
 */
export function sporeCells(raid: string, cells: number): number[] {
  const order = Array.from({ length: cells }, (_, i) => i);
  const roll = rng(hash(`spores:${raid}`));
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(roll() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order.slice(0, Math.min(SPORE_COUNT, cells)).sort((a, b) => a - b);
}

/** 포자 하나에 드는 문지르기. */
export const SPORE_RUBS = 3;

/** 장부를 얼마나 남기나. 물결 열쇠는 하루 다섯이라 열흘 치. */
export const LEDGER_KEEP = 50;

/** 홈 소식을 다시 읽는 간격. 탭을 다시 열어도 이보다 자주 읽지 않는다. */
export const HOME_RAID_REFRESH = 5 * MINUTE;

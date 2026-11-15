import { hash, rng } from "../rules";
import { FURNITURE_BY_ID } from "../room/catalog";
import { FREE, isFree, PARTS, WEAR, WEAR_BY_ID, wearOf, type Part, type Reward, type Wear } from "./catalog";
import type { Face, Look } from "./compose";
import { CLOTHS, HAIR_COLORS, SKINS } from "./palette";
import type { Pose } from "./sprites";

/**
 * 꼬마의 규칙 — 순수 함수만. 설계는 docs/garden-avatar.md §5·§6.
 *
 * ★ 꼬마는 바닥 칸 하나에 서지만 칸을 차지하지 않는다. 가구 놓기가 꼬마 때문에 막히지 않는다.
 *   그 칸의 가구가 자세를 정한다(의자 → 앉기, 침대 → 자기, 피아노 → 연주).
 * ★ 공개 문서에는 문자열 하나(packAvatar). 글이 들어갈 자리가 없다. 가졌는지는 싣지 않는다 —
 *   가지지 않은 옷은 공개하기 전에 그 부위의 기본으로 바꾼다(publicAvatar).
 * ★ 이 파일은 room/rules.ts를 import하지 않는다(room/rules.ts가 이 파일을 쓴다 — 순환을 끊는다).
 */

export interface AvatarData {
  /** 방에 세우기. 끄면 방에 없다(장부는 남는다). */
  on: boolean;
  /** 바닥 칸 "b2" | "f4". */
  at: string;
  /** 돌아다니기. */
  roam: boolean;
  look: Look;
  /** 산·받은 옷 id. 처음부터 가진 것은 적지 않는다. */
  owned: string[];
}

/** 공개 문자열의 판. 모양이 바뀌면 올린다. firestore.rules의 publicRoom()과 같다. */
export const AVATAR_VER = 1;
/** 공개 문자열의 길이. firestore.rules의 publicRoom()과 같다. */
export const AVATAR_PUBLIC_MAX = 160;
/** firestore.rules의 정규식과 같다(avatar.test.ts가 본다). */
export const AVATAR_PUBLIC_RE = /^1;[bf][0-9];[01];[0-9];[0-9];[a-z0-9.;-]{0,140}$/;

const SLOT_RE = /^[bf][0-9]$/;
const LOOK_PARTS: Array<Exclude<Part, "bubble">> = ["hair", "eyes", "top", "bottom", "shoes", "hat", "face", "held"];
const TINTED = ["top", "bottom", "shoes"] as const;

/** 정원마다 정해지는 기본 꼬마. 무료 부위 안에서. 같은 정원은 기기를 바꿔도 같은 꼬마로 시작한다. */
export function freshAvatar(seed = ""): AvatarData {
  const roll = rng(hash(`avatar:${seed}`));
  const one = <T,>(list: readonly T[]): T => list[Math.floor(roll() * list.length)];
  const tint = () => Math.floor(roll() * CLOTHS.length);
  return {
    on: true,
    at: "f1",
    roam: false,
    look: {
      skin: Math.floor(roll() * 6),
      hairColor: Math.floor(roll() * 5),
      hair: one(FREE.hair),
      eyes: one(FREE.eyes),
      top: one(FREE.top),
      bottom: one(FREE.bottom),
      shoes: one(FREE.shoes),
      tint: { top: tint(), bottom: tint(), shoes: tint() },
      bubble: "basic",
    },
    owned: [],
  };
}

function index(n: unknown, max: number): number | undefined {
  return Number.isInteger(n) && (n as number) >= 0 && (n as number) < max ? (n as number) : undefined;
}

/** 표에 있는 id만 남긴다. 반드시 입는 부위가 비거나 틀리면 기본(base)으로. */
export function cleanLook(raw: Partial<Look> | undefined, base: Look): Look {
  const look: Look = {
    skin: index(raw?.skin, SKINS.length) ?? base.skin,
    hairColor: index(raw?.hairColor, HAIR_COLORS.length) ?? base.hairColor,
    hair: wearOf("hair", raw?.hair)?.id ?? base.hair,
    eyes: wearOf("eyes", raw?.eyes)?.id ?? base.eyes,
    top: wearOf("top", raw?.top)?.id ?? base.top,
    bottom: wearOf("bottom", raw?.bottom)?.id ?? base.bottom,
    shoes: wearOf("shoes", raw?.shoes)?.id ?? base.shoes,
    bubble: wearOf("bubble", raw?.bubble)?.id ?? "basic",
  };
  for (const part of ["hat", "face", "held"] as const) {
    const id = wearOf(part, raw?.[part])?.id;
    if (id) look[part] = id;
  }
  const tint: NonNullable<Look["tint"]> = {};
  for (const part of TINTED) {
    const n = index(raw?.tint?.[part], CLOTHS.length);
    if (n !== undefined) tint[part] = n;
  }
  if (Object.keys(tint).length) look.tint = tint;
  return look;
}

export function normalizeAvatar(raw: Partial<AvatarData> | undefined, seed = ""): AvatarData {
  const base = freshAvatar(seed);
  if (!raw || typeof raw !== "object") return base;
  const owned = Array.isArray(raw.owned) ? [...new Set(raw.owned.filter((id) => typeof id === "string" && WEAR_BY_ID.has(id)))] : [];
  return {
    on: typeof raw.on === "boolean" ? raw.on : base.on,
    at: typeof raw.at === "string" && SLOT_RE.test(raw.at) ? raw.at : base.at,
    roam: raw.roam === true,
    look: cleanLook(raw.look, base.look),
    owned,
  };
}

export function ownsWear(avatar: Pick<AvatarData, "owned">, id: string | undefined): boolean {
  const w = id ? WEAR_BY_ID.get(id) : undefined;
  return Boolean(w && (isFree(w) || avatar.owned.includes(w.id)));
}

/** 가지지 않은 옷 id. 저장 단추가 이것을 본다. */
export function unownedWear(avatar: Pick<AvatarData, "owned">, look: Look): string[] {
  const ids = [...LOOK_PARTS.map((p) => look[p]), look.bubble].filter((id): id is string => Boolean(id));
  return ids.filter((id) => !ownsWear(avatar, id));
}

/** 가지지 않은 옷을 벗긴다. 반드시 입는 부위는 첫 무료 옷으로. */
export function ownedLook(avatar: AvatarData): Look {
  const look: Look = { ...avatar.look };
  for (const part of LOOK_PARTS) {
    if (!look[part] || ownsWear(avatar, look[part])) continue;
    if (PARTS.find((p) => p.id === part)?.optional) delete look[part];
    else look[part] = FREE[part][0];
  }
  if (!ownsWear(avatar, look.bubble)) look.bubble = "basic";
  return look;
}

/** 방 너비 안의 칸인가. */
export function avatarSlotOk(at: string, width: number): boolean {
  return SLOT_RE.test(at) && Number(at.slice(1)) < width;
}

// ── 공개 ─────────────────────────────────────────────────────────────

/**
 * 공개 문자열. 판;칸;돌아다니기;피부;머리색;머리;눈;윗옷[.색];아랫옷[.색];신발[.색];모자;소품;든 것;말풍선
 * 끈 꼬마·방 밖의 칸은 싣지 않는다(null).
 */
export function packAvatar(avatar: AvatarData, width: number): string | null {
  if (!avatar.on || !avatarSlotOk(avatar.at, width)) return null;
  const look = ownedLook(avatar);
  const tinted = (part: (typeof TINTED)[number]) => {
    const n = look.tint?.[part];
    return WEAR_BY_ID.get(look[part])?.tint && n !== undefined ? `${look[part]}.${n}` : look[part];
  };
  const out = [
    AVATAR_VER, avatar.at, avatar.roam ? 1 : 0, look.skin, look.hairColor, look.hair, look.eyes,
    tinted("top"), tinted("bottom"), tinted("shoes"), look.hat ?? "", look.face ?? "", look.held ?? "", look.bubble ?? "basic",
  ].join(";");
  return out.length <= AVATAR_PUBLIC_MAX && AVATAR_PUBLIC_RE.test(out) ? out : null;
}

/** 남의 꼬마를 그릴 모양으로. 판·칸·id를 다시 보고, 모르는 것은 그 부위의 기본으로. 읽을 수 없으면 null. */
export function avatarFromPublic(raw: unknown): AvatarData | null {
  if (typeof raw !== "string" || raw.length > AVATAR_PUBLIC_MAX || !AVATAR_PUBLIC_RE.test(raw)) return null;
  const f = raw.split(";");
  if (f.length !== 14) return null;
  const split = (s: string): [string, number | undefined] => {
    const [w, t] = s.split(".");
    return [w, t === undefined ? undefined : Number(t)];
  };
  const [top, topT] = split(f[7]);
  const [bottom, bottomT] = split(f[8]);
  const [shoes, shoesT] = split(f[9]);
  const base = freshAvatar("");
  const look = cleanLook(
    { skin: Number(f[3]), hairColor: Number(f[4]), hair: f[5], eyes: f[6], top, bottom, shoes, hat: f[10] || undefined, face: f[11] || undefined, held: f[12] || undefined, bubble: f[13], tint: { top: topT, bottom: bottomT, shoes: shoesT } },
    base.look,
  );
  // 남의 꼬마는 가진 것을 모른다. 그린 옷을 모두 가졌다고 본다(표에 있는 것만 남았다).
  const owned = [...LOOK_PARTS.map((p) => look[p]), look.bubble].filter((x): x is string => Boolean(x));
  return { on: true, at: f[1], roam: f[2] === "1", look, owned };
}

// ── 기분 · 자세 ──────────────────────────────────────────────────────

/** 오늘의 기분(room/catalog.ts의 MOODS) → 표정. 새 입력을 만들지 않는다. */
export function moodFace(mood: string): Face {
  switch (mood) {
    case "happy":
    case "excited":
      return { eyes: "sparkle", mouth: "grin" };
    case "proud":
      return { eyes: "smile", mouth: "grin" };
    case "focus":
      return { eyes: "open", mouth: "flat" };
    case "thanks":
      return { eyes: "smile", mouth: "smile", blush: true };
    case "busy":
      return { eyes: "open", mouth: "o" };
    case "sleepy":
      return { eyes: "closed", mouth: "o", zzz: true };
    case "hungry":
      return { eyes: "open", mouth: "open" };
    case "rainy":
      return { eyes: "open", mouth: "frown" };
    case "tired":
      return { eyes: "closed", mouth: "smile" };
    default:
      return { eyes: "smile", mouth: "smile" };
  }
}

/** 누르면 뛰는 기분. */
export function hopsOnTap(mood: string): boolean {
  return mood === "happy" || mood === "excited";
}

/** 이 칸을 덮은 가구. 2칸 가구는 왼쪽 칸에 적혀 있다. */
export function furnitureAt(placed: ReadonlyArray<{ at: string; it: string }>, at: string): { at: string; it: string } | undefined {
  const row = at[0];
  const i = Number(at.slice(1));
  return placed.find((p) => {
    if (p.at[0] !== row) return false;
    const j = Number(p.at.slice(1));
    const size = FURNITURE_BY_ID.get(p.it)?.size ?? 1;
    return i >= j && i < j + size;
  });
}

/** 이 칸에 선 꼬마의 자세. */
export function poseAt(placed: ReadonlyArray<{ at: string; it: string }>, at: string): Pose {
  const p = furnitureAt(placed, at);
  return (p && FURNITURE_BY_ID.get(p.it)?.pose) ?? "stand";
}

/** 자세가 바꾸는 표정 — 자면 눈을 감는다. */
export function faceFor(pose: Pose, mood: string): Face {
  const face = moodFace(mood);
  return pose === "sleep" ? { ...face, eyes: "closed", zzz: true } : face;
}

/**
 * 다음 칸 — 같은 줄의 옆 칸 하나. 가구 앞도 지나간다(꼬마는 자기 줄 가구 앞에 그려진다).
 * 멈춘 칸의 가구가 자세를 정한다(poseAt). seed가 같으면 같은 곳 — 같은 때 보는 사람은 같은 곳에서 본다.
 * ★ 처음에는 빈 칸·자세 가구 칸으로만 갔다. 꾸민 방에서는 양옆이 다 막혀 꼬마가 꼼짝하지 않았다(2026-11-15).
 */
export function roamNext(cur: string, width: number, seed: string): string {
  const i = Number(cur.slice(1));
  const near = [i - 1, i + 1].filter((j) => j >= 0 && j < width).map((j) => `${cur[0]}${j}`);
  if (!near.length) return cur;
  return near[Math.floor(rng(hash(`roam:${seed}`))() * near.length)];
}

// ── 사기 · 받기 ──────────────────────────────────────────────────────

export type WearRefusal = "unknown" | "off-sale" | "owned" | "short";

/** 잼(cur 없음) 또는 뿌리 조각(cur root)으로 산다. 받는 옷·무료 옷은 팔지 않는다. */
export function buyWear(avatar: AvatarData, wallet: { jam: number; roots: number }, id: string): { avatar: AvatarData; jam: number; roots: number } | WearRefusal {
  const w = WEAR_BY_ID.get(id);
  if (!w) return "unknown";
  if (isFree(w) || w.cur === "reward") return "off-sale";
  if (avatar.owned.includes(id)) return "owned";
  const root = w.cur === "root";
  const have = root ? wallet.roots : wallet.jam;
  if (!Number.isFinite(have) || have < w.price) return "short";
  return {
    avatar: { ...avatar, owned: [...avatar.owned, id] },
    jam: root ? wallet.jam : wallet.jam - w.price,
    roots: root ? wallet.roots - w.price : wallet.roots,
  };
}

export interface RewardContext {
  titles: Partial<Record<"dex" | "storm" | "plaza", number>>;
  golden: number;
  trophies: number;
}

export function rewardMet(r: Reward, ctx: RewardContext): boolean {
  if (r.kind === "title") return (ctx.titles[r.title] ?? 0) >= r.level;
  if (r.kind === "golden") return ctx.golden > 0;
  return ctx.trophies >= r.n;
}

export function rewardText(r: Reward): string {
  if (r.kind === "title") return `${r.title === "dex" ? "도감" : r.title === "storm" ? "단비" : "광장"} 칭호 ★${r.level}을 받으면 열려요`;
  if (r.kind === "golden") return "황금 변이 열매를 처음 거두면 열려요";
  return `악초 박제 ${r.n}종을 다 모으면 열려요`;
}

/** 조건을 채운 받는 옷을 장부에 넣는다. 바뀐 것이 없으면 같은 것을 돌려준다. */
export function grantRewards(avatar: AvatarData, ctx: RewardContext): AvatarData {
  const add = WEAR.filter((w) => w.cur === "reward" && w.reward && rewardMet(w.reward, ctx) && !avatar.owned.includes(w.id)).map((w) => w.id);
  return add.length ? { ...avatar, owned: [...avatar.owned, ...add] } : avatar;
}

/** 상점에서 파는 옷(잼·뿌리 조각). */
export function wearOnSale(w: Wear): boolean {
  return !isFree(w) && w.cur !== "reward";
}

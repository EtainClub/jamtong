import { hash, rng } from "../rules";
import { FURNITURE_BY_ID } from "../room/catalog";
import { floorTiles, footprint, isoSpecOf, isWallPos, type IsoPos } from "../room/isoPlace";
import type { Shown } from "../room/rules";
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
  /**
   * 바닥 자리 "x~y" — 반 타일 단위, 타일 한가운데라 늘 홀수(docs/garden-miniroom-iso.md §6). 옛 장부의 칸("b2"·"f4")은
   * normalizeAvatar가 그 칸이 옮겨 간 자리로 바꾼다. 그 자리를 덮은 가구가 자세를 정한다(앉기·자기·연주).
   */
  at: string;
  /** 돌아다니기. */
  roam: boolean;
  look: Look;
  /** 산·받은 옷 id. 처음부터 가진 것은 적지 않는다. */
  owned: string[];
}

/** 공개 문자열의 판. 모양이 바뀌면 올린다. 2 = 자리가 바닥 좌표(x~y). firestore.rules의 publicRoom()과 같다. */
export const AVATAR_VER = 2;
/** 공개 문자열의 길이. firestore.rules의 publicRoom()과 같다. */
export const AVATAR_PUBLIC_MAX = 160;
/** 판 1(옛 화면이 실은 것)의 모양 — 자리가 칸(b·f + 번호). 읽기만 한다. */
export const AVATAR_V1_RE = /^1;[bf][0-9];[01];[0-9];[0-9];[a-z0-9.;-]{0,140}$/;
/**
 * firestore.rules가 받는 모양(avatar.test.ts가 본다) — 판 1과, 아이소 방(docs/garden-miniroom-iso.md §8)의 판 2.
 * 판 2의 자리는 바닥 좌표 x~y(반 타일 단위). 규칙은 받침 순번 s<n>도 받지만 싣지 않는다 — 꼬마는 바닥 자리만 갖고,
 * 그 자리를 덮은 가구가 자세를 정한다(가구 순번은 꾸미면 바뀐다).
 */
export const AVATAR_RULE_RE = /^(1;[bf][0-9]|2;([0-9]{1,2}~[0-9]{1,2}|s[0-9]{1,2}));[01];[0-9];[0-9];[a-z0-9.;-]{0,140}$/;
/** 읽는 모양 — 규칙과 같다. */
export const AVATAR_PUBLIC_RE = AVATAR_RULE_RE;

const SLOT_RE = /^[bf][0-9]$/;
const POINT_RE = /^(\d{1,2})~(\d{1,2})$/;

/** 옛 칸 → 그 칸이 아이소 방으로 옮겨 간 바닥 자리(room/isoPlace.ts의 slotToPos)의 한가운데. 방 밖의 칸이면 null. */
export function slotToPoint(at: string, size: number): string | null {
  if (!SLOT_RE.test(at)) return null;
  const n = floorTiles(size);
  const i = Number(at.slice(1));
  if (i >= n) return null;
  return `${i * 2 + 1}~${at[0] === "f" ? n + 1 : 1}`;
}
const LOOK_PARTS: Array<Exclude<Part, "bubble">> = ["hair", "eyes", "top", "bottom", "shoes", "hat", "face", "held"];
const TINTED = ["top", "bottom", "shoes"] as const;

/** 정원마다 정해지는 기본 꼬마. 무료 부위 안에서. 같은 정원은 기기를 바꿔도 같은 꼬마로 시작한다. */
export function freshAvatar(seed = ""): AvatarData {
  const roll = rng(hash(`avatar:${seed}`));
  const one = <T,>(list: readonly T[]): T => list[Math.floor(roll() * list.length)];
  const tint = () => Math.floor(roll() * CLOTHS.length);
  return {
    on: true,
    // 작은 방(6×6)의 앞쪽 둘째 타일 — 옛 기본 칸 f1이 옮겨 간 자리.
    at: "3~7",
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

/** size는 방 크기 — 옛 칸 자리를 바닥 좌표로 바꿀 때 쓴다. */
export function normalizeAvatar(raw: Partial<AvatarData> | undefined, seed = "", size = 0): AvatarData {
  const base = freshAvatar(seed);
  if (!raw || typeof raw !== "object") return base;
  const owned = Array.isArray(raw.owned) ? [...new Set(raw.owned.filter((id) => typeof id === "string" && WEAR_BY_ID.has(id)))] : [];
  return {
    on: typeof raw.on === "boolean" ? raw.on : base.on,
    at: typeof raw.at === "string" ? (POINT_RE.test(raw.at) ? raw.at : slotToPoint(raw.at, size) ?? base.at) : base.at,
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

/** 방(한 변 width 타일) 안의 바닥 자리인가 — 타일 한가운데(홀수)만. */
export function avatarAtOk(at: string, width: number): boolean {
  const m = POINT_RE.exec(at);
  if (!m) return false;
  const x = Number(m[1]);
  const y = Number(m[2]);
  return x % 2 === 1 && y % 2 === 1 && x < width * 2 && y < width * 2;
}

// ── 공개 ─────────────────────────────────────────────────────────────

/**
 * 공개 문자열. 판;칸;돌아다니기;피부;머리색;머리;눈;윗옷[.색];아랫옷[.색];신발[.색];모자;소품;든 것;말풍선
 * 끈 꼬마·방 밖의 칸은 싣지 않는다(null).
 */
export function packAvatar(avatar: AvatarData, width: number): string | null {
  if (!avatar.on || !avatarAtOk(avatar.at, width)) return null;
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

/**
 * 남의 꼬마를 그릴 모양으로. 판·자리·id를 다시 보고, 모르는 것은 그 부위의 기본으로. 읽을 수 없으면 null.
 * 판 1(옛 화면)의 칸은 바닥 자리로 바꾼다(size = 그 방의 크기). 판 2의 받침 순번(s<n>)은 싣지 않는 모양이라 읽지 않는다.
 */
export function avatarFromPublic(raw: unknown, size = 0): AvatarData | null {
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
  const at = f[0] === "1" ? slotToPoint(f[1], size) : POINT_RE.test(f[1]) ? f[1] : null;
  if (!at) return null;
  return { on: true, at, roam: f[2] === "1", look, owned };
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

/** 꼬마가 서는 방 — 아이소 방의 장부(room/rules.ts의 RoomData 중 이것만). */
export interface AvatarRoom {
  placed: ReadonlyArray<{ it: string; pos: IsoPos }>;
  shown: readonly Shown[];
  size: number;
}

/**
 * 꼬마 칸의 바닥 자리(타일). 꼬마는 4단계(docs/garden-miniroom-iso.md §6)까지 옛 칸(b·f + 번호)에 선다 —
 * 그 칸이 아이소 방으로 옮겨 간 자리(room/isoPlace.ts의 slotToPos)의 한가운데.
 */
export function avatarPoint(at: string, size: number): { u: number; v: number } {
  const m = POINT_RE.exec(at) ?? POINT_RE.exec(slotToPoint(at, size) ?? "1~1")!;
  return { u: Number(m[1]) / 2, v: Number(m[2]) / 2 };
}

/** 바닥 점(타일 좌표)에 가장 가까운 꼬마 자리 — 그 타일의 한가운데. */
export function avatarAtFor(u: number, v: number, size: number): string {
  const n = floorTiles(size);
  const tile = (t: number) => Math.max(0, Math.min(n - 1, Math.floor(t)));
  return `${tile(u) * 2 + 1}~${tile(v) * 2 + 1}`;
}

/** 꼬마가 설 수 없는 자리인가 — 자세가 없는 가구(옷장·책장…)가 덮었다. 자세 가구(의자·침대·피아노)는 앉고 눕는 자리다. */
export function avatarBlocked(room: AvatarRoom, at: string): boolean {
  const i = furnitureAt(room, at);
  return i !== undefined && !FURNITURE_BY_ID.get(room.placed[i].it)?.pose;
}

/** 설 수 있는 가장 가까운 자리. 지금 자리가 괜찮으면 그대로, 방 전체가 막혔으면 null. 꾸미기를 마칠 때 본다. */
export function avatarFree(room: AvatarRoom, at: string): string | null {
  const n = floorTiles(room.size);
  const here = avatarPoint(at, room.size);
  const spots: Array<{ at: string; d: number }> = [];
  for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) spots.push({ at: `${x * 2 + 1}~${y * 2 + 1}`, d: Math.abs(x + 0.5 - here.u) + Math.abs(y + 0.5 - here.v) });
  spots.sort((a, b) => a.d - b.d);
  return spots.find((s) => !avatarBlocked(room, s.at))?.at ?? null;
}

/** 꼬마 자리를 덮은 바닥 가구의 순번. 여럿이면 자세가 있는 것, 그다음 앞에 그려지는 것. 없으면 undefined. */
export function furnitureAt(room: AvatarRoom, at: string): number | undefined {
  const { u, v } = avatarPoint(at, room.size);
  let best: number | undefined;
  room.placed.forEach((p, i) => {
    if (isWallPos(p.pos) || p.pos.on !== undefined) return;
    const spec = isoSpecOf(p.it, room.shown);
    if (!spec || spec.layer !== "furniture") return;
    const f = footprint(spec, p.pos);
    if (u < f.u || u >= f.u + f.w || v < f.v || v >= f.v + f.d) return;
    const posed = (j: number | undefined) => (j !== undefined && FURNITURE_BY_ID.get(room.placed[j].it)?.pose ? 1 : 0);
    if (best === undefined || posed(i) >= posed(best)) best = i;
  });
  return best;
}

/** 이 칸에 선 꼬마의 자세. */
export function poseAt(room: AvatarRoom, at: string): Pose {
  const i = furnitureAt(room, at);
  return (i !== undefined && FURNITURE_BY_ID.get(room.placed[i].it)?.pose) || "stand";
}

/** 자세가 바꾸는 표정 — 자면 눈을 감는다. */
export function faceFor(pose: Pose, mood: string): Face {
  const face = moodFace(mood);
  return pose === "sleep" ? { ...face, eyes: "closed", zzz: true } : face;
}

/**
 * 다음 자리 — 앞뒤좌우 옆 타일 하나. 설 수 있는 타일(빈 바닥·자세 가구) 가운데서 고르고, 사방이 막혔으면 막힌 타일도 지나간다.
 * 멈춘 자리의 가구가 자세를 정한다(poseAt). seed가 같으면 같은 곳 — 같은 때 보는 사람은 같은 곳에서 본다.
 * ★ 옛 칸 방에서 빈 칸·자세 가구 칸으로만 가게 했더니 꾸민 방에서 꼬마가 꼼짝하지 않았다(2026-11-15). 그래서 막히면 지나간다.
 */
export function roamNext(cur: string, room: AvatarRoom, seed: string): string {
  const m = POINT_RE.exec(cur);
  if (!m) return cur;
  const n = floorTiles(room.size);
  const x = Number(m[1]);
  const y = Number(m[2]);
  const near = [[x - 2, y], [x + 2, y], [x, y - 2], [x, y + 2]]
    .filter(([a, b]) => a > 0 && b > 0 && a < n * 2 && b < n * 2)
    .map(([a, b]) => `${a}~${b}`);
  const open = near.filter((at) => !avatarBlocked(room, at));
  const pool = open.length ? open : near;
  if (!pool.length) return cur;
  return pool[Math.floor(rng(hash(`roam:${seed}`))() * pool.length)];
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

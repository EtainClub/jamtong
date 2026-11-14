/**
 * 내 키보드 — 방에 놓는 키 네 개(docs/garden-miniroom.md §4.5). 순수 함수만 둔다.
 *
 * ★ 키 하나 = 그림(face) + 소리(sound). 그림은 12×12 도트, 8색 팔레트(0은 투명)의 144자 문자열이다.
 *   소리는 정해 둔 소리 id(PRESETS), 녹음("rec"), 또는 소리 없음("none").
 * ★ 녹음은 Storage `roomKeys/{uid}/{칸}-{판}.wav`에 있다. 판(ver)은 방 전체의 마지막 판보다 커진다 —
 *   같은 주소를 덮으면 캐시가 옛 목소리를 들려준다. 판은 녹음을 지워도 줄지 않는다.
 * ★ 공개 문서에는 그림·소리 id·녹음 판 번호만 싣는다. 주소도, 글도 싣지 않는다.
 *   공개 문서에는 아무 값이나 담길 수 있으므로 보는 쪽(keysFromPublic)이 모양을 다시 본다.
 */

/** 키의 수. firestore.rules의 publicKeys()와 같다. */
export const KEY_COUNT = 4;
/** 그림 한 변의 칸 수. */
export const FACE_SIZE = 12;
export const FACE_CELLS = FACE_SIZE * FACE_SIZE;
/** 팔레트. 0은 투명(지우개). 색 수는 firestore.rules의 '^[0-7]{144}$'와 같다. */
export const PALETTE = ["transparent", "#3a2f2a", "#ffffff", "#d9574a", "#f47b20", "#ffd85c", "#86c46d", "#2f9bd8"] as const;
export const PALETTE_NAMES = ["지우개", "먹색", "흰색", "빨강", "주황", "노랑", "초록", "하늘"] as const;
/** 녹음 판 번호의 상한. storage.rules의 파일 이름(1–7자리)·firestore.rules와 같다. */
export const KEY_VER_MAX = 9_999_999;
/** 소리 id의 길이 상한. firestore.rules와 같다. */
export const KEY_SOUND_MAX = 40;
/** 녹음 파일 크기 상한(바이트). storage.rules의 roomKeys와 같다. 16kHz 1.5초 WAV는 약 47KB다. */
export const KEY_REC_MAX_BYTES = 64 * 1024;
/** 방에 놓는 키보드의 가구 id(catalog.ts). */
export const KEYBOARD_ID = "keyboard";

export const REC = "rec";
export const SILENT = "none";

export interface RoomKey {
  /** 144자, 글자마다 팔레트 번호 '0'–'7'. */
  face: string;
  /** 소리 id(PRESETS) · REC · SILENT. */
  sound: string;
  /** 마지막으로 올린 녹음의 판. 0이면 녹음한 적 없음. sound가 REC일 때 이 판을 튼다. */
  ver: number;
}

/** 공개 문서의 키. f=그림, s=소리 id, v=녹음 판(s가 rec일 때만). */
export interface PublicKey {
  f: string;
  s: string;
  v?: number;
}

/** 정해 둔 소리. 모두 Web Audio로 그 자리에서 만든다(keyboardSound.ts). 파일이 없다. */
export const PRESETS: Array<{ id: string; label: string; icon: string }> = [
  { id: "orgel-do", label: "오르골 도", icon: "🎐" },
  { id: "orgel-mi", label: "오르골 미", icon: "🎐" },
  { id: "orgel-sol", label: "오르골 솔", icon: "🎐" },
  { id: "orgel-hi", label: "오르골 높은 도", icon: "🎐" },
  { id: "chime", label: "풍경", icon: "🎏" },
  { id: "drop", label: "물방울", icon: "💧" },
  { id: "toad", label: "두꺼비", icon: "🐸" },
  { id: "rooster", label: "수탉", icon: "🐓" },
  { id: "bird", label: "새소리", icon: "🐦" },
  { id: "drum", label: "북", icon: "🥁" },
  { id: "xylo", label: "실로폰", icon: "🎶" },
  { id: "jam-pop", label: "잼 뚜껑 퐁", icon: "🫙" },
  { id: "weed-pull", label: "잡초 뽑기 쑥", icon: "🌿" },
  { id: "bell", label: "자전거 따릉", icon: "🚲" },
  { id: "cat", label: "야옹", icon: "🐱" },
  { id: "clap", label: "손뼉", icon: "👏" },
  { id: "spring", label: "용수철 띠용", icon: "🌀" },
  { id: "sparkle", label: "반짝", icon: "✨" },
  { id: "bubble", label: "보글보글", icon: "🫧" },
  { id: "whistle", label: "휘파람", icon: "🎵" },
];

const PRESET_IDS = new Set(PRESETS.map((p) => p.id));

export function isPreset(id: unknown): id is string {
  return typeof id === "string" && PRESET_IDS.has(id);
}

export function soundLabel(key: Pick<RoomKey, "sound">): { icon: string; label: string } {
  if (key.sound === REC) return { icon: "🎙", label: "내 목소리" };
  const p = PRESETS.find((x) => x.id === key.sound);
  return p ? { icon: p.icon, label: p.label } : { icon: "🔇", label: "소리 없음" };
}

// ── 그림 ─────────────────────────────────────────────────────────────

const FACE_RE = new RegExp(`^[0-${PALETTE.length - 1}]{${FACE_CELLS}}$`);

export function isFace(s: unknown): s is string {
  return typeof s === "string" && FACE_RE.test(s);
}

export function blankFace(): string {
  return "0".repeat(FACE_CELLS);
}

/** 그림 문자열 ↔ 칸 배열. */
export function decodeFace(face: string): number[] {
  return isFace(face) ? Array.from(face, (c) => Number(c)) : Array<number>(FACE_CELLS).fill(0);
}

export function encodeFace(cells: readonly number[]): string {
  if (cells.length !== FACE_CELLS) throw new Error(`칸이 ${FACE_CELLS}개가 아니다: ${cells.length}`);
  return cells.map((c) => (Number.isInteger(c) && c >= 0 && c < PALETTE.length ? String(c) : "0")).join("");
}

/** 거울: 같은 줄의 반대쪽 칸. */
export function mirrorCell(i: number): number {
  const y = Math.floor(i / FACE_SIZE);
  const x = i % FACE_SIZE;
  return y * FACE_SIZE + (FACE_SIZE - 1 - x);
}

/** 칸 하나(거울이면 반대쪽도)를 칠한다. 바뀐 게 없으면 같은 문자열을 돌려준다. */
export function paint(face: string, i: number, color: number, mirror = false): string {
  if (!isFace(face) || i < 0 || i >= FACE_CELLS || !Number.isInteger(color) || color < 0 || color >= PALETTE.length) return face;
  const cells = decodeFace(face);
  cells[i] = color;
  if (mirror) cells[mirrorCell(i)] = color;
  const next = encodeFace(cells);
  return next === face ? face : next;
}

/**
 * 그림을 색마다 한 줄의 SVG path로. 칸마다 <rect>를 그리면 키 넷에 576개다.
 * 1칸 = 1단위(viewBox 0 0 12 12). 투명(0)은 그리지 않는다.
 */
export function faceToPaths(face: string): Array<{ color: string; d: string }> {
  const cells = decodeFace(face);
  const out = new Map<number, string[]>();
  cells.forEach((c, i) => {
    if (c === 0) return;
    const x = i % FACE_SIZE;
    const y = Math.floor(i / FACE_SIZE);
    const list = out.get(c) ?? [];
    list.push(`M${x} ${y}h1v1h-1z`);
    out.set(c, list);
  });
  return [...out.entries()].sort((a, b) => a[0] - b[0]).map(([c, d]) => ({ color: PALETTE[c], d: d.join("") }));
}

/** 그림 문자를 줄 글로 그린다(처음 키). "."=0, 글자는 팔레트 번호. */
function art(rows: string[]): string {
  return encodeFace(rows.join("").split("").map((c) => (c === "." ? 0 : Number(c))));
}

/** 처음 키 넷의 그림 — 새싹, 하트, 음표, 별. 잼통 고유의 그림이다. */
const STARTER_FACES = [
  art([
    "............",
    "....66......",
    "...6666.66..",
    "...66666666.",
    "....666.66..",
    "......6.....",
    "......6.....",
    "....44444...",
    "...4444444..",
    "...4444444..",
    "....44444...",
    "............",
  ]),
  art([
    "............",
    "............",
    "..333..333..",
    ".33333333333",
    ".33233333333",
    ".33333333333",
    "..333333333.",
    "...3333333..",
    "....33333...",
    ".....333....",
    "......3.....",
    "............",
  ]),
  art([
    "............",
    ".....777777.",
    ".....777777.",
    ".....7....7.",
    ".....7....7.",
    ".....7....7.",
    ".....7....7.",
    "...777..777.",
    "..7777.7777.",
    "..7777.7777.",
    "...77...77..",
    "............",
  ]),
  art([
    "............",
    ".....55.....",
    ".....55.....",
    "....5555....",
    "555555555555",
    ".5555555555.",
    "..55555555..",
    "...555555...",
    "..5555555...",
    "..555..555..",
    ".55......55.",
    "............",
  ]),
];

/** 처음 키의 소리: 오르골 도·미·솔·높은 도. */
const STARTER_SOUNDS = ["orgel-do", "orgel-mi", "orgel-sol", "orgel-hi"];

export function starterKey(slot: number): RoomKey {
  return { face: STARTER_FACES[slot] ?? blankFace(), sound: STARTER_SOUNDS[slot] ?? SILENT, ver: 0 };
}

export function freshKeys(): RoomKey[] {
  return Array.from({ length: KEY_COUNT }, (_, i) => starterKey(i));
}

/** 빈 키(그림 없음, 소리 없음). 운영자가 가린 키보드를 손님에게 보일 때. */
export function blankKeys(): RoomKey[] {
  return Array.from({ length: KEY_COUNT }, () => ({ face: blankFace(), sound: SILENT, ver: 0 }));
}

function validVer(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= KEY_VER_MAX;
}

/** 키보드가 생기기 전에 저장된 방, 또는 모양이 어긋난 키. 넷을 맞추고 모르는 값은 처음 키로. */
export function normalizeKeys(raw: unknown): RoomKey[] {
  const list = Array.isArray(raw) ? raw : [];
  return Array.from({ length: KEY_COUNT }, (_, i) => {
    const k = list[i] as Partial<RoomKey> | undefined;
    const start = starterKey(i);
    if (!k || typeof k !== "object") return start;
    const ver = validVer(k.ver) ? k.ver : 0;
    const sound = k.sound === REC ? (ver > 0 ? REC : start.sound) : isPreset(k.sound) || k.sound === SILENT ? k.sound : start.sound;
    return { face: isFace(k.face) ? k.face : start.face, sound, ver };
  });
}

/** 공개 문서에 싣는 키. 녹음 판은 녹음을 틀 때만. */
export function publicKeys(keys: readonly RoomKey[]): PublicKey[] {
  return normalizeKeys(keys).map((k) => (k.sound === REC ? { f: k.face, s: REC, v: k.ver } : { f: k.face, s: k.sound }));
}

/**
 * 남의 키보드를 그릴 키로 되돌린다. 그림은 길이·글자를, 소리는 표에 있는지를 본다.
 * 모르는 소리는 소리 없음, 어긋난 그림은 빈 그림. 없으면(옛 문서) 빈 키.
 */
export function keysFromPublic(raw: unknown): RoomKey[] {
  if (!Array.isArray(raw)) return blankKeys();
  return Array.from({ length: KEY_COUNT }, (_, i) => {
    const k = raw[i] as Partial<PublicKey> | undefined;
    if (!k || typeof k !== "object") return { face: blankFace(), sound: SILENT, ver: 0 };
    const face = isFace(k.f) ? k.f : blankFace();
    if (k.s === REC) return validVer(k.v) ? { face, sound: REC, ver: k.v } : { face, sound: SILENT, ver: 0 };
    return { face, sound: isPreset(k.s) ? k.s : SILENT, ver: 0 };
  });
}

// ── 녹음 ─────────────────────────────────────────────────────────────

/** 녹음 파일의 경로. storage.rules의 roomKeys/{uid}/{fileId}와 같다. */
export function recPath(uid: string, slot: number, ver: number): string {
  if (!Number.isInteger(slot) || slot < 0 || slot >= KEY_COUNT) throw new Error(`칸 번호가 어긋났다: ${slot}`);
  if (!validVer(ver)) throw new Error(`판 번호가 어긋났다: ${ver}`);
  return `roomKeys/${uid}/${slot}-${ver}.wav`;
}

/** storage.rules가 받는 파일 이름과 같은 모양. */
export const REC_FILE_RE = /^[0-3]-[1-9][0-9]{0,6}\.wav$/;

/** 다음 녹음의 판. */
export function nextVer(key: RoomKey): number {
  return Math.min(KEY_VER_MAX, key.ver + 1);
}

/** 녹음을 트는 키의 칸. */
export function recSlots(keys: readonly RoomKey[]): number[] {
  return keys.flatMap((k, i) => (k.sound === REC && k.ver > 0 ? [i] : []));
}

/**
 * 녹음을 지워야 하는가. 방 공개를 껐거나 키보드를 방에서 치웠으면, 녹음은 들을 사람이 없는데
 * 누구나 읽을 수 있는 자리에 남는다. 지운다(그림과 판 번호는 남는다).
 */
export function mustWipeRecs(keys: readonly RoomKey[], shareOn: boolean, keyboardPlaced: boolean): number[] {
  return shareOn && keyboardPlaced ? [] : recSlots(keys);
}

/** 지운 녹음의 키를 처음 소리로 돌린다. 판은 그대로 둔다(다음 녹음은 새 판). */
export function wipeRecs(keys: readonly RoomKey[], slots: readonly number[]): RoomKey[] {
  return keys.map((k, i) => (slots.includes(i) && k.sound === REC ? { ...k, sound: starterKey(i).sound } : k));
}

// ── 박자 ─────────────────────────────────────────────────────────────

/**
 * 방 음악이 흐를 때 키 소리를 다음 8분음표에 맞춘다. 음악의 격자는 nextAt + k·eighth다(k는 정수, 음수도).
 * now보다 lead 이상 뒤의 첫 격자를 돌려준다 — 너무 가까운 격자는 소리를 만들 틈이 없다.
 * 음악이 없으면 부르는 쪽이 now(+조금)에 바로 튼다.
 */
export function snapTime(now: number, nextAt: number, eighth: number, lead = 0.01): number {
  if (!(eighth > 0) || !Number.isFinite(nextAt)) return now + lead;
  const k = Math.ceil((now + lead - nextAt) / eighth - 1e-9);
  return nextAt + k * eighth;
}

/** 손가락 자판: 1–4, A S D F. */
export function keyForCode(key: string): number | null {
  const i = ["1", "2", "3", "4"].indexOf(key);
  if (i >= 0) return i;
  const j = ["a", "s", "d", "f"].indexOf(key.toLowerCase());
  return j >= 0 ? j : null;
}


/** 추가 키보드의 공개 키 넷. Firestore 규칙의 계산 한도 안에서 그림·소리·판을 모두 검사한다. */
export function packKeyboard(keys: readonly RoomKey[]): string {
  return publicKeys(keys).map((k) => `${k.f}:${k.s}:${k.v ?? 0};`).join("");
}

export function unpackKeyboard(raw: unknown): RoomKey[] {
  if (typeof raw !== "string" || !/^([0-7]{144}:[a-z-]{1,40}:[0-9]{1,7};){4}$/.test(raw)) return blankKeys();
  return keysFromPublic(raw.slice(0, -1).split(";").map((part) => {
    const [f, s, v] = part.split(":");
    return { f, s, v: Number(v) };
  }));
}

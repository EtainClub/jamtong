/**
 * 사진첩 2 — 골라서 담는 사진첩(docs/garden-album-review.md).
 *
 * 사진 파일은 받지 않는다. 사진 한 장은 콘텐츠의 앵커 하나(업적·카툰 칸·언행 토막·정책 팩트·책 한 장)이거나
 * 내 정원의 순간(moment)이다. 사용자 고유의 것은 "왜 담았나"(정해진 문구)·스티커·폴더·한 줄(60자)·날짜다.
 *
 * ★ 사실 칸은 콘텐츠에서만 온다. 사람이 쓴 한 줄은 말풍선에만, 글로만 그린다(링크로 만들지 않는다).
 * ★ 사진첩 글·댓글은 위키·factbase의 소스가 아니다(AGENTS.md).
 * ★ 값의 모양은 firestore.rules의 photoOk()·albumLineOk()와 같다 — album/rules.test.ts가 대조한다.
 */

import { TEXT_MAX } from "../ilchon/rules";

/** 사진 장수. 폴더가 생기므로 예전 24장보다 넉넉히. firestore.rules는 장수를 세지 못한다 — 화면이 지킨다. */
export const PHOTO_MAX = 60;
/** 내 정원의 순간을 몇 개까지 기억하나(올리기 전 후보). */
export const MOMENT_KEEP = 20;
/** 한 줄 길이 — 방명록과 같다. */
export const LINE_MAX = TEXT_MAX;

/** 왜 담았나. 사실을 평가하는 문구("거짓이에요"·"최고예요")는 두지 않는다. firestore.rules: p < 16. */
export const REASONS = [
  "처음 알았어요",
  "주변에 알려 주고 싶어요",
  "반론도 같이 봐야 해요",
  "더 지켜볼게요",
  "이 숫자 기억할래요",
  "직접 확인했어요",
  "궁금한 게 남았어요",
  "오래 간직할래요",
  "내 정원의 기록이에요",
  "축하해 주세요",
  "같이 읽어요",
  "소문을 확인했어요",
  "퍼 온 사진이에요",
] as const;
export const REASON_SCRAP = 12;

/** 폴더. 이름을 짓지 않고 고른다. firestore.rules: f < 8. */
export const FOLDERS = [
  { icon: "📣", label: "알려 주고 싶은 것" },
  { icon: "📚", label: "공부 중" },
  { icon: "🌱", label: "내 정원 기록" },
  { icon: "🔖", label: "책갈피" },
  { icon: "🔎", label: "소문 확인" },
  { icon: "💬", label: "언행 모음" },
  { icon: "🏛", label: "기념품" },
  { icon: "💛", label: "그냥 좋은 것" },
] as const;

/** 사진 댓글의 문구. firestore.rules의 lineOk(p < 30)를 그대로 쓴다. */
export const COMMENT_PHRASES = [
  "저도 몰랐어요",
  "근거 봤어요",
  "반론도 봤어요",
  "퍼 갈게요",
  "같이 지켜봐요",
  "좋은 장면이에요",
  "덕분에 알았어요",
  "저도 담았어요",
  "축하해요",
  "멋져요",
  "궁금했던 거예요",
  "고마워요",
  "응원해요",
  "1촌 해요",
  "다녀갑니다",
] as const;
/** "근거 봤어요" — 이 사진의 근거를 실제로 열었을 때만 고를 수 있다(화면이 지킨다). */
export const COMMENT_SAW_SOURCE = 1;

/** 퍼가기 보상 — 내 사진이 퍼가지면 한 번에 잼 20, 하루 100까지. 댓글에는 잼을 주지 않는다. */
export const SCRAP_JAM = 20;
export const SCRAP_JAM_DAY = 100;
/** 한 번에 읽는 댓글·퍼감 — 방 단위로 최근 것부터. */
export const COMMENTS_LOAD = 100;
export const SCRAPS_LOAD = 200;
/** 사진 한 장 아래에 펼치기 전 보이는 댓글 수. */
export const COMMENTS_PEEK = 2;

// ── 앵커 ─────────────────────────────────────────────────────────────

const ID = "[a-z0-9-]{1,60}";
const SUB = "[a-z0-9-]{1,40}";
export const MOMENT_KINDS = ["species", "golden", "rainbow", "raid", "souvenir", "book"] as const;
export type MomentKind = (typeof MOMENT_KINDS)[number];

/**
 * 사진이 가리키는 것. 품종 id와 같은 머리글을 써서 제목·아이콘을 품종표에서 바로 읽는다.
 *   a:<업적>             업적 카드(거둔 업적만)
 *   a:<업적>/<장면>      카툰 한 칸(거둔 업적만)
 *   w:<언행>             언행 한 편      w:<언행>#<토막>  쉽게 보기 한 토막
 *   p:<정책>#<claim>     정책 팩트 한 줄
 *   b:<책>/<장>          책 한 장
 *   m:<순간 종류>        내 정원의 순간 — 무엇인지는 md(s·v)에
 * firestore.rules의 anchorOk()와 같다.
 */
export const ANCHOR_RE = new RegExp(
  `^(a:${ID}(/${SUB})?|w:${ID}(#${SUB})?|p:${ID}#${SUB}|b:${SUB}/${SUB}|m:(${MOMENT_KINDS.join("|")}))$`,
);

export type Anchor =
  | { kind: "achievement"; slug: string }
  | { kind: "cut"; slug: string; scene: string }
  | { kind: "words"; slug: string; point?: string }
  | { kind: "policy"; slug: string; claim: string }
  | { kind: "book"; slug: string; chapter: string }
  | { kind: "moment"; moment: MomentKind };

export function parseAnchor(a: string): Anchor | null {
  if (typeof a !== "string" || !ANCHOR_RE.test(a)) return null;
  const head = a.slice(0, 2);
  const body = a.slice(2);
  if (head === "a:") {
    const [slug, scene] = body.split("/");
    return scene ? { kind: "cut", slug, scene } : { kind: "achievement", slug };
  }
  if (head === "w:") {
    const [slug, point] = body.split("#");
    return point ? { kind: "words", slug, point } : { kind: "words", slug };
  }
  if (head === "p:") {
    const [slug, claim] = body.split("#");
    return { kind: "policy", slug, claim };
  }
  if (head === "b:") {
    const [slug, chapter] = body.split("/");
    return { kind: "book", slug, chapter };
  }
  return { kind: "moment", moment: body as MomentKind };
}

/** 사진이 걸린 품종 id(제목·아이콘을 읽는 곳). 책·순간은 없다(순간은 md.s가 품종일 수 있다). */
export function speciesOf(a: Anchor): string | null {
  if (a.kind === "achievement" || a.kind === "cut") return `a:${a.slug}`;
  if (a.kind === "words") return `w:${a.slug}`;
  if (a.kind === "policy") return `p:${a.slug}`;
  return null;
}

/** 이 앵커가 맨 처음 들어갈 폴더. 사용자가 바꿀 수 있다. */
export function defaultFolder(a: Anchor): number {
  if (a.kind === "moment") return 2;
  if (a.kind === "book") return 3;
  if (a.kind === "policy") return 4;
  if (a.kind === "words") return 5;
  return 0;
}

export function defaultReason(a: Anchor): number {
  if (a.kind === "moment") return 8;
  if (a.kind === "policy") return 11;
  if (a.kind === "book") return 10;
  return 0;
}

/** 담기 전에 거둔 업적인지 볼 앵커인가(업적·카툰 칸). 언행·정책·책은 조건 없이 담는다(결정, 2026-11-22). */
export function needsHarvest(a: Anchor): boolean {
  return a.kind === "achievement" || a.kind === "cut";
}

// ── 순간 ─────────────────────────────────────────────────────────────

/** 순간의 내용. s=품종 id·책 slug·악초 종류, v=수(몇 번째 품종·물결 번호). */
export interface MomentData {
  s?: string;
  v?: number;
}

export interface Moment extends MomentData {
  t: MomentKind;
  at: number;
}

const MD_S = /^[a-z0-9:-]{1,64}$/;

export function cleanMd(raw: unknown): MomentData | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const out: MomentData = {};
  if (typeof r.s === "string" && MD_S.test(r.s)) out.s = r.s;
  if (typeof r.v === "number" && Number.isInteger(r.v) && r.v >= 0 && r.v < 1e9) out.v = r.v;
  return out.s !== undefined || out.v !== undefined ? out : undefined;
}

function momentKey(t: string, md: MomentData | undefined): string {
  return `${t}|${md?.s ?? ""}|${md?.v ?? ""}`;
}

/** 순간을 기억한다(최근 것부터, MOMENT_KEEP개). 같은 순간은 한 번. */
export function pushMoment(moments: readonly Moment[], m: Moment): Moment[] {
  const key = momentKey(m.t, m);
  return [m, ...moments.filter((x) => momentKey(x.t, x) !== key)].slice(0, MOMENT_KEEP);
}

// ── 사진 ─────────────────────────────────────────────────────────────

/** 퍼 온 사진의 출처 — 그 방의 공개 id·사진 id·그때의 방 이름. */
export interface PhotoFrom {
  g: string;
  p: string;
  n: string;
}

export interface Photo {
  id: string;
  a: string;
  md?: MomentData;
  /** 왜 담았나(REASONS 번호). */
  p: number;
  /** 스티커(ilchon STICKERS 번호). */
  k: number;
  /** 폴더(FOLDERS 번호). */
  f: number;
  /** 한 줄(60자, 없으면 ""). 방명록과 같은 검사를 지난 글. */
  x: string;
  at: number;
  from?: PhotoFrom;
  /** 대표 사진. 한 장만. */
  cv?: boolean;
  /** 댓글 받지 않기. */
  nc?: boolean;
}

export interface AlbumLedger {
  photos: Photo[];
  moments: Moment[];
  /** 퍼가기 보상 — 마지막으로 센 퍼감의 때, 오늘(한국 날짜 번호)과 오늘 받은 잼. */
  scrap: { seen: number; day: number; got: number };
}

export function freshAlbum(): AlbumLedger {
  return { photos: [], moments: [], scrap: { seen: 0, day: 0, got: 0 } };
}

export const PHOTO_ID = /^[a-z0-9]{6,20}$/;
const PUBLIC_ID = /^g[0-9a-z]{8,12}$/;

function int(v: unknown, max: number, fallback: number): number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0 && v < max ? v : fallback;
}

/** 저장된(또는 공개 문서에서 읽은) 사진 하나를 바로잡는다. 모양이 틀리면 null. */
export function cleanPhoto(raw: unknown): Photo | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || !PHOTO_ID.test(r.id)) return null;
  if (typeof r.a !== "string") return null;
  const anchor = parseAnchor(r.a);
  if (!anchor) return null;
  const md = cleanMd(r.md);
  if (anchor.kind === "moment" && !md) return null;
  const from =
    r.from && typeof r.from === "object" &&
    typeof (r.from as PhotoFrom).g === "string" && PUBLIC_ID.test((r.from as PhotoFrom).g) &&
    typeof (r.from as PhotoFrom).p === "string" && PHOTO_ID.test((r.from as PhotoFrom).p) &&
    typeof (r.from as PhotoFrom).n === "string"
      ? { g: (r.from as PhotoFrom).g, p: (r.from as PhotoFrom).p, n: (r.from as PhotoFrom).n.slice(0, 12) || "이웃" }
      : undefined;
  return {
    id: r.id,
    a: r.a,
    ...(md && anchor.kind === "moment" ? { md } : {}),
    p: int(r.p, REASONS.length, defaultReason(anchor)),
    k: int(r.k, 12, 0),
    f: int(r.f, FOLDERS.length, defaultFolder(anchor)),
    x: typeof r.x === "string" && r.x.length <= LINE_MAX ? r.x : "",
    at: typeof r.at === "number" && Number.isFinite(r.at) ? r.at : 0,
    ...(from ? { from } : {}),
    ...(r.cv === true ? { cv: true } : {}),
    ...(r.nc === true ? { nc: true } : {}),
  };
}

/** 같은 것을 두 번 담지 않는다 — 앵커와 순간 내용이 같으면 같은 사진. */
export function photoKey(p: Pick<Photo, "a" | "md">): string {
  return momentKey(p.a, p.md);
}

/**
 * 장부를 바로잡는다. 예전 사진첩(room.album, 업적 품종 id 목록)이 있으면 그 순서대로 옮긴다.
 * 옮긴 사진의 날짜는 모른다 — 0으로 두고 화면은 날짜를 적지 않는다.
 */
export function normalizeAlbum(raw: unknown, legacy?: readonly string[]): AlbumLedger {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<AlbumLedger>;
  const seen = new Set<string>();
  const photos: Photo[] = [];
  for (const p of Array.isArray(r.photos) ? r.photos : []) {
    const clean = cleanPhoto(p);
    if (!clean || seen.has(photoKey(clean)) || photos.some((x) => x.id === clean.id)) continue;
    seen.add(photoKey(clean));
    photos.push(clean);
  }
  for (const [i, id] of (legacy ?? []).entries()) {
    if (typeof id !== "string" || !/^a:[a-z0-9-]{1,40}$/.test(id) || seen.has(photoKey({ a: id }))) continue;
    seen.add(photoKey({ a: id }));
    // 사진 id는 6–20자(PHOTO_ID) — 짧은 slug도 6자가 되게 채운다.
    const pid = `old${i.toString(36)}${id.slice(2).replace(/-/g, "").slice(0, 12)}`.padEnd(6, "0").slice(0, 20);
    photos.push({ id: pid, a: id, p: 0, k: 0, f: 0, x: "", at: 0 });
  }
  let cover = false;
  const fixed = photos.slice(0, PHOTO_MAX).map((p) => {
    if (!p.cv) return p;
    if (cover) {
      const { cv: _drop, ...rest } = p;
      void _drop;
      return rest;
    }
    cover = true;
    return p;
  });
  const moments = (Array.isArray(r.moments) ? r.moments : [])
    .filter((m): m is Moment => Boolean(m) && MOMENT_KINDS.includes((m as Moment).t) && typeof (m as Moment).at === "number")
    .map((m) => ({ t: m.t, at: m.at, ...cleanMd(m) }))
    .slice(0, MOMENT_KEEP);
  const s = r.scrap;
  const scrap =
    s && typeof s.seen === "number" && typeof s.day === "number" && typeof s.got === "number"
      ? { seen: s.seen, day: s.day, got: Math.max(0, s.got) }
      : { seen: 0, day: 0, got: 0 };
  return { photos: fixed, moments, scrap };
}

export interface PhotoInput {
  a: string;
  md?: MomentData;
  p: number;
  k: number;
  f: number;
  x: string;
  from?: PhotoFrom;
  cv?: boolean;
  nc?: boolean;
}

export type AddRefusal = "full" | "have" | "bad";

/** 사진을 담는다(맨 앞에). 대표로 고르면 다른 사진의 대표를 내린다. */
export function addPhoto(album: AlbumLedger, input: PhotoInput, id: string, now: number): { album: AlbumLedger; photo: Photo } | AddRefusal {
  const photo = cleanPhoto({ ...input, id, at: now });
  if (!photo || (input.x && input.x.length > LINE_MAX)) return "bad";
  if (album.photos.some((p) => photoKey(p) === photoKey(photo))) return "have";
  if (album.photos.length >= PHOTO_MAX) return "full";
  const rest = photo.cv ? album.photos.map(dropCover) : album.photos;
  return { album: { ...album, photos: [photo, ...rest] }, photo };
}

function dropCover(p: Photo): Photo {
  if (!p.cv) return p;
  const { cv: _drop, ...rest } = p;
  void _drop;
  return rest;
}

export type PhotoPatch = Partial<Pick<Photo, "p" | "k" | "f" | "x" | "cv" | "nc">>;

/** 사진의 내 몫(문구·스티커·폴더·한 줄·대표·댓글 받기)을 고친다. 앵커·날짜·출처는 바꾸지 않는다. */
export function editPhoto(album: AlbumLedger, id: string, patch: PhotoPatch): AlbumLedger | null {
  const at = album.photos.findIndex((p) => p.id === id);
  if (at < 0) return null;
  // cleanPhoto는 cv·nc가 true일 때만 남긴다 — false로 고치면 칸이 빠진다.
  const next = cleanPhoto({ ...album.photos[at], ...patch });
  if (!next || (patch.x !== undefined && patch.x.length > LINE_MAX)) return null;
  const photos = album.photos.map((p, i) => (i === at ? next : next.cv ? dropCover(p) : p));
  return { ...album, photos };
}

export function removePhoto(album: AlbumLedger, id: string): AlbumLedger | null {
  if (!album.photos.some((p) => p.id === id)) return null;
  return { ...album, photos: album.photos.filter((p) => p.id !== id) };
}

/** 폴더별 사진 수(빈 폴더는 화면이 숨긴다). */
export function folderCounts(photos: readonly Photo[]): number[] {
  const n = FOLDERS.map(() => 0);
  for (const p of photos) n[p.f] = (n[p.f] ?? 0) + 1;
  return n;
}

/** 보이는 순서 — 대표 사진이 맨 앞, 나머지는 담은 순서(최근 것부터). */
export function ordered<T extends Pick<Photo, "cv" | "at">>(photos: readonly T[]): T[] {
  return [...photos].sort((a, b) => Number(Boolean(b.cv)) - Number(Boolean(a.cv)) || b.at - a.at);
}

// ── 공개 문서 ───────────────────────────────────────────────────────

/** gardens/{gid}/photos/{pid}에 싣는 모양. firestore.rules의 photoOk()가 같은 것을 본다. */
export interface PhotoDoc {
  a: string;
  p: number;
  k: number;
  f: number;
  x: string;
  at: number;
  md?: MomentData;
  fg?: string;
  fp?: string;
  fn?: string;
  cv?: boolean;
  nc?: boolean;
}

export function photoDoc(p: Photo): PhotoDoc {
  return {
    a: p.a,
    p: p.p,
    k: p.k,
    f: p.f,
    x: p.x,
    at: p.at,
    ...(p.md ? { md: p.md } : {}),
    ...(p.from ? { fg: p.from.g, fp: p.from.p, fn: p.from.n } : {}),
    ...(p.cv ? { cv: true } : {}),
    ...(p.nc ? { nc: true } : {}),
  };
}

/** 공개 문서에서 읽은 사진. 운영자가 한 줄을 가렸으면 hidden. */
export interface PublicPhoto extends Photo {
  hidden: boolean;
}

export function readPhotoDoc(id: string, d: Record<string, unknown>): PublicPhoto | null {
  const from = typeof d.fg === "string" && typeof d.fp === "string" ? { g: d.fg, p: d.fp, n: typeof d.fn === "string" ? d.fn : "이웃" } : undefined;
  const photo = cleanPhoto({ ...d, id, ...(from ? { from } : {}) });
  return photo ? { ...photo, hidden: d.hidden === true } : null;
}

// ── 댓글·퍼감 ───────────────────────────────────────────────────────

/** 댓글 문서 id — 한 사람이 한 사진에 하루 한 번. 규칙이 id를 본다. */
export function commentId(uid: string, photoId: string, day: number): string {
  return `${uid}_${photoId}_${day}`;
}

/** 퍼감 표식 id — 한 사람이 한 사진을 한 번. */
export function scrapId(uid: string, photoId: string): string {
  return `${uid}_${photoId}`;
}

/** 퍼갈 수 있는 사진인가. 남의 정원의 순간은 내 사진첩에서 "내 정원의 기록"이 아니다 — 퍼가지 않는다. */
export function canScrap(p: Pick<Photo, "a">): boolean {
  const a = parseAnchor(p.a);
  return Boolean(a) && a!.kind !== "moment";
}

/**
 * 받은 퍼감에서 잼을 센다. 지난번에 센 때(seen) 뒤의 것만, 하루 SCRAP_JAM_DAY까지.
 * 상한을 넘긴 퍼감은 다시 세지 않는다(seen이 넘어간다).
 */
export function scrapJam(album: AlbumLedger, scraps: ReadonlyArray<{ at: number }>, day: number): { jam: number; count: number; album: AlbumLedger } | null {
  const fresh = scraps.filter((s) => s.at > album.scrap.seen);
  if (fresh.length === 0) return null;
  const got = album.scrap.day === day ? album.scrap.got : 0;
  const room = Math.max(0, SCRAP_JAM_DAY - got);
  const jam = Math.min(room, fresh.length * SCRAP_JAM);
  const seen = Math.max(album.scrap.seen, ...fresh.map((s) => s.at));
  return { jam, count: fresh.length, album: { ...album, scrap: { seen, day, got: got + jam } } };
}

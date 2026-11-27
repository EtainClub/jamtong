import { buildClip } from "@/features/garden/album/clipBuild";
import { clipKey } from "@/features/garden/album/clips";
import { parseAnchor, PHOTO_ID } from "@/features/garden/album/rules";
import { buildCatalog } from "@/features/garden/catalog";
import { PUBLIC_ID } from "@/features/garden/rules";
import type { Species } from "@/features/garden/types";

/**
 * 사진첩 사진 한 장을 서버에서 읽는다 — 사진 링크(/g/[gid]/p/[pid])의 미리보기가 쓴다.
 *
 * garden-state.ts와 같이 Firestore REST로 읽는다(공개 방의 사진은 규칙상 누구나 읽는다).
 *
 * ★ 미리보기에 싣는 글자는 저장소에서 온 것뿐이다. 앵커(a)만 읽어 제목을 콘텐츠에서 꺼낸다.
 *   주인의 한 줄(x)·닉네임은 싣지 않는다(docs/garden-album-review.md §5 — 사람의 글이 사실처럼 퍼지지 않게).
 */

let byId: Map<string, Species> | null = null;

/** 공개 방에 있는 사진의 앵커. 없거나(내렸다) 방을 닫았으면 null. */
export async function loadPhotoAnchor(gid: string, pid: string): Promise<string | null> {
  if (!PUBLIC_ID.test(gid) || !PHOTO_ID.test(pid)) return null;
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!project || !key) return null;
  const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/gardens/${gid}/photos/${pid}?key=${key}`;
  // 캐시하지 않는다. 주인이 사진을 내리거나 방을 닫으면 미리보기도 바로 사라져야 한다.
  const res = await fetch(url, { cache: "no-store" });
  // 404=없는 사진, 403=닫은 방(규칙의 roomVisible).
  if (res.status === 404 || res.status === 403) return null;
  if (!res.ok) throw new Error(`사진첩 사진을 읽지 못했다: ${res.status}`);
  const a = ((await res.json()) as { fields?: { a?: { stringValue?: string } } }).fields?.a?.stringValue;
  return a && parseAnchor(a) ? a : null;
}

const MOMENT_TITLE: Record<string, string> = {
  species: "새 품종을 만난 날",
  golden: "황금 열매를 거둔 날",
  rainbow: "무지개 열매를 거둔 날",
  raid: "거대 잡초를 쓰러뜨린 날",
  souvenir: "기념품을 받은 날",
  book: "책 한 권을 다 읽은 날",
  room: "방 사진",
  yard: "텃밭 사진",
};

/** 사진이 담은 것 — 미리보기 제목. 콘텐츠에서 찾지 못하면 종류만. */
export function photoCaption(a: string): string {
  const anchor = parseAnchor(a);
  if (!anchor) return "사진첩 사진";
  if (anchor.kind === "moment") return MOMENT_TITLE[anchor.moment] ?? "정원의 순간";
  if (anchor.kind === "achievement" || anchor.kind === "cut") {
    byId ??= new Map(buildCatalog().map((s) => [s.id, s]));
    const title = byId.get(`a:${anchor.slug}`)?.title;
    if (!title) return anchor.kind === "cut" ? "카툰 한 칸" : "업적 카드";
    return anchor.kind === "cut" ? `카툰 「${title}」 한 칸` : `업적 「${title}」`;
  }
  const clip = buildClip(clipKey(anchor.kind, anchor.slug));
  if (anchor.kind === "words") return clip ? `언행 「${clip.title}」` : "언행 한 편";
  if (anchor.kind === "policy") return clip ? `정책 팩트 「${clip.title}」` : "정책 팩트";
  return clip ? `책 「${clip.title}」 한 장` : "책 한 장";
}

/**
 * 사진첩에 담는 언행·정책·책의 카드 자료 — 서버가 콘텐츠에서 굽고(clipBuild.ts) 화면이 받는다.
 * 자료 한 건에 파일 하나(/api/album-clip/<w|p|b>-<slug>) — 정책 claim이 천 건이 넘어 한 파일로 묶지 않는다.
 *
 * ★ 글은 모두 콘텐츠의 것이다. claim의 층(FACT·CLAIM…)과 누구의 주장인지, 확인했는지를 그대로 싣는다.
 */

export interface WordsClip {
  kind: "words";
  slug: string;
  title: string;
  /** "SNS 글" 같은 종류. */
  label: string;
  channel: string;
  displayDate: string;
  href: string;
  /** 쉽게 보기의 첫 말(없으면 맥락 한 줄). */
  intro?: string;
  points: Array<{ id: string; title: string; say: string; quote: string }>;
}

export interface PolicyClaimClip {
  id: string;
  text: string;
  type: "FACT" | "CLAIM" | "INTERPRETATION" | "OPINION";
  by?: string;
  verified: boolean;
  /** 이 claim이 답하는 도는 주장(있으면 첫 하나). */
  rumor?: string;
}

export interface PolicyClip {
  kind: "policy";
  slug: string;
  title: string;
  asOf: string;
  href: string;
  claims: PolicyClaimClip[];
}

export interface BookClip {
  kind: "book";
  slug: string;
  title: string;
  year: number;
  href: string;
  chapters: Array<{ slug: string; order: number; title: string; summary: string; href: string }>;
}

export type Clip = WordsClip | PolicyClip | BookClip;

/** 자료 파일 이름. w-<언행>, p-<정책>, b-<책>. */
export function clipKey(kind: Clip["kind"], slug: string): string {
  return `${kind === "words" ? "w" : kind === "policy" ? "p" : "b"}-${slug}`;
}

const cache = new Map<string, Promise<Clip | null>>();

/** 한 번 받은 자료는 다시 받지 않는다. 없거나 받지 못하면 null(화면은 "자료를 찾지 못했어요"). */
export function loadClip(kind: Clip["kind"], slug: string): Promise<Clip | null> {
  const key = clipKey(kind, slug);
  let p = cache.get(key);
  if (!p) {
    p = fetch(`/api/album-clip/${key}`)
      .then((r) => (r.ok ? (r.json() as Promise<Clip>) : null))
      .catch(() => {
        cache.delete(key);
        return null;
      });
    cache.set(key, p);
  }
  return p;
}

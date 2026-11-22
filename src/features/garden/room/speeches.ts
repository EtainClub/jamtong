import type { Statement } from "@/content/words/schema";

/**
 * 연설 상영관(가구 speech-screen) — 언행(content/words)에 실린 연설 영상 목록.
 *
 * ★ 언행 본문은 크다. 정원 묶음에 싣지 않고 app/garden/speeches.json으로 따로 내보내, 상영관을 열 때만 받는다.
 * ★ 언행의 kind가 speech이고 유튜브 영상이 붙은 것만. 같은 영상이 두 언행에 붙으면(연설 + 그 영상을 알린 SNS 글) 한 번만.
 * ★ 영상 제목·출처는 언행에 적힌 그대로 옮긴다. 우리가 설명을 보태지 않는다 — 자세한 것은 언행 페이지로 잇는다.
 * ★ 순수 함수만 둔다.
 */
export interface SpeechVideo {
  slug: string;
  title: string;
  displayDate: string;
  postedAt: string;
  video: string;
  mediaTitle: string;
  credit?: string;
}

/** 유튜브 주소에서 영상 id. watch?v= · youtu.be/ · /live/ · /embed/ · /shorts/. 모르는 모양이면 null. */
export function youtubeId(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www|m)\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = u.pathname.slice(1);
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:live|embed|shorts)\/([^/]+)/)?.[1] ?? null;
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}

/** 최근 연설이 먼저. */
export function buildSpeeches(statements: readonly Statement[]): SpeechVideo[] {
  const seen = new Set<string>();
  const out: SpeechVideo[] = [];
  for (const s of [...statements].sort((a, b) => b.postedAt.localeCompare(a.postedAt))) {
    if (s.kind !== "speech") continue;
    for (const m of s.media) {
      const video = m.type === "youtube" ? youtubeId(m.url) : null;
      if (!video || seen.has(video)) continue;
      seen.add(video);
      out.push({ slug: s.slug, title: s.title, displayDate: s.displayDate, postedAt: s.postedAt, video, mediaTitle: m.title, ...(m.credit ? { credit: m.credit } : {}) });
    }
  }
  return out;
}

export const speechEmbed = (video: string) => `https://www.youtube-nocookie.com/embed/${video}?autoplay=1&playsinline=1&rel=0`;
export const speechOriginal = (video: string) => `https://www.youtube.com/watch?v=${video}`;

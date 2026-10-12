/**
 * 서버와 클라이언트가 함께 쓴다. "use client" 파일에 두면 서버 컴포넌트에서
 * 부를 수 없어 따로 뺐다.
 */

/** Extract IDs from YouTube watch, share, embed, Shorts, and live URLs. */
export function youtubeVideoId(value: string): string | null {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.split("/").filter(Boolean);
    const id =
      host === "youtu.be"
        ? path[0]
        : ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)
          ? url.searchParams.get("v") ??
            (["embed", "shorts", "live"].includes(path[0]) ? path[1] : null)
          : null;
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

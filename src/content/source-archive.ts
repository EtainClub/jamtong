import type { Source } from "./schema";
import archive from "./source-archive.generated.json";

/**
 * 출처 보존본과 링크 확인 날짜.
 *
 * `pnpm sources:archive`가 만든 표를 URL로 찾는다. 출처 파일에 직접 적은
 * archivedUrl이 있으면 그것이 먼저다 — 사람이 고른 보존본이 기계가 찾은
 * 가장 가까운 사본보다 낫다.
 *
 * 화면에는 서버에서 붙여 보낸다. 표 전체를 클라이언트 묶음에 실으면 근거
 * 서랍 하나를 열려고 출처 수백 개의 표를 내려받게 된다.
 */

type Entry = {
  checkedAt: string;
  status: "ok" | "gone" | "blocked" | "error";
  http?: number;
  archivedAt?: string;
};

const TABLE = archive as Record<string, Entry>;

export interface SourceLinkInfo {
  /** 원문 링크를 마지막으로 확인한 날. */
  checkedAt?: string;
  /** 원문이 404·410을 돌려줬다. 보존본으로 안내한다. */
  gone?: boolean;
}

export type ArchivedSource = Source & SourceLinkInfo;

export function archiveEntry(url: string | undefined): Entry | undefined {
  return url ? TABLE[url] : undefined;
}

export function withArchive(source: Source): ArchivedSource {
  const entry = archiveEntry(source.url);
  if (!entry) return source;
  const archivedUrl =
    source.archivedUrl ??
    (entry.archivedAt && source.url
      ? `https://web.archive.org/web/${entry.archivedAt}/${source.url}`
      : undefined);
  return {
    ...source,
    archivedUrl,
    checkedAt: entry.checkedAt,
    gone: entry.status === "gone" || undefined,
  };
}

export function withArchives(sources: Source[]): ArchivedSource[] {
  return sources.map(withArchive);
}

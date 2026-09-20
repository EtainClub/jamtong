import { fullSearchIndex } from "@/content/search-server";

/**
 * 검색 인덱스.
 *
 * 첫 화면에 실어 보내지 않는다. 홈에 들어오는 사람 대부분은 검색하지 않는다.
 * 검색창을 건드릴 때 한 번 받아 두면 그 뒤로는 즉시 찾는다.
 *
 * 콘텐츠가 저장소에 있으므로 빌드 때 구워 둔다. 정적 파일이라 인스턴스가
 * 꺼져 있어도 지연이 없다 — 검색 첫 타에 콜드 스타트를 물리면 안 된다.
 *
 * 인덱스를 합치는 자리는 여기 하나다. 위키와 자서전은 fs로 읽으므로 브라우저에
 * 실리는 `content/search.ts`가 아니라 `content/search-server.ts`가 붙인다.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(fullSearchIndex(), {
    headers: { "cache-control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}

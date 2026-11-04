import { buildCases } from "@/features/garden/catalog";

/**
 * 탐정 온실의 사건 목록 (docs/garden-game.md §4).
 *
 * 사건이 수백 건이고 보기마다 claim 본문이 붙어 수백 KB가 된다. /garden 페이지에
 * 실으면 온실에 들어가지 않는 대다수까지 그 무게를 진다. 그래서 정적 파일로 따로
 * 내보내고, 온실 탭을 열 때만 받는다. 빌드 때 한 번 만들어진다.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildCases(), {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}

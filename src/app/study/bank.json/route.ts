import { buildStudyBank } from "@/features/study/build";

/**
 * 잼공 문항 은행 전체 — 첫 화면은 1단계 문항만 싣고(entryBank), 나머지는 여기서 받는다(StudyApp).
 *
 * 빌드 때 한 번 만들어 정적 파일로 나간다. 콘텐츠가 저장소에 있으므로 배포마다 새로 만들어진다.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildStudyBank(), {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}

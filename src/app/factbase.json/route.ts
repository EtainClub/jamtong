import { buildFactbase } from "@/lib/factbase/build";

/**
 * 근거 묶음 (insta-factbot이 읽는다).
 *
 * 빌드 때 한 번 만들어 정적 파일로 나간다. 콘텐츠가 저장소에 있으므로
 * 배포마다 새로 만들어지고, version이 곧 package.json의 버전이다.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildFactbase(), {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}

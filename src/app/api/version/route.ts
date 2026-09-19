import { BUILD } from "@/lib/build-info";

/**
 * 지금 서버가 들고 있는 빌드를 알린다.
 *
 * 브라우저에 박힌 값과 여기 값을 비교해서 새 배포가 있었는지 판단한다.
 * 캐시되면 의미가 없으므로 매번 서버에서 낸다.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { id: BUILD.id, version: BUILD.version, commit: BUILD.commit, builtAt: BUILD.builtAt },
    { headers: { "cache-control": "no-store" } },
  );
}

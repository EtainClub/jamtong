import { buildMemorial } from "@/features/garden/memorial/build";

/**
 * 잼통 정원 업적 기념관·사진첩의 자료 (docs/garden-achievement-strategy.md §3).
 *
 * 업적마다 사진·핵심 숫자·문제가 붙어 /garden 페이지에 실으면 기념관을 열지 않는 사람까지 무게를 진다.
 * 탐정 온실(cases.json)처럼 정적 파일로 따로 내보내고, 기념관·사진첩을 열 때만 받는다.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildMemorial(), {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}

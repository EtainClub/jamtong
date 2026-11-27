import { buildCartelCards } from "@/features/garden/room/cartelBuild";

/**
 * 방의 카르텔 카드가 보여 줄 요약 — 카르텔 본문(업적·성과 카드까지 딸려 온다)을 정원 묶음에 싣지 않으려고 따로 내보낸다.
 * 연설 상영관(speeches.json)과 같은 방식이다.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildCartelCards(), {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}

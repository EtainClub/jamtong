import { STATEMENTS } from "@/content/words";
import { buildSpeeches } from "@/features/garden/room/speeches";

/**
 * 방의 연설 상영관이 보여 줄 연설 영상 목록 — 언행 본문을 정원 묶음에 싣지 않으려고 따로 내보낸다.
 * 기념관(memorial.json)·탐정 온실(cases.json)과 같은 방식이다.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSpeeches(STATEMENTS), {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}

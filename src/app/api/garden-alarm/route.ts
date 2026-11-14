import { alarmAtOk, alarmKindOf, calendarFile } from "@/features/garden/alarm";
import { SITE_URL } from "@/lib/seo/site";

/**
 * 익음 알림 캘린더 파일 — 텃밭의 "캘린더에 넣기"가 연다(features/garden/alarm.ts).
 *
 * 받는 것은 시각(ms)과 종류(k=ripe|rain|gap, 정해 둔 글만 고른다)뿐이다. https 주소로 여는 .ics가 iOS 사파리와 앱 속 브라우저에서
 * 가장 잘 "캘린더에 추가"로 이어진다 — 그래서 화면에서 만들지 않고 여기서 낸다.
 */
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("at") ?? "";
  const at = /^[0-9]{10,14}$/.test(raw) ? Number(raw) : NaN;
  const now = Date.now();
  if (!alarmAtOk(at, now)) return new Response("시각이 맞지 않아요", { status: 400 });
  const kind = alarmKindOf(new URL(request.url).searchParams.get("k"));
  return new Response(calendarFile(at, `${SITE_URL}/garden${kind === "gap" ? "?tab=plaza" : ""}`, now, kind), {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": 'inline; filename="jamtong-garden.ics"',
      "cache-control": "no-store",
    },
  });
}

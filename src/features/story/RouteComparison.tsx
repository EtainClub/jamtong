import type { Claim, RouteComparison as Comparison } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 항로 비교 (설계서 10장 `comparison` 씬).
 *
 * 지도는 북극 중심 투영이라 남위 34도의 희망봉 항로를 그릴 수 없다.
 * 지도가 못 보여주는 비교는 차트가 맡는다 — 그리고 이 비교가 사실상 논지다.
 * 프레이밍은 비교군이 없을 때만 작동한다.
 *
 * 막대 길이는 거리에 정비례한다. 시각적 과장을 넣지 않는다.
 */
export function RouteComparison({
  comparisons,
  claims,
  note,
}: {
  comparisons: Comparison[];
  claims: Claim[];
  note?: string;
}) {
  if (comparisons.length === 0) return null;

  const maxKm = Math.max(...comparisons.map((c) => c.km));
  const claimIds = [...new Set(comparisons.map((c) => c.claimId))];

  return (
    <figure className="m-0">
      <ol className="space-y-5">
        {comparisons.map((route) => {
          const width = (route.km / maxKm) * 100;

          return (
            <li key={route.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span
                  className={`text-sm font-semibold ${
                    route.highlight ? "text-navy" : "text-smoke"
                  }`}
                >
                  {route.name}
                </span>
                <span className="tabular text-sm text-ash">
                  <span
                    className={`font-semibold ${
                      route.highlight ? "text-ink" : "text-smoke"
                    }`}
                  >
                    {route.km.toLocaleString("ko-KR")} km
                  </span>
                  {" · "}
                  {route.daysMin}~{route.daysMax}일
                </span>
              </div>

              <div className="mt-2 h-3 overflow-hidden rounded-full bg-taupe">
                <div
                  className={`h-full rounded-full ${
                    route.highlight ? "bg-navy" : "bg-ash"
                  }`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>

      {/* 전제 조건. 수치만 보여주고 조건을 숨기면 오도가 된다. */}
      {note && (
        <figcaption className="mt-6 border-l-2 border-ash pl-4 text-[13px] leading-relaxed text-ash">
          {note}
        </figcaption>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {claimIds.map((id) => {
          const claim = claims.find((c) => c.id === id);
          if (!claim) return null;
          return (
            <EvidenceButton key={id} claimId={id} count={claim.sourceIds.length} />
          );
        })}
      </div>
    </figure>
  );
}

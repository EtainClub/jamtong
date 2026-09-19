import type { Claim, LandUse } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 토지이용 구성.
 *
 * 금액 자료가 없을 때 "공공이 무엇을 가져갔는가"를 면적으로 보여준다.
 * 인허가 고시에 실리는 값이라 금액보다 검증이 쉽고 다툼의 여지도 적다.
 *
 * 누적 막대 하나로 전체 구성을 보이고, 그 아래에 공공용지 내역을 편다.
 * 비율은 자료의 구성비를 그대로 쓴다 — 면적에서 다시 계산하면 반올림 차이로
 * 자료와 다른 숫자가 화면에 뜬다.
 */

// onBar은 막대 안에 얹는 글자색이다. 막대가 진하면 밝게, 옅으면 진하게.
const GROUP_STYLE: Record<
  LandUse["groups"][number]["group"],
  { bar: string; dot: string; text: string; onBar: string }
> = {
  public: { bar: "bg-navy", dot: "bg-navy", text: "text-navy", onBar: "text-eggshell" },
  residential: { bar: "bg-stone", dot: "bg-stone", text: "text-smoke", onBar: "text-graphite" },
  commercial: { bar: "bg-burgundy", dot: "bg-burgundy", text: "text-burgundy", onBar: "text-eggshell" },
};

const fmt = (n: number) => n.toLocaleString("ko-KR", { maximumFractionDigits: 1 });

export function LandUseBreakdown({
  landUse,
  claims,
}: {
  landUse: LandUse;
  claims: Claim[];
}) {
  const claim = claims.find((c) => c.id === landUse.claimId);
  // 공공용지가 논지이므로 먼저 그린다.
  const ordered = [...landUse.groups].sort((a, b) =>
    a.group === "public" ? -1 : b.group === "public" ? 1 : 0,
  );
  const maxPublic = Math.max(...landUse.publicBreakdown.map((i) => i.areaSqm), 1);

  return (
    <figure className="m-0">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-smoke">전체 사업 면적</span>
        <span className="tabular text-sm font-semibold text-ink">
          {fmt(landUse.totalSqm)} ㎡
        </span>
      </div>

      {/* 누적 막대 — 한 줄로 전체 구성을 보인다 */}
      <div className="mt-3 flex h-10 w-full overflow-hidden rounded-lg">
        {ordered.map((group) => (
          <div
            key={group.id}
            className={`${GROUP_STYLE[group.group].bar} flex items-center justify-center`}
            style={{ width: `${group.sharePercent}%` }}
            title={`${group.label} ${group.sharePercent}%`}
          >
            {group.sharePercent >= 12 && (
              <span
                className={`tabular text-xs font-bold ${GROUP_STYLE[group.group].onBar}`}
              >
                {group.sharePercent}%
              </span>
            )}
          </div>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {ordered.map((group) => (
          <li key={group.id} className="flex items-baseline gap-2.5 text-sm">
            <span
              aria-hidden="true"
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm ${GROUP_STYLE[group.group].dot}`}
            />
            <span className={`font-medium ${GROUP_STYLE[group.group].text}`}>
              {group.label}
            </span>
            <span className="tabular ml-auto shrink-0 text-ash">
              {fmt(group.areaSqm)} ㎡ · {group.sharePercent}%
            </span>
          </li>
        ))}
      </ul>

      {landUse.publicBreakdown.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ash">
            공공용지 내역
          </h3>
          <ul className="mt-4 space-y-2.5">
            {landUse.publicBreakdown.map((item) => (
              <li key={item.id}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-smoke">
                    {item.label}
                    {item.detail && (
                      <span className="ml-2 text-xs text-ash">{item.detail}</span>
                    )}
                  </span>
                  <span className="tabular shrink-0 text-ash">
                    {fmt(item.areaSqm)} ㎡
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone">
                  <div
                    className="h-full rounded-full bg-navy"
                    style={{ width: `${(item.areaSqm / maxPublic) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {landUse.note && (
        <figcaption className="mt-6 border-l-2 border-ash pl-4 text-[13px] leading-relaxed text-ash">
          {landUse.note}
        </figcaption>
      )}

      {claim && (
        <div className="mt-5">
          <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
        </div>
      )}
    </figure>
  );
}

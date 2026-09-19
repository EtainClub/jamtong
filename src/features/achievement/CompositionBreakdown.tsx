import type { Claim, Composition } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 구성 — 전체가 무엇으로 이루어져 있나.
 *
 * 누적 막대 하나로 전체 구성을 보이고, 그 아래에 한 몫의 내역을 편다.
 * 비율은 자료의 구성비를 그대로 쓴다 — 수량에서 다시 계산하면 반올림 차이로
 * 자료와 다른 숫자가 화면에 뜬다.
 *
 * 그리는 순서는 콘텐츠에 적은 순서다. 여기서 정렬하지 않는다. 무엇을 먼저
 * 보일지는 그 업적의 논지에 달렸고, 그건 콘텐츠가 아는 일이다.
 */

// onBar은 막대 안에 얹는 글자색이다. 막대가 진하면 밝게, 옅으면 진하게.
const TONE: Record<
  Composition["groups"][number]["tone"],
  { bar: string; dot: string; text: string; onBar: string }
> = {
  primary: { bar: "bg-navy", dot: "bg-navy", text: "text-navy", onBar: "text-eggshell" },
  neutral: { bar: "bg-stone", dot: "bg-stone", text: "text-smoke", onBar: "text-graphite" },
  accent: { bar: "bg-burgundy", dot: "bg-burgundy", text: "text-burgundy", onBar: "text-eggshell" },
};

const fmt = (n: number) => n.toLocaleString("ko-KR", { maximumFractionDigits: 1 });

export function CompositionBreakdown({
  composition,
  claims,
}: {
  composition: Composition;
  claims: Claim[];
}) {
  const claim = claims.find((c) => c.id === composition.claimId);
  const { unit } = composition;
  // 전체와 내역이 다른 것을 셀 수 있다. 학생 수를 나눈 뒤 학교 수를 펴는 식이다.
  const breakdownUnit = composition.breakdownUnit ?? unit;
  const maxBreakdown = Math.max(...composition.breakdown.map((i) => i.amount), 1);

  return (
    <figure className="m-0">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-smoke">{composition.totalLabel}</span>
        <span className="tabular text-sm font-semibold text-ink">
          {fmt(composition.total)} {unit}
        </span>
      </div>

      {/* 누적 막대 — 한 줄로 전체 구성을 보인다 */}
      <div className="mt-3 flex h-10 w-full overflow-hidden rounded-lg">
        {composition.groups.map((group) => (
          <div
            key={group.id}
            className={`${TONE[group.tone].bar} flex items-center justify-center`}
            style={{ width: `${group.sharePercent}%` }}
            title={`${group.label} ${group.sharePercent}%`}
          >
            {group.sharePercent >= 12 && (
              <span className={`tabular text-xs font-bold ${TONE[group.tone].onBar}`}>
                {group.sharePercent}%
              </span>
            )}
          </div>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {composition.groups.map((group) => (
          <li key={group.id} className="flex items-baseline gap-2.5 text-sm">
            <span
              aria-hidden="true"
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm ${TONE[group.tone].dot}`}
            />
            <span className={`font-medium ${TONE[group.tone].text}`}>{group.label}</span>
            {group.detail && <span className="text-xs text-ash">{group.detail}</span>}
            <span className="tabular ml-auto shrink-0 text-ash">
              {fmt(group.amount)} {unit} · {group.sharePercent}%
            </span>
          </li>
        ))}
      </ul>

      {composition.breakdown.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ash">
            {composition.breakdownLabel}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {composition.breakdown.map((item) => (
              <li key={item.id}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-smoke">
                    {item.label}
                    {item.detail && <span className="ml-2 text-xs text-ash">{item.detail}</span>}
                  </span>
                  <span className="tabular shrink-0 text-ash">
                    {fmt(item.amount)} {breakdownUnit}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone">
                  <div
                    className="h-full rounded-full bg-navy"
                    style={{ width: `${(item.amount / maxBreakdown) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {composition.note && (
        <figcaption className="mt-6 border-l-2 border-ash pl-4 text-[13px] leading-relaxed text-ash">
          {composition.note}
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

import type { Claim, Counterpoint } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 쟁점과 답변 (설계 검토 문서 2.1).
 *
 * 관점을 가진 매체일수록 반론을 빼면 안 된다. 반론을 회피하면 그 자체가
 * 공격 지점이 되고, 반론에 근거로 답하면 그게 무기가 된다.
 *
 * 그래서 질문은 날을 세워 그대로 적는다. 완곡하게 다듬으면 답변의 무게도 같이 사라진다.
 */
export function Counterpoints({
  counterpoints,
  claims,
}: {
  counterpoints: Counterpoint[];
  claims: Claim[];
}) {
  if (counterpoints.length === 0) return null;

  return (
    <ul className="space-y-4">
      {counterpoints.map((cp) => {
        const supporting = cp.claimIds
          .map((id) => claims.find((c) => c.id === id))
          .filter((c): c is Claim => Boolean(c));

        // 근거가 하나도 없는 답변은 내보내지 않는다.
        if (supporting.length === 0) return null;

        return (
          <li
            key={cp.id}
            className="rounded-xl border border-line bg-ink-700 p-6"
          >
            <h3 className="flex gap-3 text-[17px] font-semibold leading-snug text-text-primary">
              <span aria-hidden="true" className="shrink-0 text-warm-400">
                Q
              </span>
              {cp.question}
            </h3>
            <p className="mt-3 flex gap-3 text-[15px] leading-relaxed text-text-secondary">
              <span aria-hidden="true" className="shrink-0 font-semibold text-ice-400">
                A
              </span>
              <span>{cp.response}</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2 pl-7">
              {supporting.map((claim) => (
                <EvidenceButton
                  key={claim.id}
                  claimId={claim.id}
                  count={claim.sourceIds.length}
                />
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

import type { Policy } from "@/content/policies/schema";

/*
 * 재판 허브의 문장 한 줄. claim 원문, 누가 한 말인지, 미검증 표식, 출처.
 * 출처는 <details>로 접는다 — 스크립트 없이 펼쳐지고 검색엔진도 읽는다.
 */
export function TrialClaim({ policy, claimId }: { policy: Policy; claimId: string }) {
  const claim = policy.claims.find((c) => c.id === claimId);
  if (!claim) return null;
  const sources = claim.sourceIds
    .map((id) => policy.sources.find((s) => s.id === id))
    .filter((s) => s !== undefined);

  return (
    <li className="text-[13px] leading-relaxed text-graphite">
      <p>
        {claim.text}
        {claim.assertionType === "CLAIM" && claim.assertedBy && (
          <span className="text-ash"> — {claim.assertedBy}</span>
        )}
        {!claim.verified && (
          <span className="ml-1 rounded bg-pending-tint px-1 text-[10px] font-semibold text-pending">
            미검증
          </span>
        )}
      </p>
      <details className="group mt-1">
        <summary className="cursor-pointer list-none text-[11px] font-medium text-navy">
          출처 {sources.length}{" "}
          <span aria-hidden="true" className="inline-block transition-transform group-open:rotate-90">
            ›
          </span>
        </summary>
        <ul className="mt-1 space-y-0.5 text-[11px] leading-relaxed text-ash">
          {sources.map((source) => (
            <li key={source.id}>
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-smoke"
                >
                  {source.publisher} 『{source.title}』
                </a>
              ) : (
                <>
                  {source.publisher} 『{source.title}』
                </>
              )}
              {source.publishedAt && <span className="tabular"> · {source.publishedAt}</span>}
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
}

/** 세 목소리 가운데 한 칸. 비어 있으면 비어 있다고 적는다. */
export function VoiceColumn({
  label,
  tone,
  policy,
  claimIds,
}: {
  label: string;
  tone: string;
  policy: Policy;
  claimIds: string[];
}) {
  return (
    <div className="rounded-card border border-stone px-3.5 py-3">
      <h4 className={`text-[11px] font-bold tracking-[0.04em] ${tone}`}>{label}</h4>
      {claimIds.length > 0 ? (
        <ul className="mt-2 space-y-2.5">
          {claimIds.map((id) => (
            <TrialClaim key={id} policy={policy} claimId={id} />
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[12px] leading-relaxed text-ash">
          아직 출처를 확인한 문장이 없습니다.
        </p>
      )}
    </div>
  );
}

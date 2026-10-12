import Link from "next/link";

import type { ResolvedEvidence, ResolvedLine } from "@/content/pledges";

import { STATUS_CHIP, STATUS_LABEL } from "./PledgeProgress";

/*
 * 약속 한 줄의 상태와 근거. 공약 화면과 국정과제 화면이 같이 쓴다.
 * 근거는 <details>로 접는다 — 스크립트 없이 펼쳐지고 검색엔진도 읽는다.
 */

export function StatusChip({ line }: { line: ResolvedLine }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_CHIP[line.status]}`}
    >
      {STATUS_LABEL[line.status]}
    </span>
  );
}

/** 근거가 붙은 약속 한 줄. 무엇이 됐는지 한 줄, 그 근거 원문, 출처. */
export function TrackedLine({ line, kicker }: { line: ResolvedLine; kicker?: string }) {
  const evidence = line.evidence;
  return (
    <div className="rounded-card border border-stone bg-taupe px-4 py-3">
      <div className="flex items-center gap-2">
        <StatusChip line={line} />
        {kicker && <span className="text-[10px] font-bold text-navy">{kicker}</span>}
      </div>
      <p className="mt-1.5 text-[13px] font-semibold leading-snug text-ink">{line.text}</p>
      {line.note && <p className="mt-1 text-[12px] leading-relaxed text-smoke">{line.note}</p>}
      {evidence && <EvidenceDetails evidence={evidence} />}
    </div>
  );
}

/** 근거 원문·출처·자세히 보기 링크. 접힌 채로 시작한다. */
export function EvidenceDetails({ evidence }: { evidence: ResolvedEvidence }) {
  return (
    <details className="group mt-2">
      <summary className="cursor-pointer list-none text-[11px] font-medium text-navy">
        근거 보기 <span aria-hidden="true" className="inline-block transition-transform group-open:rotate-90">›</span>
      </summary>
      <blockquote className="mt-2 border-l-2 border-stone pl-3 text-[12px] leading-relaxed text-smoke">
        {evidence.claim.text}
        {evidence.claim.assertionType === "CLAIM" && evidence.claim.assertedBy && (
          <span className="text-ash"> — {evidence.claim.assertedBy}의 주장</span>
        )}
        {!evidence.claim.verified && (
          <span className="ml-1 rounded bg-pending-tint px-1 text-[10px] font-semibold text-pending">
            미검증
          </span>
        )}
      </blockquote>
      <ul className="mt-2 space-y-0.5 text-[11px] leading-relaxed text-ash">
        {evidence.sources.map((source) => (
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
      <Link
        href={evidence.href}
        className="mt-2 inline-block text-[11px] font-semibold text-navy"
      >
        {evidence.label}에서 자세히 <span aria-hidden="true">→</span>
      </Link>
    </details>
  );
}

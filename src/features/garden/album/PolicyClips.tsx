import { getPolicy } from "@/content/policies";

import { ClipLink } from "./ClipLink";

/**
 * 정책 위키 페이지 끝의 "사진첩에 담기" — 사실 한 줄씩 담는다(docs/garden-album-review.md §4).
 * 본문 마크다운(lib/wiki/policy.ts)에는 넣지 않는다 — 위키 본문은 앵커만 갖는 지식층이고, 이것은 정원으로 가는 문이다.
 * 도는 주장에 답하는 사실을 먼저, 나머지는 접어 둔다.
 */
export function PolicyClips({ slug }: { slug: string }) {
  const policy = getPolicy(slug);
  if (!policy) return null;
  const answered = new Set(policy.rumors.flatMap((r) => r.claimIds));
  const first = policy.claims.filter((c) => answered.has(c.id));
  const rest = policy.claims.filter((c) => !answered.has(c.id));
  const row = (c: (typeof policy.claims)[number]) => (
    <li key={c.id} className="border-t border-stone/60 py-2">
      <p className="line-clamp-2 text-[13px] leading-relaxed text-ink">{c.text}</p>
      <ClipLink anchor={`p:${slug}#${c.id}`} label="이 사실 담기" />
    </li>
  );
  return (
    <section aria-labelledby="policy-clips" className="mt-8 rounded-card border border-stone bg-taupe/40 px-4 py-3">
      <h2 id="policy-clips" className="text-[13px] font-bold text-ink">📷 잼통 정원 사진첩에 담기</h2>
      <p className="mt-1 text-[12px] leading-relaxed text-smoke">
        사실 한 줄을 내 사진첩에 담고, 왜 담았는지 한 줄을 붙여 보세요. 출처와 근거가 함께 따라가요.
      </p>
      <ul className="mt-2">{(first.length ? first : rest.slice(0, 3)).map(row)}</ul>
      {first.length > 0 || rest.length > 3 ? (
        <details className="mt-1">
          <summary className="cursor-pointer text-[12px] font-semibold text-navy">다른 사실 {first.length ? rest.length : rest.length - 3}건</summary>
          <ul>{(first.length ? rest : rest.slice(3)).map(row)}</ul>
        </details>
      ) : null}
    </section>
  );
}

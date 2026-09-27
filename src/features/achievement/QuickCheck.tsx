import type { Achievement, Claim, SourceType } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 따져 보기 — 첫 화면 바로 아래.
 *
 * 이 사이트의 1순위 용도는 지지자가 지인에게 링크를 보내는 것이다. 받는 사람은
 * 대개 정치에 관심이 없고, 지인이 보냈으니 "맞나?" 하고 한 번 따져 본다. 그 사람이
 * 가장 먼저 봐야 하는 것은 업적이 아니라 **이 페이지를 믿어도 되는 이유**다 —
 * 근거가 무엇이고, 어떤 비판이 있고, 자료의 한계가 어디인지.
 *
 * ★ 반론을 맨 아래에 두면 회의적인 사람은 거기까지 내려가지 않는다.
 *   그래서 질문을 여기에 먼저 세운다. 답은 접어 둔다 — 펼치는 것은 읽는 사람의
 *   선택이고, 질문이 보이는 것만으로 "숨기지 않는다"는 것이 전해진다.
 *
 * ★ 쉬운 보기에서도 보인다.
 *   원문 보기의 반론 섹션으로 보내는 링크를 쓰면 쉬운 보기에서는 갈 곳이 없다.
 *   그래서 답을 여기 그대로 펼친다.
 *
 * 공유로 들어온 사람만 따로 보여 주지 않는다. 업적 페이지는 정적으로 구워 두고,
 * 같은 정보가 모두에게 먼저 보이는 편이 더 정직하다.
 */

/** 원문 쪽 자료. 기사보다 무게가 크고, 받은 사람이 직접 열어 확인할 수 있다. */
const PRIMARY: SourceType[] = ["official", "legislative", "statistics", "judicial"];

export function QuickCheck({ achievement }: { achievement: Achievement }) {
  if (achievement.publishStatus === "draft") return null;

  const { sources, claims, counterpoints, sourceNote, coverage } = achievement;
  const primary = sources.filter((s) => PRIMARY.includes(s.type)).length;
  const press = sources.filter((s) => s.type === "press").length;
  const attributed = claims.filter((c) => c.assertionType !== "FACT").length;

  const answered = counterpoints
    .map((cp) => ({
      cp,
      supporting: cp.claimIds
        .map((id) => claims.find((c) => c.id === id))
        .filter((c): c is Claim => Boolean(c)),
    }))
    // 근거 없는 답변은 반론 섹션과 똑같이 내보내지 않는다.
    .filter(({ supporting }) => supporting.length > 0);

  return (
    <aside aria-labelledby="quick-check" className="mx-auto mt-2 max-w-5xl px-5">
      <div className="rounded-card border border-stone bg-taupe/60 px-5 py-5 sm:px-6">
        <p className="text-[12px] font-semibold tracking-wide text-navy">따져 보기</p>
        <h2 id="quick-check" className="mt-1 text-[16px] font-semibold leading-snug text-ink">
          이 페이지를 믿어도 되는지, 먼저 확인할 것들
        </h2>

        <dl className="mt-4 grid gap-4 text-[13px] leading-relaxed sm:grid-cols-3">
          <div>
            <dt className="font-semibold text-ink">근거</dt>
            <dd className="mt-1 text-smoke">
              자료 {sources.length}건 — 정부·법령·통계 원문 {primary}건, 언론 보도 {press}건.
              {attributed > 0 && (
                <>
                  {" "}
                  주장 {claims.length}개 가운데 {attributed}개는 사실이 아니라 누구의 주장이나
                  해석으로 따로 표시했습니다.
                </>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">비판</dt>
            <dd className="mt-1 text-smoke">
              {answered.length > 0
                ? `제기된 비판 ${answered.length}개를 싣고 근거로 답했습니다. 아래에서 펼쳐 볼 수 있습니다.`
                : "아직 정리한 비판이 없습니다."}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">한계</dt>
            <dd className="mt-1 text-smoke">
              {sourceNote ?? "따로 적어 둔 한계가 없습니다."}
            </dd>
          </div>
        </dl>

        {/* 받은 사람의 선입견은 보도에서 온다. 같은 사건을 매체별로 어떻게 다뤘는지 옆에 둔다. */}
        {coverage.length > 0 && (
          <div className="mt-4 text-[13px] leading-relaxed">
            <p className="font-semibold text-ink">보도</p>
            <p className="mt-1 text-smoke">
              이 일을 언론이 어떻게 다뤘는지 — 어느 매체가 어떤 제목을 달았고 어디가 다루지
              않았는지 — 는 이재명 보도 위키에 따로 모아 둡니다.
            </p>
            <ul className="mt-2 space-y-1">
              {coverage.map((c) => (
                <li key={c.url}>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener"
                    className="font-medium text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy"
                  >
                    {c.date} · {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {answered.length > 0 && (
          <ul className="mt-5 divide-y divide-stone border-t border-stone">
            {answered.map(({ cp, supporting }) => (
              <li key={cp.id}>
                <details className="group py-3">
                  <summary className="flex cursor-pointer list-none gap-2.5 text-[14px] font-semibold leading-snug text-ink">
                    <span aria-hidden="true" className="shrink-0 text-burgundy">
                      Q
                    </span>
                    <span className="flex-1">{cp.question}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-ash transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-2.5 flex gap-2.5 text-[14px] leading-relaxed text-smoke">
                    <span aria-hidden="true" className="shrink-0 font-semibold text-navy">
                      A
                    </span>
                    <span>{cp.response}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 pl-6">
                    {supporting.map((claim) => (
                      <EvidenceButton
                        key={claim.id}
                        claimId={claim.id}
                        count={claim.sourceIds.length}
                      />
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

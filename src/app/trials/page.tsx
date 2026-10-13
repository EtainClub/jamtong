import Link from "next/link";
import type { Metadata } from "next";

import { getPolicy } from "@/content/policies";
import { TRIAL_BACKGROUND_SLUG, TRIALS } from "@/content/policies/trials";
import { getTrialEasy } from "@/content/policies/trials/easy";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { TrialClaim, VoiceColumn } from "@/features/trials/TrialClaim";
import { TermCards, TrialEasyCard, TrialsOverview } from "@/features/trials/TrialEasyCard";
import { ModePane, TrialsView, TrialsViewToggle } from "@/features/trials/TrialsView";

export const metadata: Metadata = {
  title: "대통령 재판",
  description:
    "이재명 대통령의 다섯 형사재판이 어디까지 왔고 무엇을 다투는지. 검찰 주장, 대통령 측 반론, 법원 판단을 나란히 놓고 문장마다 출처를 붙였습니다.",
  alternates: { canonical: "/trials" },
};

/**
 * 대통령 형사재판 허브.
 *
 * ★ 이 화면은 변론이 아니다.
 *   검찰 주장 · 대통령 측 반론 · 법원 판단을 나란히 둔다. 대통령에게 유리한 법원
 *   판단(위증교사 1심 무죄, 대법원 반대의견)과 불리한 판단(선거법 파기환송, 이화영
 *   확정판결)을 같은 칸에 같은 크기로 싣는다. 한쪽을 빼면 나머지 문장까지 믿기
 *   어려워진다.
 *
 * ★ 이 화면이 새로 만드는 문장은 세 낱말 풀이뿐이다.
 *   나머지는 모두 `src/content/policies/trials`의 claim이고, 출처가 붙어 있다.
 */
const TERMS: [string, string][] = [
  ["기소", "검찰이 죄가 있다고 보고 법원에 재판을 청구한 것. 유죄라는 뜻이 아닙니다."],
  [
    "무죄",
    "법원이 공소사실이 증명되지 않았다고 판결한 것. 1심 무죄는 항소심에서 바뀔 수 있습니다.",
  ],
  ["재판 중단", "기일을 '추후 지정'해 절차가 멈춘 것. 유무죄도, 사건 종결도 아닙니다."],
];

const BACKGROUND_CLAIMS = [
  "claim-art84",
  "claim-art84-scope",
  "claim-not-acquittal",
  "claim-committee-more",
  "claim-president-request",
  "claim-bill-delay",
];

export default function TrialsPage() {
  const background = getPolicy(TRIAL_BACKGROUND_SLUG);
  const easyRows = TRIALS.flatMap((trial) => {
    const easy = getTrialEasy(trial.slug);
    const policy = getPolicy(trial.slug);
    return easy && policy ? [{ trial, easy, policy }] : [];
  });

  return (
    <>
      <AppTopBar />

      <TrialsView>
        <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
          <div className="flex items-baseline justify-between gap-3">
            <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">대통령 재판</h1>
            <span className="tabular text-[12px] text-ash">
              {TRIALS.length}건 · 기준일 2026-10-13
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-smoke">
            이재명 대통령이 취임 전에 기소된 형사재판 다섯 건이 어디까지 왔고 무엇을 다투는지
            모았습니다. 사건마다 검찰 주장, 대통령 측 반론, 법원 판단을 나란히 놓았습니다.
          </p>

          <div className="mt-4">
            <TrialsViewToggle />
          </div>

          {/*
           * 쉽게 보기 — 원문 보기의 문장을 그림 카드로 옮긴 것. 카드의 글자는 모두
           * claim 원문에서 떼어 왔다(src/content/policies/trials/easy.ts).
           */}
          <ModePane mode="easy">
            <div className="mt-5">
              <TermCards terms={TERMS} />
            </div>

            <section aria-labelledby="tr-easy-board" className="mt-8">
              <h2 id="tr-easy-board" className="text-[15px] font-bold text-ink">
                다섯 재판, 어디서 멈췄나
              </h2>
              <p className="mt-1 text-[12px] text-ash">● 지난 단계 · ‖ 멈춘 곳 · ○ 남은 단계</p>
              <div className="mt-3">
                <TrialsOverview rows={easyRows} />
              </div>
            </section>

            <div className="mt-10 space-y-5">
              {easyRows.map((row) => (
                <div key={row.trial.slug} id={`${row.trial.slug}-easy`} className="scroll-mt-20">
                  <TrialEasyCard {...row} />
                </div>
              ))}
            </div>
          </ModePane>

          <ModePane mode="full">
            <dl className="mt-5 grid gap-2 rounded-card border border-stone bg-taupe/60 px-4 py-3.5">
              {TERMS.map(([term, body]) => (
                <div key={term} className="flex gap-3 text-[12px] leading-relaxed">
                  <dt className="w-[4.5em] shrink-0 font-bold text-ink">{term}</dt>
                  <dd className="text-graphite">{body}</dd>
                </div>
              ))}
            </dl>

            <section aria-labelledby="tr-board" className="mt-8">
              <h2 id="tr-board" className="text-[15px] font-bold text-ink">
                한눈에 보기
              </h2>
              <ol className="mt-3 divide-y divide-stone border-y border-stone">
                {TRIALS.map((trial) => (
                  <li key={trial.slug}>
                    <a
                      href={`#${trial.slug}`}
                      className="flex items-start gap-3 py-3 hover:bg-taupe/40"
                    >
                      <span className="tabular w-5 shrink-0 text-[14px] font-bold text-navy">
                        {trial.no}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-bold text-ink">{trial.name}</span>
                        <span className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                          <span className="rounded-full bg-taupe px-2 py-0.5 font-semibold text-graphite">
                            {trial.stage}
                          </span>
                          <span className="rounded-full border border-stone px-2 py-0.5 text-ash">
                            재판 중단
                          </span>
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </section>

            {TRIALS.map((trial) => {
              const policy = getPolicy(trial.slug);
              if (!policy) return null;
              return (
                <section
                  key={trial.slug}
                  id={trial.slug}
                  aria-labelledby={`${trial.slug}-h`}
                  className="mt-10 scroll-mt-20"
                >
                  <h2
                    id={`${trial.slug}-h`}
                    className="text-[17px] font-bold tracking-tight text-ink"
                  >
                    <span className="text-navy">{trial.no}</span> {trial.name}
                  </h2>
                  <p className="mt-1.5 text-[13px] font-semibold leading-relaxed text-graphite">
                    {trial.question}
                  </p>

                  <div className="mt-3 grid gap-2">
                    <VoiceColumn
                      label="검찰 주장"
                      tone="text-smoke"
                      policy={policy}
                      claimIds={trial.prosecution}
                    />
                    <VoiceColumn
                      label="대통령 측 반론"
                      tone="text-navy"
                      policy={policy}
                      claimIds={trial.defense}
                    />
                    <VoiceColumn
                      label="법원 판단"
                      tone="text-ink"
                      policy={policy}
                      claimIds={trial.court}
                    />
                    {trial.facts && trial.facts.length > 0 && (
                      <VoiceColumn
                        label="그 밖에 확인된 사실"
                        tone="text-smoke"
                        policy={policy}
                        claimIds={trial.facts}
                      />
                    )}
                  </div>

                  <Link
                    href={`/wiki/policy/${trial.slug}`}
                    className="mt-3 inline-block text-[12px] font-semibold text-navy"
                  >
                    경과·비판과 한계·확인 못 한 것 전체 보기 →
                  </Link>
                </section>
              );
            })}
          </ModePane>

          {background && (
            <section aria-labelledby="tr-bg" className="mt-12 border-t border-stone pt-6">
              <h2 id="tr-bg" className="text-[15px] font-bold text-ink">
                재판은 왜 멈췄고, 그 뒤 무엇이 있었나
              </h2>
              <ul className="mt-3 space-y-3">
                {BACKGROUND_CLAIMS.map((id) => (
                  <TrialClaim key={id} policy={background} claimId={id} />
                ))}
              </ul>
              <Link
                href={`/wiki/policy/${background.slug}`}
                className="mt-3 inline-block text-[12px] font-semibold text-navy"
              >
                비판과 반론까지 전체 보기 →
              </Link>
            </section>
          )}

          <section className="mt-9 border-t border-stone pt-6">
            <h2 className="text-[13px] font-bold text-ink">이 화면의 한계</h2>
            <p className="mt-2 text-[12px] leading-relaxed text-smoke">
              대법원 보도자료·판결문, 법무부 보도자료, 헌법 조문과 대조한 문장에는 표시가 없고, 언론
              보도에만 기댄 문장에는 미검증 표시가 붙습니다. 위증교사·대장동·법인카드 사건은
              판결문이나 공소장을 공개 자료에서 찾지 못해 모두 보도 기준입니다. 금액은 따로 밝히지
              않으면 검찰이 주장한 금액이며 법원이 인정한 액수가 아닙니다. 공범의 유죄 판결은 대통령
              본인에 대한 판단이 아닙니다.
            </p>
          </section>
        </main>
      </TrialsView>

      <BottomNav />
    </>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

import { getPolicy } from "@/content/policies";
import { PAST_CONVICTIONS, PAST_CONVICTIONS_SLUG } from "@/content/policies/trials";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { TrialClaim, VoiceColumn } from "@/features/trials/TrialClaim";
import { TermCards } from "@/features/trials/TrialEasyCard";

export const metadata: Metadata = {
  title: "확정된 과거 형사처벌",
  description:
    "이재명 대통령이 취임 전 확정받은 벌금형 네 건. 무슨 일이 있었고 법원이 무엇을 인정했는지, 대통령 측 해명과 비판을 나란히 놓고 문장마다 출처를 붙였습니다.",
  alternates: { canonical: "/trials/record" },
};

/**
 * 확정된 과거 형사처벌(이른바 '전과 4범').
 *
 * ★ /trials와 같은 규칙. 이 화면이 새로 만드는 문장은 낱말 풀이뿐이고, 나머지는
 *   모두 `src/content/policies/trials/past-convictions.ts`의 claim이다.
 * ★ 해명과 비판을 같은 카드에 같은 크기로 둔다. 맥락을 붙이는 것이 목적이지,
 *   덜어 주거나 키우는 것이 목적이 아니다.
 */
const TERMS: [string, string][] = [
  ["확정", "더 다툴 수 없게 된 판결. 아래 네 건은 모두 확정됐습니다."],
  ["벌금형", "징역이 아니라 돈을 내게 하는 형벌. 네 건 모두 벌금형입니다."],
  ["약식명령", "공판 없이 서류로 벌금을 정하는 절차. 음주운전 건이 이렇게 끝났습니다."],
];

export default function TrialsRecordPage() {
  const policy = getPolicy(PAST_CONVICTIONS_SLUG);
  if (!policy) throw new Error(`정책 ${PAST_CONVICTIONS_SLUG}가 없다`);

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <Link href="/trials" className="text-[12px] font-semibold text-navy">
          ← 대통령 재판
        </Link>
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">확정된 과거 형사처벌</h1>
          <span className="tabular text-[12px] text-ash">
            {PAST_CONVICTIONS.length}건 · 기준일 {policy.asOf}
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          지금 멈춰 있는 다섯 재판과 달리, 판결이 이미 확정된 사건들입니다. 사건마다 무슨 일이
          있었는지, 대통령 측 설명, 비판, 그 뒤를 나란히 놓았습니다.
        </p>

        <div className="mt-5">
          <TermCards terms={TERMS} />
        </div>

        <section aria-labelledby="rc-summary" className="mt-8">
          <h2 id="rc-summary" className="text-[15px] font-bold text-ink">
            한눈에 보기
          </h2>
          <ol className="mt-3 divide-y divide-stone rounded-card border border-stone bg-eggshell">
            {PAST_CONVICTIONS.map((pc, i) => (
              <li key={pc.no}>
                <a
                  href={`#rc-${i + 1}`}
                  className="flex items-baseline justify-between gap-3 px-4 py-3"
                >
                  <span className="text-[13px] font-semibold text-ink">
                    <span className="text-smoke">{pc.no}</span> {pc.name}
                    <span className="ml-1.5 text-[11px] font-normal text-ash">{pc.year}</span>
                  </span>
                  <span className="tabular shrink-0 text-[12px] font-bold text-ink">
                    {pc.sentence}
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <ul className="mt-4 space-y-3">
            <TrialClaim policy={policy} claimId="claim-four" />
            <TrialClaim policy={policy} claimId="claim-bulletin" />
          </ul>
        </section>

        <div className="mt-10 space-y-5">
          {PAST_CONVICTIONS.map((pc, i) => (
            <section key={pc.no} id={`rc-${i + 1}`} className="scroll-mt-20">
              <article
                aria-labelledby={`rc-${i + 1}-h`}
                className="rounded-card border border-stone bg-eggshell px-4 pb-4 pt-4"
              >
                <header className="flex items-start justify-between gap-3">
                  <h3 id={`rc-${i + 1}-h`} className="text-[17px] font-bold tracking-tight text-ink">
                    <span className="text-smoke">{pc.no}</span> {pc.name}
                  </h3>
                  <span className="shrink-0 rounded-full border border-ink px-2 py-0.5 text-[10px] font-bold text-ink">
                    확정 · {pc.sentence}
                  </span>
                </header>
                <p className="mt-1 text-[12px] text-ash">{pc.year}</p>

                <div className="mt-4 space-y-2">
                  <VoiceColumn
                    label="무슨 일이 있었고 법원은 무엇을 인정했나"
                    side="court"
                    policy={policy}
                    claimIds={pc.facts}
                  />
                  <VoiceColumn
                    label="대통령 측 설명"
                    side="defense"
                    policy={policy}
                    claimIds={pc.defense}
                  />
                  {pc.critique.length > 0 && (
                    <VoiceColumn
                      label="비판과 반론"
                      side="prosecution"
                      policy={policy}
                      claimIds={pc.critique}
                    />
                  )}
                  {pc.after.length > 0 && (
                    <VoiceColumn label="그 뒤" side="other" policy={policy} claimIds={pc.after} />
                  )}
                </div>
              </article>
            </section>
          ))}
        </div>

        <section
          aria-labelledby="rc-frame"
          className="mt-12 rounded-card border border-stone bg-taupe/60 px-4 py-4"
        >
          <h2 id="rc-frame" className="text-[15px] font-bold text-ink">
            &lsquo;전과 4범&rsquo;을 두고 오가는 말
          </h2>
          <ul className="mt-3 space-y-3">
            <TrialClaim policy={policy} claimId="claim-frame-defense" />
            <TrialClaim policy={policy} claimId="claim-frame-critic" />
          </ul>
          <Link
            href={`/wiki/policy/${policy.slug}`}
            className="mt-3 inline-block text-[12px] font-semibold text-navy"
          >
            연표·확인 못 한 것 전체 보기 →
          </Link>
        </section>

        <section className="mt-9 border-t border-stone pt-6">
          <h2 className="text-[13px] font-bold text-ink">이 화면의 한계</h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-[12px] leading-relaxed text-smoke">
            {policy.gaps.map((gap) => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
        </section>
      </main>

      <BottomNav />
    </>
  );
}

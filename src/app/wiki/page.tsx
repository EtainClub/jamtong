import Link from "next/link";
import type { Metadata } from "next";

import { POLICIES } from "@/content/policies";
import { TRIALS } from "@/content/policies/trials";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { AskWikiBox } from "@/features/wiki/AskWikiBox";
import { conceptCards } from "@/lib/wiki/load";

export const metadata: Metadata = {
  title: "위키",
  description:
    "업적과 언행을 가로지르는 이야기, 그리고 이재명 정부 정책의 사실관계. 모든 문장에 근거가 붙습니다.",
  alternates: { canonical: "/wiki" },
};

/**
 * 위키 첫 화면 — 묻는 상자, 정부 정책, 개념.
 *
 * `wiki/index.md`(카탈로그)는 위키를 고치는 쪽이 보는 목록이라 띄우지 않는다.
 * 대신 독자가 고를 두 갈래만 보인다. 정책은 SNS에서 도는 주장에 대응하는
 * 사실이라 앞에 둔다.
 */
export default function WikiIndexPage() {
  const concepts = conceptCards();

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10">
        <p className="mt-6 text-[11px] font-semibold tracking-[0.08em] text-ash">
          LLM WIKI
        </p>

        <AskWikiBox />

        {/*
         * 대통령 재판 다섯 건은 정책 팩트 목록에도 한 장씩 있지만, 따로 읽기보다
         * 나란히 놓고 볼 때 뜻이 있다. 그래서 목록 앞에 묶음으로 들어가는 문을 둔다.
         */}
        <Link
          href="/trials"
          className="mt-9 flex items-center justify-between gap-3 rounded-card border border-stone bg-taupe/60 px-4 py-3.5 transition-colors hover:border-graphite"
        >
          <span className="min-w-0">
            <span className="text-[14px] font-bold text-ink">대통령 재판 한눈에 보기</span>
            <span className="mt-0.5 block text-[12px] leading-relaxed text-smoke">
              멈춰 있는 형사재판 {TRIALS.length}건의 단계와 쟁점. 검찰 주장·대통령 측 반론·법원
              판단을 나란히 둡니다.
            </span>
          </span>
          <span aria-hidden="true" className="shrink-0 text-smoke">
            →
          </span>
        </Link>

        <section aria-labelledby="wiki-policies" className="mt-9">
          <h2 id="wiki-policies" className="text-[17px] font-bold tracking-tight text-ink">
            정부 정책 팩트
          </h2>
          <p className="mt-1 text-[12px] leading-relaxed text-ash">
            대통령의 업적·언행과 별도로, 이재명 정부 정책의 사실관계와 자주 도는 주장에 대한
            해명을 모읍니다. 문장마다 출처가 붙습니다.
          </p>
          <ul className="mt-4 divide-y divide-stone border-y border-stone">
            {POLICIES.map((policy) => (
              <li key={policy.slug}>
                <Link
                  href={`/wiki/policy/${policy.slug}`}
                  className="block py-3 transition-colors hover:bg-taupe/40"
                >
                  <span className="text-[14px] font-bold text-ink">{policy.title}</span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-smoke">
                    {policy.scope}
                  </span>
                  <span className="mt-1 block text-[11px] text-ash">
                    기준일 {policy.asOf}
                    {policy.rumors.length > 0 && ` · 도는 주장 ${policy.rumors.length}건`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {concepts.length > 0 && (
          <section aria-labelledby="wiki-concepts" className="mt-9">
            <h2 id="wiki-concepts" className="text-[17px] font-bold tracking-tight text-ink">
              개념
            </h2>
            <p className="mt-1 text-[12px] leading-relaxed text-ash">
              업적 하나, 언행 하나로는 보이지 않는 이야기를 모읍니다.
            </p>
            <ul className="mt-4 divide-y divide-stone border-y border-stone">
              {concepts.map((concept) => (
                <li key={concept.name}>
                  <Link
                    href={`/wiki/${concept.name}`}
                    className="block py-3 transition-colors hover:bg-taupe/40"
                  >
                    <span className="text-[14px] font-bold text-ink">{concept.title}</span>
                    <span className="mt-0.5 block text-[12px] leading-relaxed text-smoke">
                      {concept.blurb}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <BottomNav />
    </>
  );
}

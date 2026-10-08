import Link from "next/link";
import type { Metadata } from "next";

import { POLICIES } from "@/content/policies";
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

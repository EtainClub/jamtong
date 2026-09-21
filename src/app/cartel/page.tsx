import Link from "next/link";
import type { Metadata } from "next";

import { EMPTY_CARTELS, OPEN_CARTELS } from "@/content/cartels";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";

export const metadata: Metadata = {
  title: "카르텔",
  description:
    "값을 맞춰 놓고 파는 일, 한 자리를 오래 차지해 온 구조를 표적별로 모아 봅니다. 무엇이 정해졌고 무엇이 아직인지 함께 있습니다.",
  alternates: { canonical: "/cartel" },
};

/**
 * 카르텔 목록.
 *
 * 업적을 가로질러 보는 두 번째 축이다. 분야(외교·제도·복지…)가 "무엇에 관한
 * 일인가"라면 여기는 "무엇을 겨냥한 일인가"다. 같은 업적이 양쪽에 나오는 것이
 * 맞다 — 사법개혁은 제도이면서 전관예우를 겨냥한 일이다.
 *
 * ★ 이 묶음이 어디서 왔는지를 맨 위에 적는다.
 *   열두 갈래는 지지자 카드뉴스에서 출발한 이 위키의 편집 묶음이고 정부의
 *   분류가 아니다. 그 사실을 화면 밖에 두면 읽는 사람은 이것이 공식 분류라고
 *   여긴다.
 *
 * ★ 빈 것을 지우지 않는다.
 *   아홉이 아직 비어 있다. 지우면 화면은 깔끔해지지만 무엇을 못 했는지가
 *   보이지 않는다. 자서전 여섯 권과 같은 처리다.
 */
export default function CartelPage() {
  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">카르텔</h1>
          <span className="tabular text-[12px] text-ash">
            {OPEN_CARTELS.length} / {OPEN_CARTELS.length + EMPTY_CARTELS.length}
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          값을 맞춰 놓고 파는 일, 한 자리를 오래 차지해 온 구조를 표적별로 모읍니다.
          업적을 가로질러 보는 자리라 같은 업적이 여러 표적에 나옵니다.
        </p>

        <p className="mt-4 rounded-card border border-stone bg-taupe/60 px-4 py-3 text-[12px] leading-relaxed text-graphite">
          <strong className="font-bold text-ink">이 묶음은 이 위키가 지은 것입니다.</strong>{" "}
          정부의 분류가 아닙니다. 대통령이 담합을 두고 이름을 댄 분야는
          설탕·밀가루·육고기·교복·부동산이고, 여기 선 갈래들과는 다릅니다. 표적을
          나눈 것은 읽기 위한 편집이며, 각 페이지의 문장은 정부·국회 자료로 따로
          세웁니다.
        </p>

        {OPEN_CARTELS.length > 0 && (
          <section aria-labelledby="ct-open" className="mt-8">
            <h2 id="ct-open" className="text-[15px] font-bold text-ink">
              들여다본 것 {OPEN_CARTELS.length}
            </h2>
            <ul className="mt-3 space-y-2">
              {OPEN_CARTELS.map((cartel) => (
                <li key={cartel.slug}>
                  <Link
                    href={`/cartel/${cartel.slug}`}
                    className="block rounded-card border border-stone px-4 py-3.5 transition-colors hover:border-graphite"
                  >
                    <span className="text-[15px] font-bold text-ink">{cartel.name}</span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-smoke">
                      {cartel.summary}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                      {cartel.achievementSlugs.length > 0 && (
                        <span className="rounded-full bg-taupe px-2 py-0.5 font-semibold text-navy">
                          업적 {cartel.achievementSlugs.length}
                        </span>
                      )}
                      {cartel.openQuestions.length > 0 && (
                        <span className="rounded-full border border-stone px-2 py-0.5 text-ash">
                          확인 못 한 것 {cartel.openQuestions.length}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {EMPTY_CARTELS.length > 0 && (
          <section aria-labelledby="ct-empty" className="mt-9">
            <h2 id="ct-empty" className="text-[15px] font-bold text-ink">
              아직 정리하지 않은 것 {EMPTY_CARTELS.length}
            </h2>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ash">
              이름만 세워 두었습니다. 무엇을 찾다가 어디서 막혔는지는 각 페이지에
              적어 두었습니다.
            </p>
            <ul className="mt-3 space-y-2">
              {EMPTY_CARTELS.map((cartel) => (
                <li key={cartel.slug}>
                  <Link
                    href={`/cartel/${cartel.slug}`}
                    className="block rounded-card border border-dashed border-stone bg-taupe/40 px-4 py-3 transition-colors hover:border-graphite"
                  >
                    <span className="text-[14px] font-bold text-smoke">{cartel.name}</span>
                    <span className="mt-0.5 block text-[12px] leading-relaxed text-ash">
                      {cartel.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-9 border-t border-stone pt-6">
          <h2 className="text-[13px] font-bold text-ink">여기 없는 것</h2>
          <p className="mt-2 text-[12px] leading-relaxed text-smoke">
            출발점이 된 카드뉴스에는 「노동조합 불법 카르텔」이 있었지만 싣지
            않았습니다. 이 정부는 하청 노동자의 교섭권을 넓히는 노란봉투법을
            2026년 3월 시행하고 노동 분야 제1호 국정과제로 삼았습니다. 정부나
            대통령이 노동조합을 카르텔로 지목한 자료를 찾지 못했고, 근거 없이
            실으면 있지도 않은 정책을 이 위키가 만들어 내는 셈이 됩니다.
          </p>
        </section>
      </main>

      <BottomNav />
    </>
  );
}

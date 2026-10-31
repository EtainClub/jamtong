import type { Metadata } from "next";

import Link from "next/link";

import {
  EMPTY_CARTELS,
  OPEN_CARTELS,
  cartelProgress,
  countProgress,
} from "@/content/cartels";
import { formatDate } from "@/content/labels";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { CartelRing } from "@/features/cartel/CartelRing";
import { JsonLd, collectionPageLd } from "@/lib/seo/jsonld";
import {
  ProgressBar,
  ProgressGuide,
  ProgressLegend,
} from "@/features/cartel/CartelProgress";

export const metadata: Metadata = {
  title: "카르텔",
  description:
    "이재명 정부가 2025년 6월부터 카르텔을 겨냥해 건 조치를 표적별로 모으고, 조치마다 완료·추진 중·계획을 근거와 함께 표시합니다.",
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
 * ★ 가운데를 두고 둘러선 지도로 그린다(CartelRing).
 *   열두 갈래를 한 화면에 두어야 어느 쪽이 차 있고 어느 쪽이 비었는지가
 *   한눈에 보인다. 목록으로 늘어놓으면 빈 것은 스크롤 아래로 밀린다.
 *
 * ★ 이 정부가 한 일만 센다(GOV_START, 2025-06-04).
 *   성남시장·경기도지사 시절의 일은 업적에 있다. 같은 막대에 합치면 "이 정부가
 *   어디까지 왔는가"가 부풀려 읽힌다.
 *
 * ★ 진행 정도를 공약 이행 현황처럼 보인다.
 *   표적을 "깼다/못 깼다"로 칠하지 않는다. 걸린 조치를 하나씩 세어
 *   완료·추진 중·계획으로 나눈다.
 *
 * ★ 빈 것을 지우지 않는다.
 *   언론 하나가 아직 비어 있다. 지우면 화면은 깔끔해지지만 무엇을 못 했는지가
 *   보이지 않는다. 자서전 여섯 권과 같은 처리다.
 */
export default function CartelPage() {
  const rows = OPEN_CARTELS.map((cartel) => {
    const items = cartelProgress(cartel);
    return { cartel, items, count: countProgress(items) };
  });
  const total = countProgress(rows.flatMap((r) => r.items));
  // 계획은 날짜가 앞날일 수 있다. 일어난 것 가운데 가장 최근 것을 적는다.
  const latest = rows
    .flatMap((r) => r.items.filter((i) => i.status !== "planned").map((i) => i.date))
    .sort()
    .at(-1);

  return (
    <>
      <JsonLd
        data={collectionPageLd({
          path: "/cartel",
          name: "이재명 정부 카르텔 조치",
          description: "이재명 정부가 2025년 6월부터 카르텔을 겨냥해 건 조치를 표적별로 모으고, 조치마다 완료·추진 중·계획을 근거와 함께 표시합니다.",
          items: OPEN_CARTELS.map((c) => ({ name: `${c.name} 카르텔`, path: `/cartel/${c.slug}` })),
        })}
      />
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">카르텔</h1>
          <span className="tabular text-[12px] text-ash">
            {OPEN_CARTELS.length} / {OPEN_CARTELS.length + EMPTY_CARTELS.length}
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          2025년 6월 출범한 이재명 정부가 카르텔을 겨냥해 건 조치를 표적별로
          모읍니다. 카르텔은 한 번에 깨지지 않아서, 조치마다 지금 어디까지 왔는지를
          표시합니다. 성남시장·경기도지사 시절의 일은 업적에 있습니다.
        </p>

        <p className="mt-4 rounded-card border border-stone bg-taupe/60 px-4 py-3 text-[12px] leading-relaxed text-graphite">
          <strong className="font-bold text-ink">이 묶음은 이 위키가 지은 것입니다.</strong>{" "}
          정부의 분류가 아닙니다. 대통령이 담합을 두고 이름을 댄 분야는
          설탕·밀가루·육고기·교복·부동산이고, 여기 선 갈래들과는 다릅니다. 표적을
          나눈 것은 읽기 위한 편집이며, 각 페이지의 문장은 정부·국회 자료로 따로
          세웁니다.
        </p>

        <CartelRing
          open={OPEN_CARTELS}
          empty={EMPTY_CARTELS}
          counts={Object.fromEntries(rows.map((r) => [r.cartel.slug, r.count]))}
        />
        <p className="mt-3 text-center text-[11px] leading-relaxed text-ash">
          표적을 누르면 조치마다 어디까지 왔는지 봅니다. 점선 칸은 이름만 세워 둔
          것입니다.
        </p>

        {/* 전체 현황. 공약 이행 현황과 같은 모양 — 막대가 먼저, 무엇을 셌는지가 아래. */}
        <section
          aria-labelledby="ct-overview"
          className="mt-8 rounded-card border border-stone bg-taupe px-4 py-4"
        >
          <h2 id="ct-overview" className="text-[15px] font-bold text-ink">
            진행 현황
          </h2>
          <p className="mt-1 text-[12px] text-ash">
            표적 <span className="tabular">{OPEN_CARTELS.length}</span>곳에 건 조치{" "}
            <span className="tabular">{total.total}</span>개 기준
            {latest && <> · 가장 최근 조치 {formatDate(latest, "day")}</>}
          </p>
          <div className="mt-3">
            <ProgressBar count={total} />
          </div>
          <div className="mt-2.5">
            <ProgressLegend count={total} />
          </div>
          <ProgressGuide />
        </section>

        {/* 표적별 진행. 지도는 한눈에 보는 자리이고, 숫자는 여기서 읽는다. */}
        <section aria-labelledby="ct-rows" className="mt-9">
          <h2 id="ct-rows" className="text-[17px] font-bold tracking-tight text-ink">
            표적별 진행
          </h2>
          <ul className="mt-3 space-y-2.5">
            {rows.map(({ cartel, count }) => (
              <li key={cartel.slug}>
                <Link
                  href={`/cartel/${cartel.slug}`}
                  className="block rounded-card border border-stone bg-taupe px-4 py-3.5 transition-colors hover:border-graphite"
                >
                  <span className="flex items-baseline gap-2">
                    <span className="text-[15px] font-bold text-ink">{cartel.name}</span>
                    <span aria-hidden="true" className="ml-auto text-[13px] text-ash">
                      →
                    </span>
                  </span>
                  <span className="mt-1 block text-[12px] leading-relaxed text-smoke">
                    {cartel.summary}
                  </span>
                  <span className="mt-3 block">
                    <ProgressBar count={count} size="sm" />
                  </span>
                  <span className="mt-1.5 block text-[11px] text-ash">
                    조치 <span className="tabular">{count.total}</span>개 · 완료{" "}
                    <span className="tabular">{count.done}</span> · 추진 중{" "}
                    <span className="tabular">{count.ongoing}</span> · 계획{" "}
                    <span className="tabular">{count.planned}</span>
                    {cartel.openQuestions.length > 0 && (
                      <>
                        {" "}
                        · 확인 못 한 것 <span className="tabular">{cartel.openQuestions.length}</span>
                      </>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {EMPTY_CARTELS.length > 0 && (
            <p className="mt-3 text-[12px] leading-relaxed text-ash">
              아직 정리하지 않은 표적:{" "}
              {EMPTY_CARTELS.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && " · "}
                  <Link href={`/cartel/${c.slug}`} className="underline underline-offset-2">
                    {c.name}
                  </Link>
                </span>
              ))}
              . 이 정부의 조치로 근거를 세우지 못했습니다.
            </p>
          )}
        </section>

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

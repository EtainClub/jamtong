import type { Story } from "@/content/schema";
import { MoneyFlow } from "@/features/motion/MoneyFlow";
import { Counterpoints } from "@/features/story/Counterpoints";
import { LandUseBreakdown } from "@/features/story/LandUseBreakdown";
import { KeyNumbers } from "@/features/story/KeyNumbers";
import { Timeline } from "@/features/timeline/Timeline";
import { ShareButton } from "@/features/story/ShareButton";

/**
 * 대장동 레이아웃.
 *
 * 씬 구성은 이 스토리 전용이다. 북극항로와 공유하는 것은 부품
 * (KeyNumbers / Timeline / Counterpoints / EvidenceDrawer)뿐이고,
 * 배치는 하드코딩한다. 공통 패턴이 세 번째 스토리에서 반복될 때 엔진으로 올린다.
 * (설계 검토 문서 5.1)
 *
 * 순서에 의도가 있다: 무슨 일이 있었는지(연표) → 돈이 어디로 갔는지(흐름)
 * → 쟁점(반론)이다. 구조를 이해하기 전에 반론부터 읽으면 아무것도 판단할 수 없다.
 */
export function DaejangdongLayout({ story }: { story: Story }) {
  return (
    <>
      {/* ── Scene: 연표 ─────────────────────────────────────── */}
      <section
        data-scene="timeline"
        aria-labelledby="dj-timeline"
        className="mx-auto max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
      >
        <h2
          id="dj-timeline"
          className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
        >
          어떤 선택지가 있었나
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          시점을 옮기면 그때 무엇이 가능했는지가 나타납니다.
          지금 알려진 결과가 아니라, 결정 시점의 조건으로 보십시오.
        </p>
        <div className="mt-10">
          <Timeline events={story.timeline} claims={story.claims} />
        </div>
      </section>

      {/* ── Scene: 토지이용 ─────────────────────────────────── */}
      {story.landUse && (
        <section
          data-scene="land"
          aria-labelledby="dj-land"
          className="mx-auto mt-20 max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
        >
          <h2
            id="dj-land"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            땅은 어떻게 나뉘었나
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            금액을 따지기 전에 부지가 무엇으로 계획되었는지부터 봅니다.
            인허가 고시에 실리는 값이라 다툼의 여지가 가장 적은 숫자입니다.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
            <LandUseBreakdown landUse={story.landUse} claims={story.claims} />
            <KeyNumbers
              numbers={story.keyNumbers}
              claims={story.claims}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
            />
          </div>
        </section>
      )}

      {/* ── Scene: 자금 흐름 ────────────────────────────────── */}
      {story.moneyFlow && (
        <section
          data-scene="flow"
          aria-labelledby="dj-flow"
          className="mx-auto mt-20 max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
        >
          <h2
            id="dj-flow"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            돈은 어디로 갔나
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            시나리오를 바꿔 보십시오. 같은 사업이 다른 구조였다면 공공으로 흐르는
            몫이 어떻게 달라지는지 폭으로 나타납니다.
          </p>

          <div className="mt-10">
            <MoneyFlow flow={story.moneyFlow} claims={story.claims} />
          </div>
        </section>
      )}

      {/* ── Scene: 쟁점 ─────────────────────────────────────── */}
      <section
        data-scene="counterpoint"
        aria-labelledby="dj-counterpoint"
        className="mx-auto mt-20 max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
      >
        <h2
          id="dj-counterpoint"
          className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
        >
          이런 반론이 있습니다
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          제기되는 쟁점을 그대로 싣고, 각각에 근거로 답합니다.
        </p>
        <div className="mt-10">
          <Counterpoints counterpoints={story.counterpoints} claims={story.claims} />
        </div>
      </section>

      {/* ── Scene: 공유 ─────────────────────────────────────── */}
      <section
        data-scene="share"
        className="mx-auto mt-20 max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          이 화면을 그대로 공유하기
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          보고 있는 시나리오와 열어 둔 시점까지 링크에 담깁니다.
        </p>
        <div className="mt-5">
          <ShareButton />
        </div>
      </section>
    </>
  );
}

import type { Story } from "@/content/schema";
import { IndexSeriesChart } from "@/features/series/IndexSeriesChart";
import { Counterpoints } from "@/features/story/Counterpoints";
import { KeyNumbers } from "@/features/story/KeyNumbers";
import { Timeline } from "@/features/timeline/Timeline";
import { ShareButton } from "@/features/story/ShareButton";

/**
 * 주식시장 레이아웃. 세 번째 스토리.
 *
 * 순서에 의도가 있다: 지수(배경) → 연표(제도 변화) → 쟁점.
 * 지수를 먼저 두되 제도 변화를 그 위에 얹는다. 지수만 보고 나가면
 * 이 스토리가 말하려는 것을 못 본다.
 *
 * 연표를 지수 바로 뒤에 두는 이유는 커서가 두 화면을 함께 움직이기 때문이다.
 * 떨어뜨려 놓으면 그 연결이 보이지 않는다.
 */
export function StockMarketLayout({ story }: { story: Story }) {
  return (
    <>
      {story.indexSeries && (
        <section
          data-scene="series"
          aria-labelledby="sm-series"
          className="mx-auto max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
        >
          <h2
            id="sm-series"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            지수는 오르고, 또 내렸습니다
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            오른 구간만 보여주면 자료가 아니라 선전물입니다. 고점 이후 되밀린
            구간까지 함께 싣습니다. 아래 연표에서 시점을 옮기면 차트에도 그 시점이 찍힙니다.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
            <IndexSeriesChart
              series={story.indexSeries}
              timeline={story.timeline}
              claims={story.claims}
            />
            <KeyNumbers
              numbers={story.keyNumbers}
              claims={story.claims}
              className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
            />
          </div>
        </section>
      )}

      <section
        data-scene="timeline"
        aria-labelledby="sm-timeline"
        className="mx-auto mt-20 max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
      >
        <h2
          id="sm-timeline"
          className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
        >
          무엇이 바뀌었나
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          지수와 달리 제도는 남습니다. 시점을 옮기며 확인해 보세요.
        </p>
        <div className="mt-10">
          <Timeline events={story.timeline} claims={story.claims} />
        </div>
      </section>

      <section
        data-scene="counterpoint"
        aria-labelledby="sm-counterpoint"
        className="mx-auto mt-20 max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
      >
        <h2
          id="sm-counterpoint"
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

      <section
        data-scene="share"
        className="mx-auto mt-20 max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          이 화면을 그대로 공유하기
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          열어 둔 시점이 링크에 담깁니다.
        </p>
        <div className="mt-5">
          <ShareButton />
        </div>
      </section>
    </>
  );
}

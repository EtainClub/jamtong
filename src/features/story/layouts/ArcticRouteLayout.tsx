import type { Story } from "@/content/schema";
import { getMapBackground } from "@/lib/geo/land";
import { buildTrack } from "@/lib/geo/route-track";
import { ScrollRouteScene } from "@/features/motion/ScrollRouteScene";
import { KeyNumbers } from "@/features/story/KeyNumbers";
import { RouteComparison } from "@/features/story/RouteComparison";
import { Timeline } from "@/features/timeline/Timeline";
import { ShareButton } from "@/features/story/ShareButton";

/**
 * 북극항로 레이아웃. 씬 구성은 이 스토리 전용이다. (설계 검토 문서 5.1)
 */

const DISTANCE_NUMBER_IDS = new Set(["kn-distance", "kn-km", "kn-days"]);

export function ArcticRouteLayout({ story }: { story: Story }) {
  const background = getMapBackground();
  // 경로 기하는 서버에서 화면 좌표로 구워 넘긴다. 클라이언트에 d3-geo가 필요 없다.
  const tracks = story.routes.map(buildTrack);

  const distanceNumbers = story.keyNumbers.filter((n) => DISTANCE_NUMBER_IDS.has(n.id));
  const supportNumbers = story.keyNumbers.filter((n) => !DISTANCE_NUMBER_IDS.has(n.id));

  return (
    <>
      {/* ── Scene: 항로 (스크롤 구동) ───────────────────────── */}
      <section
        data-scene="route"
        aria-labelledby="scene-route"
        className="scroll-mt-14 border-t border-line"
      >
        <div className="mx-auto max-w-5xl px-5 pt-12">
          <h2
            id="scene-route"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            부산에서 로테르담까지
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            북극 중심 지도입니다. 중심에서 멀어질수록 실제 거리도 멀어지므로,
            두 항로의 길이를 눈으로 직접 비교할 수 있습니다.
            스크롤하면 배가 항로를 따라 나아갑니다.
          </p>
        </div>

        <div className="mx-auto max-w-5xl px-5">
          <ScrollRouteScene tracks={tracks} background={background} />
        </div>
      </section>

      {/* ── Scene: 항로 비교 ────────────────────────────────── */}
      <section
        data-scene="compare"
        aria-labelledby="scene-compare"
        className="mx-auto max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
      >
        <h2
          id="scene-compare"
          className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
        >
          세 갈래 길
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          같은 목적지에 닿는 세 항로를 나란히 놓으면 차이가 분명해집니다.
          막대 길이는 거리에 정비례합니다.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
          <RouteComparison
            comparisons={story.comparisons}
            claims={story.claims}
            note={story.comparisonNote}
          />
          <KeyNumbers
            numbers={distanceNumbers}
            claims={story.claims}
            className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
          />
        </div>
      </section>

      {/* ── 지원 규모 ──────────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-5xl border-t border-line px-5 pt-12">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          무엇이 준비되고 있나
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          북극항로를 운항하는 선사에 제공되는 지원과 혜택입니다.
        </p>
        <KeyNumbers
          numbers={supportNumbers}
          claims={story.claims}
          className="mt-8 grid gap-4 sm:grid-cols-3"
        />
      </section>

      {/* ── Scene: 타임라인 ─────────────────────────────────── */}
      <section
        data-scene="timeline"
        aria-labelledby="scene-timeline"
        className="mx-auto mt-20 max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12"
      >
        <h2
          id="scene-timeline"
          className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
        >
          어떻게 여기까지 왔나
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          시점을 옮기면 그때의 상황이 나타납니다.
        </p>
        <div className="mt-10">
          <Timeline events={story.timeline} claims={story.claims} />
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
          배의 위치, 선택한 항로, 열어 둔 시점까지 지금 보고 있는 상태가 링크에 담깁니다.
        </p>
        <div className="mt-5">
          <ShareButton />
        </div>
      </section>
    </>
  );
}

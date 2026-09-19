import { ACHIEVEMENTS } from "@/content/achievements";
import { MILESTONES } from "@/content/milestones";
import type { Milestone } from "@/content/schema";

/**
 * 전체 연대기.
 *
 * 업적마다 있는 연표를 한 줄로 합친다. 업적 안에서는 "이 일이 어떻게
 * 진행됐나"가 보이지만, 합쳐 놓으면 "같은 때에 무엇과 무엇이 함께 있었나"가
 * 보인다. 2013년에 무상급식이 넓어지는 동안 모라토리엄을 갚고 있었다는 것은
 * 어느 한 업적 안에서는 보이지 않는다.
 *
 * ★ 근거는 여기서 펴지 않는다.
 *   claim id는 업적 안에서만 고유하다 — claim-scale이 의료원에도 무상급식에도
 *   있다. 한 배열로 합치면 엉뚱한 근거가 열린다. 그래서 각 항목은 제 업적의
 *   그 시점으로 보내고, 근거는 거기서 연다. 근거의 주인을 하나로 둔다.
 */

export interface ChronologyEntry {
  id: string;
  date: string;
  displayDate: string;
  title: string;
  summary: string;
  claimCount: number;
  achievement: { slug: string; title: string; kicker: string };
  /**
   * 그 업적의 그 시점으로 바로 여는 주소.
   *
   * view=full이 함께 가야 한다. 기본값인 쉬운 보기에서는 연표 섹션이 아예
   * 그려지지 않아서, 커서만 맞춰 놓고 도착할 자리가 없다.
   */
  href: string;
}

const yearOf = (date: string) => Number(date.slice(0, 4));

function entries(): ChronologyEntry[] {
  const out: ChronologyEntry[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (achievement.publishStatus !== "published") continue;

    for (const event of achievement.timeline) {
      out.push({
        // 업적이 다르면 같은 event id를 써도 된다. 키는 여기서 붙인다.
        id: `${achievement.slug}:${event.id}`,
        date: event.date,
        displayDate: event.displayDate ?? event.date,
        title: event.title,
        summary: event.summary,
        claimCount: event.claimIds.length,
        achievement: {
          slug: achievement.slug,
          title: achievement.title,
          kicker: achievement.kicker,
        },
        href: `/achievement/${achievement.slug}?view=full&scene=timeline&at=${event.id}`,
      });
    }
  }

  // 최근이 위로 온다. 지금에서 거슬러 읽는 편이 연대기의 기본 읽기다.
  // 날짜가 같으면 업적 이름으로 갈라 순서를 고정한다. 렌더가 흔들리지 않게.
  return out.sort(
    (a, b) => b.date.localeCompare(a.date) || a.achievement.slug.localeCompare(b.achievement.slug),
  );
}

export const CHRONOLOGY: ChronologyEntry[] = entries();

/** 연도로 묶는다. 화면이 다시 묶지 않도록 여기서 한다. 최근 연도가 먼저다. */
export const CHRONOLOGY_BY_YEAR: { year: number; entries: ChronologyEntry[] }[] = (() => {
  const years = new Map<number, ChronologyEntry[]>();
  for (const entry of CHRONOLOGY) {
    const year = yearOf(entry.date);
    const bucket = years.get(year);
    if (bucket) bucket.push(entry);
    else years.set(year, [entry]);
  }
  return [...years.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({ year, entries: list }));
})();

/**
 * 아직 하지 않은 것.
 *
 * 연대기와 같은 줄에 두지 않는다. 한 일과 하겠다는 일이 한 줄에 서면 읽는
 * 사람이 둘을 구별할 방법이 없다. 이 사이트가 다른 무엇보다 피해야 하는 일이다.
 */
export const UPCOMING: Milestone[] = MILESTONES.filter((m) => m.status !== "done").sort((a, b) =>
  a.date.localeCompare(b.date),
);

/**
 * 연대기가 걸친 햇수.
 *
 * 정렬 순서에서 뽑지 않는다. 표시 순서가 뒤집혀도 범위는 그대로여야 한다.
 */
export const CHRONOLOGY_SPAN = CHRONOLOGY.length
  ? {
      from: Math.min(...CHRONOLOGY.map((e) => yearOf(e.date))),
      to: Math.max(...CHRONOLOGY.map((e) => yearOf(e.date))),
    }
  : null;

import { STATEMENTS } from "@/content/words";
import { KIND_LABEL } from "@/content/words/schema";
import { arrivedOn } from "@/features/garden/arrivals";

/**
 * 응원이 붙을 수 있는 언행 — 응원 탭의 "오늘의 한 줄"과 고르기 칸이 쓴다.
 *
 * ★ 순서는 "잼통에 들어온 날"이 먼저다.
 *   정원 품종 장부(arrivals.json)가 그날을 안다. 그날 19시에 정원은 신품종 장마를 열고,
 *   응원 탭은 같은 언행을 맨 앞에 건다 — 사이트 전체가 같은 날 같은 말을 본다.
 *   장부에 날짜가 없는(정원 개장 전부터 있던) 언행은 말한 날 순서로 뒤에 선다.
 *
 * ★ 원문은 싣지 않는다. 제목과 날짜, 원문으로 가는 주소만 둔다.
 */
export interface CheerTopic {
  slug: string;
  title: string;
  kind: string;
  displayDate: string;
  /** 잼통에 들어온 날. 정원 개장 전부터 있던 것은 null. */
  arrivedOn: string | null;
}

export function cheerTopics(): CheerTopic[] {
  const day = (slug: string) => arrivedOn(`w:${slug}`) ?? "";
  return [...STATEMENTS]
    .sort(
      (a, b) =>
        day(b.slug).localeCompare(day(a.slug)) ||
        b.postedAt.localeCompare(a.postedAt) ||
        a.slug.localeCompare(b.slug),
    )
    .map((s) => ({
      slug: s.slug,
      title: s.title,
      kind: KIND_LABEL[s.kind],
      displayDate: s.displayDate,
      arrivedOn: day(s.slug) || null,
    }));
}

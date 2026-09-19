import { ACHIEVEMENTS } from "@/content/achievements";
import { MILESTONES } from "@/content/milestones";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/content/labels";

/**
 * 검색 인덱스.
 *
 * 서버에서 만들어 화면에 넘긴다. 검색 자체는 브라우저에서 한다 — 업적 일곱과
 * 시점 서른일곱, 세부 성과 열여덟이 전부라 서버를 한 번 더 왕복할 이유가 없다.
 *
 * ★ haystack에는 근거 문장까지 넣고, 화면에는 넣지 않는다.
 *   "판교특별회계"는 어느 업적의 제목에도 부제에도 없지만 근거에는 있다.
 *   위키에서 찾는 말은 대개 요약문이 아니라 본문에 있다. 다만 찾은 뒤에 보여줄
 *   것은 그 업적이지 근거 문장 조각이 아니다.
 */

export type SearchKind = "achievement" | "moment" | "milestone";

export const KIND_LABEL: Record<SearchKind, string> = {
  achievement: "업적",
  moment: "시점",
  milestone: "세부 성과",
};

export interface SearchEntry {
  id: string;
  kind: SearchKind;
  title: string;
  detail: string;
  /** 어느 업적의 것인지. 업적 자신은 비운다. */
  context?: string;
  href: string;
  /** 소문자·공백 제거된 검색용 문자열. 화면에 쓰지 않는다. */
  haystack: string;
}

/**
 * 비교용으로 다듬는다.
 *
 * 공백과 쉼표를 지우는 이유: 자료에는 "7,285억 원"으로 적혀 있는데 사람은
 * "7285"라고 친다. 가운뎃점과 물결표도 같은 이유로 지운다.
 */
export function normalize(text: string): string {
  return text.toLowerCase().replace(/[\s,.·~()[\]"'`]/g, "");
}

function build(): SearchEntry[] {
  const out: SearchEntry[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (achievement.publishStatus !== "published") continue;

    const claimText = achievement.claims.map((c) => c.text).join(" ");
    const numbers = achievement.keyNumbers
      .map((n) => `${n.label} ${n.value}${n.unit ?? ""} ${n.caption ?? ""}`)
      .join(" ");
    const entities = achievement.graph?.entities.map((e) => e.name).join(" ") ?? "";

    out.push({
      id: achievement.slug,
      kind: "achievement",
      title: achievement.title,
      detail: achievement.subtitle,
      href: `/achievement/${achievement.slug}`,
      haystack: normalize(
        [
          achievement.title,
          achievement.subtitle,
          achievement.kicker,
          achievement.summary,
          numbers,
          entities,
          claimText,
        ].join(" "),
      ),
    });

    for (const event of achievement.timeline) {
      out.push({
        id: `${achievement.slug}:${event.id}`,
        kind: "moment",
        title: event.title,
        detail: event.summary,
        context: `${achievement.title} · ${event.displayDate ?? event.date}`,
        href: `/achievement/${achievement.slug}?view=full&scene=timeline&at=${event.id}`,
        haystack: normalize(
          [event.title, event.summary, event.displayDate ?? "", event.date].join(" "),
        ),
      });
    }
  }

  for (const item of MILESTONES) {
    out.push({
      id: item.id,
      kind: "milestone",
      title: item.title,
      detail: `${CATEGORY_LABEL[item.categories[0]]} · ${STATUS_LABEL[item.status]}`,
      href: "/explore",
      haystack: normalize(
        [
          item.title,
          item.categories.map((c) => CATEGORY_LABEL[c]).join(" "),
          item.highlight ? `${item.highlight.value} ${item.highlight.label}` : "",
          item.date,
        ].join(" "),
      ),
    });
  }

  return out;
}

export const SEARCH_INDEX: SearchEntry[] = build();

/**
 * 찾는다.
 *
 * 띄어쓴 말은 모두 들어 있어야 한다("성남 병원" → 둘 다 있는 것만). 한국어는
 * 형태소를 나누지 않으면 부분 문자열이 가장 잘 맞는다. 이 크기에서는 그걸로 충분하다.
 *
 * 순서는 업적 → 시점 → 세부 성과. 같은 종류 안에서는 제목에 맞은 것이 앞이다.
 */
const KIND_ORDER: Record<SearchKind, number> = { achievement: 0, moment: 1, milestone: 2 };

export function search(index: SearchEntry[], query: string, limit = 12): SearchEntry[] {
  const terms = query.split(/\s+/).map(normalize).filter(Boolean);
  if (terms.length === 0) return [];

  const hits = index.filter((entry) => terms.every((t) => entry.haystack.includes(t)));

  return hits
    .sort((a, b) => {
      const at = terms.every((t) => normalize(a.title).includes(t)) ? 0 : 1;
      const bt = terms.every((t) => normalize(b.title).includes(t)) ? 0 : 1;
      // 종류가 먼저다. 이 사이트의 단위는 업적이므로 업적이 시점보다 위에 온다.
      // 그 안에서 제목에 맞은 것이 본문에만 맞은 것보다 앞이다.
      return KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || at - bt;
    })
    .slice(0, limit);
}

import { ACHIEVEMENTS } from "@/content/achievements";
import { MILESTONES } from "@/content/milestones";
import { CARTEL_ENTRIES, isOpen } from "@/content/cartels";
import { STATEMENTS } from "@/content/words";
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
 *
 * ★ 이 파일은 브라우저에도 실린다 — fs를 부르는 것을 들이지 않는다.
 *   위키(`wiki/**`)와 자서전 본문(`text/*.md`)은 디스크에서 읽어 오므로 여기
 *   있을 수 없다. 그 둘은 `search-server.ts`가 붙이고, 인덱스를 합치는 자리는
 *   `/api/search-index` 하나다. 화면은 만들어진 인덱스만 받는다.
 */

export type SearchKind =
  | "achievement"
  | "moment"
  | "milestone"
  | "words"
  | "book"
  | "wiki"
  | "cartel";

export const KIND_LABEL: Record<SearchKind, string> = {
  achievement: "업적",
  moment: "시점",
  milestone: "세부 성과",
  words: "언행",
  book: "자서전",
  wiki: "위키",
  cartel: "카르텔",
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


  /*
   * 언행.
   *
   * haystack에 원문을 통째로 넣는다. 이 자료에서 사람이 찾는 말은 제목이
   * 아니라 본문 한가운데에 있다 — "손가혁", "계양구"로 찾아 들어온다.
   */
  for (const statement of STATEMENTS) {
    out.push({
      id: `words:${statement.slug}`,
      kind: "words",
      title: statement.title,
      detail: statement.easy?.intro ?? statement.body.slice(0, 80),
      context: `${statement.channel} · ${statement.displayDate}`,
      href: `/words/${statement.slug}`,
      haystack: normalize(
        [
          statement.title,
          statement.body,
          statement.topics.join(" "),
          statement.glossary.map((g) => `${g.term} ${g.explain}`).join(" "),
          statement.context ?? "",
        ].join(" "),
      ),
    });
  }
  /*
   * 카르텔.
   *
   * ★ 비어 있는 표적은 넣지 않는다.
   *   이름 한 줄뿐인 페이지가 검색에 잡히면 열어 봤을 때 읽을 것이 없다.
   *   장이 없는 책을 넣지 않는 것과 같은 규칙이다. 목록에는 그대로 남아 있다.
   *
   * ★ 걸린 업적의 제목을 haystack에 넣지 않는다.
   *   넣으면 "대장동"으로 찾았을 때 업적과 카르텔이 두 줄로 잡힌다. 위키
   *   소스 페이지에서 본문을 빼는 것과 같은 이유다 — 같은 말은 원본이 맡는다.
   *
   * ★ 확인하지 못한 것도 넣지 않는다.
   *   "언론"으로 찾았는데 "언론 자료를 찾지 못했습니다"가 걸리면, 없는 것이
   *   있는 것처럼 잡히는 셈이 된다.
   */
  for (const entry of CARTEL_ENTRIES) {
    const { cartel } = entry;
    if (!isOpen(cartel)) continue;

    out.push({
      id: `cartel:${cartel.slug}`,
      kind: "cartel",
      title: `${cartel.name} 카르텔`,
      detail: cartel.summary,
      href: `/cartel/${cartel.slug}`,
      haystack: normalize(
        [
          // 화면에 보이는 제목 그대로. 「카르텔」이 빠져 있으면 "의료 카르텔"로
          // 찾았을 때 제목이 그대로 적힌 항목이 걸리지 않는다.
          `${cartel.name} 카르텔`,
          cartel.summary,
          cartel.problems.map((p) => p.text).join(" "),
        ].join(" "),
      ),
    });
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

/** 저장소 안 자료만. 위키와 자서전은 `search-server.ts`가 덧붙인다. */
export const SEARCH_INDEX: SearchEntry[] = build();

/**
 * 찾는다.
 *
 * 띄어쓴 말은 모두 들어 있어야 한다("성남 병원" → 둘 다 있는 것만). 한국어는
 * 형태소를 나누지 않으면 부분 문자열이 가장 잘 맞는다. 이 크기에서는 그걸로 충분하다.
 *
 * 순서는 업적 → 언행 → 자서전 → 위키 → 카르텔 → 시점 → 세부 성과. 같은 종류
 * 안에서는 제목에 맞은 것이 앞이다.
 *
 * 언행을 시점보다 위에 둔 이유: 본인이 한 말은 그 자체로 찾을 값어치가 있다.
 * 시점은 어느 업적의 한 칸이라 그 업적을 먼저 보는 편이 대개 맞다.
 *
 * 위키를 본인이 쓴 것들 아래에 둔 이유: 위키는 우리가 raw source를 읽고 다시
 * 쓴 것이다. 같은 말이 원본과 위키에 다 걸리면 원본이 먼저 보여야 한다.
 *
 * 카르텔을 시점보다 위에 둔 이유: 표적은 업적 여럿을 모은 자리라, 같은 말이
 * 걸렸다면 업적의 한 칸보다 표적 전체를 먼저 보는 편이 대개 맞다.
 */
const KIND_ORDER: Record<SearchKind, number> = {
  achievement: 0,
  words: 1,
  book: 2,
  wiki: 3,
  cartel: 4,
  moment: 5,
  milestone: 6,
};

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

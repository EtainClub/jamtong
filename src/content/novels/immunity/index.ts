import { EP01_BODY } from "./ep01";
import { EP02_BODY } from "./ep02";

/**
 * 정치소설 《면역》.
 *
 * 이타인클럽이 X에 연재하는 소설이다. 한 편마다 글 한 편과 숏츠 한 편이 짝을
 * 이룬다. 전체 열다섯 편이고, 아직 올라오지 않은 편도 자리는 미리 잡아 둔다 —
 * 몇 편 중 몇 편째인지 보여야 연재를 따라올 수 있다.
 *
 * ★ 이것은 소설이다. 업적·언행·정책의 사실 자료가 아니고, 위키의 raw source도
 *   아니다. 위키 페이지가 여기 적힌 문장을 앵커로 삼지 않는다.
 *
 * 새 편을 더하는 순서:
 *   1. `epNN.ts`에 X 원문 본문을 옮긴다(머리의 편 제목과 꼬리의 "다음 이야기"는 뺀다).
 *   2. 아래 EPISODES의 그 편에 `title`·`body`·`postedAt`·`xUrl`을 채운다.
 *   3. 숏츠가 올라오면 `shortsId`에 유튜브 영상 id를 적는다.
 */

export type NovelEpisode = {
  /** 몇 편째인지. 주소에도 쓴다 — `/novels/immunity/1`. */
  no: number;
  /** 편 제목. 아직 모르면 비워 둔다. */
  title?: string;
  /** 본문. 있으면 공개된 편이다. */
  body?: string;
  /** X에 올라온 날. YYYY-MM-DD, 한국 시각. */
  postedAt?: string;
  /** X 원문 주소. */
  xUrl?: string;
  /** 이 편의 숏츠. 유튜브 영상 id. 없으면 자리만 그린다. */
  shortsId?: string;
};

export type Novel = {
  slug: string;
  title: string;
  genre: string;
  author: string;
  authorUrl: string;
  /** 시리즈 소개. 1편에서 드러난 것만 적는다. */
  logline: string;
  synopsis: string;
  /** 전체 편수. */
  total: number;
  episodes: NovelEpisode[];
};

const KNOWN: NovelEpisode[] = [
  {
    no: 1,
    title: "스물아홉",
    body: EP01_BODY,
    postedAt: "2026-09-27",
    xUrl: "https://x.com/etainclub/status/2104034639749001611",
    shortsId: "4xJFHuHc_HE",
  },
  {
    no: 2,
    title: "범인을 찾아라",
    body: EP02_BODY,
    postedAt: "2026-09-28",
    xUrl: "https://x.com/etainclub/status/2104338608765419966",
    shortsId: "z8DXK_HkDIU",
  },
];

const TOTAL = 15;

export const IMMUNITY: Novel = {
  slug: "immunity",
  title: "면역",
  genre: "정치소설",
  author: "이타인클럽",
  authorUrl: "https://x.com/etainclub",
  logline: "몸을 향한 첫 번째 질문은, 훗날 한 나라를 향한 질문이 된다.",
  synopsis:
    "스물아홉 살 직장인 한도윤은 목에 만져진 작은 혹 때문에 병원을 찾았다가 림프종 진단을 받는다. " +
    "범인을 찾아 없애면 예전으로 돌아갈 수 있으리라 믿으며 밤새 검색하던 그는 한 문장 앞에서 멈춘다 — " +
    "우리 몸에서는 끊임없이 비정상적인 세포가 생긴다. 그렇다면 왜 내 몸은 그것을 막지 못했을까.",
  total: TOTAL,
  episodes: Array.from(
    { length: TOTAL },
    (_, i) => KNOWN.find((e) => e.no === i + 1) ?? { no: i + 1 },
  ),
};

export const NOVELS: Novel[] = [IMMUNITY];

export function getNovel(slug: string): Novel | undefined {
  return NOVELS.find((n) => n.slug === slug);
}

/** 본문이 있는 편만. 주소가 열리는 편이다. */
export function publishedEpisodes(novel: Novel): NovelEpisode[] {
  return novel.episodes.filter((e) => e.body);
}

/** 본문을 문단으로. 원문의 빈 줄과 줄바꿈을 모두 문단 경계로 본다. */
export function paragraphs(body: string): string[] {
  return body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** 목록에 보일 첫머리. */
export function excerpt(body: string, max = 90): string {
  let out = "";
  for (const p of paragraphs(body)) {
    const next = out ? `${out} ${p}` : p;
    if (next.length > max) return out ? `${out} …` : `${p.slice(0, max)}…`;
    out = next;
  }
  return out;
}

/** 읽는 데 드는 분. 한국어 분당 500자로 어림한다. */
export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(body.replace(/\s/g, "").length / 500));
}

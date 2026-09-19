import { z } from "zod";

/**
 * 언행 — 이재명 대통령이 직접, 공개적으로 한 말과 행동.
 *
 * 업적과 다른 종류의 자료다. 업적은 **남이 확인해 준 사실**을 모아 근거를
 * 매다는 일이고, 언행은 **본인이 한 말 그 자체**다. 그래서 여기서는 근거를
 * 따로 달지 않는다. 원문이 곧 근거다.
 *
 * ★ 원문에 손대지 않는다.
 *   오탈자도, 띄어쓰기도, 줄바꿈도 그대로 둔다. 읽기 좋게 고치는 순간 이것은
 *   원문이 아니라 우리가 다듬은 글이 된다. 이 자료의 값어치는 전부 '그대로'에
 *   있다. 나중에 이 말을 두고 다툼이 생겼을 때 기댈 것이 그것뿐이다.
 *
 * ★ 쉽게 보기는 요약이지 대체가 아니다.
 *   긴 글은 읽다 만다. 그래서 짧게 옮긴 것을 함께 둔다. 다만 옮긴 한 토막마다
 *   **원문의 어느 대목을 옮긴 것인지** 그 문장을 그대로 붙인다. 붙인 문장이
 *   원문에 없으면 빌드가 깨진다(validateStatement). 업적에서 근거 없는 것을
 *   그리지 않는 것과 같은 규칙이다 — 여기서는 원문이 근거의 자리에 있다.
 *
 * ★ 우리가 해석을 보태지 않는다.
 *   무엇을 뜻하는 말인지, 잘한 말인지 아닌지는 적지 않는다. 쉽게 보기는 '무슨
 *   말인지'까지이고 '그래서 어떻다'는 읽는 사람 몫이다.
 */

export const statementKindSchema = z.enum([
  "post", // SNS 글
  "speech", // 연설·발언
  "interview", // 인터뷰
  "letter", // 서한·편지
  "act", // 말이 아닌 행동
]);
export type StatementKind = z.infer<typeof statementKindSchema>;

export const KIND_LABEL: Record<StatementKind, string> = {
  post: "SNS 글",
  speech: "연설·발언",
  interview: "인터뷰",
  letter: "서한",
  act: "행동",
};

/**
 * 언행 삽화.
 *
 * 업적의 Eli5Art와 섞지 않는다. 저쪽은 항로·예산·좌석처럼 **사실의 모양**을
 * 그리고, 여기는 사람 사이에 오가는 일을 그린다. 한 통에 담으면 백 개가 넘는
 * 열거형이 더 커지기만 하고, 어느 쪽에서 쓰는 그림인지 알 수 없게 된다.
 */
export const WordArt = z.enum([
  "quote-pick", // 남의 글을 한 조각 가져오다
  "part-whole", // 조각 하나와 그 사람 전체는 다르다
  "sorry", // 마음이 상한 사람에게
  "by-friends", // 친구를 보면 그 사람을 안다
  "street-badge", // 팻말 붙이고 험하게 굴던 사람
  "fewer-more", // 내 편은 줄고 상대는 는다
  "masked", // 지지자인 척 지지자를 찌른다
  "calm-words", // 거친 말을 내려놓고
  // 청년의 날
  "youth-meet", // 청년들을 만나 이야기를 듣다
  "longest-wait", // 가장 오래 공부하고 가장 오래 기다린다
  "fewer-doors", // 기회 자체가 줄었다
  "blind-spot", // 아동과 노인 사이에 빈 자리
  "hard-how", // 무엇은 분명한데 어떻게가 어렵다
  "from-field", // 탁상이 아니라 현장에서
  // 개혁론
  "same-dream", // 36년 전과 지금, 같은 목표
  "slow-road", // 빠른 길은 되돌아오고 느린 길은 닿는다
  "careful-steps", // 절차와 공감을 밟아 간다
  "power-weight", // 권한이 커지면 책임도 커진다
  "not-war", // 선거는 전쟁이 아니다
  // 유가
  "pump-steady", // 주유소 가격판이 잠잠하다
  "many-suppliers", // 사 오는 곳을 늘렸다
  "cap-gap", // 국제가는 뛰는데 국내가는 눌렸다
  "still-risk", // 그래도 아직 위험하다
  // 발달장애인 돌봄
  "father-worry", // 아버지의 마지막 걱정
  "not-alone", // 부모가 없어도 혼자 남지 않게
  "care-24", // 하루 종일 곁을 지킨다
  "step-on", // 한 걸음씩, 멈추지 않고
  // 부동산
  "rate-watch", // 금리를 눈여겨보라
  "auction-up", // 연체와 경매가 늘고 있다
  "build-fast", // 빨리 많이 짓겠다
  "two-loans", // 공급을 늘리는 돈과 수요를 늘리는 돈은 다르다
  "spread-out", // 수도권 집중을 흩는다
  "safety-net", // 값이 무너지면 공공이 받는다
]);
export type WordArt = z.infer<typeof WordArt>;

/** 쉽게 보기의 한 토막. */
export const easyPointSchema = z.object({
  id: z.string(),
  /** 이 토막이 무슨 이야기인지. 한 줄. */
  title: z.string(),
  /** 쉬운 말로 옮긴 것. 한두 문장. 길어지면 쉽게 보기가 아니게 된다. */
  say: z.string(),
  /** 이 토막의 그림. 없으면 글만 나온다. */
  art: WordArt.optional(),
  /**
   * ★ 불변식: 옮긴 자리의 원문. body 안에 **그대로** 있어야 한다.
   *   요약이 원문에서 얼마나 멀어졌는지를 읽는 사람이 바로 대볼 수 있게 한다.
   */
  quote: z.string().min(1, "옮긴 자리의 원문이 없는 토막은 허용되지 않는다"),
});
export type EasyPoint = z.infer<typeof easyPointSchema>;

export const statementSchema = z.object({
  id: z.string(),
  slug: z.string(),
  /** 원문에 제목이 있으면 그대로. 없으면 첫 줄에서 따되 지어내지 않는다. */
  title: z.string(),
  kind: statementKindSchema,
  /** 어디에 올린 것인지. "X (@Jaemyung_Lee)". */
  channel: z.string(),
  url: z.string().url().optional(),
  /** 정렬용 ISO 날짜. */
  postedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "postedAt은 YYYY-MM-DD여야 한다"),
  /** 화면에 그대로 적는 시각. 원문이 밝힌 만큼만. */
  displayDate: z.string(),
  /** 원문. 절대 손대지 않는다. */
  body: z.string().min(1),
  /**
   * 이 글이 놓인 자리. 편집자가 적는 한 줄.
   *
   * 무슨 일이 있어서 나온 말인지까지만 적는다. 그 일의 옳고 그름이나 상대가
   * 누구인지는 적지 않는다 — 이 위키가 다룰 것이 아니고, 대개 개인이다.
   */
  context: z.string().optional(),
  topics: z.array(z.string()).default([]),
  /**
   * 원문에 나오는 말 가운데 모르면 읽히지 않는 것.
   * 뜻만 적고 평가하지 않는다.
   */
  glossary: z
    .array(z.object({ term: z.string(), explain: z.string() }))
    .default([]),
  /** 원문이 길 때만 붙인다. 짧은 글에는 쉽게 보기가 필요 없다. */
  easy: z
    .object({
      intro: z.string(),
      points: z.array(easyPointSchema).min(2, "토막이 둘은 있어야 요약이 된다"),
      /**
       * 요약만 보고 가면 오해할 대목.
       *
       * 앞으로 하겠다는 말을 이미 한 일로 읽는 것이 가장 흔하다. 여기도
       * 원문 한 대목을 붙여, 무엇을 보고 그렇게 적었는지 대볼 수 있게 한다.
       */
      caveat: z.object({ text: z.string(), quote: z.string().min(1) }).optional(),
    })
    .optional(),
  /** 이 말과 맞물리는 업적. slug로 건다. */
  relatedAchievements: z.array(z.string()).default([]),
});
export type Statement = z.infer<typeof statementSchema>;
export type StatementInput = z.input<typeof statementSchema>;

/**
 * 공백을 무시하고 견준다.
 *
 * 원문에는 줄바꿈과 두 칸 띄어쓰기가 섞여 있다("수많은 개혁이  진행되는").
 * 사람이 인용을 옮겨 적을 때 그것까지 맞추기는 어렵고, 맞추라고 하면 결국
 * 원문 쪽을 고치게 된다. 글자가 같으면 같은 문장으로 본다.
 */
function squash(text: string): string {
  return text.replace(/\s+/g, "");
}

/**
 * 쉽게 보기의 인용이 전부 원문 안에 있는지. 빌드에서 깨진다.
 *
 * 이 검사가 이 자료형의 전부다. 이것이 없으면 '쉽게 보기'는 그냥 우리가 쓴
 * 글이 되고, 원문과 얼마나 다른지 아무도 모르게 된다.
 */
export function validateStatement(statement: Statement): string[] {
  const errors: string[] = [];
  const haystack = squash(statement.body);

  const quoted = [
    ...(statement.easy?.points ?? []).map((p) => ({ where: `easy.points "${p.id}"`, quote: p.quote })),
    ...(statement.easy?.caveat
      ? [{ where: "easy.caveat", quote: statement.easy.caveat.quote }]
      : []),
  ];

  for (const point of quoted) {
    if (!haystack.includes(squash(point.quote))) {
      errors.push(
        `${point.where} → 인용문이 원문에 없다: “${point.quote.slice(0, 40)}…”`,
      );
    }
  }

  for (const entry of statement.glossary) {
    if (!haystack.includes(squash(entry.term))) {
      errors.push(`glossary "${entry.term}" → 원문에 나오지 않는 말이다`);
    }
  }

  return errors;
}

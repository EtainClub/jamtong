import { statementSchema, type StatementInput } from "./schema";

/**
 * 「사욕을 위해 국익을 훼손하는 자들」 — 2026년 4월 12일 X 글.
 *
 * ★ 쉽게 보기를 붙이지 않았다.
 *   짧고, 어려운 말이 거의 없고, 문장 하나하나가 이미 결론이다. 이런 글에
 *   요약을 붙이면 원문보다 길어지고, 옮기는 과정에서 날만 무뎌진다.
 *   말풀이 하나로 충분하다.
 *
 * ★ 누구를 두고 한 말인지 적지 않는다.
 *   "정치와 언론 영역에서도"라고만 되어 있다. 대상을 짚어 넣는 순간 이 위키가
 *   그 지목에 동의한 것이 된다.
 */

const BODY = `사욕을 위해 국익을 훼손하는 자들을 매국노라 부른다.

매국 행위를 하면서도 사욕을 위해 국익을 해치는 것이 나쁜 짓임을 모르는 이들도 많다. 아니 알면서 감행하는 것인지도 모르겠다.

심지어 국익을 포함한 공익추구가 사명인 정치와 언론 영역에서도 매국행위는 버젓이 벌어진다.

결국 이 역시 우리가 힘을 모아 가르치고 극복해야할 국가적 과제, 비정상의 정상화 과제이다.

각국의 주권과 보편적 인권은 존중되어야 하고 침략적 전쟁은 부인된다. 그게 우리 헌법정신이자 국제적 상식이다.

역지사지는 개인만이 아니라 국가관계에도 적용된다.

내 생명과 재산만큼 남의 생명 재산도 귀하다.

존중해야 존중받는다.`;

const raw: StatementInput = {
  id: "national-interest",
  slug: "national-interest",
  title: "존중해야 존중받는다",
  kind: "post",
  channel: "X (@Jaemyung_Lee)",
  url: "https://x.com/Jaemyung_Lee",
  postedAt: "2026-04-12",
  displayDate: "2026년 4월 12일",
  body: BODY,
  context:
    "제 이익을 위해 나라의 이익을 해치는 일에 대한 글입니다. 누구를 두고 한 " +
    "말인지는 원문에 적혀 있지 않아 여기에도 적지 않습니다.",
  topics: ["국익", "주권", "인권"],
  glossary: [
    {
      term: "역지사지",
      explain: "처지를 바꿔 생각해 본다는 뜻입니다.",
    },
  ],
  relatedAchievements: [],
};

export const nationalInterest = statementSchema.parse(raw);

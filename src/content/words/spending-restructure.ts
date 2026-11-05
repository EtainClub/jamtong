import { statementSchema, type StatementInput } from "./schema";

/**
 * 「국민여러분의 관심과 도움이 필요합니다」 — 2026년 11월 3일 X 글.
 *
 * ★ 원문은 한 글자도 고치지 않았다. 홑화살괄호(<>)로 묶은 첫 줄, 줄 끝 빈칸까지
 *   올라온 그대로다.
 *
 * ★ 제목은 원문 첫 줄에서 괄호와 마침표만 뺐다.
 *
 * ★ 2027년 예산안의 지출 구조조정을 높이 평가한 한 이용자의 X 글을 인용한 글이다.
 *   인용된 개인 계정은 적지 않는다. 인용 글에만 있는 말('전액 현금 절감액이 아니다',
 *   '교육교부금 산정 방식' 등)은 대통령 글에 없으므로 옮기지 않는다.
 *
 * ★ 2,100여 개·6,476개·107조 2,000억 원은 같은 날 시정연설에서 정부가 밝힌 수다
 *   (policy:budget-2027). 짧은 글이라 쉽게 보기는 두지 않는다.
 *
 * 날짜는 글 주소의 id에서 읽었다(X의 id는 올린 시각을 담는다).
 */

const BODY = `<국민여러분의 관심과 도움이 필요합니다.>

국가 예산이 투입되던 
2,100여 개 사업 폐지,
6,476개 사업 구조조정,
총 107조 2,000억 원 규모의 지출 조정.

국민 전체와 국가를 위해 반드시 필요하지만, 이 역시 누군가의 기득권을 침해하여 정부에 대한 반발 유인이 됩니다.

개혁은 그래서 어렵습니다.
관심과 지원 부탁드립니다.`;

const raw: StatementInput = {
  id: "spending-restructure",
  slug: "spending-restructure",
  title: "국민여러분의 관심과 도움이 필요합니다",
  kind: "post",
  channel: "X (@Jaemyung_Lee)",
  url: "https://x.com/Jaemyung_Lee/status/2117398837715423395",
  postedAt: "2026-11-03",
  displayDate: "2026년 11월 3일 오전 8:29",
  body: BODY,
  context:
    "2027년 예산안의 대규모 지출 구조조정을 다룬 한 이용자의 X 글을 인용하며, 개혁에 따르는 " +
    "반발을 말하고 관심을 부탁한 글입니다.",
  topics: ["예산", "2027년 예산안", "지출 구조조정", "개혁"],
  glossary: [
    {
      term: "구조조정",
      explain: "여기서는 정부 사업을 없애거나 합치고 줄여 예산 쓰임새를 다시 짜는 일을 말합니다.",
    },
    {
      term: "기득권",
      explain: "이미 차지하고 있는 이익이나 권리입니다. 여기서는 없어지거나 줄어드는 사업에서 예산을 받던 쪽을 가리킵니다.",
    },
  ],

  relatedAchievements: [],
};

export const spendingRestructure = statementSchema.parse(raw);

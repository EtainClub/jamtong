import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 건설 — 지금은 자재 담합 한 건이다.
 *
 * ★ 작게 적는다.
 *   광양 레미콘 담합은 한 지역의 자재 업체 사건이다. 건설사 자체의 입찰담합을
 *   이 정부가 제재한 사례는 찾지 못했다. 한 건으로 "건설 카르텔을 깼다"고
 *   읽히지 않게 요약에 범위를 밝힌다.
 *
 * 경기도지사 시절의 건설원가 공개·페이퍼컴퍼니 단속(`gyeonggi-construction`)은
 * 이 정부의 일이 아니어서 걸지 않는다.
 */

const raw: CartelInput = {
  id: "construction",
  slug: "construction",
  name: "건설",
  summary:
    "건설 현장에 들어가는 자재와 입찰의 값. 지금은 한 지역 레미콘 업체들의 가격·물량 담합 제재 한 건뿐입니다.",
  milestoneIds: ["ct-remicon"],
  openQuestions: [
    "이 정부가 건설사의 공공공사 입찰담합을 제재한 사례를 찾지 못했습니다.",
    "공정위의 ‘담합 재적발 시 공공입찰 제한’(담합 표적)이 건설 분야에 실제로 적용된 건수를 확인하지 못했습니다.",
    "경기도지사 시절의 건설원가 공개·페이퍼컴퍼니 단속은 업적 「경기도 건설 불공정 단속」에 있습니다. 이 정부의 일이 아니어서 여기 세지 않습니다.",
  ],
  sourceNote: "공정위 처분을 보도로 확인했습니다. 2026년 10월 31일 기준입니다.",
};

export const construction: CartelEntry = {
  cartel: cartelSchema.parse(raw),
  claims: [],
  sources: [],
};

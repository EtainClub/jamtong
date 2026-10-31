import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 교육 — 교복 입찰 담합.
 *
 * 대통령이 2026년 2월 담합 분야로 이름을 댄 것 가운데 교복이 있다(`collusion`).
 * 담합 표적에 둘지 교육에 둘지 정하지 못하고 비워 두었다가, 학교가 발주하는
 * 입찰이라 여기 둔다.
 *
 * ★ 「사교육 카르텔」은 여기 없다.
 *   2023년 이전 정부가 킬러문항을 두고 쓴 말이다. 남의 정부 일을 이 자리에
 *   옮기지 않는다.
 */

const raw: CartelInput = {
  id: "education",
  slug: "education",
  name: "교육",
  summary:
    "학교가 발주하는 입찰에서 값을 맞춘 일. 세 지역 교복 입찰 담합에 과징금이 나왔습니다.",
  milestoneIds: ["ct-uniform"],
  openQuestions: [
    "공정위 보도자료 본문(첨부 문서)을 열지 못해 수치는 보도로 대조했습니다.",
    "교육청 입찰 정보를 담합 징후 분석 시스템에 잇는 일이 실제로 시작됐는지 확인하지 못했습니다.",
    "사교육비와 입시를 겨냥한 이 정부의 조치는 확인하지 못했습니다.",
  ],
  sourceNote: "공정위 보도자료 제목과 보도로 확인했습니다. 2026년 10월 31일 기준입니다.",
};

export const education: CartelEntry = {
  cartel: cartelSchema.parse(raw),
  claims: [],
  sources: [],
};

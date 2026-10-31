import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 금융 — 은행과 국고채 전문딜러의 담합.
 *
 * ★ '이자장사' 비판은 싣지 않는다.
 *   정부가 은행의 이자 수익을 비판한 말은 있지만 제재가 아니다. 여기에는
 *   공정위가 처분을 내렸거나 절차에 들어간 것만 센다.
 */

const raw: CartelInput = {
  id: "finance",
  slug: "finance",
  name: "금융",
  summary:
    "금융회사끼리 정보를 나누고 입찰을 맞춘 일. 4대 은행의 LTV 정보교환에 과징금이 나왔고, 국고채 입찰 담합은 제재 절차에 들어갔습니다.",
  milestoneIds: ["ct-bank-ltv", "ct-ktb-bid"],
  openQuestions: [
    "4대 은행이 LTV 처분에 실제로 행정소송을 냈는지, 결과가 어떤지 확인하지 못했습니다.",
    "국고채 입찰 담합의 전원회의 결론이 아직 나오지 않았습니다.",
  ],
  sourceNote: "공정위 처분과 심사보고서 송부를 보도로 확인했습니다. 2026년 10월 31일 기준입니다.",
};

export const finance: CartelEntry = {
  cartel: cartelSchema.parse(raw),
  claims: [],
  sources: [],
};

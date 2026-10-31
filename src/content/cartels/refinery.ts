import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 정유사 — 기소와 공정위 심의, 두 갈래가 동시에 가고 있다.
 *
 * ★ 둘 다 추진 중이다.
 *   검찰은 정유 4사를 기소했고 공정위는 2곳을 심의하기 시작했다. 판결도
 *   과징금도 아직 없다. 혐의가 크다고 완료 칸에 올리지 않는다.
 *
 * ★ 석유 최고가격제는 세지 않는다.
 *   `oil-supply`의 최고가격제는 담합 제재가 아니라 가격 규제다. 같은 시기에
 *   같은 업계를 겨냥했지만, 여기 세면 "담합을 깼다"로 읽힌다.
 */

const raw: CartelInput = {
  id: "refinery",
  slug: "refinery",
  name: "정유사",
  summary:
    "기름값이 어떻게 정해지는지. 전쟁 직후 유가 담합 혐의로 검찰이 정유 4사를 기소했고, 공정위도 2곳을 심의하고 있습니다. 결론은 아직입니다.",
  milestoneIds: ["ct-refinery-indict", "ct-refinery-ftc"],
  openQuestions: [
    "1심 판결과 공정위 결론이 아직 나오지 않았습니다.",
    "석유 최고가격제(2026년 3월 시행)는 담합 제재가 아니라 가격 규제여서 여기 세지 않습니다. 업적 「원유 수입처 다변화」 쪽에 있습니다.",
    "담합 혐의가 기름값에 실제로 얼마나 반영됐는지는 재판과 심의에서 가려질 일입니다.",
  ],
  sourceNote: "검찰 기소와 공정위 심의 착수를 보도로 확인했습니다. 2026년 10월 31일 기준입니다.",
};

export const refinery: CartelEntry = {
  cartel: cartelSchema.parse(raw),
  claims: [],
  sources: [],
};

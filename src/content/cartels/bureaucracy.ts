import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 관료 — 공공기관 퇴직자가 일감으로 이어지는 구조.
 *
 * 지금은 철도 기관 하나다. 국토부가 철도 전관 카르텔 근절 TF를 두고 기관별
 * 계약 기준을 고쳤다. 판사·검사 출신의 전관예우는 「전관예우」 표적에 따로 있다.
 *
 * ★ 묶어서 추진 중으로 센다.
 *   국가철도공단과 코레일은 이미 기준을 고쳤지만 에스알과 철도기술연구원은
 *   시범·구축 단계다. 한 점검회의에서 나온 묶음을 쪼개면 출처 하나가 여러
 *   칸을 채운다.
 */

const raw: CartelInput = {
  id: "bureaucracy",
  slug: "bureaucracy",
  name: "관료",
  summary:
    "공공기관 퇴직자가 그 기관의 일감으로 이어지는 구조. 철도 기관들이 퇴직자 관련 계약 제한을 늘리고 재취업 업체에 감점을 주기 시작했습니다.",
  milestoneIds: ["ct-rail-revolving"],
  openQuestions: [
    "철도 밖의 공공기관(LH 등)에서 이 정부가 새로 낸 전관 차단 조치는 찾지 못했습니다. LH 전관 대책은 2023년 이전 정부의 일입니다.",
    "퇴직공직자 취업제한 제도(공직자윤리법)를 이 정부가 강화한 개정은 확인하지 못했습니다.",
    "철도 기관의 조치로 퇴직자 업체의 수주가 실제로 줄었는지는 아직 재지 않았습니다.",
  ],
  sourceNote: "국토부 점검회의 내용을 보도로 확인했습니다. 2026년 10월 31일 기준입니다.",
};

export const bureaucracy: CartelEntry = {
  cartel: cartelSchema.parse(raw),
  claims: [],
  sources: [],
};

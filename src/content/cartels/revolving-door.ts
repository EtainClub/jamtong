import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 전관예우 — 이 위키에 이미 있는 업적 둘이 받친다.
 *
 * 새 근거를 만들지 않는다. 법왜곡죄·재판소원·대법관 증원은 `judicial-reform`이,
 * 수사와 기소를 나눈 일은 `prosecution-reform`이 근거까지 갖춰 들고 있다.
 * 여기서 할 일은 그 둘을 한 표적 아래 모아 보이는 것뿐이다.
 *
 * ★ 업적 둘을 조치 넷으로 나눠 센다.
 *   사법개혁 3법은 셋이 효력이 생기는 때가 다르다 — 법왜곡죄와 재판소원은
 *   공포와 동시에 시행됐고, 대법관 증원은 2028년부터다. 업적 하나를 한 칸으로
 *   세면 "완료"로 칠할지 "추진 중"으로 칠할지부터 거짓이 된다.
 *
 * ★ 수사·기소 분리는 시행일이 지났지만 「추진 중」으로 둔다.
 *   근거가 말하는 것은 "시행일은 2026년 10월 2일"까지다. 그날 기관이 실제로
 *   문을 열었는지를 확인한 자료가 아직 업적에 없다.
 *
 * ★ "무엇이 문제인가"는 아직 비어 있다.
 *   유전무죄 무전유죄가 실제로 어느 정도인지를 말하려면 통계가 필요한데
 *   찾지 못했다. 근거 없는 진단을 우리 말로 적느니 비워 둔다.
 */

const raw: CartelInput = {
  id: "revolving-door",
  slug: "revolving-door",
  name: "전관예우",
  summary:
    "판결을 다시 볼 길을 늘리고, 수사와 기소를 한 기관이 함께 쥐던 구조를 나눈 일을 모았습니다.",
  achievementSlugs: ["judicial-reform", "prosecution-reform"],
  measures: [
    {
      id: "rd-distort",
      title: "법왜곡죄 시행",
      status: "done",
      date: "2026-03-12",
      datePrecision: "day",
      ref: "judicial-reform#claim-distort",
      note: "재판·수사 중인 사건에서 판사·검사 등이 법을 왜곡하면 10년 이하의 징역에 처합니다. 공포와 동시에 시행됐습니다.",
    },
    {
      id: "rd-appeal",
      title: "재판소원 시행",
      status: "done",
      date: "2026-03-12",
      datePrecision: "day",
      ref: "judicial-reform#claim-appeal",
      note: "대법원 판결을 포함한 법원 재판도 헌법소원 대상이 됐습니다. 공포와 동시에 시행됐습니다.",
    },
    {
      id: "rd-bench",
      title: "대법관 14명 → 26명 증원",
      status: "ongoing",
      date: "2026-03-12",
      datePrecision: "day",
      ref: "judicial-reform#claim-bench",
      note: "법은 공포됐고, 증원은 2028년 3월부터 3년에 걸쳐 매년 4명씩 이뤄집니다.",
    },
    {
      id: "rd-split",
      title: "수사·기소 분리, 검찰청 폐지",
      status: "ongoing",
      date: "2026-03-24",
      datePrecision: "day",
      ref: "prosecution-reform#claim-law",
      note: "중대범죄수사청법과 공소청법이 공포됐고 시행일은 2026년 10월 2일입니다. 그날 두 기관이 실제로 출범했는지는 아직 확인하지 못했습니다.",
    },
  ],
  openQuestions: [
    "전관 변호사의 수임과 선고 결과를 잇는 통계를 찾지 못했습니다. ‘유전무죄 무전유죄’가 어느 정도인지를 수치로 적을 수 없습니다.",
    "전관예우 자체를 겨냥한 별도 제도(수임 제한 강화 등)가 이 정부에서 있었는지 확인하지 못했습니다.",
  ],
  sourceNote:
    "여기 모인 두 업적은 각자의 근거를 들고 있습니다. 이 페이지가 따로 더하는 " +
    "주장은 없습니다. 2026년 9월 21일 기준입니다.",
};

export const revolvingDoor: CartelEntry = {
  cartel: cartelSchema.parse(raw),
  claims: [],
  sources: [],
};

import type { PolicyInput } from "./schema";

/**
 * 공공계약 선금(선급금) 제도 합리화 (2026년 2월 발표, 7월 시행).
 *
 * 대통령 유튜브 영상 답글에 "공공기관 계약 선급금 비율을 낮춰 중소기업이 어려우니 원래대로 70%로 되돌려 달라"는 요청이 달렸다(잼통 Voice).
 * 무엇이 언제 어떻게 바뀌었는지, 중소기업 구간은 어떻게 다른지, 왜 바꿨다고 했는지 적는다.
 *
 * ★ '70%'는 바뀌기 전 최초 지급 상한이자 바뀐 뒤의 누적 상한이다. 두 숫자를 섞지 않는다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #236.
 */
export const PUBLIC_CONTRACT_ADVANCE: PolicyInput = {
  slug: "public-contract-advance",
  title: "공공계약 선금 제도 개편: 최초 지급 30~50%로 (2026년)",
  scope:
    "2026년 2월 25일 재정경제부 '선금 제도 합리화 방안'의 최초 지급률(계약 규모별 30~50%), 누적 70% 한도, 선금 관리 강화, 개편 배경(코로나 특례 일몰, 다원시스 납품 지연)",
  ministries: ["재정경제부", "조달청"],
  categories: ["economy"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-advance",
      text: "공공기관 계약 선급금 비율을 낮춰 중소기업이 어려우니 원래대로 70%로 되돌려 달라",
      claimIds: ["claim-rate", "claim-small", "claim-background"],
    },
  ],
  claims: [
    {
      id: "claim-history",
      text:
        "선금 제도는 1997년부터 계약금액의 70% 한도로 운영됐다. 코로나19 이후 한시 특례로 한도를 100%까지 늘렸다가 2025년 특례가 끝나면서 70%로 돌아갔다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260225"],
      verified: true,
    },
    {
      id: "claim-rate",
      text:
        "구윤철 부총리 겸 재정경제부 장관은 2026년 2월 25일 '선금 제도 합리화 방안'을 발표했다. 7월부터 최초 선금은 계약금액의 30~50%를 의무 지급하고, 계약 이행이 확인되면 누적 최대 70%까지 추가로 줄 수 있다. " +
        "해외 원자재 구매처럼 필요성이 크면 발주기관 판단으로 처음부터 70%까지 줄 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260225", "src-khan-20260225"],
      verified: true,
    },
    {
      id: "claim-small",
      text:
        "최초 지급률은 계약 규모가 작을수록 높다. 공사 100억 원 이상·물품제조·용역 10억 원 이상은 최대 30%이고, 공사 20억 원 미만·물품제조·용역 3억 원 미만 소규모 계약은 50%다. 중소기업이 많은 소규모 계약을 우대한 것이라고 정부는 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260225", "src-hankyung-20260225"],
      verified: true,
    },
    {
      id: "claim-control",
      text:
        "계약상대자는 선금사용계획서를 내고 계약마다 전용계좌로 관리해야 하며, 자료를 내지 않거나 허위면 반환을 청구하고, 목적 외 사용으로 이행에 지장을 주면 계약 해지까지 할 수 있다. 업체가 원하지 않으면 발주기관이 선금을 강제로 줄 수 없게 명문화했다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260225"],
      verified: true,
    },
    {
      id: "claim-background",
      text:
        "이 대통령은 2025년 말 다원시스의 열차 납품 지연을 두고 \"국가가 사기를 당했다\"고 질타했다. 재경부 관계자는 이번 조치가 대통령 발언과 무관하지 않다면서도 코로나 이후 준비해 온 정상화 계획이라고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260225"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-announce",
      date: "2026-02-25",
      datePrecision: "day",
      title: "선금 제도 합리화 방안 발표",
      summary: "경제관계장관회의.",
      claimIds: ["claim-rate", "claim-small", "claim-background"],
    },
    {
      id: "t-apply",
      date: "2026-07",
      datePrecision: "month",
      title: "새 선금 한도·지급방식 시행",
      summary: "최초 30~50%.",
      claimIds: ["claim-rate"],
    },
  ],
  gaps: [
    "7월 시행 뒤 중소기업의 선금 수령액 변화나 자금난 실태를 보여 주는 통계는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-mt-20260225",
      title: "李 질타한 '공공계약 선금'...최초 지급률 30~50%로 낮춘다",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/economy/2026/02/25/2026022414325824106",
      publishedAt: "2026-02-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260225",
      title: "공공계약 첫 선금 30~50%만 준다",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202602252050025",
      publishedAt: "2026-02-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-20260225",
      title: "공공계약 선금한도 70% → 30~50%로",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2026022549071",
      publishedAt: "2026-02-25",
      type: "press",
      license: "link-only",
    },
  ],
};

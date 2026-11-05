import type { PolicyInput } from "./schema";

/**
 * 신용회복 지원 (연체이력 삭제, 2025~2026년).
 *
 * 2026년 11월 3일 대통령 X 게시물에 "신용불량자들의 신용을 회복시켜 달라"는 답글이 달렸다(잼통 Voice).
 * 이재명 정부가 한 신용회복 지원 — 성실 상환자의 연체이력 삭제 — 의 대상·결과와, 재연체 비판을 적는다.
 *
 * ★ 연체이력 삭제는 빚을 없애 주는 것이 아니다. 다 갚은 사람의 기록을 지운다.
 *   못 갚은 장기 연체채권을 사들여 소각·조정하는 것은 새도약기금(policy:new-leap-fund)이다.
 * ★ 2026-11-05 처음 등록 — 잼통 Voice 이슈 #215.
 */
export const CREDIT_RECOVERY: PolicyInput = {
  slug: "credit-recovery",
  title: "신용회복 지원 (연체이력 삭제, 2025~2026년)",
  scope:
    "2025년 9월 시행된 5천만 원 이하 소액 연체자 연체이력 삭제의 대상·요건, 2026년 1월 결과 발표, 재연체 비판",
  ministries: ["금융위원회"],
  categories: ["welfare", "economy"],
  asOf: "2026-11-05",
  rumors: [
    {
      id: "rumor-restore-credit",
      text: "신용불량자들의 신용을 회복시켜 달라",
      claimIds: ["claim-scheme", "claim-result", "claim-effect"],
    },
  ],
  claims: [
    {
      id: "claim-scheme",
      text:
        "금융위원회는 2025년 9월 30일부터 2020년 1월~2025년 8월 사이 5,000만 원 이하 연체(개인·개인사업자 대출)가 생긴 사람이 2025년 12월 말까지 " +
        "연체액을 모두 갚으면 신청 없이 연체이력 정보를 지웠다. 2021년과 2024년에도 같은 취지의 조치가 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20250811", "src-cr-khan-20260122"],
      verified: true,
    },
    {
      id: "claim-why",
      text:
        "연체이력은 다 갚은 뒤에도 최장 5년간 금융회사에 공유돼 금리·한도·신규 대출에 불이익을 준다. 금융위는 코로나19와 고금리로 불가피하게 연체했더라도 " +
        "성실히 갚은 서민·소상공인에게 회복 기회를 주는 조치라고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "금융위원회",
      sourceIds: ["src-khan-20250811"],
      verified: true,
    },
    {
      id: "claim-result",
      text:
        "금융위원회는 2026년 1월 22일 292만 8,000명이 지원을 받았다고 밝혔다. 개인 257만 2,000명(대상의 87%), 개인사업자 35만 6,000명(47%)이다.",
      assertionType: "CLAIM",
      assertedBy: "금융위원회",
      sourceIds: ["src-cr-khan-20260122"],
      verified: true,
    },
    {
      id: "claim-effect",
      text:
        "금융위 발표에 따르면 신용평점은 개인 평균 29점, 개인사업자 평균 45점 올랐고, 개인 3만 8,000명이 신용카드를 새로 발급받았으며 11만 명이 은행 신규 대출을 이용했다.",
      assertionType: "CLAIM",
      assertedBy: "금융위원회",
      sourceIds: ["src-cr-khan-20260122"],
      verified: true,
    },
    {
      id: "claim-relapse",
      text:
        "국민의힘 김상훈 의원실이 신용평가사 자료를 분석한 결과, 수혜자의 5.8%인 16만 9,000명이 2026년 1월 1~20일 사이에 다시 연체됐다. " +
        "2024년 조치 수혜자는 2025년 7월까지 약 33.3%(95만 5,559명)가 재연체했다.",
      assertionType: "CLAIM",
      assertedBy: "김상훈 국민의힘 의원실",
      sourceIds: ["src-mt-20260209"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-relapse"],
  timeline: [
    {
      id: "t-start",
      date: "2025-09-30",
      datePrecision: "day",
      title: "연체이력 삭제 시행",
      summary: "2025년 말까지 다 갚으면 삭제.",
      claimIds: ["claim-scheme"],
    },
    {
      id: "t-result",
      date: "2026-01-22",
      datePrecision: "day",
      title: "결과 발표",
      summary: "292만 8,000명.",
      claimIds: ["claim-result", "claim-effect"],
    },
  ],
  gaps: [
    "아직 갚지 못한 연체자를 위한 신용회복위원회 채무조정(신속채무조정·개인워크아웃)의 2026년 실적과 제도 변경은 정리하지 못했다.",
    "2026년에 추가 연체이력 삭제 조치가 있는지는 확인하지 못했다.",
    "재연체 수치는 의원실 분석이며 금융위원회의 반론은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-khan-20250811",
      title: "역대 최대 '신용사면'…소액 연체, 연내 상환 땐 '연체이력' 삭제",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202508112135005",
      publishedAt: "2025-08-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-cr-khan-20260122",
      title: "빚 다 갚은 293만명 '신용사면'…연체 이력 지워 금융거래 정상화",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202601222056005",
      publishedAt: "2026-01-22",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mt-20260209",
      title: "[단독]지난해 신용사면자 중 17만명, 올해 단 20일 만에 또 연체",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/finance/2026/02/09/2026020915053582875",
      publishedAt: "2026-02-09",
      type: "press",
      license: "link-only",
    },
  ],
};

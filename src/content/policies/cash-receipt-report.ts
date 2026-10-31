import type { PolicyInput } from "./schema";

/**
 * 현금영수증 발급 거부 신고와 제재.
 *
 * 「당장 먹을 쌀조차 없는 국민이 있다면」 답글에 "현금영수증 발급을 피하는 업소를 녹음 등 증거 없이도
 * 신고할 수 있게 하고 바로 제재해 달라"는 요청이 달렸다(잼통 Voice). 현행 신고 요건과 제재를 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #192.
 */
export const CASH_RECEIPT_REPORT: PolicyInput = {
  slug: "cash-receipt-report",
  title: "현금영수증 발급 거부 신고와 제재",
  scope: "일반가맹점·의무발행업종의 현금영수증 발급 의무 위반 제재(가산세·과태료), 신고 자격·기한과 포상금 (2026년 5월 기준)",
  ministries: ["국세청"],
  categories: ["economy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-report",
      text: "현금영수증 발급을 피하는 업소를 녹음 등 증거 없이도 신고할 수 있게 하고 바로 제재해 달라",
      claimIds: ["claim-sanction", "claim-mandatory", "claim-who", "claim-reward"],
    },
  ],
  claims: [
    {
      id: "claim-sanction",
      text: "일반가맹점이 발급 요청을 거부하면 1차에 거부 금액의 5% 가산세와 명령서, 2차부터 5% 가산세에 20% 과태료가 붙는다.",
      assertionType: "FACT",
      sourceIds: ["src-taxtimes-275271"],
      verified: true,
    },
    {
      id: "claim-mandatory",
      text:
        "전문직 등 의무발행업종은 10만 원 이상 현금 거래 때 요청이 없어도 발급해야 하며, 어기면 미발급 금액의 20% 가산세(10일 안 자진 발급 시 10%)가 붙는다.",
      assertionType: "FACT",
      sourceIds: ["src-taxtimes-275271"],
      verified: true,
    },
    {
      id: "claim-who",
      text: "발급 거부는 거래 당사자인 소비자가 5년 안에 신고할 수 있고, 의무발행업종 미발급은 소비자뿐 아니라 제3자도 신고할 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-taxtimes-275271"],
      verified: true,
    },
    {
      id: "claim-reward",
      text: "신고 포상금은 미발급 금액의 20%(5만 원 이하는 1만 원, 건당 최대 25만 원)이고 한 사람이 1년에 100만 원까지 받을 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-taxtimes-275271"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [],
  gaps: [
    "신고 때 요구되는 증빙(영수증·이체 기록 등)의 범위는 국세청 안내 원문으로 확인하지 못했다.",
    "증빙 요건을 완화하자는 제도 개선 논의는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-taxtimes-275271",
      title: "현금영수증제도, 발급자·수취자 모두에 윈윈",
      publisher: "한국세정신문",
      url: "https://taxtimes.co.kr/news/article.html?no=275271",
      publishedAt: "2026-05-26",
      type: "press",
      license: "link-only",
    },
  ],
};

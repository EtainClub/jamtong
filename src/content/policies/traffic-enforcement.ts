import type { PolicyInput } from "./schema";

/**
 * 교통 단속 기준: 이륜차 주정차 과태료 개선 주문(2026년 8월).
 *
 * 10월 말 X 게시물 답글에 "교통 정책에서도 과잉 단속을 바로잡아 달라"는 요청이 달렸다(잼통 Voice).
 * 2026년 확인되는 단속 기준 조정 사례를 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #147.
 */
export const TRAFFIC_ENFORCEMENT: PolicyInput = {
  slug: "traffic-enforcement",
  title: "교통 단속 기준: 이륜차 주정차 과태료 개선 주문",
  scope: "경찰청의 이륜차 불법 주정차 과태료 시행령 입법예고(2026년)와 청와대 비서실장의 개선 주문, 과잉 단속 논란",
  ministries: ["경찰청", "청와대"],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-overenforcement",
      text: "교통 정책에서도 과잉 단속을 바로잡아 달라",
      claimIds: ["claim-notice", "claim-kang"],
    },
  ],
  claims: [
    {
      id: "claim-notice",
      text: "경찰청은 2026년 오토바이 등 이륜차의 불법 주정차에 과태료를 물리는 도로교통법 시행령 개정안을 입법예고했고, 4천 건 넘는 의견이 접수됐다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20000329565"],
      verified: true,
    },
    {
      id: "claim-kang",
      text:
        "강훈식 대통령비서실장은 8월 19일 수석비서관회의에서 주차 공간이 부족한 채 단속에만 치중하면 배달 노동자의 생계를 외면하는 " +
        "'탁상행정'이 될 수 있다며, 경찰청에 업무 특성을 고려한 개선안을 마련하라고 주문했다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20000329565"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-kang",
      date: "2026-08-19",
      datePrecision: "day",
      title: "비서실장 개선 주문",
      summary: "이륜차 과태료 시행령.",
      claimIds: ["claim-kang"],
    },
  ],
  gaps: [
    "경찰청의 이륜차 과태료 시행령 수정안과 시행 여부는 확인하지 못했다.",
    "무인 교통단속 장비 설치 기준이나 과태료 수입 추이에 대한 2026년 정부 조치는 찾지 못했다.",
    "답글이 말하는 '과잉 단속'이 어떤 단속을 가리키는지는 답글에 나오지 않아 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-sbsbiz-20000329565",
      title: "강훈식, '이륜차 주차 과태료'에 \"탁상행정\"…개선안 마련 주문",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000329565",
      publishedAt: "2026-08-19",
      type: "press",
      license: "link-only",
    },
  ],
};

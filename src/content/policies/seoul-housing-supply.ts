import type { PolicyInput } from "./schema";

/**
 * 서울 주택 인허가 감소의 원인 논쟁과 정비사업.
 *
 * 10월 X 게시물 답글에 "서울 공급 감소는 2022년이 아니라 2018년 재건축 안전진단 강화 등 정비사업
 * 규제에서 시작됐다", "집을 사려면 허가받고 대출이 막히고 세무조사를 받는 것은 민주주의가 아니다"는
 * 말이 달렸다(잼통 Voice). 서울시의 설명과 2026년 인허가 흐름을 적는다.
 *
 * ★ 공급 감소의 원인은 서울시·정부·전문가가 서로 다르게 설명한다. 각 설명의 주체를 밝힌다.
 * ★ 대출 규제·토지거래허가구역은 policy:housing-measures에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #126.
 */
export const SEOUL_HOUSING_SUPPLY: PolicyInput = {
  slug: "seoul-housing-supply",
  title: "서울 주택 인허가 감소의 원인 논쟁과 정비사업",
  scope:
    "2018년 재건축 안전진단 강화와 2023년 완화, 2026년 1분기 서울 주택 인허가 급감 보도에 대한 서울시 설명(과거 정비구역 해제·신규 지정 중단), 정비사업 진행 현황과 2031년 착공 목표",
  ministries: ["국토교통부", "서울특별시"],
  categories: ["region", "economy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-2018",
      text: "서울 공급 감소는 2022년부터가 아니라 2018년 재건축 안전진단 강화 등 정비사업 규제에서 시작됐다",
      claimIds: ["claim-2018-rule", "claim-seoul-explain", "claim-pipeline"],
    },
    {
      id: "rumor-democracy",
      text: "집을 사려면 허가를 받고, 소득이 있어도 대출이 막히고, 집을 사면 세무조사를 받는 것은 민주주의가 아니다",
      claimIds: ["claim-seoul-explain"],
    },
  ],
  claims: [
    {
      id: "claim-seoul-explain",
      text:
        "서울시는 2026년 1분기 인허가 감소를 두고, 2011~2020년 정비구역 389곳(약 43만 호)이 해제되고 2015년부터 2021년 3월까지 " +
        "신규 재개발 지정이 2곳에 그친 결과가 누적된 것이라고 설명했다. 2025년 1분기에 대형 인허가(신림1구역 4,185호)가 몰려 " +
        "감소 폭이 커 보인다고도 했다.",
      assertionType: "CLAIM",
      assertedBy: "서울특별시",
      sourceIds: ["src-seoul-mediahub-2018058"],
      verified: true,
    },
    {
      id: "claim-pipeline",
      text:
        "서울시에 따르면 2026년 3월 기준 정비구역 지정 190곳(약 27만 2천 호), 조합설립 인가 207곳(약 17만 1천 호)이 진행 중이며, " +
        "2031년까지 31만 호 착공을 목표로 하고 있다.",
      assertionType: "CLAIM",
      assertedBy: "서울특별시",
      sourceIds: ["src-seoul-mediahub-2018058"],
      verified: true,
    },
    {
      id: "claim-2018-rule",
      text:
        "국토교통부는 2018년 3월 재건축 안전진단의 구조안전성 가중치를 50%로 높였다. 이 기준으로 안전진단을 마친 46개 단지 가운데 재건축 판정을 " +
        "받은 곳은 하나도 없었다. 정부는 2022년 12월 구조안전성 비중을 30%로 낮추는 완화안을 내 2023년 1월부터 시행했다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20221208"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-explain",
      date: "2026-05-06",
      datePrecision: "day",
      title: "서울시 인허가 급감 보도 설명자료",
      summary: "과거 정비구역 해제 누적을 원인으로 듦.",
      claimIds: ["claim-seoul-explain", "claim-pipeline"],
    },
    {
      id: "t-2018",
      date: "2018-03",
      datePrecision: "month",
      title: "재건축 안전진단 강화",
      summary: "구조안전성 가중치 50%.",
      claimIds: ["claim-2018-rule"],
    },
  ],
  gaps: [
    "2018년 안전진단 강화가 서울 주택 인허가·착공 물량에 준 영향을 수치로 따로 분석한 공식 자료는 찾지 못했다.",
    "2026년 하반기 서울 인허가·착공 누계(국토교통부 통계)는 원문으로 대조하지 못했다.",
    "토지거래허가구역·대출 규제·자금조달 조사의 범위는 이 페이지에서 다루지 않았다.",
  ],
  sources: [
    {
      id: "src-seoul-mediahub-2018058",
      title: "[설명자료] 서울 주택 인허가 62% 급감… 공급부족 더 심해진다",
      publisher: "서울특별시 미디어허브",
      url: "https://mediahub.seoul.go.kr/archives/2018058",
      publishedAt: "2026-05-06",
      type: "official",
      license: "public",
    },
    {
      id: "src-seoul-20221208",
      title: "재건축 마지막 '대못' 뽑는다…안전진단 기준 대폭 완화",
      publisher: "서울신문",
      url: "https://m.seoul.co.kr/news/2022/12/08/20221208500058",
      publishedAt: "2022-12-08",
      type: "press",
      license: "link-only",
    },
  ],
};

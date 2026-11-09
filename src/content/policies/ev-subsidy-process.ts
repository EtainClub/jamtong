import type { PolicyInput } from "./schema";

/**
 * 전기차 구매보조금 신청 절차 (2026년 지침).
 *
 * 대통령 유튜브 영상 답글에 "전기차 보조금 신청을 구매자가 직접 할 수 있도록 바꿔 달라"는 요청이 달렸다(잼통 Voice).
 * 지금 보조금이 어떤 경로로 신청·지급되는지, 2026년 지침에서 무엇이 바뀌었는지 확인된 만큼 적는다.
 *
 * ★ 신청 실무를 판매사가 대신 입력하는 관행은 블로그 안내에만 있어 claim으로 쓰지 않았다(gaps).
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #266.
 */
export const EV_SUBSIDY_PROCESS: PolicyInput = {
  slug: "ev-subsidy-process",
  title: "전기차 구매보조금 신청 절차와 2026년 지침",
  scope:
    "기후에너지환경부 '2026년 전기자동차 보급사업 보조금 업무처리지침'의 확정·개정, 보급사업 수행자(제작·수입사) 선정 제도, 지자체 공고의 신청 경로와 지급 순서",
  ministries: ["기후에너지환경부", "지방자치단체"],
  categories: ["economy", "welfare"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-direct",
      text: "전기차 보조금 신청을 구매자가 직접 할 수 있도록 바꿔 달라",
      claimIds: ["claim-flow", "claim-order", "claim-operator"],
    },
  ],
  claims: [
    {
      id: "claim-guideline",
      text:
        "기후에너지환경부는 2026년 1월 13일 '2026년 전기자동차 보급사업 보조금 업무처리지침'을 확정해 무공해차 통합누리집(ev.or.kr)에 공개했고, 6월 23일 개정본을 다시 공고했다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-20260113", "src-ev-guide"],
      verified: true,
    },
    {
      id: "claim-operator",
      text:
        "2026년 지침에는 '전기자동차 보급사업 수행자 선정' 제도가 들어갔다. 평가를 거쳐 수행자로 선정된 제작·수입사가 파는 차량이어야 보조금 대상이 되며, 평가는 6월까지 하고 7월부터 본격 시행하는 일정이었다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260113", "src-yulchon-202601"],
      verified: true,
    },
    {
      id: "claim-flow",
      text:
        "지자체 공고의 추진 절차는 '보급사업 공고 → 구매자와 제작·수입사의 구매계약 → 구매 지원신청서 접수' 순서이며, 신청은 기후에너지환경부의 무공해차 구매보조금 지원시스템(ev.or.kr)으로 한다. " +
        "서울시 2026년 하반기 추가 공고(9월 14일)는 승용차 신청을 11월 30일까지 받는다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20260914"],
      verified: true,
    },
    {
      id: "claim-order",
      text:
        "보조금은 지원신청서 접수 순서가 아니라 차량 출고·등록 순서로 지급된다. 서울시 하반기 공고 기준 지원 가능 여부 확인 요청 기한은 12월 2일, 지급 신청 기한은 12월 9일이다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20260914"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-guideline",
      date: "2026-01-13",
      datePrecision: "day",
      title: "2026년 보조금 지침 확정",
      summary: "수행자 선정 제도 도입.",
      claimIds: ["claim-guideline", "claim-operator"],
    },
    {
      id: "t-seoul",
      date: "2026-09-14",
      datePrecision: "day",
      title: "서울시 하반기 추가 공고",
      summary: "11월 30일까지 신청.",
      claimIds: ["claim-flow", "claim-order"],
    },
  ],
  gaps: [
    "구매자가 시스템에 직접 신청하지 않고 판매사·제작사가 대신 입력하는 실무는 민간 안내 글에만 나와 있어 공식 지침 원문으로 확인하지 못했다.",
    "구매자 직접 신청으로 절차를 바꾸는 방안을 정부가 검토하고 있다는 발표는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-korea-20260113",
      title: "2026년도 전기차 보조금 업무처리지침 확정",
      publisher: "기후에너지환경부(대한민국 정책브리핑)",
      url: "https://www.korea.kr/briefing/pressReleaseView.do?newsId=156739487",
      publishedAt: "2026-01-13",
      type: "official",
      license: "public",
    },
    {
      id: "src-ev-guide",
      title: "규정·가이드라인",
      publisher: "무공해차 통합누리집",
      url: "https://ev.or.kr/nportal/infoGarden/initGuideAction.do",
      type: "official",
      license: "public",
    },
    {
      id: "src-nate-20260113",
      title: "2026년도 전기차 보조금 업무처리지침 확정",
      publisher: "네이트 뉴스",
      url: "https://news.nate.com/view/20260113n28931",
      publishedAt: "2026-01-13",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-yulchon-202601",
      title: "2026년 개정 전기차 보조금 지침 안내",
      publisher: "법무법인 율촌",
      url: "https://yulchonllc.com/legal/2026/202601/Mobility&ESG/legalupdate-kor-260108/PDF/260108_YC_LU_Mobility&ESG_Kor.pdf",
      publishedAt: "2026-01-08",
      type: "research",
      license: "link-only",
    },
    {
      id: "src-seoul-20260914",
      title: "2026년도 하반기 전기자동차 민간 보급사업 추가 공고",
      publisher: "서울특별시",
      url: "https://news.seoul.go.kr/env/?p=570727",
      publishedAt: "2026-09-14",
      type: "official",
      license: "public",
    },
  ],
};

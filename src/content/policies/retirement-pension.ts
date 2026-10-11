import type { PolicyInput } from "./schema";

/**
 * 퇴직연금 의무화와 퇴직금 일시 수령.
 *
 * "퇴직금 일시 수령이 폐지된다", "정부가 퇴직금을 대신 관리해 바로 못 받는다"는 글이
 * 돈다. 2025년 6월 노동부가 국정기획위원회에 보고한 초기 안에는 퇴직금·퇴직연금을
 * 퇴직연금으로 단일화하는 방안이 실제로 있었다. 그러나 2026년 2월 노사정 합의는
 * 일시금 수령을 그대로 보장한다고 밝혔다. 두 시점을 섞으면 어느 쪽으로도 틀린다.
 *
 * ★ 2026-10-11 기준 의무화 법안은 국회에서 논의 중이다. 확정된 법이 아니다.
 * ★ 2026-10-11 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #2.
 */
export const RETIREMENT_PENSION: PolicyInput = {
  slug: "retirement-pension",
  title: "퇴직연금 의무화와 퇴직금 일시 수령",
  scope: "퇴직연금 전 사업장 의무화 논의의 단계별 내용, 일시금 수령 여부, 기금형 운용 주체",
  ministries: ["고용노동부"],
  categories: ["welfare", "institution"],
  asOf: "2026-10-11",
  rumors: [
    {
      id: "rumor-lump-sum-abolished",
      text: "이재명 정부가 퇴직금 일시 수령제를 폐지해 연금으로만 받게 된다",
      claimIds: ["claim-2025-report", "claim-tripartite-lump-sum", "claim-bill-status"],
    },
    {
      id: "rumor-government-holds",
      text: "퇴직금이 연금으로 바뀌면 정부가 대신 관리해 국민은 바로 받을 수 없다",
      claimIds: ["claim-tripartite-lump-sum", "claim-fund-type", "claim-operator-debate"],
    },
  ],
  claims: [
    {
      id: "claim-2025-report",
      text:
        "고용노동부는 2025년 6월 국정기획위원회에 퇴직연금을 300인 이상 사업장부터 5단계로 " +
        "전 사업장에 의무화하고, 퇴직금과 퇴직연금으로 나뉜 퇴직급여를 퇴직연금으로 단일화하는 " +
        "방안을 보고했다고 보도됐다. 단일화하면 일시금 퇴직금은 사라진다는 내용이었다. " +
        "퇴직연금공단 신설과 수급 요건을 근속 1년에서 3개월로 낮추는 방안도 들어 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-sbs-20250624"],
      verified: true,
    },
    {
      id: "claim-tripartite",
      text:
        "노사정 '퇴직연금제도 기능 강화를 위한 노사정 TF'는 2026년 2월 6일 공동선언문을 " +
        "발표했다. 퇴직급여를 회사 밖에 적립(사외적립)하는 것을 모든 사업장에 의무화하되 " +
        "사업장 규모에 따라 단계적으로 시행하고, 구체적인 단계와 시기는 영세·중소기업 " +
        "실태조사 뒤 정하기로 했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260206"],
      verified: true,
    },
    {
      id: "claim-tripartite-lump-sum",
      text:
        "노동부는 의무화 뒤에도 기존 일시금 수령 방식이 그대로 보장되며, 일시금을 받지 " +
        "못한다는 오해를 합의문에 명확히 반영했다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "고용노동부",
      sourceIds: ["src-newsis-20260206"],
      verified: true,
    },
    {
      id: "claim-fund-type",
      text:
        "합의는 노사가 조성한 기금을 수탁법인이 운용하는 기금형 퇴직연금을 확정기여(DC)형에 " +
        "도입하되, 기존 계약형을 대체하지 않고 병행하기로 했다. 수탁법인은 민간 금융사가 " +
        "세우는 개방형, 여러 사용자가 함께 세우는 연합형 등이다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260206"],
      verified: true,
    },
    {
      id: "claim-small-business-fund",
      text:
        "국회는 2026년 2월 12일 근로자퇴직급여 보장법 개정안을 통과시켜 중소기업퇴직연금기금 " +
        "가입 대상을 상시근로자 30명 이하에서 100명 미만 사업장으로 넓혔다. 2026년 7월부터 " +
        "50명 미만, 2027년 1월부터 100명 미만이 대상이다.",
      assertionType: "FACT",
      sourceIds: ["src-straight-20260212"],
      verified: true,
    },
    {
      id: "claim-bill-status",
      text:
        "2026년 10월 7일 보도 기준, 의무화·기금형 도입 법안은 여당 의원들이 잇따라 발의해 " +
        "국회에서 논의 중이고 정부안은 마무리 단계로 전해졌다. 의무화 시행 시기는 아직 " +
        "확정되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20261007"],
      verified: true,
    },
    {
      id: "claim-operator-debate",
      text:
        "기금형의 운용 주체는 의원안마다 다르다. 노사 참여 비영리 수탁법인(한정애 의원안), " +
        "민간 전문운용사 경쟁(안도걸 의원안), 노동부 산하 퇴직연금공단 신설(박홍배·안호영 " +
        "의원안), 국민연금공단 등 기존 공적기관 참여 허용(이용우 의원안)이 함께 올라와 있다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20261007"],
      verified: true,
    },
    {
      id: "claim-severance-decline",
      text:
        "노동부 관계자는 퇴직금 제도가 사양길에 접어드느냐는 질문에 '점점 그렇게 될 것'이라고 " +
        "답했다. 일시금 수령은 보장하더라도 퇴직금 제도 자체의 비중은 줄어든다는 뜻이다.",
      assertionType: "CLAIM",
      assertedBy: "고용노동부 관계자",
      sourceIds: ["src-newsis-20260206"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-severance-decline", "claim-operator-debate"],
  timeline: [
    {
      id: "t-2025-report",
      date: "2025-06-24",
      datePrecision: "day",
      title: "노동부, 국정기획위에 단일화 방안 보고 (보도)",
      summary: "퇴직금·퇴직연금 단일화, 5단계 의무화.",
      claimIds: ["claim-2025-report"],
    },
    {
      id: "t-tripartite",
      date: "2026-02-06",
      datePrecision: "day",
      title: "노사정 공동선언",
      summary: "사외적립 의무화, 일시금 수령 보장, 기금형 병행.",
      claimIds: ["claim-tripartite", "claim-tripartite-lump-sum", "claim-fund-type"],
    },
    {
      id: "t-sme-fund",
      date: "2026-02-12",
      datePrecision: "day",
      title: "중소기업퇴직연금기금 대상 확대법 통과",
      summary: "30명 이하 → 100명 미만.",
      claimIds: ["claim-small-business-fund"],
    },
    {
      id: "t-bills",
      date: "2026-10-07",
      datePrecision: "day",
      title: "기금형 법안 국회 논의 중",
      summary: "운용 주체가 쟁점.",
      claimIds: ["claim-bill-status", "claim-operator-debate"],
    },
  ],
  gaps: [
    "노사정 공동선언문 원문과 노동부 보도자료를 직접 확인하지 못했다. 일시금 보장은 보도에 인용된 노동부 설명이다.",
    "정부 법안(근로자퇴직급여 보장법 개정안)이 국회에 제출됐는지, 일시금 선택권을 조문에 어떻게 적었는지 의안정보시스템으로 확인하지 못했다.",
    "노동부가 2026년 7월까지 내겠다고 한 세부 의무화 계획(단계·시기)이 발표됐는지 확인하지 못했다.",
    "일시금으로 받을 때와 연금으로 받을 때의 퇴직소득세 차이는 다루지 않았다.",
  ],
  sources: [
    {
      id: "src-sbs-20250624",
      title: "정부, 퇴직연금 전 사업장 의무화·'일시금 없는' 연금화 검토",
      publisher: "SBS",
      url: "https://news.sbs.co.kr/news/endPage.do?news_id=N1008150185",
      publishedAt: "2025-06-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260206",
      title: "퇴직연금 의무화·기금형 도입 합의…\"일시금 수령 가능\"(종합)",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260206_0003505242",
      publishedAt: "2026-02-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-straight-20260212",
      title: "중소기업 퇴직연금 대상 대폭 확대…근로자퇴직급여법 개정",
      publisher: "스트레이트뉴스",
      url: "https://www.straightnews.co.kr/news/articleView.html?idxno=295006",
      publishedAt: "2026-02-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261007",
      title: "기금형 퇴직연금 입법 속도…'운용주체' 쟁점",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202610071820472692",
      publishedAt: "2026-10-07",
      type: "press",
      license: "link-only",
    },
  ],
};

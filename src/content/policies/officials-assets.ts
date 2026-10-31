import type { PolicyInput } from "./schema";

/**
 * 고위공직자 재산 변동과 재산심사 제도.
 *
 * 「당장 먹을 쌀조차 없는 국민이 있다면」 답글에 "증세를 연구하기 전에 고위 공직자의 재산 급증부터
 * 막아야 한다"는 말이 달렸다(잼통 Voice). 2026년 정기 재산공개 결과와 심사 강화안을 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #139.
 */
export const OFFICIALS_ASSETS: PolicyInput = {
  slug: "officials-assets",
  title: "고위공직자 재산 변동과 재산심사 제도",
  scope:
    "2026년 3월 정부공직자윤리위원회 정기 재산공개(1,903명) 결과와 증가 요인, 2026년 하반기 가상자산·비상장주식·단일종목 ETF 심사 강화안, 부동산 백지신탁 논의",
  ministries: ["인사혁신처"],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-assets",
      text: "서민을 위한다면서 증세를 연구하기 전에 고위 공직자의 재산 급증부터 막아야 한다",
      claimIds: ["claim-2026-disclosure", "claim-screening", "claim-real-estate"],
    },
  ],
  claims: [
    {
      id: "claim-2026-disclosure",
      text:
        "정부공직자윤리위원회가 2026년 3월 26일 공개한 재산공개 대상자 1,903명의 평균 재산은 20억 9,563만 원으로 직전보다 약 " +
        "1억 4,870만 원 늘었고, 76.1%(1,449명)의 재산이 증가했다. 증가분의 26.4%는 공시가격·공시지가 상승에 따른 가액 변동이었다.",
      assertionType: "FACT",
      sourceIds: ["src-mpm-2026-disclosure"],
      verified: false,
    },
    {
      id: "claim-screening",
      text:
        "인사혁신처는 8월 업무보고에서 해외 계좌·차명 거래가 의심되는 가상자산 심사를 강화하고, 단일종목 ETF도 재산공개 대상에 넣어 " +
        "직무 관련 ETF가 3천만 원을 넘으면 백지신탁 대상으로 하겠다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-6251090"],
      verified: true,
    },
    {
      id: "claim-real-estate",
      text:
        "주식은 3천만 원을 넘으면 백지신탁 심사를 받지만 부동산은 백지신탁 제도가 없다. 인사혁신처는 처분권 제한이 기본권 침해 소지가 " +
        "크다는 입장을 밝혀 왔다.",
      assertionType: "FACT",
      sourceIds: ["src-newstapa-t9u8e"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-real-estate"],
  timeline: [
    {
      id: "t-disclosure",
      date: "2026-03-26",
      datePrecision: "day",
      title: "2026년 정기 재산공개",
      summary: "평균 20억 9,563만 원.",
      claimIds: ["claim-2026-disclosure"],
    },
    {
      id: "t-report",
      date: "2026-08-05",
      datePrecision: "day",
      title: "인사혁신처 업무보고",
      summary: "가상자산·ETF 심사 강화.",
      claimIds: ["claim-screening"],
    },
  ],
  gaps: [
    "재산 증가가 큰 공직자에 대한 소명 요구·징계 실적은 찾지 못했다.",
    "부동산 백지신탁 도입 법안의 국회 상황은 확인하지 못했다.",
    "인사혁신처 재산공개 보도자료 원문(PDF)은 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-mpm-2026-disclosure",
      title: "2026년 정기 재산변동사항 공개 (정부공직자윤리위원회)",
      publisher: "인사혁신처",
      url: "https://www.mpm.go.kr/board/file/bbs_0000000000000029/4229/FILE_000000100065915/b974a7e122ea450cf759b1c840d5edb1",
      publishedAt: "2026-03-26",
      type: "official",
      license: "public",
    },
    {
      id: "src-news1-6251090",
      title: "고위공직자 가상자산·비상장주식 심사 강화…단일종목 ETF도 재산공개",
      publisher: "뉴스1",
      url: "https://www.news1.kr/amp/politics/pm-bai-comm/6251090",
      publishedAt: "2026-08-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstapa-t9u8e",
      title: "[현장에서] \"강남 아파트 가진 사람이 정책 만든다\"…부동산 백지신탁제, 다시 꺼내든 이유",
      publisher: "뉴스타파",
      url: "https://newstapa.org/article/T9U8E",
      type: "press",
      license: "link-only",
    },
  ],
};

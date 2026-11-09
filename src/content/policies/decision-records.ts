import type { PolicyInput } from "./schema";

/**
 * 정책 결정 회의의 기록: 레버리지 ETF 간담회 회의록 미작성, 전남광주 반도체 회의 결과보고서 부재 (2026년 10~11월).
 *
 * 대통령 유튜브 영상 답글에 "광주·전남 통합, 반도체 클러스터, 레버리지 ETF 같은 결정의 회의록이 없다니 일 처리가 주먹구구식"이라는
 * 비판이 달렸다(잼통 Voice). 어느 회의의 기록이 없다고 확인됐는지, 누가 확인했는지 사안별로 나눠 적는다.
 *
 * ★ 두 사안은 주체가 다르다. ETF는 청와대 간담회(국정감사 서면 답변), 반도체는 전남광주통합특별시(시의회 행정사무감사)다. 한데 묶어 쓰지 않는다.
 * ★ 레버리지 ETF 도입 경위는 policy:single-stock-leverage-etf, 호남 반도체는 policy:honam-chip-cluster에 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #240.
 */
export const DECISION_RECORDS: PolicyInput = {
  slug: "decision-records",
  title: "정책 결정 회의의 기록: 레버리지 ETF 간담회와 전남광주 반도체 사업",
  scope:
    "2026년 1월 13일 청와대 비공개 간담회(단일종목 레버리지 ETF)의 회의록 미작성 답변, 전남광주통합특별시 반도체산업지원실의 회의 결과보고서 부재 지적",
  ministries: ["청와대", "금융위원회", "전남광주통합특별시"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-no-minutes",
      text: "광주·전남 통합, 반도체 클러스터, 레버리지 ETF 같은 결정의 회의록이 없다니 일 처리가 주먹구구식이다",
      claimIds: ["claim-etf-minutes", "claim-etf-apology", "claim-chip-records"],
    },
  ],
  claims: [
    {
      id: "claim-etf-minutes",
      text:
        "청와대는 국민의힘 김재섭 의원에게 낸 서면 답변에서 김용범 당시 정책실장이 2026년 1월 13일 주재한 단일종목 레버리지 ETF 관련 간담회에 대해 \"비공개 간담회로 회의록은 작성하지 않았다\"고 밝혔다. " +
        "야당은 이 간담회를 상품 도입의 출발점으로 지목했다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20261106"],
      verified: true,
    },
    {
      id: "claim-etf-apology",
      text:
        "하준경 청와대 정책실장은 10월 29일 국회 운영위원회 국정감사에서 이 문제에 사과하면서도, 상품 도입의 최종 결정은 청와대가 아니라 금융위원회가 했다고 밝혔다. " +
        "금융감독원 집계로 출시일부터 8월 14일까지 개인투자자 손실은 6조 3,130억 원이었다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20261106", "src-etoday-2634114"],
      verified: true,
    },
    {
      id: "claim-chip-records",
      text:
        "전남광주통합특별시의회 임종국 의원은 11월 행정사무감사에서 반도체산업지원실이 시민참여형 홍보·토크콘서트를 추진하면서도 회의운영비·행사홍보비 세부 지출 내역과 회의 결과 보고서가 없다고 지적했다. " +
        "중앙부처 대상 제도개선 건의 실적도 '해당 없음'이었다.",
      assertionType: "FACT",
      sourceIds: ["src-newscj-3445978"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-etf-minutes", "claim-chip-records"],
  timeline: [
    {
      id: "t-meeting",
      date: "2026-01-13",
      datePrecision: "day",
      title: "청와대 비공개 간담회(회의록 없음)",
      summary: "레버리지 ETF 관련.",
      claimIds: ["claim-etf-minutes"],
    },
    {
      id: "t-audit",
      date: "2026-10-29",
      datePrecision: "day",
      title: "운영위 국감, 정책실장 사과",
      summary: "최종 결정은 금융위.",
      claimIds: ["claim-etf-apology"],
    },
    {
      id: "t-chip",
      date: "2026-11-04",
      datePrecision: "day",
      title: "전남광주 시의회 행정사무감사 지적",
      summary: "회의 결과보고서 부재.",
      claimIds: ["claim-chip-records"],
    },
  ],
  gaps: [
    "광주·전남 행정통합 결정 과정의 회의록이 없다는 공식 확인이나 보도는 찾지 못했다.",
    "비공개 간담회에 회의록 작성 의무가 있는지(공공기록물법 시행령의 회의록 작성 대상 해당 여부)는 법령 원문으로 확인하지 못했다.",
    "금융위원회의 레버리지 ETF 도입 결정 회의 기록이 있는지는 공개되지 않았다.",
  ],
  sources: [
    {
      id: "src-hankyung-20261106",
      title: "장성철 \"다 공개한다면서 레버리지 ETF는 왜 공개 안 하냐\"",
      publisher: "한국경제",
      url: "https://hankyung.com/article/202611069928H",
      publishedAt: "2026-11-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-2634114",
      title: "레버리지 ETF 투자자 보호 공방⋯종목 제한ㆍ삼성증권 발언 도마 [국감]",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2634114",
      publishedAt: "2026-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newscj-3445978",
      title: "전남광주 반도체 클러스터 '페이퍼 행정' 도마… 대정부 건의 0건",
      publisher: "천지일보",
      url: "https://www.newscj.com/news/articleView.html?idxno=3445978",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
  ],
};

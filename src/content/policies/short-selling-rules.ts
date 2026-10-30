import type { PolicyInput } from "./schema";

/**
 * 공매도·물적분할 등 개인 투자자 보호 제도의 현재.
 *
 * 잠재성장률 글(10월 20일) 답글에 "공매도·대차거래, D+2 결제, 대주주 블록딜·물적분할처럼
 * 개인 투자자에게 불리한 제도를 고쳐 달라"는 요청이 달렸다(잼통 Voice). 지금 무엇이 이미
 * 바뀌어 있고 무엇이 그대로인지 적는다.
 *
 * ★ 상장폐지 요건은 policy:delisting-reform에 따로 있다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #86.
 */
export const SHORT_SELLING_RULES: PolicyInput = {
  slug: "short-selling-rules",
  title: "공매도·물적분할 등 개인 투자자 보호 제도의 현재",
  scope:
    "2025년 3월 공매도 전면 재개 때 바뀐 대차·대주 조건과 불법 공매도 중앙점검시스템(NSDS) 1년 성과, 2025년 7월 상법 개정(이사 충실의무 주주 확대), 물적분할 자회사 상장 때 일반주주 보호 장치",
  ministries: ["금융위원회", "한국거래소", "법무부"],
  categories: ["economy"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-rules",
      text: "공매도·대차거래, D+2 결제, 대주주 블록딜·물적분할처럼 개인 투자자에게 불리한 제도를 고쳐 달라",
      claimIds: ["claim-equal-terms", "claim-nsds", "claim-commercial-act", "claim-split"],
    },
  ],
  claims: [
    {
      id: "claim-equal-terms",
      text:
        "금융당국은 2025년 3월 31일 공매도를 전면 재개하면서 공매도 목적의 대차(기관)와 대주(개인)의 상환기간을 " +
        "90일(연장 포함 최대 12개월)로, 담보비율을 105%로 맞췄다. 그 전에는 개인 대주의 담보비율(120%)과 상환 " +
        "조건이 기관보다 불리하다는 지적이 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-blockmedia-409365", "src-ajunews-20241121"],
      verified: false,
    },
    {
      id: "claim-nsds",
      text:
        "한국거래소의 불법 공매도 중앙점검시스템(NSDS)은 2025년 3월 31일 가동됐다. 1년간 전체 공매도 거래대금의 " +
        "91.3%를 상시 점검했고, 위반 의심 거래 76건을 금융당국에 통보했다. 거래소는 대부분이 기관의 시스템 오류나 " +
        "단순 실수였다고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-metro-20260330"],
      verified: true,
    },
    {
      id: "claim-commercial-act",
      text:
        "상법 개정안이 2025년 7월 3일 국회 본회의를 여야 합의로 통과했다. 이사의 충실의무 대상을 '회사'에서 '회사 및 " +
        "주주'로 넓혀 공포 즉시 시행했고, 대규모 상장회사의 전자주주총회 병행은 2027년 1월부터 의무가 된다. 감사위원 " +
        "선임 때의 '3% 룰'을 넓히고, 사외이사를 '독립이사'로 바꾸며 의무 선임 비율을 4분의 1에서 3분의 1로 올리는 " +
        "내용은 1년 유예 뒤 시행한다. 집중투표제 의무화는 빠졌다.",
      assertionType: "FACT",
      sourceIds: ["src-shinkim-2889"],
      verified: true,
    },
    {
      id: "claim-split",
      text:
        "물적분할 자회사 상장과 관련해서는 2022년 금융위원회 방안으로 상장사가 물적분할에 반대하는 주주에게 " +
        "주식매수청구권을 주고, 분할 때 주주 보호 정책을 설명하게 했다. 충실의무 확대 뒤로는 물적분할로 일반주주가 " +
        "손해를 보면 이사의 책임을 물을 근거가 넓어졌다는 해석이 나온다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-shinkim-1901", "src-shinkim-2889"],
      verified: false,
    },
    {
      id: "claim-critique",
      text:
        "공매도 조건을 맞춘 뒤에도 개인은 빌릴 수 있는 주식의 양과 종목이 기관보다 적어 형평성 논란이 남아 있다는 " +
        "지적이 이어진다.",
      assertionType: "OPINION",
      sourceIds: ["src-blockmedia-409365"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-reopen",
      date: "2025-03-31",
      datePrecision: "day",
      title: "공매도 전면 재개, NSDS 가동",
      summary: "대차·대주 조건 일원화.",
      claimIds: ["claim-equal-terms", "claim-nsds"],
    },
    {
      id: "t-act",
      date: "2025-07-03",
      datePrecision: "day",
      title: "상법 개정안 국회 통과",
      summary: "이사 충실의무 '회사 및 주주'로.",
      claimIds: ["claim-commercial-act"],
    },
    {
      id: "t-nsds-year",
      date: "2026-03-30",
      datePrecision: "day",
      title: "NSDS 1년, 위반 의심 76건",
      summary: "거래대금 91.3% 상시 점검.",
      claimIds: ["claim-nsds"],
    },
  ],
  gaps: [
    "주식 결제주기(현재 거래일+2일)를 앞당기는 논의가 정부 안에 있는지는 찾지 못했다.",
    "대주주 블록딜(시간외 대량매매)을 미리 공시하게 하는 제도의 추진 현황은 확인하지 못했다.",
    "2026년 들어 공매도 제도를 추가로 바꾸겠다는 금융위원회 발표는 찾지 못했다.",
    "대차·대주 조건 일원화는 2024년 입법예고와 보도로 확인했고, 시행 규정 원문과는 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-blockmedia-409365",
      title: "공매도, 개인·기관 거래 조건 통일... \"개인에게 유리해졌다\"",
      publisher: "블록미디어",
      url: "https://www.blockmedia.co.kr/archives/409365",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ajunews-20241121",
      title: "금융당국, 공매도 대차상환기간 통일·잔고관리 위반 제재 등 하위법규 개정 입법예고",
      publisher: "아주경제",
      url: "https://www.ajunews.com/view/20241121104532106",
      publishedAt: "2024-11-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-metro-20260330",
      title: "공매도 중앙점검시스템 1년…거래 91% 상시 점검, 위반 의심 76건 적발",
      publisher: "메트로신문",
      url: "https://www.metroseoul.co.kr/article/20260330500662",
      publishedAt: "2026-03-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-shinkim-2889",
      title: "이재명 정부 ‘더 세진’ 상법 개정안 본회의 통과 - 지배구조 리스크 점검의 골든타임",
      publisher: "법무법인 세종",
      url: "https://shinkim.com/kor/media/newsletter/2889",
      publishedAt: "2025-07-03",
      type: "research",
      license: "link-only",
    },
    {
      id: "src-shinkim-1901",
      title: "물적분할 후 자회사 상장시 주주 보호 방안 관련",
      publisher: "법무법인 세종",
      url: "https://shinkim.com/kor/media/newsletter/1901",
      publishedAt: "2022-09",
      type: "research",
      license: "link-only",
    },
  ],
};

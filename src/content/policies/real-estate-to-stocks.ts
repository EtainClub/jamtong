import type { PolicyInput } from "./schema";

/**
 * 부동산 자금의 증시 이동('머니무브') 정책 기조.
 *
 * Voice 방문자가 "부동산 자금의 증시 이동 정책" 자료를 요청했다(잼통 Voice). 대통령이 이 방향을
 * 밝힌 발언과, 실제 자금 흐름에 관한 통계·반론을 적는다.
 *
 * ★ '머니무브'는 하나의 법이나 사업이 아니라 정책 기조다. 대통령 발언과 금융당국 발언을 날짜별로 적는다.
 * ★ 자금 흐름 통계는 의원실이 국토교통부 자료를 집계한 것이다. 집계 주체를 밝힌다.
 * ★ 2026-11-05 처음 등록 — 잼통 Voice 이슈 #217.
 */
export const REAL_ESTATE_TO_STOCKS: PolicyInput = {
  slug: "real-estate-to-stocks",
  title: "부동산 자금의 증시 이동('머니무브') 정책 기조",
  scope:
    "부동산에서 자본시장으로 자금을 옮기겠다는 대통령 발언(2025년 7월, 2026년 1·2월)과 금융당국 발언(2026년 9월), 주식·채권 매각대금의 주택 매입 유입 통계",
  ministries: ["금융위원회", "금융감독원", "국토교통부"],
  categories: ["economy"],
  asOf: "2026-11-05",
  rumors: [],
  claims: [
    {
      id: "claim-2025-07",
      text:
        "이 대통령은 2025년 7월 1일 국무회의 모두발언에서 \"투자 수단이 주택 또는 부동산으로 한정되다 보니까 자꾸 주택이 투자 수단 또는 투기 수단이 되면서 주거 불안정을 초래해 왔다\"며 " +
        "부동산을 대체할 투자 수단으로 주식을 들었다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20250701"],
      verified: true,
    },
    {
      id: "claim-2026-01",
      text:
        "2026년 1월 27일 국무회의에서는 \"부동산에 비정상적으로 집중된 우리 사회의 자원 배분 왜곡을 반드시 바로 잡아야 한다\"고 했고, " +
        "\"자본시장 정상화를 발목 잡는 여러 가지 불합리한 제도도 계속해서 신속하게 개선해 생산적 금융으로의 전환을 한층 가속해야 하겠다\"고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-20260127"],
      verified: true,
    },
    {
      id: "claim-2026-02",
      text:
        "코스피가 처음 6000선을 넘은 2026년 2월 25일, 이 대통령은 민주당 상임고문단 오찬에서 부동산에 묶여 있던 자금이 자본시장으로 들어오는 흐름을 \"매우 자연스럽고 고무적인 현상\"이라고 평가했다.",
      assertionType: "FACT",
      sourceIds: ["src-alpha-20260225"],
      verified: true,
    },
    {
      id: "claim-fss",
      text:
        "이찬진 금융감독원장은 2026년 9월 21일 국민금융포럼에서 \"안정성을 강조한 자본 규제가 자금 흐름을 기업금융에서 주택담보대출 중심으로 편중시켰다\"며 부동산 쏠림 완화 기조를 유지하고, " +
        "생산적 금융을 위해 위험자산 가중치 등 규제 근거를 합리화하는 작업을 하고 있다고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-kmib-20260921"],
      verified: true,
    },
    {
      id: "claim-reverse-flow",
      text:
        "국민의힘 김종양 의원실이 국토교통부 자금조달계획서를 집계한 결과, 2026년 1~4월 주식·채권 매각대금 약 3조 7,255억 원이 주택 매입에 쓰였고 그중 65.5%가 서울, 특히 강남·송파·서초구에 몰렸다.",
      assertionType: "CLAIM",
      assertedBy: "김종양 국민의힘 의원실",
      sourceIds: ["src-fnnews-20260614"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-reverse-flow"],
  timeline: [
    {
      id: "t-2025-07",
      date: "2025-07-01",
      datePrecision: "day",
      title: "\"부동산 대체 투자 수단은 주식\"",
      summary: "국무회의 모두발언.",
      claimIds: ["claim-2025-07"],
    },
    {
      id: "t-2026-01",
      date: "2026-01-27",
      datePrecision: "day",
      title: "\"자원 배분 왜곡 바로잡아야\"",
      summary: "국무회의 모두발언.",
      claimIds: ["claim-2026-01"],
    },
    {
      id: "t-2026-02",
      date: "2026-02-25",
      datePrecision: "day",
      title: "코스피 6000 돌파, \"고무적 현상\"",
      summary: "상임고문단 오찬.",
      claimIds: ["claim-2026-02"],
    },
  ],
  gaps: [
    "부동산에서 증시로 실제로 얼마가 옮겨 갔는지 보여 주는 공식 통계는 찾지 못했다. 투자자 예탁금 증가만으로는 출처를 알 수 없다.",
    "주식 매각대금의 주택 유입 통계는 1~4월 집계만 기사로 확인했다. 1~9월 약 9조 3천억 원이라는 수치는 칼럼에서만 보았다.",
    "자본시장 활성화 개별 제도(상법 개정, 배당소득 분리과세 등)는 이 페이지에서 정리하지 않았다.",
  ],
  sources: [
    {
      id: "src-hankyung-20250701",
      title: "이재명 대통령 \"'부동산' 대체 투자 수단은 '주식'\"",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2025070111777",
      publishedAt: "2025-07-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-20260127",
      title: "이 대통령 \"부동산에 집중된 자원 배분 왜곡 반드시 바로잡아야\"",
      publisher: "뉴스1",
      url: "https://m.news.nate.com/view/20260127n29870",
      publishedAt: "2026-01-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-alpha-20260225",
      title: "李 대통령 \"부동산 자금 자본시장 유입…매우 자연스럽고 고무적인 현상\"",
      publisher: "알파경제",
      url: "https://m.news.nate.com/view/20260225n38165",
      publishedAt: "2026-02-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kmib-20260921",
      title: "\"부동산에서 주식·펀드로 머니무브… 금융 활성화 위해 규제 완화\"",
      publisher: "국민일보",
      url: "https://www.kmib.co.kr/article/view.asp?arcid=9000014176&code=11151100&sid1=eco",
      publishedAt: "2026-09-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20260614",
      title: "\"주식 팔아 강남 집 샀다\"…4개월간 3.7조원 주택시장 유입",
      publisher: "파이낸셜뉴스(연합뉴스)",
      url: "https://www.fnnews.com/news/202606140602140193",
      publishedAt: "2026-06-14",
      type: "press",
      license: "link-only",
    },
  ],
};

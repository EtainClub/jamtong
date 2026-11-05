import type { PolicyInput } from "./schema";

/**
 * 국토보유세·토지 공개념과 이재명 정부의 보유세 정책.
 *
 * 2026년 11월 3일 대통령 X 게시물에 "토지는 소유가 아니라 모든 국민이 사용권 지분을 갖게 하고,
 * 그 임대 수익을 국민기본소득으로 나눠야 한다"는 답글이 달렸다(잼통 Voice). 이 대통령이 예전에
 * 내건 국토보유세가 지금 어떤 처지인지, 정부가 실제로 내놓은 보유세 개편이 무엇인지 적는다.
 *
 * ★ 국토보유세(모든 토지에 매기는 새 세금)와 종부세 개편(있는 세금 조정)은 다르다.
 * ★ 답글의 제안(토지 사용권 지분제)은 정부가 검토한 적이 확인되지 않는다(gaps).
 * ★ 종부세 개편의 세부와 공약 비교는 policy:housing-pledge-vs-policy에 있다.
 * ★ 2026-11-05 처음 등록 — 잼통 Voice 이슈 #214.
 */
export const LAND_HOLDING_TAX: PolicyInput = {
  slug: "land-holding-tax",
  title: "국토보유세·토지 공개념과 정부의 보유세 정책",
  scope:
    "이 대통령의 예전 국토보유세 공약, 21대 대선에서 빠진 경위, 2026년 7월 부동산 토론회의 보유세 발언, 2026년 세제개편안의 종합부동산세 개편",
  ministries: ["재정경제부", "행정안전부"],
  categories: ["economy"],
  asOf: "2026-11-05",
  rumors: [
    {
      id: "rumor-land-dividend",
      text: "토지는 소유가 아니라 모든 국민이 사용권 지분을 갖게 하고, 그 임대 수익을 국민기본소득으로 나눠야 한다",
      claimIds: ["claim-history", "claim-2025-pledge", "claim-2026-reform"],
    },
  ],
  claims: [
    {
      id: "claim-history",
      text:
        "국토보유세는 모든 토지에 일괄 부과하는 세금으로, 고가 부동산에 매기는 종합부동산세와 다르다. 이 대통령은 2017년 민주당 경선과 20대 대선에서 " +
        "세수를 기본소득 재원으로 쓰는 '기본소득형 국토보유세'를 공약으로 내걸었다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-20260711"],
      verified: true,
    },
    {
      id: "claim-2025-pledge",
      text:
        "2025년 21대 대선에서는 국토보유세를 공약으로 제시하지 않았다. 당시 이 후보는 \"경제 상황이 어려운 만큼 국민에게 부담을 전가하는 증세는 바람직하지 않다\"며 " +
        "국토보유세·탄소세 같은 신규 세금은 도입하지 않겠다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-20260711", "src-taxwatch-20250514"],
      verified: true,
    },
    {
      id: "claim-2026-debate",
      text:
        "이 대통령은 2026년 7월 23일 부동산정책 국민 대토론회에서 \"보유세를 강화해야 한다는 데는 대체적으로 동의한다\"면서 \"어느 범위에서 어느 정도로 강화할지, 어떤 차등을 둘지가 중요하다\"고 말했다. " +
        "\"실거주 용도일 경우에는 감해주고\", \"호화주택·다주택·명백한 투기용 주택이면 가중 요소가 될 수 있다\"고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260723"],
      verified: true,
    },
    {
      id: "claim-2026-reform",
      text:
        "정부가 2026년 8월 3일 확정한 세제개편안은 새 토지세가 아니라 종합부동산세 개편이다. 주택분 종부세를 주택 수가 아닌 가격 기준으로 바꾸고, " +
        "거주 1세대 1주택 기본공제를 12억 원에서 14억 원으로 올리며, 공정시장가액비율을 60%에서 70%(3주택 이상·조정지역 2주택은 80%까지)로 단계적으로 올린다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20260803"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-2025-pledge",
      date: "2025-05",
      datePrecision: "month",
      title: "21대 대선 공약에서 국토보유세 제외",
      summary: "신규 세금 도입 않겠다고 밝힘.",
      claimIds: ["claim-2025-pledge"],
    },
    {
      id: "t-debate",
      date: "2026-07-23",
      datePrecision: "day",
      title: "부동산정책 국민 대토론회",
      summary: "보유세 강화와 차등 언급.",
      claimIds: ["claim-2026-debate"],
    },
    {
      id: "t-reform",
      date: "2026-08-03",
      datePrecision: "day",
      title: "2026년 세제개편안 확정",
      summary: "종부세 가격 기준 개편.",
      claimIds: ["claim-2026-reform"],
    },
  ],
  gaps: [
    "대통령이 취임 뒤 '국토보유세'라는 이름을 직접 언급하거나 공식 철회한 발언은 찾지 못했다.",
    "토지 공개념을 헌법에 넣는 문제에 대한 현 정부 입장은 확인하지 못했다.",
    "답글이 제안한 '토지 사용권 지분제'를 정부가 검토한 기록은 찾지 못했다.",
    "세제개편안이 국회에서 어떻게 처리됐는지는 이 페이지 기준일까지 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-asiae-20260711",
      title: "부동산 세제 백가쟁명 여는 李, 국토보유세 다시 꺼내나",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026071101280605994",
      publishedAt: "2026-07-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-taxwatch-20250514",
      title: "\"증세 없다\" 외친 여야…세금 공약, 어떻게 다를까?",
      publisher: "택스워치",
      url: "https://www.taxwatch.co.kr/article/tax/2025/05/12/0001",
      publishedAt: "2025-05-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260723",
      title: "이 대통령 \"똘똘한 한 채, 심각한 문제…보유세, 단계적 차등 부과 고민 중\"",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202607231627001",
      publishedAt: "2026-07-23",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-20260803",
      title: "'35억 똘똘한 한 채' 겨냥…18.6만 가구 종부세 더 걷는다 [2026 세제개편]",
      publisher: "MTN",
      url: "https://news.mtn.co.kr/news-detail/2026080308021314983",
      publishedAt: "2026-08-03",
      type: "press",
      license: "link-only",
    },
  ],
};

import type { PolicyInput } from "./schema";

/**
 * 기업형 장기 임대주택.
 *
 * 2026년 11월 3일 대통령 X 게시물에 "개인이 대출로 집을 사는 시대를 끝내고, 기업이 주택을 소유해
 * 임대하는 구조로 바꿔야 한다"는 답글이 달렸다(잼통 Voice). 이것은 사실 주장이 아니라 제안이므로,
 * 그 제안과 맞닿은 실제 제도 — 2024년 도입된 20년 장기 민간임대, 2026년 리츠 장기화 검토와 8·13
 * 대책의 장기임대 지원 — 를 적고, 찬반을 함께 둔다.
 *
 * ★ 2024년 8월 방안은 윤석열 정부 때 나온 것이다. 이재명 정부가 이어받은 부분을 구분한다.
 * ★ 2026-11-04 처음 등록 — 잼통 Voice 이슈 #206.
 */
export const CORPORATE_RENTAL_HOUSING: PolicyInput = {
  slug: "corporate-rental-housing",
  title: "기업형 장기 임대주택",
  scope:
    "리츠 등 법인이 100세대 이상을 20년 이상 임대하는 신유형 장기민간임대(2024년 8월 발표), 2026년 공공지원 민간임대 리츠 20년 장기화 검토, 8·13 대책의 장기임대 금융지원과 개인 임대사업자 세제 변화, 이에 대한 비판",
  ministries: ["국토교통부", "재정경제부"],
  categories: ["economy", "welfare"],
  asOf: "2026-11-04",
  rumors: [
    {
      id: "rumor-corporate",
      text: "개인이 대출로 집을 사는 시대를 끝내고, 기업이 주택을 소유해 임대하는 구조로 바꿔야 한다",
      claimIds: ["claim-2024-plan", "claim-reit-20y", "claim-813-rental", "claim-molit-view", "claim-ccej"],
    },
  ],
  claims: [
    {
      id: "claim-2024-plan",
      text:
        "국토교통부는 2024년 8월 28일 경제관계장관회의에서 리츠 등 법인이 한 단지 100세대 이상을 20년 이상 임대하는 신유형 장기민간임대주택을 도입하겠다고 발표했다. " +
        "임대료 규제를 줄인 자율형·준자율형·지원형으로 나누고, 법인 중과세 완화와 취득·재산세 감면, PF 보증·기금 융자를 주며, 2035년까지 10만 가구를 공급한다는 목표다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-kr-20240828"],
      verified: true,
    },
    {
      id: "claim-reit-20y",
      text:
        "주택도시보증공사(HUG)는 2026년 1월 7일 공공지원 민간임대 리츠의 운영 기간을 현행 10년(10년 임대 후 분양·청산)에서 20년 이상으로 늘리는 방안을 연구하는 용역을 발주했다. " +
        "검토 초기 단계이며, 업계는 현행 10년 임대도 적자에 가까워 사업성이 가장 큰 과제라고 본다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20260108"],
      verified: true,
    },
    {
      id: "claim-813-rental",
      text:
        "정부는 2026년 8월 13일 공급대책에서 공공지원 민간임대에 금융지원을 강화해 20년 이상 장기임대 공급을 유도하고, HUG 보증을 결합한 '임대주택 담보 장기 모기지 상품'을 도입하기로 했다. " +
        "같은 대책으로 개인 임대사업자의 상생임대 특례는 2026년 말 폐지되고, 의무임대기간이 끝난 매입임대 주택은 2027년 말까지 팔아야 양도세 중과 배제와 장기보유특별공제 50%를 받는다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260814"],
      verified: true,
    },
    {
      id: "claim-molit-view",
      text:
        "국토교통부 관계자는 개인 중심 임대시장은 불안정하므로 법인형으로 규모를 키워 관리·감독하고, 장기 금융제도를 갖추면 해외 자본 참여도 기대된다고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "국토교통부 관계자",
      sourceIds: ["src-newsis-20260814"],
      verified: true,
    },
    {
      id: "claim-ccej",
      text:
        "경실련은 20년형 공공지원 민간임대가 기존 임대차시장 정상화를 포기하는 정책이며, 기업이 정부 지원을 받아 임대하다 집값이 오르면 분양수익을 얻는 구조라고 비판했다. " +
        "대한주택임대인협회는 등록 당시 약속한 제도를 나중에 바꾸고 소급 적용하면 누가 정부 정책을 믿겠느냐고 반발했다.",
      assertionType: "CLAIM",
      assertedBy: "경제정의실천시민연합·대한주택임대인협회",
      sourceIds: ["src-newsis-20260814"],
      verified: true,
    },
    {
      id: "claim-lee-2022",
      text:
        "이 대통령은 대선 후보였던 2022년 1월 6일 MBC 토론에서, 국가가 자금을 대고 10년 뒤 시가 분양이 가능했던 뉴스테이식 민간임대는 큰 특혜가 됐다고 지적하며 " +
        "\"민간에서 우리가 생각하는 방식의 선량한 민간 임대주택이 가능하겠느냐\", \"쉽지 않다고 본다\"고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 당시 대선 후보",
      sourceIds: ["src-newstomato-20220107"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-ccej", "claim-lee-2022"],
  timeline: [
    {
      id: "t-2022",
      date: "2022-01-06",
      datePrecision: "day",
      title: "후보 시절 민간임대 회의론",
      summary: "MBC 토론에서 뉴스테이식 특혜 지적.",
      claimIds: ["claim-lee-2022"],
    },
    {
      id: "t-2024",
      date: "2024-08-28",
      datePrecision: "day",
      title: "신유형 장기민간임대 발표",
      summary: "100세대·20년 이상, 2035년까지 10만 가구 목표.",
      claimIds: ["claim-2024-plan"],
    },
    {
      id: "t-reit",
      date: "2026-01-07",
      datePrecision: "day",
      title: "임대리츠 20년 장기화 용역",
      summary: "HUG 발주, 검토 초기.",
      claimIds: ["claim-reit-20y"],
    },
    {
      id: "t-813",
      date: "2026-08-13",
      datePrecision: "day",
      title: "8·13 대책 장기임대 지원",
      summary: "장기 모기지 도입, 개인 임대 세제 혜택 축소.",
      claimIds: ["claim-813-rental", "claim-molit-view", "claim-ccej"],
    },
  ],
  gaps: [
    "2024년 방안의 20년 장기민간임대가 2026년 11월까지 실제로 몇 가구 공급·착공됐는지 확인하지 못했다.",
    "이재명 정부가 '개인 대출 주택 구입을 줄이고 기업 임대로 바꾼다'는 방향을 공식 목표로 밝힌 자료는 찾지 못했다. 정부의 공공임대 확대 방침(공공장기임대 대량 공급)과는 별개다.",
    "HUG 용역 결과와 리츠 장기화 제도의 확정 여부는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-korea-kr-20240828",
      title: "최장 20년 장기 거주…기업형 임대주택 10만 가구 공급 추진",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148933151",
      publishedAt: "2024-08-28",
      type: "official",
      license: "public",
    },
    {
      id: "src-fnnews-20260108",
      title: "공공 지원 민간임대리츠 10년→20년 장기화 추진",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202601081817389237",
      publishedAt: "2026-01-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260814",
      title: "'빌라·오피스텔 13만호' 공급 드라이브…임대시장 기업형으로 바뀌나",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260814_0003750166",
      publishedAt: "2026-08-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstomato-20220107",
      title: "이재명, 부동산 '세제완화·공급확대'…\"임대주택은 공공서 책임\"(종합)",
      publisher: "뉴스토마토",
      url: "https://newstomato.com/ReadNews.aspx?no=1098693",
      publishedAt: "2022-01-07",
      type: "press",
      license: "link-only",
    },
  ],
};

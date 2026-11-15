import type { PolicyInput } from "./schema";

/**
 * 근로소득세 징수액 추이와 직장인 세 부담 — 왜 늘었고, 정부는 어떻게 보는가.
 *
 * 2026년 11월 인스타그램 게시물이 "직장인들의 월급에서 뜯어가는 근로소득세가 늘어나고 있다"고 올렸다
 * (신고 센터 factbot-gap #292).
 *
 * ★ 징수액이 늘었다는 것은 사실이다. 그러나 세율을 올려서가 아니라 근로자 수·급여 증가와 과표 구간이
 *   물가를 따라가지 않는 구조 때문이라는 점, 정부가 그 구조를 고치는 데(물가연동제) 반대해 왔다는 점을
 *   함께 적는다. 둘 다 받은 사람이 따져 볼 대목이다.
 * ★ 2026년 근로소득세만 떼어 낸 누계는 찾지 못했다. 소득세 전체로 적는다(gaps).
 * ★ 세제개편안 전반은 policy:tax-reform-2026에 있다.
 * ★ 2026-11-15 처음 등록 — factbot-gap #292.
 */
export const WAGE_INCOME_TAX: PolicyInput = {
  slug: "wage-income-tax",
  title: "근로소득세 징수액 추이와 직장인 세 부담",
  scope:
    "2024~2025년 근로소득세 징수 실적과 10년 증가율, 2026년 1~9월 소득세 수입, 증가 원인(근로자·급여 증가, 과표 미조정), " +
    "소득세 물가연동제를 둘러싼 국회 법안과 정부 입장",
  ministries: ["재정경제부", "기획예산처"],
  categories: ["economy"],
  asOf: "2026-11-15",
  rumors: [
    {
      id: "rumor-wage-tax-up",
      text: "직장인들의 월급에서 뜯어가는 근로소득세가 늘어나고 있다",
      claimIds: ["claim-2025", "claim-decade", "claim-2026", "claim-causes", "claim-bracket", "claim-no-rate-hike", "claim-indexation-gov"],
    },
  ],
  claims: [
    {
      id: "claim-2025",
      text:
        "근로소득세 수입은 2025년 68조4천억 원으로 2024년(61조 원)보다 7조4천억 원(12.1%) 늘었다. 국회예산정책처는 임금근로자 수 " +
        "증가와 특별급여 증가율 개선을 원인으로 들었다.",
      assertionType: "FACT",
      sourceIds: ["src-nabo-20260212", "src-hankook-20260805"],
      verified: true,
    },
    {
      id: "claim-decade",
      text: "최근 10년 동안 총국세 수입이 71.6% 늘어나는 사이 근로소득세 수입은 152.4% 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-20260805"],
      verified: true,
    },
    {
      id: "claim-2026",
      text:
        "재정경제부의 '2026년 9월 국세수입 현황'에 따르면 2026년 1~9월 소득세 수입은 111조 원으로 1년 전보다 16.5% 늘었다. 정부는 " +
        "취업자와 급여 증가, 주택 거래량 증가를 원인으로 설명했다. 같은 기간 전체 국세는 385조 원으로, 반도체 기업 실적에 따른 " +
        "법인세(128조 원, 68% 증가)가 가장 크게 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20261030"],
      verified: true,
    },
    {
      id: "claim-causes",
      text:
        "총급여 8천만 원을 넘는 근로자의 비중은 2023년 12.1%로 10년 전(6.2%)의 두 배가 됐다. 누진세율 구조에서는 급여가 오르면 더 " +
        "높은 세율 구간에 드는 사람이 늘어 세 부담이 급여보다 빠르게 커진다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-20260805"],
      verified: true,
    },
    {
      id: "claim-bracket",
      text:
        "근로소득세 과세표준 구간은 2023년에 8,800만 원 이하 구간만 조정됐고, 8,800만 원 초과 구간은 2008년 이후 그대로다. 과표 구간이 " +
        "물가와 임금 상승을 따라가지 않아 명목 급여만 올라도 세 부담이 늘어난다는 지적이 나온다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-20260805"],
      verified: true,
    },
    {
      id: "claim-no-rate-hike",
      text:
        "근로소득세 과표 구간은 2023년 조정 뒤 바뀌지 않았고, 2025년 세제개편은 법인세, 2026년은 부동산 세제가 중심이었다. 2026년 " +
        "논의에서 근로소득세는 빠졌으며 재정경제부 관계자는 \"현재로선 별도로 검토한 것이 없다\"고 했다. 그래서 최근 징수액 증가는 " +
        "세율을 올려서가 아니라 근로자·급여 증가와 과표가 그대로인 구조에서 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-20260805", "src-nabo-20260212"],
      verified: true,
    },
    {
      id: "claim-indexation-bills",
      text:
        "더불어민주당 박범계·윤준병·박선원 의원과 국민의힘 김미애·이인선·최은석 의원이 종합소득 과세표준을 물가에 연동하는 소득세법 " +
        "개정안을 각각 냈다.",
      assertionType: "FACT",
      sourceIds: ["src-fn-20260616"],
      verified: true,
    },
    {
      id: "claim-indexation-gov",
      text:
        "재정경제부와 기획예산처는 물가연동제를 \"중장기 과세 기반과 과세형평 등을 종합적으로 고려해 검토할 사안\"이라며 부정적 입장을 " +
        "밝혔다. 면세자 비율이 32.5%(2024년)로 높아 과세 기반이 안정적이지 않고, 누진세율 구조에서는 감세 효과가 고소득자에게 " +
        "몰린다는 이유를 들었다. 보도에 따르면 정부는 2026년 세법개정안에 물가연동제를 담지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "재정경제부·기획예산처",
      sourceIds: ["src-fn-20260616", "src-segye-20260614"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "세수 여건이 좋아진 지금 근로소득세를 손볼 때라는 주장도 나온다. 정부가 물가연동제를 받아들이지 않는 한 과표 구간이 그대로인 " +
        "채 급여가 오르면 직장인의 실질 세 부담은 계속 커진다는 비판이다.",
      assertionType: "CLAIM",
      assertedBy: "물가연동제 도입을 주장하는 쪽(언론·국회의원)",
      sourceIds: ["src-hankook-20260805"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-bracket", "claim-critique"],
  timeline: [
    {
      id: "t-2025",
      date: "2026-02-12",
      datePrecision: "day",
      title: "2025년 근로소득세 68.4조 원",
      summary: "1년 새 12.1% 늘었다(국회예산정책처).",
      claimIds: ["claim-2025"],
    },
    {
      id: "t-indexation",
      date: "2026-06-16",
      datePrecision: "day",
      title: "정부, 물가연동제에 부정적",
      summary: "여야 의원 법안에 \"종합적으로 검토할 사안\".",
      claimIds: ["claim-indexation-gov", "claim-indexation-bills"],
    },
    {
      id: "t-2026",
      date: "2026-10-30",
      datePrecision: "day",
      title: "1~9월 소득세 111조 원",
      summary: "취업자·급여 증가, 주택 거래 증가.",
      claimIds: ["claim-2026"],
    },
  ],
  gaps: [
    "2026년 1~9월 근로소득세만 떼어 낸 누계는 재정경제부 원자료에서 확인하지 못했다. 소득세 전체 수치로 적었다.",
    "국회예산정책처 '2025년 국세수입 실적' 원문 PDF는 내려받았지만 본문을 직접 대조하지 못했다. 수치는 같은 숫자를 실은 보도로 확인했다.",
    "직장인 1인당 평균 세 부담과 면세자 비율의 최근 추이는 이 페이지에 넣지 못했다.",
  ],
  sources: [
    {
      id: "src-nabo-20260212",
      title: "2025년 국세수입 실적 및 세목별 증감원인(나보포커스 제137호)",
      publisher: "국회예산정책처",
      url: "https://www.nabo.go.kr/board/file/down.do?fid=33319105",
      publishedAt: "2026-02-12",
      type: "official",
      license: "link-only",
    },
    {
      id: "src-hankook-20260805",
      title: "'유리지갑' 직장인 세 부담 커졌다… \"세수 여건 좋아진 지금, 근소세 손볼 때\"",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2026080415480004176",
      publishedAt: "2026-08-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-20261030",
      title: "9월까지 국세 385조원…반도체 덕에 96조원 더 걷혀",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2026103069211",
      publishedAt: "2026-10-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fn-20260616",
      title: "정치권 '소득세 물가연동' 제안… 정부 \"과세형평 맞지 않다\"",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202606161832081089",
      publishedAt: "2026-06-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20260614",
      title: "[단독] 근로소득세 물가연동제 올해 세법개정안 반영 안 할 듯",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20260614508182",
      publishedAt: "2026-06-14",
      type: "press",
      license: "link-only",
    },
  ],
};

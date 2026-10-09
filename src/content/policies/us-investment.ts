import type { PolicyInput } from "./schema";

/**
 * 한미 관세 합의와 대미투자 3,500억 달러.
 *
 * "국민 1인당 940만 원씩 미국에 바친다", "세금으로 퍼 주고 못 돌려받는다" 같은 말이
 * 돈다. 3,500억 달러를 인구로 나눈 계산 자체는 산수지만, 그 돈이 무엇으로 이뤄졌고
 * 어디서 나오며 돌려받는 구조인지가 빠져 있다.
 *
 * ★ 비판도 함께 싣는다.
 *   상업성이 없어도 투자할 수 있는 예외 조항, 국회 통제, 외환보유액 감소는 실제
 *   쟁점이다. 정부 설명(원리금 회수)은 정부의 주장이므로 CLAIM이고, 시민단체 비판도
 *   CLAIM이다. 어느 쪽이 맞는지는 아직 투자 결과가 없어 판단하지 않는다.
 *
 * ★ 2026-10-09 처음 등록, 같은 날 편집팀이 원자료와 대조했다.
 */
export const US_INVESTMENT: PolicyInput = {
  slug: "us-investment",
  title: "한미 관세 합의와 대미투자 3,500억 달러",
  scope: "2025년 한미 관세 합의에 따른 대미투자의 구성, 재원, 원금 회수 구조, 첫 집행",
  ministries: ["재정경제부", "산업통상부", "한미전략투자공사"],
  categories: ["diplomacy", "economy"],
  asOf: "2026-10-09",
  rumors: [
    {
      id: "rumor-per-capita",
      text: "국민 1인당 940만 원씩 세금으로 미국에 바친다",
      claimIds: ["claim-structure", "claim-funding", "claim-fx-reserves"],
    },
    {
      id: "rumor-no-return",
      text: "돈만 주고 한 푼도 돌려받지 못한다",
      claimIds: ["claim-repayment", "claim-minister-recovery", "claim-exception", "claim-critics"],
    },
  ],
  claims: [
    {
      id: "claim-structure",
      text:
        "2025년 10월 29일 한미는 관세 협상 세부 사항에 합의했다. 대미투자 3,500억 달러는 " +
        "현금 투자 2,000억 달러와 한국 기업이 주도하는 조선 협력(MASGA) 1,500억 달러(보증 " +
        "포함)로 나뉜다. 현금 투자는 연간 200억 달러가 상한이고, 사업 진행에 따라 집행한다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-deal-1029"],
      verified: true,
    },
    {
      id: "claim-tariff",
      text:
        "같은 합의로 상호관세는 25%에서 15%로, 자동차·부품 관세는 15%로 낮아졌다. 쌀과 " +
        "쇠고기 시장은 추가로 열지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-deal-1029"],
      verified: true,
    },
    {
      id: "claim-repayment",
      text:
        "합의에 따르면 투자는 상업적 합리성과 원리금 회수가 보장되는 사업으로 한정하고, " +
        "수익은 5대 5로 나누되 20년 안에 원금 회수가 어려우면 배분 비율을 조정할 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-deal-1029"],
      verified: true,
    },
    {
      id: "claim-funding",
      text:
        "구윤철 부총리는 대미투자는 공짜로 주는 돈이 아니라 원리금을 회수하는 투자이고, " +
        "재원은 기본적으로 외환보유고 운용 수익을 쓰며 부족하면 해외에서 달러채를 발행해 " +
        "국내 외환시장에 영향을 주지 않겠다고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "구윤철 부총리 겸 재정경제부 장관",
      sourceIds: ["src-newsis-koo-0304"],
      verified: true,
    },
    {
      id: "claim-law",
      text:
        "대미투자특별법은 2026년 3월 12일 국회 본회의에서 재석 242명 중 찬성 226명, 반대 8명, " +
        "기권 8명으로 통과했다. 법은 한미전략투자공사와 한미전략투자기금을 두고, 정부가 " +
        "투자 사업을 미국과 협의하기 전에 국회 재정경제기획위원회에 보고하도록 했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-law-0312"],
      verified: true,
    },
    {
      id: "claim-exception",
      text:
        "특별법은 국가안보 등 불가피한 사유가 있으면 상업적 합리성이 확보되지 않은 투자도 " +
        "국회 재정경제기획위원회 동의를 받아 추진할 수 있게 했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-law-0312", "src-khan-project-0312"],
      verified: true,
    },
    {
      id: "claim-critics",
      text:
        "참여연대는 특별법이 상업성 없는 투자를 허용하고 국회 동의 대신 보고에 그치며, " +
        "결국 납세자가 무한책임을 지게 된다고 비판했다.",
      assertionType: "CLAIM",
      assertedBy: "참여연대",
      sourceIds: ["src-pspd-0310"],
      verified: true,
    },
    {
      id: "claim-first-project",
      text:
        "정부는 2026년 10월 1일 첫 투자금 24억 달러를 미국 측 투자관리기구(I-SPV)에 " +
        "송금했다. 1호 사업은 텍사스주 엔시날 가스복합화력발전소(총 223억 달러, 6,472MW)다. " +
        "최종 전력 수요처는 아직 확정되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-first-1002"],
      verified: true,
    },
    {
      id: "claim-minister-recovery",
      text:
        "김정관 산업통상부 장관은 1호 사업을 고르며 존속기간 안에 원리금을 회수할 수 있는지를 " +
        "중점적으로 살폈다고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "김정관 산업통상부 장관",
      sourceIds: ["src-news1-first-1002"],
      verified: true,
    },
    {
      id: "claim-fx-reserves",
      text:
        "2026년 9월 말 외환보유액은 4,405억 6,000만 달러로 한 달 새 17억 2,000만 달러 줄었다. " +
        "한국은행은 한미전략투자공사에 대한 자산위탁을 감소 요인 중 하나로 꼽았다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-fx-1006"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-deal",
      date: "2025-10-29",
      datePrecision: "day",
      title: "한미 관세 협상 세부 합의",
      summary: "현금 2,000억 달러(연 200억 상한) + 조선 협력 1,500억 달러.",
      claimIds: ["claim-structure", "claim-tariff", "claim-repayment"],
    },
    {
      id: "t-law",
      date: "2026-03-12",
      datePrecision: "day",
      title: "대미투자특별법 국회 통과",
      summary: "한미전략투자공사 설립, 사전 국회 보고.",
      claimIds: ["claim-law", "claim-exception"],
    },
    {
      id: "t-first",
      date: "2026-10-01",
      datePrecision: "day",
      title: "첫 투자금 24억 달러 송금",
      summary: "1호 사업 텍사스 엔시날 발전소.",
      claimIds: ["claim-first-project"],
    },
  ],
  gaps: [
    "'1인당 940만 원'을 처음 말한 사람과 출처를 원문으로 확인하지 못했다.",
    "외환보유고 운용 수익으로 연 200억 달러를 충당할 수 있는지에 대한 정부 추계를 확인하지 못했다.",
    "한미전략투자공사에 위탁한 외환보유액 규모와 추가 위탁 일정은 발표되지 않았다.",
    "조선 협력 1,500억 달러 중 보증과 기업 직접 투자의 비율을 확인하지 못했다.",
    "1호 사업의 수익 전망과 원금 회수 일정은 아직 공개되지 않았다.",
  ],
  sources: [
    {
      id: "src-newsis-deal-1029",
      title: "한미 관세협상 합의…연 상한 200억달러",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20251029_0003382384",
      publishedAt: "2025-10-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-koo-0304",
      title: "구윤철 \"대미투자, 공짜로 주는 돈 아냐…원리금 회수·기업 기회\"(종합)",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260304_0003534278",
      publishedAt: "2026-03-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-law-0312",
      title: "대미투자특별법 국회 본회의 통과…3500억달러 투자의 1호 사업은?",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202603121510011",
      publishedAt: "2026-03-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-project-0312",
      title: "대미투자특별법 1호 사업 'LNG·원전' 유력",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202603122026005/",
      publishedAt: "2026-03-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-pspd-0310",
      title: "여야 합의로 특위 통과한 대미투자특별법, 대미투자 위험이나 국민부담 우려 해소 못한 졸속 입법",
      publisher: "참여연대",
      url: "https://peoplepower21.org/solidarity/2017336",
      publishedAt: "2026-03-10",
      type: "research",
      license: "link-only",
    },
    {
      id: "src-news1-first-1002",
      title: "24억달러 첫 송금…韓 대미투자 1호 텍사스 발전소 자재 발주 본격화",
      publisher: "뉴스1",
      url: "https://v.daum.net/v/20261002060256436",
      publishedAt: "2026-10-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-fx-1006",
      title: "대미 투자 자산위탁에 외환보유액 감소…9월 4406억달러",
      publisher: "머니투데이방송",
      url: "https://news.mtn.co.kr/news-detail/2026100607231142188",
      publishedAt: "2026-10-06",
      type: "press",
      license: "link-only",
    },
  ],
};

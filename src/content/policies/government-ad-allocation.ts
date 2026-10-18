import type { PolicyInput } from "./schema";

/**
 * 정부광고 배분 기준 — 세금으로 집행하는 광고는 어떻게 매체를 고르나.
 *
 * "정부 정책을 제대로 보도하지 않는 언론사에는 광고·예산 지원을 보도의 질과
 * 양에 따라 줄여야 한다"는 답글이 돈다(2026년 10월). 이 페이지는 지금 제도가
 * 매체를 어떻게 고르는지, 이재명 정부가 무엇을 바꿨는지, 그리고 보도 내용을
 * 기준으로 광고를 늘리고 줄이는 일이 과거에 어떤 비판을 받았는지를 함께 둔다.
 *
 * ★ "보도 태도로 광고를 조정하자"는 제안은 역대 정부의 '광고 탄압' 논란과
 *   같은 구조다. 그 비판을 critique로 함께 보여야 객관적이다.
 * ★ 2026-10-18 처음 등록 — 잼통 Voice voice-gap 이슈 #48.
 */
export const GOVERNMENT_AD_ALLOCATION: PolicyInput = {
  slug: "government-ad-allocation",
  title: "정부광고 배분 기준",
  scope:
    "정부기관·공공법인 광고의 매체 선정 방식(정부광고법·지표), 2026년 공개 확대와 개정안, 보도 내용과 광고 " +
    "배분을 연결하는 데 대한 비판",
  ministries: ["문화체육관광부", "청와대"],
  categories: ["institution", "economy"],
  asOf: "2026-10-18",
  rumors: [
    {
      id: "rumor-cut-ads",
      text: "정부 정책을 제대로 보도하지 않는 언론사는 보도의 질과 양에 따라 정부광고를 줄여야 한다",
      claimIds: ["claim-advertiser", "claim-sunim-criteria", "claim-carrot-stick"],
    },
  ],
  claims: [
    {
      id: "claim-scale",
      text: "정부기관과 공공법인이 집행하는 정부광고는 연간 1조 원이 넘는다.",
      assertionType: "FACT",
      sourceIds: ["src-daenews-ad-bill-20260529"],
      verified: true,
    },
    {
      id: "claim-index-2021",
      text:
        "문화체육관광부는 2021년 12월 ABC 부수 대신 열독률(효과성)과 언론중재위 시정권고·자율심의 참여 등 " +
        "사회적 책임(신뢰성)을 담은 '정부광고 지표'를 내놓았다. 지표 가중치는 광고주인 기관이 스스로 정했다.",
      assertionType: "FACT",
      sourceIds: ["src-mcst-ad-index-20211201"],
      verified: true,
    },
    {
      id: "claim-advertiser",
      text:
        "정부광고법과 시행령은 매체를 고를 때 광고주인 정부기관 등의 의견을 먼저 존중하도록 한다. 문화체육관광부는 " +
        "2023년 12월 28일 열독률 구간 기준 논란과 '정부가 언론사 순위를 매긴다'는 비판 끝에 정부광고 지표 활용을 " +
        "중단하고, 요청이 있을 때 참고자료만 주는 방식으로 바꿨다.",
      assertionType: "FACT",
      sourceIds: ["src-newsseoul-ad-index-20231228"],
      verified: true,
    },
    {
      id: "claim-disclosure",
      text:
        "2026년 1월 30일부터 정부광고 통합지원시스템(GOAD)에 기관별·월별 집행 내역이 매달 공개된다. 로그인 없이 " +
        "볼 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-goad-ad-20260127"],
      verified: true,
    },
    {
      id: "claim-sunim-criteria",
      text:
        "이규연 청와대 홍보소통수석은 2026년 1월 인터뷰에서 \"광고 효율성, 언론의 공공성을 고려하는 방식\"의 집행 " +
        "기준을 관련 부처와 협의 중이라고 했다. 배제 기준의 예로는 \"내란을 옹호하거나 차별·혐오를 조장하는 매체에 " +
        "정부광고를 줄 순 없지 않나\"라고 말했다. 정부 정책 보도의 양이나 논조를 기준으로 삼는다는 말은 없었다.",
      assertionType: "CLAIM",
      assertedBy: "이규연 청와대 홍보소통수석",
      sourceIds: ["src-mediatoday-lee-ad-20260123"],
      verified: true,
    },
    {
      id: "claim-bill",
      text:
        "이기헌 더불어민주당 의원은 2026년 5월 28일 정부광고법 개정안을 냈다. 연간 광고 계획 제출과 집행 내역 공개를 " +
        "의무로 하고, 매체선정위원회를 두며, 가짜뉴스 확산 등 사회적 물의를 일으킨 매체에 대한 광고 제재 근거를 " +
        "두는 내용이다.",
      assertionType: "FACT",
      sourceIds: ["src-daenews-ad-bill-20260529"],
      verified: true,
    },
    {
      id: "claim-civic",
      text:
        "2026년 6월 언론시국회의 토론회에서 채영길 교수는 \"정부광고 집행 기준과 내역을 투명하게 공개하고 공적 " +
        "책무성에 따라 배분되도록 제도화해야 한다\"고 제안했다.",
      assertionType: "CLAIM",
      assertedBy: "채영길 교수(언론시국회의 토론회)",
      sourceIds: ["src-pressian-media-reform-20260616"],
      verified: true,
    },
    {
      id: "claim-carrot-stick",
      text:
        "정부광고가 정권마다 우호 매체에 몰리고 비판 보도를 한 매체에서 끊긴다는 '광고 탄압' 논란은 역대 정부에서 " +
        "되풀이됐다. 최진봉 성공회대 교수는 정부광고가 \"정부비판적인 언론사에는 광고 집행을 줄여서 보도를 " +
        "무력화하는 '당근과 채찍' 방식으로 악용될 소지가 크다\"고 지적했다.",
      assertionType: "CLAIM",
      assertedBy: "최진봉 성공회대 교수(한국기자협회 보도)",
      sourceIds: ["src-journalist-ad-20171220"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-index",
      date: "2021-12-01",
      datePrecision: "day",
      title: "새 정부광고 지표 발표",
      summary: "열독률과 사회적 책임 지표를 도입했다.",
      claimIds: ["claim-index-2021"],
    },
    {
      id: "t-index-stop",
      date: "2023-12-28",
      datePrecision: "day",
      title: "정부광고 지표 활용 중단",
      summary: "순위 대신 참고자료만 주는 방식으로 바꿨다.",
      claimIds: ["claim-advertiser"],
    },
    {
      id: "t-monthly",
      date: "2026-01-30",
      datePrecision: "day",
      title: "집행 내역 월별 공개 시작",
      summary: "GOAD 누리집에서 기관별·월별 내역을 본다.",
      claimIds: ["claim-disclosure"],
    },
    {
      id: "t-bill",
      date: "2026-05-28",
      datePrecision: "day",
      title: "정부광고법 개정안 발의",
      summary: "매체선정위원회와 집행 내역 공개 의무를 담았다.",
      claimIds: ["claim-bill"],
    },
  ],
  critiqueIds: ["claim-carrot-stick", "claim-civic"],
  gaps: [
    "2025년·2026년 정부광고 실제 집행액과 매체별 배분은 이 페이지에서 확인하지 못했다. GOAD 공개 자료로 볼 수 있다.",
    "이규연 수석이 말한 새 집행 기준이 확정됐는지는 확인하지 못했다.",
    "이기헌 의원 개정안의 국회 처리 결과는 확인하지 못했다.",
    "보도 내용이나 논조를 기준으로 광고를 배분하는 것이 현행법상 허용되는지에 대한 정부나 법원의 판단은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-daenews-ad-bill-20260529",
      title: "연 1조 넘는 정부광고, 깜깜이 집행 막는다",
      publisher: "동아경제신문",
      url: "https://www.daenews.co.kr/25331",
      publishedAt: "2026-05-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mcst-ad-index-20211201",
      title: "새로운 정부광고 지표 마련",
      publisher: "문화체육관광부(대한민국 정책브리핑)",
      url: "https://www.korea.kr/briefing/policyBriefingView.do?newsId=156483824",
      publishedAt: "2021-12-01",
      type: "official",
      license: "public",
    },
    {
      id: "src-newsseoul-ad-index-20231228",
      title: "문화체육관광부, '정부광고법' 취지에 맞게 정부광고 참고자료만 제공한다",
      publisher: "뉴스서울",
      url: "https://newsseoul.co.kr/news/view/1065584420484446",
      publishedAt: "2023-12-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldk-goad-ad-20260127",
      title: "정부 광고 집행 내역 매달 공개…투명성 강화",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026012715000011813",
      publishedAt: "2026-01-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mediatoday-lee-ad-20260123",
      title: "[단독 인터뷰] 이규연 홍보소통수석 \"언론재단, 정부광고 현황 매달 공개해야\"",
      publisher: "미디어오늘",
      url: "https://www.mediatoday.co.kr/news/articleView.html?idxno=331758",
      publishedAt: "2026-01-23",
      type: "interview",
      license: "link-only",
    },
    {
      id: "src-pressian-media-reform-20260616",
      title: "\"정부 광고 배분 기준 개혁해야\"…언론시국회의 '언론 개혁' 토론회",
      publisher: "프레시안",
      url: "https://www.pressian.com/pages/articles/2026061617491252453",
      publishedAt: "2026-06-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-journalist-ad-20171220",
      title: "정부 광고, 우호 매체에 몰리고 정권 따라 '출렁'",
      publisher: "한국기자협회",
      url: "https://www.journalist.or.kr/m/m_article.html?no=43292",
      publishedAt: "2017-12-20",
      type: "press",
      license: "link-only",
    },
  ],
};

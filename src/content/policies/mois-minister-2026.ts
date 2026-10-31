import type { PolicyInput } from "./schema";

/**
 * 2026년 행정안전부 장관 관련 논란의 사실관계.
 *
 * 10월 X 게시물 답글에 "행정안전부 장관·차관과 대통령이 국민을 속였으니 대국민 사과를 해야 한다"는
 * 말이 달렸다(잼통 Voice). 답글이 어떤 사안을 가리키는지 나오지 않아, 2026년 행정안전부 장관이 국회에서
 * 사과하거나 공방을 벌인 사안을 모은다.
 *
 * ★ 투표용지 부족 사태 전체는 policy:ballot-shortage-2026, 소방 재정은 policy:firefighter-finance에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #191.
 */
export const MOIS_MINISTER_2026: PolicyInput = {
  slug: "mois-minister-2026",
  title: "2026년 행정안전부 장관 관련 논란의 사실관계",
  scope: "윤호중 행정안전부 장관의 투표용지 부족 사태 국정조사 사과(7월)와 대통령 보고 경위, 소방 인사권·재원 공방(10월)",
  ministries: ["행정안전부"],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-deceive",
      text: "행정안전부 장관·차관과 대통령이 국민을 속였으니 대국민 사과를 해야 한다",
      claimIds: ["claim-ballot-apology", "claim-report", "claim-fire"],
    },
  ],
  claims: [
    {
      id: "claim-ballot-apology",
      text:
        "윤호중 행정안전부 장관은 7월 1일 투표용지 부족 사태 국정조사 특위에서 \"참정권이 심각하게 침해된 데 대해 젊은 청년과 국민께 진심으로 " +
        "사과드린다\"고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-imbc-6834278"],
      verified: true,
    },
    {
      id: "claim-report",
      text: "윤 장관은 같은 자리에서 투표용지 부족 사태를 대통령에게 직접 보고하지 않았고 다음 날 오전 서면으로 보고했다고 답했다.",
      assertionType: "FACT",
      sourceIds: ["src-imbc-6834278"],
      verified: true,
    },
    {
      id: "claim-fire",
      text:
        "윤 장관은 10월 29일 국가가 소방 인사권을 가졌으니 소방관 인건비도 국가가 대야 한다는 추미애 경기도지사의 주장에 대해 인사권은 국가직 " +
        "전환 전과 같고 대부분 시도지사에게 위임돼 있다며 \"사실이 아니다\"라고 반박했다. 소방 재원이 취약하다는 점은 인정했다.",
      assertionType: "CLAIM",
      assertedBy: "윤호중 행정안전부 장관",
      sourceIds: ["src-fnnews-20261029"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-apology",
      date: "2026-07-01",
      datePrecision: "day",
      title: "국정조사 특위 사과",
      summary: "투표용지 부족 사태.",
      claimIds: ["claim-ballot-apology", "claim-report"],
    },
    {
      id: "t-fire",
      date: "2026-10-29",
      datePrecision: "day",
      title: "소방 인사권 공방",
      summary: "추미애 지사 주장 반박.",
      claimIds: ["claim-fire"],
    },
  ],
  gaps: [
    "답글이 말하는 '장·차관과 대통령이 국민을 속인' 사안이 무엇인지는 답글에 나오지 않아 대조하지 못했다.",
    "행정안전부 차관이 관련된 2026년 논란은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-imbc-6834278",
      title: "윤호중 장관 \"심각한 참정권 침해, 국민께 진심으로 사과\"",
      publisher: "MBC",
      url: "https://imnews.imbc.com/news/2026/politics/article/6834278_36911.html",
      publishedAt: "2026-07-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261029",
      title: "윤호중 \"추미애 소방 인사권 주장 사실 아냐…담뱃세 일몰분 일부 활용은 검토\"",
      publisher: "파이낸셜뉴스",
      url: "https://fnnews.com/news/202610291753590070",
      publishedAt: "2026-10-29",
      type: "press",
      license: "link-only",
    },
  ],
};

import type { PolicyInput } from "./schema";

/**
 * 대통령실 예산·특수활동비와 참모의 국정감사 출석.
 *
 * 10월 X 게시물 답글에 "야당 시절 특활비를 전액 삭감하더니 집권 뒤 대통령실 특활비를 늘렸다",
 * "청와대 예산이 크게 늘었다는데 왜 늘었나", "국감에 나오지 않은 대통령실 참모들을 내보내라"는
 * 말이 달렸다(잼통 Voice). 대통령실 예산의 추이, 특활비 경위, 2026년 운영위 증인 채택 결과를 적는다.
 *
 * ★ 해외 순방 일정과 성과는 policy:overseas-trips-2026에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #121, #159, #183.
 */
export const PRESIDENTIAL_OFFICE_BUDGET: PolicyInput = {
  slug: "presidential-office-budget",
  title: "대통령실 예산·특수활동비와 참모의 국정감사 출석",
  scope:
    "2024~2026년 대통령실 예산 추이, 2025년 특수활동비 삭감과 추경·2026년 예산의 부활, 2026년 국회 운영위 국정감사 증인 채택 결과",
  ministries: ["청와대", "기획예산처"],
  categories: ["institution", "economy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-special",
      text: "야당 시절 특수활동비를 전액 삭감하더니 집권 뒤 대통령실 특활비는 오히려 늘렸다",
      claimIds: ["claim-special-history", "claim-special-2026"],
    },
    {
      id: "rumor-budget",
      text: "청와대 예산이 크게 늘었다는데 왜 늘었는가",
      claimIds: ["claim-budget-trend", "claim-special-2026"],
    },
    {
      id: "rumor-audit",
      text: "SNS로 정치하지 말고 국정감사에 나오지 않은 대통령실 참모들을 국감에 내보내라",
      claimIds: ["claim-witness", "claim-witness-positions", "claim-audit-date"],
    },
  ],
  claims: [
    {
      id: "claim-budget-trend",
      text:
        "대통령실 예산은 2024년 1,031억 원, 2025년 956억 원이었고, 2026년 예산은 국회에서 1,051억 4,800만 원으로 확정돼 " +
        "1년 전보다 95억 2천만 원 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20251203"],
      verified: true,
    },
    {
      id: "claim-special-history",
      text:
        "당시 야당이던 더불어민주당은 2025년 예산에서 대통령실 특수활동비를 전액 삭감했다. 이재명 정부 출범 뒤 2025년 추경에서 " +
        "6개월분 41억 2,500만 원이 다시 편성됐다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20251203"],
      verified: true,
    },
    {
      id: "claim-special-2026",
      text:
        "2026년 예산에는 대통령실 특활비 82억 1,500만 원이 정부안대로 반영됐고, 이것이 대통령실 예산 증가의 주된 원인이다. " +
        "국민의힘은 '내로남불'이라고 비판했다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20251203", "src-dailian-1569658"],
      verified: true,
    },
    {
      id: "claim-witness",
      text:
        "국회 운영위원회는 10월 21일 2026년 국정감사 증인 명단을 재석 20명 중 찬성 15명으로 가결했다. 국민의힘이 요구한 " +
        "강훈식 전 비서실장, 김현지 제1부속실장, 김용범 전 정책실장 등은 명단에 들지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2017313"],
      verified: true,
    },
    {
      id: "claim-witness-positions",
      text:
        "국민의힘은 최근 교체된 전임 참모가 나와야 결정 경위를 확인할 수 있다고 했고, 민주당은 기존 기관 증인으로 충분하며 " +
        "전임자는 이미 인수인계를 마쳤다고 맞섰다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘 / 더불어민주당",
      sourceIds: ["src-inews24-2017313"],
      verified: true,
    },
    {
      id: "claim-audit-date",
      text:
        "대통령비서실·국가안보실·대통령경호처 국정감사는 국민의힘 요청대로 10월 29일 오후로 잡혔고, 증인은 기관증인만 채택됐다. 한병도 운영위원장은 " +
        "대통령실 국감에 일반증인을 부른 것은 2024년 한 차례뿐이고 부속실장이 출석한 전례는 2000년대 이후 없다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20261021"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-special-2026"],
  timeline: [
    {
      id: "t-2026-budget",
      date: "2025-12",
      datePrecision: "month",
      title: "2026년 대통령실 예산 확정",
      summary: "1,051억 원, 특활비 82억 원.",
      claimIds: ["claim-budget-trend", "claim-special-2026"],
    },
    {
      id: "t-witness",
      date: "2026-10-21",
      datePrecision: "day",
      title: "운영위 국감 증인 채택",
      summary: "전임 참모 증인 채택 무산.",
      claimIds: ["claim-witness"],
    },
  ],
  gaps: [
    "2027년 대통령실 예산안 총액과 특활비 규모, 세종집무실 건립비 편성 내역은 원문으로 확인하지 못했다.",
    "대통령실 특활비 집행 내역의 공개 범위는 정리하지 못했다.",
    "대통령비서실 국정감사(10월 말) 당일 실제 출석자와 질의 내용은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-heraldk-20251203",
      title: "내년 대통령실 예산 尹정부보다 9.1%↑…포상금 증액에 '플러스'",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2025120321094651030",
      publishedAt: "2025-12-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1569658",
      title: "대통령실 특활비, 0원→82억원…野 \"없어도 국정 마비 안된다더니? 내로남불\"",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1569658",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-inews24-2017313",
      title: "'김현지·강훈식' 등 국감 안나온다⋯운영위, 증인 채택 '與 주도 가결'",
      publisher: "아이뉴스24",
      url: "https://www.inews24.com/view/2017313",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20261021",
      title: "국회 운영위, 29일 靑 국정감사…강훈식·김용범·김현지 증인 제외",
      publisher: "서울신문",
      url: "https://www.seoul.co.kr/news/newsView.php?id=20261021500119",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
  ],
};

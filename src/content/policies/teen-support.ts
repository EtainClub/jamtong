import type { PolicyInput } from "./schema";

/**
 * 청소년·청년 돌봄과 참여, 예술 창작 지원 (2026).
 *
 * 통통 항목에 없는 것만 묶는다. 가족돌봄 청소년 자기돌봄비, 청소년 정책 참여 의무화,
 * 청년 예술 창작자 지원이다. 청년 문화예술패스·청소년 문화누리카드·학교 밖 청소년 지원은
 * 통통에서 가져온 항목(`tongtong.ts`)에 있다.
 *
 * ★ 2026-10-09 처음 등록, 같은 날 편집팀이 원자료와 대조했다.
 */
export const TEEN_SUPPORT: PolicyInput = {
  slug: "teen-support",
  title: "청소년·청년 돌봄과 참여, 예술 창작 지원 (2026)",
  scope: "가족돌봄 청소년 지원, 청소년 정책 참여, 청년 예술 창작자 지원",
  ministries: ["보건복지부", "성평등가족부", "문화체육관광부"],
  categories: ["welfare"],
  asOf: "2026-10-09",
  claims: [
    {
      id: "claim-carers",
      text:
        "2026년 9월부터 청년미래센터는 가족을 돌보는 청소년·청년에게 자기돌봄비를 연 " +
        "200만 원(기준 중위소득 100% 이하) 지원하고, 장학금·금융·주거 서비스를 연계한다. " +
        "청년미래센터는 전국 4곳에서 17곳으로 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-teen-0709"],
      verified: true,
    },
    {
      id: "claim-participation",
      text:
        "2026년 10월 29일부터 지방자치단체의 지방청소년정책위원회에 9~24세 청소년 위원을 " +
        "위촉해야 한다. 초등 5~6학년부터 고등학생, 학교 밖 청소년이 참여하는 '국민생각함' " +
        "청소년 패널도 하반기부터 운영한다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-teen-0709"],
      verified: true,
    },
    {
      id: "claim-artists",
      text:
        "순수예술 분야 청년 창작자(20~39세) 3,000명에게 연 900만 원을 지원하는 'K-Art 청년 " +
        "창작자 지원'이 2026년 2월 시작했고, 청년 700명이 해외 문화현장에서 활동하는 " +
        "'청년 K-컬처 글로벌 프론티어'가 새로 생겼다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-culture-0203"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-artists",
      date: "2026-02",
      datePrecision: "month",
      title: "청년 예술 창작자 지원 시작",
      summary: "3,000명에게 연 900만 원.",
      claimIds: ["claim-artists"],
    },
    {
      id: "t-carers",
      date: "2026-09",
      datePrecision: "month",
      title: "가족돌봄 청소년 자기돌봄비 지원",
      summary: "연 200만 원, 청년미래센터 17곳.",
      claimIds: ["claim-carers"],
    },
    {
      id: "t-participation",
      date: "2026-10-29",
      datePrecision: "day",
      title: "지방 청소년정책 청소년 참여 의무화",
      summary: "9~24세 청소년 위원 위촉.",
      claimIds: ["claim-participation"],
    },
  ],
  gaps: [
    "2027년 예산안에서 청년문화패스를 19~34세로 넓힌다는 보도가 있지만 원문을 확인하지 못했고, 국회 심의 전이다. 2026년 청년 문화예술패스는 통통에서 가져온 「청년 문화예술패스」 페이지에 있다.",
    "자기돌봄비의 연령 범위와 신청 방법을 원자료로 확인하지 못했다.",
    "위기청소년·학교 밖 청소년 지원(1388 상담 고도화 등)은 계획 보도만 있어 싣지 않았다.",
  ],
  sources: [
    {
      id: "src-korea-teen-0709",
      title: "2026년 하반기 청소년을 위한 정책 변화",
      publisher: "정책브리핑",
      url: "https://v.daum.net/v/20260709094020525",
      publishedAt: "2026-07-09",
      type: "official",
      license: "link-only",
    },
    {
      id: "src-korea-culture-0203",
      title: "청년의 창작부터 유아 교육·보육까지…올해 지원 폭 넓힌다",
      publisher: "정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148958981",
      publishedAt: "2026-02-03",
      type: "official",
      license: "public",
    },
  ],
};

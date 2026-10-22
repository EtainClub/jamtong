import type { PolicyInput } from "./schema";

/**
 * 2019년 탈북 어민 강제북송 사건과 재판.
 *
 * "문재인 정권 당시 탈북 어민을 강제 북송한 일이 있었다"는 게시물이 돈다. 사실이다.
 * 이재명 정부의 정책은 아니지만, 이 사건의 항소심 판결이 2026년 10월에 나와 다시
 * 회자된다. 북송 경위와 재판 결과만 적는다.
 *
 * ★ 2심까지의 판결이다. 피고인들이 상고하겠다고 밝혀 확정되지 않았다.
 * ★ 어민들이 동료 선원 16명을 살해했다는 것은 당시 정부 조사 결과로 알려진 혐의이고,
 *   법원에서 따로 판단된 사실이 아니다.
 * ★ 2026-10-23 처음 등록 — 신통 factbot-gap 이슈 #62.
 */
export const FISHERMEN_REPATRIATION_2019: PolicyInput = {
  slug: "fishermen-repatriation-2019",
  title: "2019년 탈북 어민 강제북송 사건과 재판",
  scope:
    "2019년 11월 북한 어민 2명 북송의 경위, 문재인 정부 안보 라인 4명에 대한 직권남용 재판의 1·2심 결과",
  ministries: ["통일부", "국가안보실", "국가정보원"],
  categories: ["diplomacy", "institution"],
  asOf: "2026-10-23",
  rumors: [
    {
      id: "rumor-repatriation",
      text: "문재인 정권 당시 탈북 어민을 강제 북송한 일이 있었다",
      claimIds: ["claim-incident", "claim-indictment", "claim-appeal-ruling", "claim-reasoning"],
    },
  ],
  claims: [
    {
      id: "claim-incident",
      text:
        "2019년 11월 2일 북한 어민 2명이 나포됐다. 문재인 정부는 이들이 동료 선원 16명을 살해한 혐의가 " +
        "있어 북한이탈주민 보호 대상이 아니라고 보고, 11월 7일 판문점을 통해 북한으로 돌려보냈다. 나포 이틀 만에 " +
        "북송을 결정하고 닷새 만에 집행했다. 이들은 서면으로 보호를 요청한 바 있다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-20261021", "src-newsis-20220713"],
      verified: true,
    },
    {
      id: "claim-indictment",
      text:
        "검찰은 2023년 2월 정의용 전 국가안보실장, 서훈 전 국가정보원장, 노영민 전 대통령 비서실장, 김연철 전 " +
        "통일부 장관을 국가정보원법상 직권남용 권리행사방해 등 혐의로 불구속 기소했다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-20261021", "src-herald-20261021"],
      verified: true,
    },
    {
      id: "claim-first-ruling",
      text:
        "1심(2025년 2월)은 네 명 모두 유죄로 보면서 형의 선고를 유예했다. 정의용·서훈 징역 10개월, 김연철·노영민 " +
        "징역 6개월의 선고유예다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-20261021", "src-hankook-20261021"],
      verified: true,
    },
    {
      id: "claim-appeal-ruling",
      text:
        "서울고법 형사15-3부는 2026년 10월 21일 정의용·서훈에게 징역 1년 6개월에 집행유예 3년, 김연철에게 징역 " +
        "1년에 집행유예 2년을 선고했다. 1심보다 무겁다. 노영민은 공모를 인정하기 어렵다며 무죄를 선고했다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-20261021", "src-hankook-20261021", "src-asiatoday-20261021"],
      verified: true,
    },
    {
      id: "claim-reasoning",
      text:
        "2심 재판부는 북한 주민도 대한민국 국민이므로 중대범죄로 보호 대상에서 빠지더라도 귀순 의사에 반해 북송할 " +
        "수 없고, 강제북송은 통치행위가 아니라 사법심사 대상이라고 판단했다. 충분한 법적 검토 없이 나포 이틀 만에 " +
        "북송을 결정한 것은 위법하다고 봤다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-20261021"],
      verified: true,
    },
    {
      id: "claim-defense",
      text:
        "정의용·서훈·김연철 측은 정권 교체 뒤 전임 정부의 정책 판단을 정치·이념적 잣대로 처벌하려 한다며 상고하겠다고 " +
        "밝혔다. 문재인 전 대통령은 2심 재판부에 무죄를 주장하는 탄원서를 냈다.",
      assertionType: "CLAIM",
      assertedBy: "정의용·서훈·김연철 측",
      sourceIds: ["src-hankook-20261021", "src-herald-20261021"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-defense"],
  timeline: [
    {
      id: "t-capture",
      date: "2019-11-02",
      datePrecision: "day",
      title: "북한 어민 2명 나포",
      summary: "동해. 이틀 만에 북송 결정.",
      claimIds: ["claim-incident"],
    },
    {
      id: "t-repatriation",
      date: "2019-11-07",
      datePrecision: "day",
      title: "판문점 통해 북송",
      summary: "어민들은 서면으로 보호를 요청한 바 있다.",
      claimIds: ["claim-incident"],
    },
    {
      id: "t-indictment",
      date: "2023-02",
      datePrecision: "month",
      title: "안보 라인 4명 기소",
      summary: "국가정보원법상 직권남용 등.",
      claimIds: ["claim-indictment"],
    },
    {
      id: "t-first",
      date: "2025-02",
      datePrecision: "month",
      title: "1심 선고유예",
      summary: "네 명 모두 유죄, 형 선고 유예.",
      claimIds: ["claim-first-ruling"],
    },
    {
      id: "t-appeal",
      date: "2026-10-21",
      datePrecision: "day",
      title: "2심 집행유예, 노영민 무죄",
      summary: "정의용·서훈 징역 1년 6개월에 집행유예 3년.",
      claimIds: ["claim-appeal-ruling", "claim-reasoning"],
    },
  ],
  gaps: [
    "대법원 상고가 실제로 접수됐는지는 2026년 10월 23일 기준 확인하지 못했다.",
    "1심 선고일(2025년 2월)의 정확한 날짜는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-hankook-20261021",
      title: "'탈북어민 강제북송' 정의용·서훈 1심 선고유예→2심 집행유예",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2026102114480004673",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-20261021",
      title: "'16명 살해 탈북어민 강제북송' 했더니…정의용·서훈, 1심 선고유예→2심서 징역형 집행유예",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10910263",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiatoday-20261021",
      title: "탈북 어민 '강제북송' 정의용·서훈 징역형 집행유예…노영민 무죄",
      publisher: "아시아투데이",
      url: "https://www.asiatoday.co.kr/kn/view.php?key=20261021010007117",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20220713",
      title: "탈북어민 북송사건 고강도 조사 예고…무슨 일 있었나",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20220713_0001941609",
      publishedAt: "2022-07-13",
      type: "press",
      license: "link-only",
    },
  ],
};

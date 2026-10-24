import type { PolicyInput } from "./schema";

/**
 * 인성·공동체 교육 정책 (제3차 인성교육종합계획).
 *
 * 대통령 X 게시물 답글에 "성적만 강조하지 말고 공동체에서 함께 사는 법을 배우는 교육을 해
 * 달라"는 요청이 달렸다(잼통 Voice). 인성교육진흥법에 따른 5개년 계획과 2026년 교육부 업무
 * 계획에서 이 요청과 닿는 부분을 적는다.
 *
 * ★ 제3차 종합계획은 2026년 1월 공청회에 나온 '안'까지 확인했다. 최종 확정본은 찾지 못해
 *   안의 내용을 확정된 정책처럼 쓰지 않는다.
 * ★ 2026-10-24 처음 등록 — 잼통 Voice 이슈 #74.
 */
export const CHARACTER_EDUCATION: PolicyInput = {
  slug: "character-education",
  title: "인성·공동체 교육: 제3차 인성교육종합계획(2026~2030)",
  scope:
    "인성교육진흥법에 따른 제3차 인성교육종합계획(2026~2030)안의 비전·추진 과제, 2026년 교육부 업무계획의 민주시민 " +
    "교육, 시·도교육청 시행계획",
  ministries: ["교육부", "시·도교육청"],
  categories: ["welfare", "institution"],
  asOf: "2026-10-24",
  rumors: [
    {
      id: "rumor-community",
      text: "성적만 강조하지 말고 공동체에서 함께 사는 법을 배우는 교육을 해 달라",
      claimIds: ["claim-law", "claim-plan-tasks", "claim-plan-detail", "claim-civic", "claim-seoul"],
    },
  ],
  claims: [
    {
      id: "claim-law",
      text:
        "인성교육진흥법에 따라 교육부는 5년마다 인성교육종합계획을 세운다. 교육부는 2026년 1월 28일 제3차 계획" +
        "(2026~2030)안 공청회를 열었다.",
      assertionType: "FACT",
      sourceIds: ["src-moe-20260114"],
      verified: true,
    },
    {
      id: "claim-plan-tasks",
      text:
        "계획안의 비전은 \"미래 사회를 주도할 통합적 인성을 갖춘 민주시민 육성\"이다. 추진 과제로 미래 사회 대비 " +
        "인성교육 다양화, 교육 구성원 간 상호 존중과 협력적 소통 강화, 공동체 기반 인성교육 협력 체계 구축, 생애주기 " +
        "맞춤형 인성교육, 학교 인성교육 내실화와 교원 역량 강화를 들었다.",
      assertionType: "FACT",
      sourceIds: ["src-moe-20260114", "src-newsis-20260130"],
      verified: true,
    },
    {
      id: "claim-plan-detail",
      text:
        "안에는 대학생 인성교육 확대(교양 과목·봉사활동 학점제), 학부모 인성교육 콘텐츠, AI 리터러시와 딥페이크 등 " +
        "미디어 범죄 예방 교육, '학생마음건강증진법' 제정과 마음건강 교과(가칭) 도입이 들어 있다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260130"],
      verified: true,
    },
    {
      id: "claim-civic",
      text:
        "2025년 12월 발표된 2026년 교육부 업무계획의 첫 과제는 민주시민 교육과 역사 교육 강화로, 토론식 수업을 넓히고 " +
        "학생들이 헌법 가치를 이해하고 실천하도록 하겠다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "교육부",
      sourceIds: ["src-korea-moe-plan-2026"],
      verified: false,
    },
    {
      id: "claim-seoul",
      text:
        "서울시교육청은 '공동체형 인성'을 핵심 가치로 한 2026 서울인성교육 시행계획을 내고, 초등학교 1학년을 " +
        "'인성교육 집중학년'으로 지정했다.",
      assertionType: "FACT",
      sourceIds: ["src-sen-2026"],
      verified: false,
    },
  ],
  timeline: [
    {
      id: "t-moe-plan",
      date: "2025-12-12",
      datePrecision: "day",
      title: "2026년 교육부 업무계획 발표",
      summary: "첫 과제는 민주시민·역사 교육.",
      claimIds: ["claim-civic"],
    },
    {
      id: "t-hearing",
      date: "2026-01-28",
      datePrecision: "day",
      title: "제3차 인성교육종합계획안 공청회",
      summary: "공동체 기반 인성교육 협력 체계 등.",
      claimIds: ["claim-law", "claim-plan-tasks", "claim-plan-detail"],
    },
  ],
  gaps: [
    "제3차 인성교육종합계획 최종 확정본과 발표일은 확인하지 못했다. 교육부는 2026년 2월 중 발표할 계획이라고 했다.",
    "인성교육 예산과, 입시·성적 중심 교육을 바꾸려는 평가 제도 개편이 함께 추진되는지는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-moe-20260114",
      title: "제3차 인성교육종합계획('26~'30)(안) 공청회 안내",
      publisher: "교육부",
      url: "https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=333&boardSeq=105143&lev=0&searchType=null&statusYN=W&page=1&s=moe&m=0205&opType=N",
      publishedAt: "2026-01-14",
      type: "official",
      license: "public",
    },
    {
      id: "src-newsis-20260130",
      title: "윤곽 드러낸 '제3차 인성교육종합계획'…대학생도 받는다",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260130_0003496878",
      publishedAt: "2026-01-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-korea-moe-plan-2026",
      title: "2026년 교육부 업무계획",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/briefing/policyBriefingView.do?newsId=156734914",
      publishedAt: "2025-12-12",
      type: "official",
      license: "public",
    },
    {
      id: "src-sen-2026",
      title: "'2026 서울인성교육 시행계획' 발표",
      publisher: "서울특별시교육청",
      url: "https://enews.sen.go.kr/news/view.do?bbsSn=190402&step1=3&step2=1",
      type: "official",
      license: "public",
    },
  ],
};

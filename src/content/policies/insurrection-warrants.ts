import type { PolicyInput } from "./schema";

/**
 * 내란 사건 구속영장 기각과 내란전담재판부 (2026년).
 *
 * 대통령 유튜브 영상 답글 두 건에 "법원이 구속영장을 번번이 기각하는 등 사법부를 아직 믿을 수 없으니 사법 개혁과 내란 청산이 더디다"는
 * 아쉬움이 달렸다(잼통 Voice). 특검별 영장 기각 수치와 법원이 든 사유, 내란전담재판부 특례법과 영장판사 배치 논란을 적는다.
 *
 * ★ 사법개혁 3법(법왜곡죄·재판소원·대법관 증원)은 achievement:judicial-reform에 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #233.
 */
export const INSURRECTION_WARRANTS: PolicyInput = {
  slug: "insurrection-warrants",
  title: "내란 사건 구속영장 기각과 내란전담재판부 (2026년)",
  scope:
    "내란·김건희·종합특검의 구속영장 기각률(2026년 7월 집계)과 법원의 기각 사유, 내란전담재판부 특례법(2026년 1월 공포)과 전담 영장판사 배치 논란",
  ministries: ["법원", "특별검사"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-warrants",
      text: "법원이 구속영장을 번번이 기각하는 등 사법부를 아직 믿을 수 없으니 사법 개혁과 내란 청산이 더디다",
      claimIds: ["claim-rates", "claim-reasons", "claim-special-act", "claim-judges"],
    },
  ],
  claims: [
    {
      id: "claim-rates",
      text:
        "뉴시스 집계에 따르면 2026년 2월 출범한 종합특검은 7월 17일까지 구속영장 18건을 청구해 결정된 17건 중 6명이 구속되고 11건이 기각됐다(기각률 64.7%). " +
        "같은 집계에서 내란 특검의 기각률은 46.1%(13건 중 6건), 김건희 특검은 31.0%(29건 중 9건)였다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20260717"],
      verified: true,
    },
    {
      id: "claim-reasons",
      text:
        "법원은 심우정 전 검찰총장 영장을 \"증거 인멸의 염려에 대한 소명이 부족하다\", \"도망할 염려가 있다고 보기 어렵다\"며 기각했고, 김명수 전 합참의장에 대해서는 \"주된 범죄 혐의에 대해 다툼의 여지가 있다\"고 했다. " +
        "법조계에서는 혐의 소명이 충분하지 않은 상태에서 수사 기간 막판에 무리하게 청구했다는 시각도 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20260717"],
      verified: true,
    },
    {
      id: "claim-special-act",
      text:
        "내란·외환·반란 사건을 전담 재판부가 신속히 심리하게 하는 특례법은 2025년 12월 23일 국회를 통과해 2026년 1월 6일 공포·시행됐다. 서울중앙지법은 전담재판부 2개와 전담 영장법관 2명을, 서울고법은 2월 5일 형사1부·12부를 전담재판부로 지정했다. " +
        "윤석열 전 대통령 측과 국민의힘은 위헌이라며 반발했다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1594979", "src-khan-20260212", "src-seoul-20260220-trials"],
      verified: true,
    },
    {
      id: "claim-judges",
      text:
        "민주당 서영교 의원은 내란 사건 임시 영장판사로 이정재·남세진 부장판사가 배치되자, 두 판사가 윤석열 전 대통령 체포영장과 추경호 의원·박성재 전 장관 구속영장을 기각했던 판사라며 반발했다.",
      assertionType: "FACT",
      sourceIds: ["src-daum-20260127"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-judges"],
  timeline: [
    {
      id: "t-act",
      date: "2026-01-06",
      datePrecision: "day",
      title: "내란전담재판부 특례법 공포·시행",
      summary: "2025년 12월 23일 국회 통과.",
      claimIds: ["claim-special-act"],
    },
    {
      id: "t-rates",
      date: "2026-07-17",
      datePrecision: "day",
      title: "종합특검 영장 기각률 64.7%",
      summary: "뉴시스 집계.",
      claimIds: ["claim-rates", "claim-reasons"],
    },
  ],
  gaps: [
    "법원 전체의 내란 관련 영장 발부·기각 통계(특검별이 아닌 공식 집계)는 찾지 못했다.",
    "종합특검 수사 종료 이후 기소·재판 결과는 이 페이지에서 정리하지 않았다.",
  ],
  sources: [
    {
      id: "src-fnnews-20260717",
      title: "종합특검, 수사 기간 막바지 구속영장 '무더기' 기각…기각률 65%",
      publisher: "파이낸셜뉴스(뉴시스)",
      url: "https://www.fnnews.com/news/202607171739042789",
      publishedAt: "2026-07-17",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1594979",
      title: "내란전담재판부 특례법 공포·시행(데일리안 보도)",
      publisher: "데일리안",
      url: "https://m.dailian.co.kr/news/view/1594979",
      publishedAt: "2026-01-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260212",
      title: "서울중앙지법 내란전담재판부·전담 영장법관 지정(경향신문 보도)",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202602121907001/",
      publishedAt: "2026-02-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20260220-trials",
      title: "尹 항소땐 내란전담부로, 한덕수 이상민 등 내란재판 2라운드 돌입 [로:맨스]",
      publisher: "서울신문",
      url: "https://m.seoul.co.kr/news/2026/02/20/20260220500256",
      publishedAt: "2026-02-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-daum-20260127",
      title: "서영교의 분노 \"내란전담재판부법 통과했더니... 기가 막혀\"",
      publisher: "오마이뉴스(다음 게재)",
      url: "https://v.daum.net/v/20260127174232689",
      publishedAt: "2026-01-27",
      type: "press",
      license: "link-only",
    },
  ],
};

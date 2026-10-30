import type { PolicyInput } from "./schema";

/**
 * 6·25전쟁과 자유민주주의에 대한 대통령 발언.
 *
 * 부마민주항쟁 기념일 글(10월 16일) 답글에 "민주화운동만 말하고 6·25와 자유민주주의는
 * 말하지 않는다"는 말이 30건 넘게 달렸다(잼통 Voice). 대통령이 6·25에 무엇을 말했는지,
 * 전문이 공개된 연설에서 '자유민주주의'라는 말을 썼는지를 원문으로 확인해 적는다.
 *
 * ★ "한 번도 말하지 않았다"를 이 페이지가 확정하지 않는다. 전문을 대조한 연설은
 *   2026년 6·25 기념사와 2025년 국군의 날 기념사 둘이다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #81.
 */
export const PRESIDENT_KOREAN_WAR_REMARKS: PolicyInput = {
  slug: "president-korean-war-remarks",
  title: "6·25전쟁과 자유민주주의에 대한 대통령 발언",
  scope:
    "이재명 대통령의 2025년 6·25 75주년 글, 2026년 6·25 76주년 기념사, 2025년 국군의 날 기념사에서 6·25·자유·북한을 어떻게 말했는지",
  ministries: ["국가보훈부"],
  categories: ["diplomacy", "institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-silent",
      text: "민주화 운동만 말하고 6·25와 자유민주주의는 말하지 않는다",
      claimIds: ["claim-2025-post", "claim-2026-speech", "claim-2026-words", "claim-armed-forces", "claim-no-nk"],
    },
  ],
  claims: [
    {
      id: "claim-2025-post",
      text:
        "이재명 대통령은 2025년 6월 25일 '6·25전쟁 75주년을 맞으며'라는 글을 SNS에 올렸다. 국군 장병과 참전용사, " +
        "유가족의 희생에 존경과 감사를 표하고, 참전용사를 영원히 잊지 않겠다고 했다. 군사력에만 의존하는 시대는 " +
        "지났고 평화가 가장 확실한 안보라고도 썼다.",
      assertionType: "FACT",
      sourceIds: ["src-jjan-20250625"],
      verified: true,
    },
    {
      id: "claim-2026-speech",
      text:
        "2026년 6월 25일 수원에서 열린 6·25전쟁 제76주년 기념식에서는 직접 기념사를 했다. 영웅들을 기억하고 기리는 " +
        "것이 국가의 가장 중요한 책무라고 했고, 참전용사의 특별한 희생에 특별한 보상과 예우가 따라야 한다며 " +
        "참전유공자 지원을 대를 이어 계승하겠다고 했다. 오랫동안 공을 인정받지 못한 비정규군 공로자 3명이 포상을 받았다.",
      assertionType: "FACT",
      sourceIds: ["src-newstomato-20260625", "src-asiae-20260625"],
      verified: true,
    },
    {
      id: "claim-2026-words",
      text:
        "2026년 기념사 전문에 '자유'는 두 번 나온다. \"자유와 번영, 평화의 오늘\", \"대한민국이 지금 누리는 이 자유와 " +
        "평화의 토대에는 … 유엔 참전용사들의 거룩한 희생과 헌신이 서려 있습니다\"이다. '자유민주주의'라는 말은 " +
        "나오지 않는다.",
      assertionType: "FACT",
      sourceIds: ["src-newstomato-20260625"],
      verified: true,
    },
    {
      id: "claim-armed-forces",
      text:
        "2025년 10월 1일 국군의 날 기념사 전문에도 '자유민주주의'와 '6·25'라는 말은 없다. \"모든 국민이 평온하고 " +
        "자유로운 일상을 누리며\"라는 대목이 있고, 군이 헌법 정신과 민주주의 가치로 무장해야 한다는 것이 주된 " +
        "내용이었다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20251001", "src-segye-20251001"],
      verified: true,
    },
    {
      id: "claim-no-nk",
      text:
        "헤럴드경제는 2026년 기념사에 북한의 도발이나 북핵 문제, 대북정책에 관한 직접적인 언급이 없었다고 보도했다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20260624"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "같은 보도는 과거 정부들이 6·25 기념식에서 북한의 군사적 위협과 북핵 문제를 짚어 왔던 것과 달리, 이번 " +
        "기념사는 희생을 기리고 평화 비전을 제시하는 데 무게를 두었다고 평했다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-heraldk-20260624"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-2025",
      date: "2025-06-25",
      datePrecision: "day",
      title: "6·25 75주년 SNS 글",
      summary: "참전용사 감사, 평화가 가장 확실한 안보.",
      claimIds: ["claim-2025-post"],
    },
    {
      id: "t-armed",
      date: "2025-10-01",
      datePrecision: "day",
      title: "국군의 날 기념사",
      summary: "헌법 정신과 민주주의 가치를 강조.",
      claimIds: ["claim-armed-forces"],
    },
    {
      id: "t-2026",
      date: "2026-06-25",
      datePrecision: "day",
      title: "6·25 76주년 기념식 기념사",
      summary: "특별한 희생에 특별한 보상.",
      claimIds: ["claim-2026-speech", "claim-2026-words"],
    },
  ],
  gaps: [
    "대통령의 모든 연설과 SNS 글에서 '자유민주주의'를 쓴 적이 있는지는 전수 확인하지 못했다. 이 페이지는 전문을 대조한 두 연설만 말한다.",
    "2025년 6·25 SNS 글의 원문 주소는 확인하지 못했다. 보도로 확인했다.",
    "북한을 언급하지 않은 데 대한 정부의 공식 설명은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-jjan-20250625",
      title: "이 대통령 \"평화가 곧 경제이자 국민 생존과 직결되는 시대\"",
      publisher: "전북일보",
      url: "https://www.jjan.kr/article/20250625580124",
      publishedAt: "2025-06-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstomato-20260625",
      title: "이 대통령 \"국가 위한 희생에 마땅한 보상이 정부 원칙\"(전문)",
      publisher: "뉴스토마토",
      url: "https://www.newstomato.com/readnews.aspx?no=1305152",
      publishedAt: "2026-06-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20260625",
      title: "6·25 기념식 참석한 李대통령 \"강력한 국방력으로 평화의 한반도 만들겠다\"",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026062509523203691",
      publishedAt: "2026-06-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20251001",
      title: "[전문]이재명 대통령 제77주년 국군의 날 기념사",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20251001_0003351974",
      publishedAt: "2025-10-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20251001",
      title: "李대통령 \"불법계엄 잔재 말끔히 청산…헌법수호 군대로 재건\"",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20251001507326",
      publishedAt: "2025-10-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldk-20260624",
      title: "李대통령 \"특별한 희생에는 특별한 보상\"…6·25 기념식 北 언급은 없어",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026062418112680050",
      publishedAt: "2026-06-24",
      type: "press",
      license: "link-only",
    },
  ],
};

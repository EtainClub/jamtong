import type { PolicyInput } from "./schema";

/**
 * 태권도 유네스코 인류무형유산 등재: 북한 단독 신청, 한국 신청, 남북 공동 등재 시도.
 *
 * 11월 초 대통령 X 게시물 답글에 "정부가 태권도와 관련된 권리까지 북한에 넘겨주려 한다"는 말이 달렸다(잼통 Voice).
 * 2026년 11월 북한의 단독 신청이 등재 권고를 받으면서 나온 말로 보인다. 누가 언제 무엇을 신청했는지,
 * 등재가 '권리'를 주는 것인지, 정부가 무엇을 했는지 적는다.
 *
 * ★ "공동등재 서한을 보냈다"는 것은 국가유산청 설명이다. MBN의 '서한 미발송' 보도와 엇갈리므로 CLAIM으로 적는다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #270.
 */
export const TAEKWONDO_UNESCO: PolicyInput = {
  slug: "taekwondo-unesco",
  title: "태권도 유네스코 무형유산 등재와 남북 공동 등재 시도 (2024~2026)",
  scope:
    "북한의 태권도 단독 등재 신청(2024년 3월)과 2026년 11월 등재 권고, 한국의 별도 신청(2026년 3월), 공동 등재 서한 논란, 등재의 법적 의미",
  ministries: ["국가유산청", "통일부", "문화체육관광부"],
  categories: ["diplomacy"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-rights",
      text: "정부가 태권도와 관련된 권리까지 북한에 넘겨주려 한다",
      claimIds: ["claim-nk-nomination", "claim-no-exclusive", "claim-kr-nomination", "claim-letters"],
    },
  ],
  claims: [
    {
      id: "claim-nk-nomination",
      text:
        "북한은 2024년 3월 '조선의 전통 무술 태권도'를 단독으로 유네스코 인류무형유산 대표목록 등재 신청했다. 허민 국가유산청장은 2026년 11월 2일 " +
        "이 신청이 평가기구의 '등재 권고'를 받을 것으로 예상된다고 밝혔다. 최종 결정은 12월 중국 샤먼에서 열리는 제21차 무형유산위원회에서 한다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20261102"],
      verified: true,
    },
    {
      id: "claim-no-exclusive",
      text:
        "허민 청장은 북한이 단독 등재되더라도 태권도에 대한 배타적 권리가 생기는 것은 아니라고 설명했고, 한국은 '확장 등재' 또는 별도 등재를 " +
        "계속 추진한다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "국가유산청장",
      sourceIds: ["src-khan-20261102", "src-korea-20261106"],
      verified: true,
    },
    {
      id: "claim-kr-nomination",
      text:
        "한국도 2026년 3월 '태권도: 도장 기반 공동체 수련 문화'라는 이름으로 별도 등재 신청서를 냈다. 정부는 남북 공동 등재를 목표로 했으나, 청장은 남북 관계 여건상 " +
        "공동 등재는 현시점에서 \"사실상 어려울 것\"이라고 했다. 한국 신청은 새 심사를 거쳐야 해 시간이 걸린다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20261102", "src-heraldk-20260331"],
      verified: true,
    },
    {
      id: "claim-letters",
      text:
        "MBN이 11월 5일 국가유산청이 공동 등재 공문을 보내지 않고 보냈다고 답했다고 보도하자, 국가유산청은 이튿날 \"국가유산청은 2026년 4월에, 통일부는 6월에\" " +
        "공동 등재 추진 공식 서한을 유네스코 사무총장 앞으로 보냈다고 반박했다. 북한 등재가 결정되더라도 한국 태권도의 단독 또는 확장 등재를 추진하겠다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "국가유산청",
      sourceIds: ["src-korea-20261106"],
      verified: true,
    },
    {
      id: "claim-ssireum",
      text:
        "남북이 각각 신청했다가 공동 등재에 성공한 선례는 2018년 씨름이다. 2024년에는 북한 쪽 국제태권도연맹(ITF) 총재가 씨름 선례대로 공동 추진하자는 뜻을 국내 민간 추진단에 전했다고 추진단장이 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20261102", "src-jjan-20240817"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-nk",
      date: "2024-03",
      datePrecision: "month",
      title: "북한 단독 등재 신청",
      summary: "조선의 전통 무술 태권도.",
      claimIds: ["claim-nk-nomination"],
    },
    {
      id: "t-kr",
      date: "2026-03",
      datePrecision: "month",
      title: "한국 별도 등재 신청",
      summary: "도장 기반 공동체 수련 문화.",
      claimIds: ["claim-kr-nomination"],
    },
    {
      id: "t-letters",
      date: "2026-04",
      datePrecision: "month",
      title: "공동 등재 서한(국가유산청 4월, 통일부 6월)",
      summary: "국가유산청 설명.",
      claimIds: ["claim-letters"],
    },
    {
      id: "t-recommend",
      date: "2026-11-02",
      datePrecision: "day",
      title: "북한 신청 등재 권고 예상",
      summary: "12월 샤먼 위원회에서 최종 결정.",
      claimIds: ["claim-nk-nomination", "claim-no-exclusive"],
    },
  ],
  gaps: [
    "유네스코 위원회의 최종 결정(12월)은 아직 나오지 않았다.",
    "국가유산청·통일부 서한의 원문은 공개되지 않아 내용을 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-khan-20261102",
      title: "북한 단독 등재 신청 '태권도', 유네스코 무형유산 유력…남북 공동등재는 난항",
      publisher: "경향신문",
      url: "https://khan.co.kr/article/202611021504001",
      publishedAt: "2026-11-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-korea-20261106",
      title: "'태권도 유네스코 서한 미발송' 보도는 사실이 아닙니다",
      publisher: "국가유산청(대한민국 정책브리핑)",
      url: "https://m.korea.kr/briefing/actuallyView.do?newsId=148975207",
      publishedAt: "2026-11-06",
      type: "official",
      license: "public",
    },
    {
      id: "src-heraldk-20260331",
      title: "'태권도'·'인삼문화', 유네스코 인류무형유산 등재 도전",
      publisher: "헤럴드K",
      url: "https://www.heraldk.com/article/2026033116093341899",
      publishedAt: "2026-03-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-jjan-20240817",
      title: "최재춘 KOREA 태권도 유네스코 추진단장 \"남북 공동 등재는 경직된 남북관계 변화 기회\"",
      publisher: "전북일보",
      url: "https://www.jjan.kr/articleAmp/20240817580065",
      publishedAt: "2024-08-17",
      type: "press",
      license: "link-only",
    },
  ],
};

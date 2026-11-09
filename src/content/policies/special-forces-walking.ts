import type { PolicyInput } from "./schema";

/**
 * 특전사 '모델 워킹' 행사(2026년 10월 29일) 경위와 육군 해명.
 *
 * 대통령 유튜브 영상 답글에 "특전사 장병에게 모델 워킹 연습을 시키는 행사는 해외에서도 비웃음을 산다"는
 * 비판이 달렸다(잼통 Voice). 행사가 누가 기획한 무엇이었는지, 육군이 무엇을 인정했는지 적는다.
 *
 * ★ 국방부·청와대 지시가 아니라 부대 자체 기획이라는 것은 육군의 설명이다. CLAIM으로 적는다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #272.
 */
export const SPECIAL_FORCES_WALKING: PolicyInput = {
  slug: "special-forces-walking",
  title: "특전사 '모델 워킹' 행사 논란 (2026년 10~11월)",
  scope: "육군 특수전사령부 제1공수특전여단의 'K워킹 퍼포먼스 밀리터리 페스티벌' 경위, 비판, 육군의 해명과 부적절 인정",
  ministries: ["국방부", "육군"],
  categories: ["diplomacy", "institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-runway",
      text: "특전사 장병에게 모델 워킹 연습을 시키는 행사는 해외에서도 비웃음을 사는 일이다",
      claimIds: ["claim-event", "claim-army", "claim-foreign"],
    },
  ],
  claims: [
    {
      id: "claim-event",
      text:
        "육군 특수전사령부 제1공수특전여단은 2026년 10월 29일 부대 체육관에서 'K워킹 퍼포먼스 밀리터리 페스티벌'을 열었다. 공개된 영상에는 " +
        "여성 모델이 군복 차림의 장병들에게 걸음걸이와 포즈를 가르치고, 장병들이 한 명씩 나와 패션쇼처럼 걷는 장면이 담겼다. TV조선 보도로 알려졌다.",
      assertionType: "FACT",
      sourceIds: ["src-wikitree-1171849", "src-ytn-20261105"],
      verified: true,
    },
    {
      id: "claim-criticism",
      text:
        "국민의힘 박충권 의원은 11월 4일 페이스북에서 북한의 도발이 이어지는 가운데 특전사에 패션모델을 불러 워킹을 가르친다고 국방부를 비판했다. " +
        "다만 \"일선 장병에게는 죄가 없다\"고 덧붙였다.",
      assertionType: "FACT",
      sourceIds: ["src-imaeil-20261105", "src-heraldbiz-10927025"],
      verified: true,
    },
    {
      id: "claim-army",
      text:
        "육군은 인성교육의 하나로 바른 자세와 걸음걸이를 익히게 하려고 부대가 자체적으로 계획하고 강사를 섭외한 프로그램이라고 설명했다. " +
        "그러면서 교육 내용이 부대 특성과 장병 눈높이에 맞지 않아 부적절했고 사전 검토도 미흡했다고 인정하고, 장병 의견을 듣고 교육 내용을 다시 검토하겠다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "육군",
      sourceIds: ["src-ytn-20261105", "src-imaeil-20261105"],
      verified: true,
    },
    {
      id: "claim-context",
      text:
        "이 여단은 2024년 12·3 비상계엄 때 병력이 국회에 동원된 부대이며, 당시 여단장은 계엄 관련 재판을 받고 있다. 이 때문에 교육 취지에 의문을 제기하는 목소리가 더 커졌다는 보도가 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-wikitree-1171849"],
      verified: true,
    },
    {
      id: "claim-foreign",
      text:
        "Korea Herald와 Asia News Network 등 영문 매체도 이 행사를 '특수부대원에게 런웨이 워킹을 가르쳤다'는 논란으로 보도했다.",
      assertionType: "FACT",
      sourceIds: ["src-koreaherald-10927133", "src-ann-runway"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-criticism", "claim-army"],
  timeline: [
    {
      id: "t-event",
      date: "2026-10-29",
      datePrecision: "day",
      title: "부대 행사",
      summary: "1공수여단 체육관.",
      claimIds: ["claim-event"],
    },
    {
      id: "t-army",
      date: "2026-11-05",
      datePrecision: "day",
      title: "육군 \"부적절, 사전 검토 미흡\"",
      summary: "보도·비판 뒤 해명.",
      claimIds: ["claim-criticism", "claim-army"],
    },
  ],
  gaps: [
    "행사에 든 비용과 강사 섭외 경위(예산 출처)는 공개되지 않았다.",
    "육군 상급부대나 국방부가 사전에 이 행사를 알았는지는 보도에서 확인되지 않는다.",
  ],
  sources: [
    {
      id: "src-wikitree-1171849",
      title: "여자 모델들 따라 걸으며 웃음...특전사 부대 '행사 영상' 논란",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1171849",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ytn-20261105",
      title: "특전사 모델 워킹 교육 논란과 육군 해명(YTN 보도)",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0103_202611051133536270",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-imaeil-20261105",
      title: "특전사 모델 워킹 행사 논란(매일신문 보도)",
      publisher: "매일신문",
      url: "https://www.imaeil.com/page/view/2026110508541406441",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldbiz-10927025",
      title: "박충권 의원의 특전사 모델 워킹 교육 비판(헤럴드경제 보도)",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10927025",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-koreaherald-10927133",
      title: "Special forces soldiers taught runway walks and model poses in what Army says was training intended to improve posture",
      publisher: "The Korea Herald",
      url: "https://www.koreaherald.com/article/10927133",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ann-runway",
      title: "Soldiers on the runway? South Korean army event sparks backlash",
      publisher: "Asia News Network",
      url: "https://asianews.network/soldiers-on-the-runway-south-korean-army-event-sparks-backlash/",
      publishedAt: "2026-11",
      type: "press",
      license: "link-only",
    },
  ],
};

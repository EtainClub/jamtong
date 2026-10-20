import type { PolicyInput } from "./schema";

/**
 * 북한군 포로 송환과 한·우크라이나 외교 갈등.
 *
 * 인스타그램에 "이재명 정부가 북한의 반응을 의식해 우크라이나에 생포된 북한군
 * 포로 문제를 외면하고 있다", "우크라이나 등 우방과 갈등을 빚고 있다",
 * "우크라이나 대사를 소환했다"는 주장이 돈다(2026년 10월).
 *   - 포로 2명은 2026년 9월 한국에 도착했다. '외면'과는 사실관계가 다르다.
 *   - 대사 소환과 갈등은 사실이다. 다만 정부가 밝힌 이유는 비공개 합의를
 *     우크라이나가 깨고 부인했다는 것이다. '북한을 의식해서'라는 동기를
 *     뒷받침하는 자료는 찾지 못했다 — 동기는 판정하지 않는다.
 *
 * ★ 비공개 합의가 있었는지는 양국 주장이 엇갈린다. 둘 다 CLAIM으로 둔다.
 * ★ 2026-10-20 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #51·#52.
 */
export const UKRAINE_POW_DISPUTE: PolicyInput = {
  slug: "ukraine-pow-dispute",
  title: "북한군 포로 송환과 우크라이나 대사 소환",
  scope:
    "우크라이나군에 생포된 북한군 포로 2명의 한국 송환, 송환 사실 공개를 둘러싼 한·우크라이나 갈등과 " +
    "한국 정부의 외교 조치(2026년 9~10월)",
  ministries: ["외교부", "청와대"],
  categories: ["diplomacy"],
  asOf: "2026-10-20",
  rumors: [
    {
      id: "rumor-ignore-pow",
      text: "이재명 정부가 북한의 반응을 의식해 우크라이나에 생포된 북한군 포로 문제를 외면하고 있다",
      claimIds: ["claim-arrived", "claim-gov-principle"],
    },
    {
      id: "rumor-recall",
      text: "이재명 정부가 북한을 의식해 우크라이나와 갈등을 빚고 우크라이나 대사를 소환했다",
      claimIds: ["claim-dispute-start", "claim-recall", "claim-ukraine-side", "claim-withdraw"],
    },
  ],
  claims: [
    {
      id: "claim-arrived",
      text:
        "2025년 1월 러시아 쿠르스크에서 우크라이나군에 생포된 북한군 포로 2명이 2026년 9월 한국으로 왔다. " +
        "젤렌스키 우크라이나 대통령은 9월 23일(현지시간) 유엔총회 연설에서 \"최근 북한군 전쟁 포로 2명을 " +
        "대한민국으로 보냈다\"고 밝혔고, 외교부는 송환 사실을 부인하지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-pow-20260924"],
      verified: true,
    },
    {
      id: "claim-gov-principle",
      text:
        "외교부는 그동안 우크라이나 등 관련국과 협의해 왔으며, 이 문제는 \"당사자들의 자유의사를 존중하고 국제법과 " +
        "인도주의 원칙에 부합하는 방식으로 해결돼야 한다\"고 밝혔다. 신병·경로 등은 당사자와 가족의 신변안전을 " +
        "이유로 공개하지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "외교부",
      sourceIds: ["src-hankyung-pow-20260924"],
      verified: true,
    },
    {
      id: "claim-dispute-start",
      text:
        "정부는 송환을 비공개로 하기로 한 합의를 우크라이나가 일방적으로 깼다며 9월 28일 주한 우크라이나 대사대리를 " +
        "초치해 공식 사과를 요구했다. 대통령은 10월 2일 X에서 우크라이나가 합의 사실 자체를 부인했다고 비판하고, " +
        "사과를 계속 거부하면 추가 조치를 하겠다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "외교부·이재명 대통령",
      sourceIds: ["src-newdaily-pow-20261020", "src-weeklykhan-pow-20261008"],
      verified: true,
    },
    {
      id: "claim-ukraine-side",
      text:
        "우크라이나 측은 비공개 합의 자체가 없었다고 했다. 젤렌스키 대통령 보좌관은 공개 사흘 뒤 합의를 부인했고, " +
        "시비하 외무장관은 10월 12일 \"종결된 사안\"이라며 사과 요구를 사실상 거부했다.",
      assertionType: "CLAIM",
      assertedBy: "우크라이나 대통령실·외무부",
      sourceIds: ["src-nocut-pow-20261019", "src-newdaily-pow-20261020"],
      verified: true,
    },
    {
      id: "claim-recall",
      text:
        "정부는 10월 8일 박기창 주우크라이나 대사를 본국으로 소환하기로 결정했다. 조현 외교부 장관은 10월 6일 " +
        "국정감사에서 우크라이나로부터 사과 표현이 담긴 메시지를 받았지만 정부 기대에 못 미친다고 말했었다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-pow-20261008", "src-newdaily-pow-20261020"],
      verified: true,
    },
    {
      id: "claim-embassy-testimony",
      text:
        "윤지완 주우크라이나 대사대리는 10월 18일 국정감사에서 \"송환 시점이나 공개 여부에 대해 사전에 공개 계획을 " +
        "논의한 바 없다\", \"오히려 비공개 상태를 최대한 오래 유지하는 것이 바람직하다는 데 뜻을 모았었다\"고 했다. " +
        "합의를 문서로 남기지는 않았다고 답했다.",
      assertionType: "CLAIM",
      assertedBy: "윤지완 주우크라이나 대사대리",
      sourceIds: ["src-nocut-pow-20261019"],
      verified: true,
    },
    {
      id: "claim-withdraw",
      text:
        "외교부는 10월 20일 대사 소환 뒤에도 우크라이나 측의 전향적 조치가 없고 공습 위협이 있다며 공관원 일부 " +
        "철수를 결정했다. 영사 인력은 남고 대사대리를 중심으로 외교 소통은 이어 간다.",
      assertionType: "FACT",
      sourceIds: ["src-newdaily-pow-20261020"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-un",
      date: "2026-09-23",
      datePrecision: "day",
      title: "젤렌스키, 유엔총회에서 포로 송환 공개",
      summary: "포로 2명은 이미 한국에 와 있었다.",
      claimIds: ["claim-arrived"],
    },
    {
      id: "t-summon",
      date: "2026-09-28",
      datePrecision: "day",
      title: "주한 우크라이나 대사대리 초치",
      summary: "정부는 비공개 합의 위반이라며 사과를 요구했다.",
      claimIds: ["claim-dispute-start"],
    },
    {
      id: "t-recall",
      date: "2026-10-08",
      datePrecision: "day",
      title: "주우크라이나 대사 소환 결정",
      summary: "우크라이나 측은 합의가 없었다고 맞섰다.",
      claimIds: ["claim-recall", "claim-ukraine-side"],
    },
    {
      id: "t-withdraw",
      date: "2026-10-20",
      datePrecision: "day",
      title: "공관원 일부 철수 결정",
      summary: "영사 인력은 남는다.",
      claimIds: ["claim-withdraw"],
    },
  ],
  critiqueIds: ["claim-ukraine-side", "claim-embassy-testimony"],
  gaps: [
    "정부가 북한의 반응을 의식해 조치했다는 주장을 뒷받침하거나 반박하는 공식 자료는 찾지 못했다. 정부가 밝힌 이유는 비공개 합의 위반이다.",
    "비공개 합의는 문서로 남지 않았다. 합의가 있었는지는 양국 주장이 엇갈린다.",
    "송환된 2명의 정착 절차와 우크라이나에 남은 다른 북한군 포로가 있는지는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-hankyung-pow-20260924",
      title: "젤렌스키 \"북한군 포로 2명 최근 韓 보내\"…정부, 사실상 인정 [종합]",
      publisher: "한국경제",
      url: "https://hankyung.com/article/2026092448777",
      publishedAt: "2026-09-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-weeklykhan-pow-20261008",
      title: "외교부 \"주우크라이나 대사 국내 소환\"",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202610081729011",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nocut-pow-20261019",
      title: "주우크라 대사대리 \"北포로 송환, 공개시점 서로 얘기 안해\"",
      publisher: "CBS노컷뉴스",
      url: "https://nocutnews.co.kr/news/6593126",
      publishedAt: "2026-10-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newdaily-pow-20261020",
      title: "정부, 우크라이나에 '초강수' … 대사 소환 이어 공관원 일부 철수",
      publisher: "뉴데일리",
      url: "https://www.newdaily.co.kr/site/data/html/2026/10/20/2026102000260.html",
      publishedAt: "2026-10-20",
      type: "press",
      license: "link-only",
    },
  ],
};

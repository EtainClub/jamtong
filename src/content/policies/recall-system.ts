import type { PolicyInput } from "./schema";

/**
 * 국회의원 국민소환제: 발의된 법안과 '법률이냐 개헌이냐' 논쟁.
 *
 * 대통령 유튜브 영상 답글에 "국회의원을 해마다 평가해 자질이 부족하면 자격을 박탈하는 제도를 만들자"는 제안이 달렸다(잼통 Voice).
 * 이와 가장 가까운 제도인 국민소환제의 입법 상황을 적는다.
 *
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #241.
 */
export const RECALL_SYSTEM: PolicyInput = {
  slug: "recall-system",
  title: "국회의원 국민소환제 입법 논의",
  scope: "22대 국회에 발의된 국회의원 국민소환법안의 청구·가결 요건, 민주당의 '법률로 추진' 방침과 개헌 필요론, 2025년 초 대통령(당시 대표)의 언급",
  ministries: ["국회"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-evaluate",
      text: "국회의원을 해마다 평가해 자질이 부족하면 자격을 박탈하는 제도를 만들자",
      claimIds: ["claim-choi-bill", "claim-law-vs-constitution"],
    },
  ],
  claims: [
    {
      id: "claim-choi-bill",
      text:
        "민주당 최민희 의원은 2025년 1월 '국회의원의 국민소환에 관한 법률안'을 대표발의했다. 지역구 선거구 획정 상한 인구의 30%에 해당하는 유권자 서명으로 소환투표를 청구하고, " +
        "투표권자 3분의 1 이상이 투표해 유효투표 과반이 찬성하면 의원직을 잃는 구조다. 22대 국회에는 이광희 의원도 비슷한 법안을 냈다.",
      assertionType: "FACT",
      sourceIds: ["src-zdnet-20250106", "src-kgnews-825512"],
      verified: true,
    },
    {
      id: "claim-law-vs-constitution",
      text:
        "이재명 당시 대표가 2025년 2월 국민소환제를 다시 꺼내자, 민주당 조승래 수석대변인은 이미 발의된 법안으로 논의하면 된다며 개헌이 아닌 법률로 추진하겠다고 밝혔다. " +
        "반면 헌법이 보장하는 국회의원 임기와 충돌할 수 있어 개헌으로 도입해야 한다는 의견도 많다. 2018년 문재인 대통령 개헌안에도 국민소환제가 들어 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-imbc-6685203", "src-kmib-1739179754"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-bill",
      date: "2025-01-06",
      datePrecision: "day",
      title: "국민소환법안 대표발의",
      summary: "최민희 의원.",
      claimIds: ["claim-choi-bill"],
    },
  ],
  gaps: [
    "국민소환법안들의 2026년 국회 심사 경과(행정안전위원회 상정 여부)는 확인하지 못했다.",
    "의원을 해마다 평가해 자격을 박탈하는 방식의 제도는 발의된 법안에서 찾지 못했다. 현행 법안은 유권자의 소환투표 방식이다.",
  ],
  sources: [
    {
      id: "src-zdnet-20250106",
      title: "\"투표 통과하면 의원직 상실\"...최민희, 국민소환제 법안 발의",
      publisher: "ZDNet Korea",
      url: "https://zdnet.co.kr/view/?no=20250106163149",
      publishedAt: "2025-01-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kgnews-825512",
      title: "최민희 의원, 국회의원 국민소환제 도입 법안 발의",
      publisher: "경기신문",
      url: "https://www.kgnews.co.kr/news/article.html?no=825512",
      publishedAt: "2025-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-imbc-6685203",
      title: "민주당 \"국회의원 국민소환제, 개헌 아닌 법안으로 추진\"",
      publisher: "MBC",
      url: "https://imnews.imbc.com/news/2025/politics/article/6685203_36711.html",
      publishedAt: "2025-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kmib-1739179754",
      title: "'국회의원 국민소환제' 다시 꺼낸 이재명… 정치권 '개헌' 논의 맞불",
      publisher: "국민일보",
      url: "https://www.kmib.co.kr/article/view.asp?arcid=1739179754",
      publishedAt: "2025-02-10",
      type: "press",
      license: "link-only",
    },
  ],
};

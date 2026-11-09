import type { PolicyInput } from "./schema";

/**
 * 전자감독(전자발찌) 대상자 관리: 인력·예산·재범과 2026년 대응.
 *
 * 대통령 유튜브 영상 답글 세 건에 "전자발찌를 차는 범죄자의 형기를 늘리지 않는 것이 재정 부담 때문인가"라는 질문이 달렸다(잼통 Voice).
 * 전자감독 대상자 수·예산·인력이 어떻게 변했는지, 2026년 사건 뒤 법무부가 무엇을 하겠다고 했는지 적는다.
 *
 * ★ 형량은 법원이 법정형 안에서 정하고, 전자감독은 형과 별개로 부과되는 보안처분이다. 형기를 늘리지 않는 이유가 재정이라는 자료는 없다(gaps).
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #228.
 */
export const ELECTRONIC_MONITORING: PolicyInput = {
  slug: "electronic-monitoring",
  title: "전자감독(전자발찌) 대상자 관리: 인력·예산·재범 (2026년)",
  scope:
    "전자감독 대상자·전담 인력·예산의 변화(2022~2026), 대상자 성폭력 재범, 2026년 남양주·인천 사건과 법무부의 감독 체계 재점검, 2027년 증원 계획",
  ministries: ["법무부"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-sentence",
      text: "전자발찌를 차는 범죄자의 형기를 늘리지 않는 것이 재정 부담 때문인가",
      claimIds: ["claim-scale", "claim-budget", "claim-recidivism", "claim-response"],
    },
  ],
  claims: [
    {
      id: "claim-scale",
      text:
        "전자감독 대상자는 2022년 4,316명에서 2026년 8월 5,301명으로 23% 늘었지만, 전담 인력은 255명에서 234명으로 줄었다. 직원 1명이 맡는 대상자는 17.1명에서 20.3명으로 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-2026101404087", "src-hankyung-202610153148"],
      verified: true,
    },
    {
      id: "claim-budget",
      text:
        "전자감독 예산은 2022년 274억 원에서 2026년 373억 원으로 36.1% 늘었다. 같은 기간 감독 경보는 2022년 253만 건에서 2026년 8월까지 506만 건으로 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-202610153148"],
      verified: true,
    },
    {
      id: "claim-recidivism",
      text:
        "박지원 의원실이 법무부 자료를 분석한 결과 2022년 1월부터 2026년 8월까지 전자감독 대상자의 성폭력 동종 재범은 106건, 한 달 평균 약 1.9건이었다. " +
        "2026년 3월 남양주에서는 감독 대상자가 20대 여성을 살해했고, 10월 13일 인천에서는 살인미수 전력이 있는 감독 대상자가 대형 상업시설에서 8명을 흉기로 찔렀다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-2026101404087", "src-hankyung-202610153148"],
      verified: true,
    },
    {
      id: "claim-response",
      text:
        "법무부는 인천 사건 뒤 사과하고 감독 체계를 전면 재점검하겠다고 했다. 2027년에 전담 인력을 46명 늘려 567명으로 키우는 계획이 보도됐고, 1인당 관리 대상을 12명 수준으로 낮추려 157명 증원안을 마련했다는 보도도 있다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeonggi-20261021", "src-segye-20261014"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-scale", "claim-recidivism"],
  timeline: [
    {
      id: "t-namyangju",
      date: "2026-03",
      datePrecision: "month",
      title: "남양주 감독 대상자 살인",
      summary: "정보 공유 미흡 지적.",
      claimIds: ["claim-recidivism"],
    },
    {
      id: "t-incheon",
      date: "2026-10-13",
      datePrecision: "day",
      title: "인천 감독 대상자 흉기 난동",
      summary: "법무부 사과, 체계 재점검.",
      claimIds: ["claim-recidivism", "claim-response"],
    },
  ],
  gaps: [
    "전자발찌 부착 대상 범죄의 형량을 재정 부담 때문에 낮게 유지한다는 정부 자료나 발언은 찾지 못했다. 형량은 법원이 정한다.",
    "2027년 전자감독 인력 증원 규모는 보도마다 달라(46명·157명) 예산안 원문으로 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-hankyung-2026101404087",
      title: "전자발찌 차고도 한 달에 2건꼴로 성폭력 재범…관리 인력은 외려 줄어",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2026101404087",
      publishedAt: "2026-10-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-202610153148",
      title: "전과 23범, 전자발찌 차고 범죄…373억 써도 속수무책",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/202610153148H",
      publishedAt: "2026-10-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kyeonggi-20261021",
      title: "전자발찌 대상자 5천명 돌파에 관리 인력 부족…법무부, 내년 46명 증원",
      publisher: "경기일보",
      url: "https://www.kyeonggi.com/article/20261021580597",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20261014",
      title: "감독관 1명이 전자발찌 20명 관리… '위험 징후' 파악 한계",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20261014520659",
      publishedAt: "2026-10-14",
      type: "press",
      license: "link-only",
    },
  ],
};

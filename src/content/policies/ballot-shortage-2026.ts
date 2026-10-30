import type { PolicyInput } from "./schema";

/**
 * 2026년 6·3 지방선거 투표용지 부족 사태와 부정선거 주장.
 *
 * 부마민주항쟁 기념일 글(10월 16일) 답글에 "투표용지가 없어 투표하지 못한 국민이 있는데 정부는
 * 참정권도 보장하지 못한다", "선관위가 부정선거를 저질렀다"는 말이 달렸다(잼통 Voice).
 * 6월 3일 무엇이 있었는지, 누가 책임을 졌는지, 부정선거 주장에 대해 법원이 어떻게 판단해
 * 왔는지 적는다.
 *
 * ★ 중앙선거관리위원회는 헌법기관으로 정부 소속이 아니다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #101.
 */
export const BALLOT_SHORTAGE_2026: PolicyInput = {
  slug: "ballot-shortage-2026",
  title: "2026년 6·3 지방선거 투표용지 부족 사태와 부정선거 주장",
  scope:
    "제9회 전국동시지방선거 본투표일의 투표용지 부족 규모와 원인 조사, 선관위원장·사무총장 사퇴와 국정조사, 21대 총선 부정선거 소송에 대한 대법원 판단",
  ministries: ["중앙선거관리위원회", "국회"],
  categories: ["institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-ballot",
      text: "투표용지가 없어 투표하지 못한 국민이 있는데 정부는 헌법상 참정권도 보장하지 못한다",
      claimIds: ["claim-shortage", "claim-scale", "claim-responsibility", "claim-nec-status"],
    },
    {
      id: "rumor-fraud",
      text: "선거관리위원회가 부정선거를 저질렀다",
      claimIds: ["claim-cause", "claim-supreme-court", "claim-all-dismissed"],
    },
  ],
  claims: [
    {
      id: "claim-shortage",
      text:
        "2026년 6월 3일 지방선거 본투표일에 서울 송파·강남·광진·동작구 등의 투표소에서 투표용지가 떨어져 유권자들이 " +
        "기다리거나 투표가 중단됐다. 국민의힘은 중대한 참정권 침해라며 서울 개표 중단과 선거 연기를 요구했다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20260603", "src-dailian-1652009"],
      verified: true,
    },
    {
      id: "claim-scale",
      text:
        "선관위 집계로 전국 91개 투표소에서 추가로 받은 투표용지를 썼고, 이 가운데 26곳은 투표가 잠시라도 중지됐다가 " +
        "재개됐다. 서울 송파구가 15곳으로 가장 많았다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260610"],
      verified: true,
    },
    {
      id: "claim-responsibility",
      text:
        "노태악 중앙선관위원장과 허철훈 사무총장이 6월 5일 책임을 지고 사퇴했다. 선관위는 외부 인사 6명으로 진상규명" +
        "위원회를 꾸려 6월 10~19일 운영했고, 국회는 '투표용지 부족 사태 등 국민 참정권 침해 진상규명 및 선거관리 개혁을 " +
        "위한 국정조사 특별위원회'를 가동했다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20260605", "src-newsis-20260610", "src-dailian-1654687", "src-kbmaeil-20260714"],
      verified: true,
    },
    {
      id: "claim-cause",
      text:
        "선관위는 투표율이 지난 선거보다 높아 준비한 용지가 모자랐다고 설명했다. 진상규명위원장은 첫 회의 뒤 투표용지가 " +
        "부족할 때의 대응 매뉴얼이 없었음을 확인했고, 인쇄 매수를 줄이라는 지침이 내려간 배경을 선관위에 요청했다고 " +
        "밝혔다. 조작 정황이 나왔다는 발표는 없다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1652009", "src-dailian-1654687"],
      verified: false,
    },
    {
      id: "claim-nec-status",
      text:
        "중앙선거관리위원회는 헌법 제114조에 따른 독립 헌법기관으로, 행정부(정부)에 속하지 않는다.",
      assertionType: "FACT",
      sourceIds: ["src-law-constitution-114"],
      verified: true,
    },
    {
      id: "claim-supreme-court",
      text:
        "대법원은 2022년 7월 인천 연수을 선거무효 소송에서 21대 총선 조작 주장을 처음 판단해 기각했다. 2021년 6월 재검표로 " +
        "표 차이가 2,614표로 줄었을 뿐 결과는 바뀌지 않았고, 재판부는 부정선거 실행 주체의 존재 등을 구체적으로 증명하지 " +
        "못하고 의혹 제기에 그쳤다고 보았다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20220727", "src-lawtimes-180537"],
      verified: true,
    },
    {
      id: "claim-all-dismissed",
      text:
        "선관위 자료에 따르면 21대 총선 관련 선거·당선 무효 소송은 126건이었고, 법원이 인용한 것은 한 건도 없다.",
      assertionType: "FACT",
      sourceIds: ["src-tf-2181621"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "뉴스타파는 국정조사로 이번 사태가 선관위의 구조적 문제와 오랜 부실에서 비롯됐다는 사실이 드러났다고 평가했다.",
      assertionType: "OPINION",
      sourceIds: ["src-newstapa-zSXoe"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-2022",
      date: "2022-07",
      datePrecision: "month",
      title: "대법원, 21대 총선 조작 주장 첫 기각",
      summary: "인천 연수을.",
      claimIds: ["claim-supreme-court"],
    },
    {
      id: "t-election",
      date: "2026-06-03",
      datePrecision: "day",
      title: "지방선거 투표용지 부족",
      summary: "91곳 추가 용지, 26곳 투표 중지 후 재개.",
      claimIds: ["claim-shortage", "claim-scale"],
    },
    {
      id: "t-resign",
      date: "2026-06-05",
      datePrecision: "day",
      title: "선관위원장·사무총장 사퇴",
      summary: "책임을 지고 물러났다.",
      claimIds: ["claim-responsibility"],
    },
    {
      id: "t-committee",
      date: "2026-06-10",
      datePrecision: "day",
      title: "진상규명위원회 첫 회의",
      summary: "대응 매뉴얼 부재 확인.",
      claimIds: ["claim-cause"],
    },
  ],
  gaps: [
    "진상규명위원회와 국회 국정조사 특위의 최종 결론은 찾지 못했다.",
    "투표용지 부족으로 실제로 투표를 포기한 유권자 수는 집계된 자료를 찾지 못했다.",
    "헌법 조문은 국가법령정보센터 링크로만 달았고 문장 단위로 대조하지는 않았다.",
  ],
  sources: [
    {
      id: "src-weeklykhan-20260603",
      title: "서울 10여개 투표소 투표용지 부족 초유 사태···국민의힘 \"서울 선거 개표 중단, 연기해야\"",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202606031736001",
      publishedAt: "2026-06-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1652009",
      title: "'투표 용지 부족' 지방선거 초유의 사태 발생…선관위 대국민 사과 예정(종합)",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1652009/",
      publishedAt: "2026-06-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1654687",
      title: "'투표지 부족' 진상규명위 첫 회의 \"전모 밝히고 결과 투명하게 공개\"",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1654687/",
      publishedAt: "2026-06-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260610",
      title: "선관위, '투표용지 부족 사태' 진상규명위 첫 회의…\"전모 밝혀 공개할 것\"",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260610_0003664158",
      publishedAt: "2026-06-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-weeklykhan-20260605",
      title: "노태악 선관위원장 \"물러나겠다···국정조사 등 회피하지 않을 것\"",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202606051618001",
      publishedAt: "2026-06-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kbmaeil-20260714",
      title: "여야, 선관위 한목소리 질타…‘투표용지 부족·선피아’ 집중 추궁",
      publisher: "경북매일",
      url: "https://kbmaeil.com/article/20260714500699",
      publishedAt: "2026-07-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-law-constitution-114",
      title: "대한민국헌법 제114조(선거관리위원회)",
      publisher: "국가법령정보센터",
      url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%ED%97%8C%EB%B2%95/%EC%A0%9C114%EC%A1%B0",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-newsis-20220727",
      title: "대법, '총선 조작 주장' 첫 판단…\"입증 안돼\" 기각(종합)",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20220727_0001958824",
      publishedAt: "2022-07-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-lawtimes-180537",
      title: "\"부정선거 실행 주체 존부 등 구체적 증명 없이 의혹 제기에 그쳐\"",
      publisher: "법률신문",
      url: "https://www.lawtimes.co.kr/news/180537",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-tf-2181621",
      title: "[부정선거론 언제까지] 126건 소송 모두 '기각·각하'<하>",
      publisher: "더팩트",
      url: "https://news.tf.co.kr/read/ptoday/2181621.htm",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstapa-zSXoe",
      title: "[주간 뉴스타파] 선관위 개혁 '동상이몽', 선거 재건 vs 윤어게인",
      publisher: "뉴스타파",
      url: "https://newstapa.org/article/zSXoe",
      publishedAt: "2026-07-30",
      type: "press",
      license: "link-only",
    },
  ],
};

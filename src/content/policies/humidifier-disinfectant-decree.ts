import type { PolicyInput } from "./schema";

/**
 * 가습기살균제 참사 특별법 시행령 전부개정 — 배상체계 전환과 인과관계 논란.
 *
 * "시행령이 법의 인과관계 추정 조항을 무력화하고 피해자에게 입증 부담을
 * 떠넘긴다"는 답글이 돈다(2026년 10월). 이 말은 피해자단체가 시행령을 분석해
 * 낸 주장과 같다. 단체 주장은 CLAIM으로, 정부가 발표한 개편 내용은 FACT로
 * 나란히 둔다. 정부가 이 비판에 직접 답한 자료는 찾지 못했다 — gaps에 적는다.
 *
 * ★ 별표 2의 실제 조문은 확인하지 못했다. 인과관계를 "다시 판단하게 한다"는
 *   서술은 단체의 해석이므로 FACT로 옮기지 않는다.
 * ★ 2026-10-18 처음 등록 — 잼통 Voice voice-gap 이슈 #44.
 */
export const HUMIDIFIER_DISINFECTANT_DECREE: PolicyInput = {
  slug: "humidifier-disinfectant-decree",
  title: "가습기살균제 참사 특별법 시행령 전부개정과 인과관계 논란",
  scope:
    "2026년 가습기살균제 피해구제 특별법 전부개정에 따른 시행령 개정 내용과, 피해 인정 기준을 두고 " +
    "피해자단체가 제기한 비판",
  ministries: ["기후에너지환경부", "국무조정실"],
  categories: ["welfare", "institution"],
  asOf: "2026-10-18",
  rumors: [
    {
      id: "rumor-burden",
      text: "시행령이 법의 인과관계 추정 조항을 무력화하고 피해자에게 입증 부담을 떠넘긴다",
      claimIds: ["claim-victims-causation", "claim-decree", "claim-existing-victims"],
    },
  ],
  claims: [
    {
      id: "claim-plan",
      text:
        "정부는 2025년 12월 24일 국가정책조정회의에서 '가습기살균제 참사 피해자 종합지원대책'을 확정하고 " +
        "이 사건을 '참사'로 규정했다. 기업 중심의 피해구제를 기업과 국가가 함께 책임지는 손해배상 체계로 " +
        "바꾸겠다고 밝혔다. 2024년 6월 대법원 판결로 국가책임이 인정된 뒤의 조치다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-humidifier-20251224"],
      verified: true,
    },
    {
      id: "claim-law",
      text:
        "특별법 전부개정안은 2026년 3월 12일 국회를 통과했고 10월 8일 시행됐다. 기존 피해구제위원회는 " +
        "국무총리 소속 배상심의위원회로 바뀐다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-humidifier-20260507", "src-edaily-humidifier-20260601"],
      verified: true,
    },
    {
      id: "claim-decree",
      text:
        "시행령 전부개정안은 2026년 9월 22일 국무회의에서 의결돼 10월 8일부터 시행됐다. 배상심의위원회 " +
        "지원단과 조사판정·재심의 전문위원회를 두고, 배상금은 치료비·간병비·휴업배상·장해·유족배상·장례비·" +
        "위자료 등 항목별로 정한다. 세부 기준은 배상심의위원회 의결을 거쳐 기후에너지환경부 장관이 고시한다.",
      assertionType: "FACT",
      sourceIds: ["src-gov-humidifier-20260922"],
      verified: true,
    },
    {
      id: "claim-existing-victims",
      text:
        "개정 전 법으로 피해를 인정받은 사람은 시행일에 손해배상을 신청한 것으로 본다. 인정받지 못한 사람은 " +
        "2026년 10월 8일부터 2027년 4월 8일까지 새로 신청할 수 있다. 2026년 5월 보도 기준 신청자 8,065명 " +
        "가운데 6,011명이 피해를 인정받았다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-humidifier-20260507"],
      verified: true,
    },
    {
      id: "claim-support",
      text:
        "입법예고안에는 원료사업자 분담률을 25%에서 45%로 올리고, 치료비·간병비를 나눠 계속 받을 수 있게 하며, " +
        "학생 피해자의 학교 우선 배정과 대학 등록금(최대 8학기) 지원을 넣는 내용이 담겼다.",
      assertionType: "FACT",
      sourceIds: ["src-edaily-humidifier-20260601"],
      verified: true,
    },
    {
      id: "claim-victims-causation",
      text:
        "피해자단체는 시행령 별표 2의 피해자 결정 기준이 시간적 선후관계·노출 정도·진료이력·역학조사·다른 " +
        "원인 여부를 종합해 인과관계를 다시 판단하게 해, 법이 정한 인과관계 추정을 약화한다고 비판했다. " +
        "배상 대상에 '상당한 인과관계가 있는 손해'라는 문구가 들어가 입증 부담이 커질 수 있다고도 했다.",
      assertionType: "CLAIM",
      assertedBy: "가습기살균제 피해자단체(한국NGO신문 보도)",
      sourceIds: ["src-ngonews-humidifier-20261001"],
      verified: true,
    },
    {
      id: "claim-victims-process",
      text:
        "피해자 측은 정부에 요구한 36개 항목의 서면 답변 시한 전에 시행령이 의결됐고 확정 조문도 공개되지 " +
        "않았다며 긴급 이의제기서를 냈다. 위자료·가동연한·지연손해금 산식 공개, 심의 참여 보장, 배상 뒤 새로 " +
        "확인되는 손해의 추가 배상 길을 요구했다.",
      assertionType: "CLAIM",
      assertedBy: "가습기살균제 피해자단체(한국NGO신문 보도)",
      sourceIds: ["src-ngonews-humidifier-20260923"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-plan",
      date: "2025-12-24",
      datePrecision: "day",
      title: "피해자 종합지원대책 확정",
      summary: "'참사'로 규정하고 국가·기업 공동 배상체계로 전환을 발표했다.",
      claimIds: ["claim-plan"],
    },
    {
      id: "t-law",
      date: "2026-03-12",
      datePrecision: "day",
      title: "특별법 전부개정안 국회 통과",
      summary: "배상심의위원회를 국무총리 소속으로 두었다.",
      claimIds: ["claim-law"],
    },
    {
      id: "t-notice",
      date: "2026-06-02",
      datePrecision: "day",
      title: "시행령·시행규칙 개정안 입법예고",
      summary: "7월 13일까지 의견을 받았다.",
      claimIds: ["claim-support"],
    },
    {
      id: "t-decree",
      date: "2026-09-22",
      datePrecision: "day",
      title: "시행령 국무회의 의결, 피해자 측 이의제기",
      summary: "피해자 측은 답변 시한 전 의결이라며 반발했다.",
      claimIds: ["claim-decree", "claim-victims-process"],
    },
    {
      id: "t-effective",
      date: "2026-10-08",
      datePrecision: "day",
      title: "개정 특별법·시행령 시행",
      summary: "미인정자 신규 신청은 2027년 4월 8일까지다.",
      claimIds: ["claim-law", "claim-existing-victims"],
    },
  ],
  critiqueIds: ["claim-victims-causation", "claim-victims-process"],
  gaps: [
    "시행령 별표 2의 실제 조문을 확인하지 못했다. 인과관계를 다시 판단하게 한다는 서술은 피해자단체의 해석이다.",
    "피해자단체의 인과관계 비판에 대한 기후에너지환경부의 공식 답변은 찾지 못했다.",
    "개정 전에 피해를 인정받은 사람이 새 기준으로 다시 인과관계 심사를 받는지는 확인하지 못했다. 보도로 확인된 것은 '신청한 것으로 본다'는 데까지다.",
    "배상심의위원회가 고시할 세부 배상기준은 아직 공개되지 않았다.",
  ],
  sources: [
    {
      id: "src-korea-humidifier-20251224",
      title: "정부, 가습기살균제 사건 '참사'로 규정…국가 주도 배상체계로 전환",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148957088",
      publishedAt: "2025-12-24",
      type: "official",
      license: "public",
    },
    {
      id: "src-heraldk-humidifier-20260507",
      title: "가습기살균제 피해 미인정자 2000여명, 구제 길 다시 열린다",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026050718281959537",
      publishedAt: "2026-05-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-edaily-humidifier-20260601",
      title: "가습기살균제 피해배상 체계 확립…시행령·시행규칙 개정안 입법예고",
      publisher: "이데일리",
      url: "https://edaily.co.kr/News/Read?mediaCodeNo=257&newsId=03401366645477456",
      publishedAt: "2026-06-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-gov-humidifier-20260922",
      title: "가습기살균제 피해구제 특별법 시행령 전부개정안 국무회의 의결(기후에너지환경부 보도자료)",
      publisher: "기후에너지환경부(서울신문 보도자료 게재)",
      url: "https://go.seoul.co.kr/news/prnewsView.php?id=448690",
      publishedAt: "2026-09-22",
      type: "official",
      license: "link-only",
    },
    {
      id: "src-ngonews-humidifier-20260923",
      title: "가습기살균제 피해자들 \"시행령 강행 말라\"…국가책임 이행 놓고 정면 '반발'",
      publisher: "한국NGO신문",
      url: "https://www.ngonews.kr/news/articleView.html?idxno=239087",
      publishedAt: "2026-09-23",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ngonews-humidifier-20261001",
      title: "\"피해구제법 취지 훼손\"…가습기살균제 피해자들, 새 시행령에 강력 '반발'",
      publisher: "한국NGO신문",
      url: "https://www.ngonews.kr/news/articleView.html?idxno=239581",
      publishedAt: "2026-10-01",
      type: "press",
      license: "link-only",
    },
  ],
};

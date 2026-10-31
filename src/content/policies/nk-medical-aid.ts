import type { PolicyInput } from "./schema";

/**
 * 북한 강동군병원 의료장비 지원 계획 (93억 원).
 *
 * "정부가 북한에 93억 원을 지원한다"는 게시물이 돈다(2026년 10월). 통일부가 약 93억 원
 * 규모의 의료장비 지원을 계획한 것은 사실이다. 다만 국회 제출 자료 기준으로 잠정안이고,
 * 북한이 받겠다는 뜻을 확인하지 못해 아직 보내지 않았다. 현금이 아니라 의료장비다.
 *
 * ★ "확정"이라는 제목의 보도가 있으나, 확정된 것은 유엔 대북제재위원회의 제재 면제
 *   승인이다. 사업 자체는 북한과 협의가 남은 잠정안이다.
 * ★ 장비 전용(생화학무기) 우려는 야당 의원의 주장이라 CLAIM으로 적는다.
 * ★ 2026-10-23 처음 등록 — 신통 factbot-gap 이슈 #59.
 * ★ 2026-10-31 보충 — 잼통 Voice 이슈 #156(러시아·북한 송금 주장).
 */
export const NK_MEDICAL_AID: PolicyInput = {
  slug: "nk-medical-aid",
  title: "북한 의료장비 지원 계획 (93억 원)",
  scope:
    "통일부의 평양 강동군병원 의료장비 지원 계획의 규모·품목·재원·제재 면제·발송 일정, 북한 수용 여부와 국회의 비판",
  ministries: ["통일부"],
  categories: ["diplomacy", "welfare"],
  asOf: "2026-10-23",
  rumors: [
    {
      id: "rumor-93",
      text: "정부가 북한에 93억 원을 지원한다",
      claimIds: ["claim-plan", "claim-tentative", "claim-funding", "claim-sanctions", "claim-schedule", "claim-north-response"],
    },
    {
      id: "rumor-russia-nk",
      text: "대통령이 러시아와 북한에 돈을 보냈다",
      claimIds: ["claim-plan", "claim-tentative", "claim-schedule"],
    },
  ],
  claims: [
    {
      id: "claim-plan",
      text:
        "통일부는 평양 강동군병원에 의료장비 166종 1,431개를 보내는 계획을 세웠다. 예상 사업비는 675만 달러, " +
        "약 93억 원이다. 엑스레이·CT·청진기·혈압계·수술대·무영등·제세동기·인공호흡기·구급차 등이 들어 있고, " +
        "품목은 한국국제보건의료재단(KOFIH)의 도움을 받아 골랐다. 현금이 아니라 장비 지원이다.",
      assertionType: "FACT",
      sourceIds: ["src-imaeil-20260920", "src-wikitree-20261007", "src-fnnews-20260920"],
      verified: true,
    },
    {
      id: "claim-tentative",
      text:
        "통일부는 2026년 10월 7일 국회 외교통일위원회 김대식 의원에게 낸 자료에서 이 계획이 북측과 협의가 필요한 " +
        "잠정안이라고 밝혔다. 제조사·모델은 정해지지 않았고 규격과 단가는 바뀔 수 있다.",
      assertionType: "CLAIM",
      assertedBy: "통일부",
      sourceIds: ["src-wikitree-20261007", "src-imaeil-20260920"],
      verified: true,
    },
    {
      id: "claim-funding",
      text:
        "재원은 남북협력기금 가운데 민생협력지원의 보건의료협력 예산을 쓸 계획이다. 남북교류협력추진협의회 의결 " +
        "등 기금 집행 절차는 앞으로 밟을 예정이다.",
      assertionType: "FACT",
      sourceIds: ["src-wikitree-20261007"],
      verified: true,
    },
    {
      id: "claim-sanctions",
      text:
        "품목 가운데 41개는 유엔 안보리 대북제재 대상이어서, 정부는 대북제재위원회의 면제를 받았다. 승인일은 " +
        "2026년 5월 22일이고, 유효기간은 승인 통보일로부터 9개월이다.",
      assertionType: "FACT",
      sourceIds: ["src-wikitree-20261007", "src-imaeil-20260920"],
      verified: true,
    },
    {
      id: "claim-schedule",
      text:
        "정부가 유엔에 낸 계획상 발송은 승인일로부터 6개월 안, 잠정 기한은 11월 22일이다. 운송사로 현대아산이 " +
        "잠정 선정됐고, 인천항에서 중국 단둥을 거쳐 남포항으로 들어가는 경로다. 실제 발송일은 북한과 협의해 정한다.",
      assertionType: "FACT",
      sourceIds: ["src-wikitree-20261007", "src-news1-20261008"],
      verified: true,
    },
    {
      id: "claim-north-response",
      text:
        "남북 직접 소통이 끊겨 있어 정부는 북한이 장비를 받을 뜻이 있는지 확인하지 못했다. 파이낸셜뉴스는 현재로선 " +
        "성사 가능성이 희박하다고 봤다.",
      assertionType: "FACT",
      sourceIds: ["src-imaeil-20260920", "src-fnnews-20260920"],
      verified: true,
    },
    {
      id: "claim-minister",
      text:
        "정동영 통일부 장관은 북한의 핵·군사 정책에 대한 비판을 주민의 질병 치료와 \"연계해서는 안 된다\"고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "정동영 통일부 장관",
      sourceIds: ["src-imaeil-20260920"],
      verified: true,
    },
    {
      id: "claim-diversion",
      text:
        "국민의힘 박충권 의원은 9월 17일 외교통일위원회에서 강동군에 북한 군수산업을 맡는 제2경제위원회가 있다며, " +
        "166종 가운데 일부가 생화학무기 생산·개발에 전용될 수 있다고 주장했다. 김대식 의원은 북한과 협의도 전에 " +
        "계획을 세우는 방식을 비판하며 \"원칙과 검증 먼저\"라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "박충권·김대식 국민의힘 의원",
      sourceIds: ["src-imaeil-20260920", "src-news1-20261008"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-diversion", "claim-north-response"],
  timeline: [
    {
      id: "t-exemption",
      date: "2026-05-22",
      datePrecision: "day",
      title: "유엔 대북제재위, 의료장비 제재 면제 승인",
      summary: "41개 품목. 유효기간 9개월.",
      claimIds: ["claim-sanctions"],
    },
    {
      id: "t-committee",
      date: "2026-09-17",
      datePrecision: "day",
      title: "국회 외통위에서 전용 우려 제기",
      summary: "박충권 의원, 생화학무기 전용 가능성 주장.",
      claimIds: ["claim-diversion"],
    },
    {
      id: "t-submission",
      date: "2026-10-07",
      datePrecision: "day",
      title: "통일부, 국회에 잠정 계획 제출",
      summary: "166종 1,431개, 약 93억 원. 북한과 협의 전.",
      claimIds: ["claim-plan", "claim-tentative", "claim-schedule"],
    },
  ],
  gaps: [
    "남북협력기금 집행 의결이 이뤄졌는지, 이뤄졌다면 언제 얼마로 의결됐는지 확인하지 못했다.",
    "2026년 10월 23일 기준 실제로 장비가 발송됐다는 보도는 찾지 못했다.",
    "정부가 러시아에 자금을 보냈다는 기록은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-imaeil-20260920",
      title: "정부 `北 주민 치료` vs 국힘 `생화학무기 개발`…93억 의료지원 공방",
      publisher: "매일신문",
      url: "https://www.imaeil.com/page/view/2026092008414544781",
      publishedAt: "2026-09-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20260920",
      title: "93억 의료기 北에 무상지원 추진..北 반응 없는 일방적 선물?",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202609200935000685",
      publishedAt: "2026-09-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-wikitree-20261007",
      title: "이재명 정부, 우리 군인들 다쳤는데 북한에 '93억 지원' 확정",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1164640",
      publishedAt: "2026-10-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-20261008",
      title: "정부, 北에 93억원 의료장비 지원…이르면 다음 달까지 남포항 반입",
      publisher: "뉴스1",
      url: "https://www.news1.kr/nk/society/6313329",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
  ],
};

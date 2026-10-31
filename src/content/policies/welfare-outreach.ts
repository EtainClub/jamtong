import type { PolicyInput } from "./schema";

/**
 * 복지 사각지대: 신청주의 개선, 그냥드림, 근로장려금, 선별·보편 논쟁.
 *
 * 「당장 먹을 쌀조차 없는 국민이 있다면」(10월 19일) 답글에 "신청해야만 주는 복지는 고령자를
 * 배제한다", "모든 시군에 무료 급식소와 생필품 보급소를 두라", "쌀보다 즉석밥이 낫다",
 * "일해도 가난한 근로빈곤층을 지원하라", "어려운 사람을 골라 돕는 건 보수의 선별 복지 아니냐",
 * "사회복지공무원 처우도 살펴 달라"는 말이 달렸다(잼통 Voice). 관련 제도를 모은다.
 *
 * ★ 대통령 글은 words:rice-first에 있다. 체납관리단의 복지 연계는 policy:tax-arrears-team에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #122, #151, #165, #167, #170.
 */
export const WELFARE_OUTREACH: PolicyInput = {
  slug: "welfare-outreach",
  title: "복지 사각지대: 신청주의 개선, 그냥드림, 근로장려금",
  scope:
    "2026년 복지급여 신청주의 개선(자동 지급·직권 신청), 먹거리 기본보장 '그냥드림'의 본사업 전환, 근로장려금 2027년 확대안, 대통령의 '차등·타깃 지원' 언급",
  ministries: ["보건복지부", "재정경제부", "국세청"],
  categories: ["welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-application",
      text: "국가가 정보를 다 가지고 있으면서 신청해야만 복지를 주는 방식은 정보에 어두운 고령자를 배제한다",
      claimIds: ["claim-auto-plan", "claim-auto-law"],
    },
    {
      id: "rumor-food",
      text: "모든 시군에 무료 급식소와 생필품 보급소를 두고, 쌀보다는 즉석밥·간편식으로 지원하는 편이 낫다",
      claimIds: ["claim-dream", "claim-dream-budget"],
    },
    {
      id: "rumor-working-poor",
      text: "극빈층 보호와 함께, 일해도 가난한 근로빈곤층을 지원하는 데 복지의 중점을 둬야 한다",
      claimIds: ["claim-eitc"],
    },
    {
      id: "rumor-selective",
      text: "어려운 사람을 골라 돕는 것은 보수정부가 말한 선별 복지인데, 야당 시절 기본 정책을 내세우며 반대하지 않았나",
      claimIds: ["claim-targeted"],
    },
  ],
  claims: [
    {
      id: "claim-auto-plan",
      text:
        "보건복지부는 2026년 5월 12일 국무회의에 '위기가구 지원 강화방안'을 보고했다. 아동수당·부모급여·첫만남이용권은 출생신고만 " +
        "하면 자동으로 지급하고, 위기가구는 당사자 동의 없이도 공무원이 직권으로 신청할 수 있게 하며, 전기·수도 사용량 변화도 " +
        "위기가구 발굴에 쓰겠다는 내용이다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260512", "src-newsis-20260512"],
      verified: false,
    },
    {
      id: "claim-auto-law",
      text:
        "10월에는 국가가 가진 정보로 신청 없이 급여를 조사·지급할 근거와 위기가구 직권 신청 근거를 담은 이른바 '신청주의 개선 6법'이 " +
        "국회 본회의를 통과했다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20000337939"],
      verified: false,
    },
    {
      id: "claim-dream",
      text:
        "소득 심사 없이 먹거리·생필품을 주는 '그냥드림'(먹거리 기본보장 코너)은 시범사업을 거쳐 2026년 5월 본사업으로 바뀌어 " +
        "전국 280곳으로 늘었다. 품목은 기부 물품 입고 상황에 따라 다르다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260515"],
      verified: false,
    },
    {
      id: "claim-dream-budget",
      text: "복지부는 2026년 1차 추경에 그냥드림 확대 예산을 반영해 연내 300곳 수준으로 늘리겠다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "보건복지부",
      sourceIds: ["src-heraldk-20260330"],
      verified: false,
    },
    {
      id: "claim-eitc",
      text:
        "2026년 세제개편안은 근로장려금 소득 기준을 단독 2,200만→2,600만 원, 홑벌이 3,200만→3,700만 원, 맞벌이 4,400만→5,200만 원으로 " +
        "올리고 최대 지급액을 단독 180만, 홑벌이 310만, 맞벌이 360만 원으로 높인다. 국회를 통과하면 2027년 소득분(2027년 9월 신청)부터 적용된다.",
      assertionType: "FACT",
      sourceIds: ["src-taxtimes-276243", "src-bokjiro-1310188"],
      verified: false,
    },
    {
      id: "claim-targeted",
      text:
        "대통령은 2026년 들어 '차등'과 '타깃 지원'이라는 말을 자주 쓰고 있다. 대선 전 '전 국민 25만 원' 같은 보편 지급을 주장하던 " +
        "때와 대비된다는 평가가 있다.",
      assertionType: "INTERPRETATION",
      assertedBy: "한국경제",
      sourceIds: ["src-hankyung-20260316"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-targeted"],
  timeline: [
    {
      id: "t-plan",
      date: "2026-05-12",
      datePrecision: "day",
      title: "위기가구 지원 강화방안 보고",
      summary: "자동 지급·직권 신청.",
      claimIds: ["claim-auto-plan"],
    },
    {
      id: "t-dream",
      date: "2026-05-16",
      datePrecision: "day",
      title: "그냥드림 본사업",
      summary: "전국 280곳.",
      claimIds: ["claim-dream"],
    },
    {
      id: "t-law",
      date: "2026-10",
      datePrecision: "month",
      title: "신청주의 개선 6법 본회의 통과",
      summary: "신청 없는 급여 지급 근거.",
      claimIds: ["claim-auto-law"],
    },
  ],
  gaps: [
    "신청주의 개선 6법의 공포일·시행일과 자동 지급 대상 급여의 최종 목록은 확인하지 못했다.",
    "그냥드림의 즉석밥·간편식 제공 여부와 시군별 설치 현황은 정리하지 못했다.",
    "사회복지 전담공무원의 2026년 인원·처우 개선·악성민원 대책은 찾지 못했다.",
    "2027년 근로장려금 총예산은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-mt-20260512",
      title: "'복지, 탈신청주의'...아동수당·부모급여, 출생신고시 자동 신청",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/policy/2026/05/12/2026051210101812724",
      publishedAt: "2026-05-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260512",
      title: "복지부, 아동수당 등 신청 없이 자동지급·직권신청 추진",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260512_0003625377",
      publishedAt: "2026-05-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbsbiz-20000337939",
      title: "아동수당·부모급여 신청 안 해도 준다…법적 근거 마련",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000337939",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260515",
      title: "'그냥드림', 내일부터 본사업…전국 280개소 확대 운영",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260515_0003631794",
      publishedAt: "2026-05-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldk-20260330",
      title: "그냥드림, 150개소→300개소로 전국 확대…복지부, 추경 3263억원 편성",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026033021131141512",
      publishedAt: "2026-03-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-taxtimes-276243",
      title: "[세제개편]근로장려금, 문턱 낮추고 지급액 최대 360만원으로 높여",
      publisher: "한국세정신문",
      url: "https://www.taxtimes.co.kr/mobile/article.html?no=276243",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-bokjiro-1310188",
      title: "2027년 9월 신청분부터 달라지는 '근로장려금'",
      publisher: "복지로",
      url: "https://www.bokjiro.go.kr/ssis-tbu/cms/pc/news/promotion/1310188_1118.html",
      type: "official",
      license: "public",
    },
    {
      id: "src-hankyung-20260316",
      title: "'차등 복지' 언급 부쩍 많아진 李",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2026031647861",
      publishedAt: "2026-03-16",
      type: "press",
      license: "link-only",
    },
  ],
};

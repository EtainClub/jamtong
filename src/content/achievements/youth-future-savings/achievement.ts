import { achievementSchema, type AchievementInput } from "@/content/schema";

const raw: AchievementInput = {
  id: "youth-future-savings",
  slug: "youth-future-savings",
  title: "청년미래적금",
  subtitle: "청년의 저축에 정부가 보태는 3년 적금",
  kicker: "민생·청년 금융",
  categories: ["welfare", "economy"],
  summary: "2026년 6월 22일 청년미래적금 가입 신청이 시작됐다. 월 최대 50만 원을 저축하면 정부 기여금과 이자소득 비과세 혜택을 받는 3년 만기 상품이다. 금융위는 7월 2일 누적 신청자가 200만 명을 넘었다고 발표했다. 2차 모집은 10월 7일 시작 예정이다.",
  type: "policy",
  publishStatus: "published",
  featured: true,
  lifeQuestion: "청년미래적금은 누가 가입하고, 얼마나 지원받나요?",
  sourceNote: "2026년 10월 3일 기준 금융위원회 자료를 대조했습니다. 신청자 수는 계좌 개설자 수가 아닙니다. 출시와 지원 제도를 다루며 만기 수령·장기 자산형성 효과는 확인하지 않았습니다. 히어로는 AI로 생성한 설명용 삽화입니다.",
  headlineKeyNumberId: "ys-term",
  keyNumbers: [
    { id: "ys-term", label: "만기", value: "3", unit: "년", claimId: "ys-product" },
    { id: "ys-monthly", label: "월 납입 한도", prefix: "최대", value: "50", unit: "만 원", claimId: "ys-product" },
    { id: "ys-match", label: "정부 기여금 비율", value: "6·12", unit: "%", caption: "일반형·우대형 · 가입 유형별 조건 적용", claimId: "ys-product" },
    { id: "ys-applications", label: "누적 가입 신청", value: "201.2", unit: "만 명", caption: "금융위 발표 · 2026.7.2 13시 · 계좌 개설자 수와 다름", claimId: "ys-demand" },
  ],
  timeline: [
    { id: "ys-launch", date: "2026-06-22", datePrecision: "day", title: "가입 신청 시작", summary: "청년미래적금 첫 모집이 시작됐다.", claimIds: ["ys-launch-fact"] },
    { id: "ys-demand-event", date: "2026-07-02", datePrecision: "day", title: "신청자 200만 명 돌파 발표", summary: "금융위가 이날 13시 기준 누적 신청자 201.2만 명을 발표했다.", claimIds: ["ys-demand"] },
    { id: "ys-second-announced", date: "2026-09-30", datePrecision: "day", title: "2차 모집 안내", summary: "10월 신청과 11월 계좌 개설 일정을 안내했다.", claimIds: ["ys-second"] },
    { id: "ys-second-open", date: "2026-10-07", datePrecision: "day", title: "2차 신청 시작 예정", summary: "신청 기간은 10월 7~16일이다. 기준일 현재 시작 전이다.", claimIds: ["ys-second"] },
  ],
  eli5: {
    intro: "내 저축에 무엇이 더해지는지, 신청과 가입이 어떻게 다른지 봐요.",
    scenes: [
      { id: "ys-e-save", title: "내가 저축하면 정부가 보태요", say: "3년 동안 저축하는 상품이에요. 가입 유형에 따라 정부 기여금이 붙고 이자소득세가 면제돼요.", art: "ys-match", claimIds: ["ys-product"] },
      { id: "ys-e-apply", title: "신청한 뒤 심사를 거쳐요", say: "신청했다고 바로 계좌가 생기지는 않아요. 가입요건을 심사한 뒤 통과한 사람이 계좌를 열어요.", art: "ys-apply", claimIds: ["ys-demand", "ys-second"] },
    ],
    caveat: { text: "가입에는 연령·소득 등 조건이 있어요. ‘최대 19.4% 효과’는 은행 이자율 자체가 아니에요.", claimIds: ["ys-eligibility", "ys-rate"] },
  },
  scenes: [{
    id: "ys-explainer", kind: "explainer", heading: "출시된 제도와 앞으로의 모집", lede: "시점을 넘겨 실제 시작된 일과 남은 절차를 확인합니다.",
    claimIds: ["ys-launch-fact", "ys-demand", "ys-second"],
    explainer: {
      chapters: [
        {
          id: "ys-ch-dates", question: "어디까지 진행됐나요?", heading: "출시부터 2차 모집까지",
          steps: [
            { id: "ys-step-launch", label: "첫 모집", caption: "6월 22일 가입 신청이 시작됐다." },
            { id: "ys-step-asof", label: "현재", caption: "10월 3일 현재 2차 일정이 공지됐다." },
            { id: "ys-step-next", label: "다음 모집", caption: "10월 7일 시작은 아직 예정이다." },
          ],
          visual: { kind: "timeline-gate", start: "2026-06-22", end: "2026-11-27", spanLabel: "첫 모집 이후", futureLabel: "2차 모집 예정",
            marks: [
              { id: "ys-mark-launch", date: "2026-06-22", displayDate: "6.22", label: "첫 신청", status: "done" },
              { id: "ys-mark-asof", date: "2026-10-03", displayDate: "10.3", label: "기준일", status: "asof" },
              { id: "ys-mark-next", date: "2026-10-07", displayDate: "10.7", label: "2차 신청", status: "planned" },
              { id: "ys-mark-account", date: "2026-11-16", displayDate: "11.16", label: "2차 계좌 개설", status: "planned" },
            ] },
          takeaway: "상품은 출시됐다. 2차 모집과 계좌 개설은 아직 남았다.", claimId: "ys-second",
        },
        {
          id: "ys-ch-gates", question: "신청자 수가 곧 가입자 수인가요?", heading: "계좌를 열기까지",
          steps: [
            { id: "ys-step-apply", label: "신청", caption: "2차 신청은 취급기관 앱에서 받는다." },
            { id: "ys-step-review", label: "심사", caption: "가입·소득 심사를 거친다." },
            { id: "ys-step-account", label: "개설", caption: "통과자는 11월 16~27일 계좌를 개설할 수 있다." },
          ],
          visual: { kind: "stage-gates", asOfLabel: "2차 모집 · 2026.10.3 기준", pendingLabel: "앞으로의 절차", stages: [
            { id: "ys-gate-notice", label: "일정 안내", note: "9.30", status: "done" },
            { id: "ys-gate-apply", label: "신청", note: "10.7~16", status: "pending" },
            { id: "ys-gate-review", label: "심사", note: "10.19~11.13", status: "pending" },
            { id: "ys-gate-account", label: "계좌 개설", note: "11.16~27", status: "pending" },
          ] },
          takeaway: "신청, 심사, 계좌 개설은 서로 다른 단계다.", claimId: "ys-second",
        },
      ],
    },
  }],
  graph: {
    note: "개인 대신 제도 참여 주체를 표시했습니다. 기여금은 가입 유형별 조건을 따릅니다.",
    entities: [
      { id: "ys-gov", name: "정부", kind: "government", description: "기여금과 비과세 지원", isFocus: true },
      { id: "ys-young", name: "가입 청년", kind: "group", description: "연령·소득 등 요건을 충족한 가입자" },
      { id: "ys-bank", name: "취급 금융기관", kind: "organization", description: "계좌 개설과 적금 운용" },
    ],
    relations: [
      { id: "ys-r-match", fromId: "ys-gov", toId: "ys-young", label: "기여금 6% 또는 12%와 비과세 지원", startDate: "2026-06-22", startPrecision: "day", assertionType: "FACT", claimIds: ["ys-product", "ys-launch-fact"] },
      { id: "ys-r-save", fromId: "ys-young", toId: "ys-bank", label: "월 최대 50만 원 자유 납입", startDate: "2026-06-22", startPrecision: "day", assertionType: "FACT", claimIds: ["ys-product", "ys-launch-fact"] },
      { id: "ys-r-interest", fromId: "ys-bank", toId: "ys-young", label: "3년 고정금리 · 기관별 우대 조건", startDate: "2026-06-22", startPrecision: "day", assertionType: "FACT", claimIds: ["ys-rate", "ys-launch-fact"] },
    ],
  },
  counterpoints: [
    { id: "ys-cp-rate", question: "은행 금리가 19.4%인가요?", response: "아니다. 은행 기본금리 5%에 우대금리가 붙는다. 19.4%는 기여금·비과세까지 포함해 다른 단리 적금과 비교한 최대 효과다.", claimIds: ["ys-rate"] },
    { id: "ys-cp-count", question: "200만 명이 모두 가입했나요?", response: "금융위 수치는 누적 신청자다. 심사 통과와 계좌 개설을 확인한 수치가 아니다.", claimIds: ["ys-demand"] },
    { id: "ys-cp-all", question: "모든 청년이 기여금을 받나요?", response: "연령·개인소득·가구소득 등 요건과 가입 유형별 조건을 충족해야 한다. 개인별 자격은 공식 안내에서 확인해야 한다.", claimIds: ["ys-eligibility", "ys-product"] },
  ],
  claims: [
    { id: "ys-launch-fact", text: "청년미래적금은 2026년 6월 22일 가입 신청을 시작했다.", assertionType: "FACT", sourceIds: ["src-ys-launch"], verified: true },
    { id: "ys-demand", text: "금융위는 2026년 7월 2일 13시 누적 가입 신청자가 201.2만 명이라고 발표했다. 신청 종료 후 자격심사와 계좌 개설이 별도로 진행된다.", assertionType: "CLAIM", assertedBy: "금융위원회", sourceIds: ["src-ys-launch"], verified: true },
    { id: "ys-product", text: "청년미래적금은 월 최대 50만 원을 자유 납입하는 3년 만기 상품이다. 정부 기여금 비율은 6% 또는 12%이고 이자소득세가 면제된다.", assertionType: "FACT", sourceIds: ["src-ys-second"], verified: true },
    { id: "ys-rate", text: "은행 금리는 기본 5%와 기관별 우대 최대 2~3%p를 합한 3년 고정금리다. 금융위가 안내한 최대 19.4%는 기여금·비과세를 포함한 우대형의 단리 적금 환산 효과다.", assertionType: "FACT", sourceIds: ["src-ys-second"], verified: true },
    { id: "ys-eligibility", text: "가입대상은 만 19~34세이며 병역 이행 기간은 최대 6년까지 연령 계산에서 제외된다. 개인소득·가구소득 등 가입요건과 우대형 조건이 별도로 적용된다.", assertionType: "FACT", sourceIds: ["src-ys-second"], verified: true },
    { id: "ys-second", text: "9월 30일 안내된 2차 일정은 신청 10월 7~16일, 심사 10월 19일~11월 13일, 계좌 개설 11월 16~27일이다. 10월 3일 현재 예정 일정이다.", assertionType: "FACT", sourceIds: ["src-ys-second"], verified: true },
  ],
  sources: [
    { id: "src-ys-launch", title: "청년미래적금, 7.2일 13시 기준 누적 가입 신청자 200만명 넘겨", url: "https://www.fsc.go.kr/no010101/87242", publisher: "금융위원회", publishedAt: "2026-07-02", type: "official", license: "public" },
    { id: "src-ys-second", title: "‘연 최대 19.4%’ 2차 청년미래적금, 10월 7일부터 가입 신청", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148972819", publisher: "금융위원회 · 정책브리핑", publishedAt: "2026-09-30", type: "official", license: "public" },
  ],
};

export const youthFutureSavings = achievementSchema.parse(raw);

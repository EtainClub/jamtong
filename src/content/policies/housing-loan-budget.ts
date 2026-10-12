import type { PolicyInput } from "./schema";

/**
 * 디딤돌·버팀목 정책대출 예산 (2026·2027년).
 *
 * "내년 예산에서 청년 전세 정책대출이 거의 다 삭감됐다", "디딤돌·버팀목 대출이 3조 원
 * 이상 삭감됐다"는 글이 돈다(2025년 11월 게시물). 주택도시기금에서 직접 내주는 돈
 * (기금재원)이 3조 원 넘게 줄어든 것은 사실이다. 그러나 정부는 은행 돈으로 먼저
 * 빌려주고 금리 차이를 예산으로 메우는 이차보전을 늘렸다. 기금재원이 줄어든 것과
 * 대출이 사라진 것은 다른 이야기다.
 *
 * ★ 실제로 대출이 얼마나 나갔는지(실행액)는 따로 확인해야 한다. 대출 규제 뒤 한도가
 *   낮아지고 실행액이 줄었다는 보도가 있어 비판으로 함께 싣는다.
 * ★ 대출 조건 자체는 통통에서 가져온 `youth-jeonse-loan`이 다룬다.
 * ★ 2026-10-12 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #23.
 */
export const HOUSING_LOAN_BUDGET: PolicyInput = {
  slug: "housing-loan-budget",
  title: "디딤돌·버팀목 정책대출 예산 (2026·2027년)",
  scope: "주택도시기금의 구입·전세 정책대출(디딤돌·버팀목) 기금재원과 이차보전 예산의 변화",
  ministries: ["국토교통부"],
  categories: ["welfare", "economy"],
  asOf: "2026-10-12",
  rumors: [
    {
      id: "rumor-cut-3tn",
      text: "내년 정부 예산에서 디딤돌·버팀목 대출이 3조 원 이상 삭감됐다",
      claimIds: ["claim-2026-fund-cut", "claim-2026-interest-subsidy", "claim-molit-2026"],
    },
    {
      id: "rumor-almost-all",
      text: "내년 정부 예산에서 청년 전세자금으로 쓸 수 있는 정부 정책 대출은 거의 다 삭감됐다",
      claimIds: ["claim-2026-fund-cut", "claim-molit-2026", "claim-2027-plan"],
    },
  ],
  claims: [
    {
      id: "claim-2026-fund-cut",
      text:
        "2026년 예산에서 디딤돌·버팀목 등 정책대출에 쓰는 주택도시기금 재원은 2025년 14조 원에서 " +
        "10.3조 원으로 줄었다. 정부안 단계의 삭감액은 약 3.76조 원으로 보도됐다. 국토교통부는 기금 " +
        "여유재원이 줄어든 상황을 고려했다고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-molit-20251124"],
      verified: true,
    },
    {
      id: "claim-2026-interest-subsidy",
      text:
        "같은 해 은행 재원으로 정책대출을 먼저 내주고 금리 차이를 정부가 메우는 이차보전 예산은 " +
        "1.84조 원에서 1.97조 원으로 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-molit-20251124"],
      verified: true,
    },
    {
      id: "claim-molit-2026",
      text:
        "국토교통부는 2025년 11월 24일 '청년 대출금을 깎았다'는 보도가 사실과 다르다며, 이차보전 " +
        "방식을 우선 활용하므로 기금재원 변화와 상관없이 대출을 공급할 수 있다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "국토교통부",
      sourceIds: ["src-molit-20251124"],
      verified: true,
    },
    {
      id: "claim-2027-plan",
      text:
        "2027년 예산안에서도 은행 자체 재원으로 먼저 공급하고 정부가 이자 차이를 보전하는 방식이 " +
        "이어진다. 기금재원 배정은 10조 3,016억 원에서 5조 2,800억 원으로 약 절반이 되고, 국토부는 " +
        "이 재원도 가급적 쓰지 않는 것을 목표로 한다고 보도됐다. 기금 여유자금이 회복되면 예전 " +
        "방식으로 돌아갈 계획이다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-20260902"],
      verified: true,
    },
    {
      id: "claim-fund-shortage",
      text:
        "배경에는 주택도시기금의 여유자금 감소가 있다. 2025년 말 여유자금은 14조 4,000억 원으로 " +
        "2021년 최대치(49조 원)의 30% 수준이었고, 청약통장은 2022년부터 줄고 있다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-20260902"],
      verified: true,
    },
    {
      id: "claim-limits-cut",
      text:
        "2025년 6·27 대출 규제 뒤 디딤돌·버팀목 한도가 낮아지고(청년 버팀목 2억 원 → 1억 5,000만 원) " +
        "대출 실행액이 크게 줄었다는 보도가 있다. 예산이 유지돼도 실제로 빌릴 수 있는 돈은 줄었다는 " +
        "지적이다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-loans"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-limits-cut", "claim-fund-shortage"],
  timeline: [
    {
      id: "t-2026-budget",
      date: "2025-11-24",
      datePrecision: "day",
      title: "국토부, '청년 대출 삭감' 보도 해명",
      summary: "기금재원 14조 → 10.3조, 이차보전 1.84조 → 1.97조.",
      claimIds: ["claim-2026-fund-cut", "claim-2026-interest-subsidy", "claim-molit-2026"],
    },
    {
      id: "t-2027-budget",
      date: "2026-09-02",
      datePrecision: "day",
      title: "2027년 예산안",
      summary: "은행 재원 우선 공급 유지, 기금재원 5.28조.",
      claimIds: ["claim-2027-plan"],
    },
  ],
  gaps: [
    "디딤돌·버팀목의 연도별 실제 대출 실행액과 총 공급 목표액을 확인하지 못했다. 예산이 대출 규모를 그대로 뜻하지는 않는다.",
    "청년 전세 대출만 따로 떼어 본 예산은 확인하지 못했다.",
    "국토부 해명은 정부안 단계 삭감액(약 3.76조 원)에 직접 답하지 않았다.",
    "6·27 대책 이후 한도·실행액 감소 보도는 원문을 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-molit-20251124",
      title: "국토부 \"디딤돌·버팀목 청년 대출금 깎았다는 보도 사실과 달라\"",
      publisher: "국토교통부 · 정책브리핑(사실은 이렇습니다)",
      url: "https://www.korea.kr/briefing/actuallyView.do?newsId=148955173",
      publishedAt: "2025-11-24",
      type: "official",
      license: "public",
    },
    {
      id: "src-news1-20260902",
      title: "디딤돌·버팀목, 내년에도 '은행 돈' 먼저…기금 5.3조도 아낀다",
      publisher: "뉴스1",
      url: "https://v.daum.net/v/20260902050651332",
      publishedAt: "2026-09-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-loans",
      title: "[단독] \"대출 문턱 높이더니\" 디딤돌·버팀목 18조 줄었다[부동산360]",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10656474",
      type: "press",
      license: "link-only",
    },
  ],
};

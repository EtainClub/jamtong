import type { PolicyInput } from "./schema";

/**
 * 새도약기금 (장기 연체채권 매입·소각).
 *
 * "빚 안 갚고 버티면 정부가 다 갚아 준다", "외국인 빚까지 탕감한다" 같은 말이 돈다.
 * 성실 상환자와의 형평 문제는 가치 판단이라 여기서 옳고 그름을 가리지 않는다.
 * 대상 요건, 심사 기준, 실제 소각 규모만 적는다.
 *
 * ★ 매입과 소각은 다르다.
 *   기금이 사들인 채권(11.7조)이 모두 소각되는 것이 아니다. 소각은 심사 생략
 *   취약계층·시효 완성·파산면책 채권과, 심사로 상환능력이 없다고 판정된 채권이다.
 *   나머지는 채무조정(원금 일부 감면·분할상환)이다.
 *
 * ★ 2026-10-09 처음 등록, 같은 날 편집팀이 원자료와 대조했다.
 */
export const NEW_LEAP_FUND: PolicyInput = {
  slug: "new-leap-fund",
  title: "새도약기금 (장기 연체채권 소각)",
  scope: "7년 이상 연체된 5천만 원 이하 개인 채권을 사들여 소각하거나 조정하는 제도의 대상 요건과 진행 상황",
  ministries: ["금융위원회", "한국자산관리공사(캠코)"],
  categories: ["welfare", "economy"],
  asOf: "2026-10-09",
  rumors: [
    {
      id: "rumor-all-forgiven",
      text: "빚 안 갚고 버티면 정부가 다 탕감해 준다",
      claimIds: ["claim-eligibility", "claim-screening", "claim-cumulative"],
    },
    {
      id: "rumor-foreigners",
      text: "외국인 빚까지 세금으로 탕감해 준다",
      claimIds: ["claim-exclusions", "claim-funding"],
    },
    {
      id: "rumor-rich",
      text: "고소득자·코인 부자도 빚을 탕감받는다",
      claimIds: ["claim-screening", "claim-income-check"],
    },
  ],
  claims: [
    {
      id: "claim-eligibility",
      text:
        "새도약기금은 2025년 10월 1일 출범했다. 대상은 7년 이상(2018년 6월 16일 이전) 연체된 " +
        "5,000만 원 이하 개인 연체채권(개인사업자 포함)이고, 금액은 금융회사별 원금 합산 " +
        "기준이다. 채무자가 따로 신청하지 않아도 기금이 금융회사에서 채권을 사들인다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-launch-1001", "src-mtn-launch-1001"],
      verified: true,
    },
    {
      id: "claim-exclusions",
      text: "사행성·유흥업 관련 채권과 외국인 채권은 매입 대상에서 빠진다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-launch-1001"],
      verified: true,
    },
    {
      id: "claim-screening",
      text:
        "사들인 채권을 모두 소각하지는 않는다. 소득이 중위소득 60% 이하이고 생계형 재산을 " +
        "빼면 회수할 재산이 없을 때만 전액 소각한다. 그 밖에는 원금 30~80% 감면, 최장 " +
        "10년 분할상환, 최장 3년 상환유예 같은 채무조정을 한다. 기초생활수급자·중증장애인·" +
        "보훈대상자 채권은 별도 심사 없이 소각한다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-burn-1208", "src-newsis-launch-1001"],
      verified: true,
    },
    {
      id: "claim-funding",
      text:
        "기금 재원은 정부와 금융권이 4,000억 원씩 내기로 한 8,000억 원에서 금융권 출연이 " +
        "늘어 8,400억 원이 됐다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-launch-1001"],
      verified: true,
    },
    {
      id: "claim-income-check",
      text:
        "금융위원회는 새도약기금이 소득을 절대 기준으로 심사해 고소득자가 원천적으로 " +
        "배제된다고 설명했다. 가상자산 보유를 확인하려고 신용정보법 개정을 추진했고, " +
        "개정 신용정보법은 2026년 8월 13일 시행됐다. 그 전까지 심사가 필요한 채권의 소각은 " +
        "미뤄졌다.",
      assertionType: "CLAIM",
      assertedBy: "금융위원회",
      sourceIds: ["src-bizwatch-income-1216", "src-kuki-burn4-1002"],
      verified: true,
    },
    {
      id: "claim-cumulative",
      text:
        "2026년 10월 2일 기준으로 기금은 1~6차에 걸쳐 장기 연체채권 11조 7,000억 원" +
        "(95만 7,000명)을 사들였고, 그중 4차까지 3조 8,551억 원(45만 2,000명)을 소각했다. " +
        "채무자별 평균 소각액은 4차 기준 871만 원이고, 4차 소각 차주의 약 90.7%가 50대 이상, " +
        "채권의 88.6%가 10년 이상 연체였다.",
      assertionType: "FACT",
      sourceIds: ["src-kuki-burn4-1002"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-launch",
      date: "2025-10-01",
      datePrecision: "day",
      title: "새도약기금 출범",
      summary: "7년 이상·5천만 원 이하 개인 연체채권 매입 시작.",
      claimIds: ["claim-eligibility", "claim-funding"],
    },
    {
      id: "t-burn1",
      date: "2025-12-08",
      datePrecision: "day",
      title: "1차 소각 (1.1조 원, 약 7만 명)",
      summary: "기초생활수급자·중증장애인·보훈대상자 채권.",
      claimIds: ["claim-screening"],
    },
    {
      id: "t-credit-law",
      date: "2026-08-13",
      datePrecision: "day",
      title: "개정 신용정보법 시행",
      summary: "가상자산 보유 확인 등 상환능력 심사 본격화.",
      claimIds: ["claim-income-check"],
    },
    {
      id: "t-burn4",
      date: "2026-10-02",
      datePrecision: "day",
      title: "4차 소각 (1조 5,968억 원, 18만 3,000명)",
      summary: "누적 소각 3조 8,551억 원, 45만 2,000명.",
      claimIds: ["claim-cumulative"],
    },
  ],
  gaps: [
    "출범 당시 추산한 전체 매입 규모(16조 4,000억 원, 113만 4,000명)와 실제 매입 실적(11조 7,000억 원)의 차이를 설명한 정부 자료를 확인하지 못했다.",
    "외국인 채권 제외는 출범 보도에서 확인했다. 금융위원회 보도자료 원문으로는 대조하지 못했다.",
    "정부 출연분이 어느 예산에서 나왔는지 확인하지 못했다.",
    "상환능력 심사를 거친 추가 소각(2026년 4분기 예정)의 규모는 아직 발표되지 않았다.",
  ],
  sources: [
    {
      id: "src-newsis-launch-1001",
      title: "\"113만명 빚 16.4조 탕감\"…새정부 배드뱅크 '새도약기금' 출범",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20251001_0003351798",
      publishedAt: "2025-10-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-launch-1001",
      title: "'113만명 빚 16.4조 탕감' 새도약기금 공식 출범",
      publisher: "머니투데이방송",
      url: "https://news.mtn.co.kr/news-detail/2025100109445453933",
      publishedAt: "2025-10-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fsc-burn-1208",
      title: "사회 취약계층 장기 연체채권 1.1조원(7만명) 우선 소각 「새도약기금 소각식」 개최",
      publisher: "금융위원회",
      url: "https://www.fsc.go.kr/no010101/85809",
      publishedAt: "2025-12-08",
      type: "official",
      license: "public",
    },
    {
      id: "src-bizwatch-income-1216",
      title: "고소득자도 빚 탕감?…금융위 \"소득·가상자산 보유도 보겠다\"",
      publisher: "비즈워치",
      url: "https://v.daum.net/v/20251216172304172",
      publishedAt: "2025-12-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kuki-burn4-1002",
      title: "새도약기금 1.6조 추가 소각…누적 수혜자 45만명",
      publisher: "쿠키뉴스",
      url: "https://www.kukinews.com/article/view/kuk202610020061",
      publishedAt: "2026-10-02",
      type: "press",
      license: "link-only",
    },
  ],
};

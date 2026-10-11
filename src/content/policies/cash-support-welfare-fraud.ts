import type { PolicyInput } from "./schema";

/**
 * 현금성 지원의 대상·재원과 복지 부정수급.
 *
 * "이재명 정부가 일하는 사람에게 세금을 걷어 일 안 하는 사람에게 배급한다", "일 안 하면
 * 배급해 주니 일 안 하는 부정수급자가 많다"는 글이 돈다(2026년 5월 게시물). 특정 정책을
 * 짚지 않는 말이라, 이 정부의 대표적 현금성 지원인 민생회복 소비쿠폰과 기초생활보장
 * 생계급여의 대상·재원·근로 조건, 그리고 공식 집계된 부정수급 규모를 적는다.
 *
 * ★ '부정수급자가 많다'를 판단하려면 전체 수급 규모 대비 비율이 필요한데, 그 분모를
 *   확인하지 못했다. 그래서 많다·적다를 단정하지 않고 집계된 숫자만 적는다.
 * ★ 2026-10-11 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #3·#6.
 */
export const CASH_SUPPORT_WELFARE_FRAUD: PolicyInput = {
  slug: "cash-support-welfare-fraud",
  title: "현금성 지원의 대상·재원과 복지 부정수급",
  scope: "민생회복 소비쿠폰의 대상·금액·재원, 생계급여의 근로 관련 조건, 생계급여·공공재정 부정수급 환수 규모",
  ministries: ["행정안전부", "보건복지부", "국민권익위원회"],
  categories: ["welfare", "economy"],
  asOf: "2026-10-11",
  rumors: [
    {
      id: "rumor-tax-workers",
      text: "이재명 정부는 일하는 사람에게 세금을 걷어 일하지 않는 사람에게 배급(현금 지급)한다",
      claimIds: ["claim-coupon-target", "claim-coupon-funding", "claim-livelihood-work"],
    },
    {
      id: "rumor-fraud-many",
      text: "일하지 않으면 배급을 해 주기 때문에 더 일하지 않는 부정수급자들이 많다",
      claimIds: ["claim-fraud-livelihood", "claim-fraud-public-2024", "claim-livelihood-work", "claim-fraud-recovery"],
    },
  ],
  claims: [
    {
      id: "claim-coupon-target",
      text:
        "2025년 민생회복 소비쿠폰은 취업 여부와 상관없이 전 국민에게 지급됐다. 1차로 모두 " +
        "15만 원(차상위·한부모 30만 원, 기초생활수급자 40만 원)을 받고, 2차로 건강보험료 기준 " +
        "소득 하위 90%가 10만 원을 더 받았다. 비수도권과 인구감소지역 주민은 추가로 받아 " +
        "1인 최대 수령액은 수도권 50만 원, 비수도권 53만 원, 인구감소지역 55만 원이었다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20250619", "src-etoday-20250704"],
      verified: true,
    },
    {
      id: "claim-coupon-funding",
      text:
        "소비쿠폰은 2025년 2차 추가경정예산으로 마련됐다. 정부안 기준 재원은 국채 추가 발행 " +
        "19.8조 원, 지출 구조조정 5.3조 원, 기금 가용재원 2.5조 원 등이었다. 국회는 7월 4일 " +
        "추경을 31.8조 원으로 확정했다. 세금만이 아니라 상당 부분이 빚(국채)이었다.",
      assertionType: "FACT",
      sourceIds: ["src-ajunews-20250619", "src-etoday-20250704"],
      verified: true,
    },
    {
      id: "claim-coupon-debt",
      text:
        "2차 추경 반영 뒤 2025년 국가채무는 1,301.9조 원(GDP 대비 49.1%), 관리재정수지 적자는 " +
        "111.6조 원(GDP 대비 4.2%)으로 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-20250704"],
      verified: true,
    },
    {
      id: "claim-livelihood-work",
      text:
        "기초생활보장 생계급여는 소득이 기준(2026년 4인 가구 월 207만 8,316원) 아래인 가구에 " +
        "모자란 만큼을 채워 준다. 근로·사업소득은 30%를 공제해 일할수록 손해가 덜 나게 했고, " +
        "2026년부터 청년 추가 공제를 34세 이하·60만 원으로 넓혔다. 근로능력이 있는 수급자에게는 " +
        "자활사업 참여를 조건으로 생계급여를 줄 수 있다(국민기초생활보장법 제9조).",
      assertionType: "FACT",
      sourceIds: ["src-mohw-20260101", "src-law-nbls"],
      verified: false,
    },
    {
      id: "claim-fraud-livelihood",
      text:
        "보건복지부가 국민의힘 최보윤 의원실에 낸 자료에 따르면 생계급여 부정수급으로 환수가 " +
        "결정된 금액은 2022년 117.1억 원, 2023년 159.5억 원, 2024년 173.9억 원, 2025년 " +
        "185.6억 원으로 해마다 늘었다. 2022년~2026년 8월 누적은 7만 393건, 914.5억 원이다.",
      assertionType: "FACT",
      sourceIds: ["src-ainews1-20261002"],
      verified: true,
    },
    {
      id: "claim-fraud-public-2024",
      text:
        "국민권익위원회 점검에 따르면 2024년 공공재정 전체(309개 기관)의 부정수급 환수 결정은 " +
        "16만 2,042건, 1,042억 원이었다. 유형별로 생계급여(267억 원)가 가장 많았고 주거급여" +
        "(122억 원)가 뒤를 이었다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-acrc-20250611"],
      verified: true,
    },
    {
      id: "claim-fraud-recovery",
      text:
        "생계급여 부정수급 환수 결정액 중 실제로 돌려받은 비율은 2022년 74.0%에서 2025년 " +
        "47.9%로 떨어졌다. 다만 최근 연도는 징수에 시간이 걸려 낮게 잡힌다.",
      assertionType: "FACT",
      sourceIds: ["src-ainews1-20261002"],
      verified: true,
    },
    {
      id: "claim-fraud-prosecution",
      text:
        "보건복지부는 2026년부터 생계급여 부정수급 고발 기준을 환수금액 300만 원 이상에서 " +
        "1,000만 원 이상으로 바꾸고, 반기별 고발 실적을 제출받기로 했다.",
      assertionType: "FACT",
      sourceIds: ["src-mohw-20260101"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-coupon-debt", "claim-fraud-recovery"],
  timeline: [
    {
      id: "t-supplementary",
      date: "2025-07-04",
      datePrecision: "day",
      title: "2차 추경 31.8조 확정",
      summary: "전 국민 소비쿠폰.",
      claimIds: ["claim-coupon-target", "claim-coupon-funding"],
    },
    {
      id: "t-livelihood-2026",
      date: "2026-01-01",
      datePrecision: "day",
      title: "2026년 기초생활보장 기준",
      summary: "청년 근로소득 공제 확대, 고발 기준 변경.",
      claimIds: ["claim-livelihood-work", "claim-fraud-prosecution"],
    },
  ],
  gaps: [
    "생계급여 전체 지급액·수급자 수 대비 부정수급 비율을 확인하지 못했다. 그래서 부정수급이 '많다'고도 '적다'고도 단정하지 않는다.",
    "부정수급과 근로 의욕 사이의 관계를 다룬 공식 통계나 연구는 찾지 못했다.",
    "국민기초생활보장법 제9조(조건부 수급) 현행 조문을 국가법령정보센터에서 직접 대조하지 못했다.",
    "추경 확정안(31.8조 원) 기준의 최종 국채 발행 규모는 확인하지 못했다. 19.8조 원은 정부안 기준이다.",
    "근로장려금처럼 일하는 저소득 가구에만 주는 현금 지원의 규모는 다루지 않았다.",
    "고발 기준을 1,000만 원으로 바꾼 것이 고발 대상을 좁히는 것인지, 의무 고발 범위를 정한 것인지 보도자료 원문으로 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-hankyung-20250619",
      title: "새 정부 20.2조 더 푼다…국민 1인당 15만~50만원 '소비쿠폰'",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/202506195517i",
      publishedAt: "2025-06-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ajunews-20250619",
      title: "[2차 추경] 경기진작·민생안정에 30.5조원…\"전 국민 15만~50만원 소비쿠폰 지급\"",
      publisher: "아주경제",
      url: "https://www.ajunews.com/view/20250619113759622",
      publishedAt: "2025-06-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-20250704",
      title: "'31.8조' 2차 추경안 확정…'전국민 소비쿠폰' 7월 1차 지급",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2485025",
      publishedAt: "2025-07-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mohw-20260101",
      title: "2026년에도 두텁고 촘촘하게, 국민의 기초생활을 보장한다",
      publisher: "보건복지부",
      url: "https://www.mohw.go.kr/board.es?mid=a10503010100&bid=0027&act=view&list_no=1488477",
      publishedAt: "2026-01-01",
      type: "official",
      license: "public",
    },
    {
      id: "src-law-nbls",
      title: "국민기초생활 보장법 제9조 (급여의 방법)",
      publisher: "국가법령정보센터",
      url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B5%AD%EB%AF%BC%EA%B8%B0%EC%B4%88%EC%83%9D%ED%99%9C%EB%B3%B4%EC%9E%A5%EB%B2%95",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-ainews1-20261002",
      title: "5년간 생계급여 부정수급 914억…환수율은 61.2%에 그쳐",
      publisher: "독립신문",
      url: "https://www.ainews1.co.kr/news/articleView.html?idxno=37202",
      publishedAt: "2026-10-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-korea-acrc-20250611",
      title: "지난해 부정수급 1042억 원 환수 결정…생계급여·주거급여 순 많아",
      publisher: "국민권익위원회 · 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148944248",
      publishedAt: "2025-06-11",
      type: "official",
      license: "public",
    },
  ],
};

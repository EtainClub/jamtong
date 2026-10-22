import type { PolicyInput } from "./schema";

/**
 * 추가경정예산(추경) 추진 경과 (2025~2026).
 *
 * "정부가 지방선거를 앞두고 추경을 또 추진해 돈을 푼다"는 게시물이 돈다(2026년 봄).
 * 추경을 거듭한 것도, 2026년 추경이 6·3 지방선거 두 달 전에 처리된 것도 사실이다.
 * 목적이 중동전쟁 대응인지 선거용인지는 여야가 다툰 평가라서 판정하지 않고,
 * 양쪽 주장과 추경의 실제 구성·재원을 나란히 둔다.
 *
 * ★ 2025년 1차 추경(13.8조 원)은 이재명 정부 출범 전에 처리됐다. 이 정부가 낸
 *   추경은 2025년 2차와 2026년 1차, 두 번이다.
 * ★ 2026-10-23 처음 등록 — 신통 factbot-gap 이슈 #57·#58.
 */
export const SUPPLEMENTARY_BUDGET: PolicyInput = {
  slug: "supplementary-budget",
  title: "추가경정예산 추진 경과 (2025~2026)",
  scope:
    "2025년 1·2차 추경과 2026년 1차(중동전쟁 대응) 추경의 시점·규모·재원·구성, 선거용이라는 비판과 정부 설명, " +
    "이후 2차 추경 논의",
  ministries: ["기획예산처", "재정경제부"],
  categories: ["economy"],
  asOf: "2026-10-23",
  rumors: [
    {
      id: "rumor-again",
      text: "정부가 추경(추가경정예산)을 또 추진한다",
      claimIds: ["claim-2025-first", "claim-2025-second", "claim-2026-passed", "claim-second-2026", "claim-surplus-use"],
    },
    {
      id: "rumor-election",
      text: "정부가 지방선거를 앞두고 추경을 통해 돈을 푼다",
      claimIds: ["claim-2026-proposal", "claim-2026-items", "claim-2026-funding", "claim-election-critique", "claim-government-reply"],
    },
  ],
  claims: [
    {
      id: "claim-2025-first",
      text:
        "2025년에는 추경이 두 번 있었다. 1차 추경은 이재명 정부 출범(2025년 6월 4일) 전인 5월 1일 국회를 통과했다. " +
        "산불 등 재해·재난 대응 3조 3천억 원, 통상·AI 지원 4조 5천억 원, 민생 지원 5조 1천억 원으로 정부안(12조 " +
        "2천억 원)보다 1조 6천억 원 늘어난 13조 8천억 원이다. 여야 원내대표가 합의해 처리했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-supp-20250501", "src-etoday-supp-20250704"],
      verified: true,
    },
    {
      id: "claim-2025-second",
      text:
        "이재명 정부의 첫 추경인 2025년 2차 추경은 2025년 7월 4일 국회 본회의에서 31조 8천억 원으로 확정됐다. " +
        "정부안(31조 5천억 원)보다 늘었고, 전 국민 민생회복 소비쿠폰 예산이 들어갔다. 2차 추경을 반영한 국가채무는 " +
        "1,301조 9천억 원으로 전망됐다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-supp-20250704"],
      verified: true,
    },
    {
      id: "claim-2026-proposal",
      text:
        "2026년 1차 추경안 26조 2천억 원은 2026년 3월 31일 국무회의에서 의결됐다. 정부가 붙인 이름은 '중동전쟁 위기 " +
        "극복 추경'이다.",
      assertionType: "FACT",
      sourceIds: ["src-daum-20260331", "src-mediapen-20260407"],
      verified: true,
    },
    {
      id: "claim-2026-items",
      text:
        "구성은 고유가 부담 완화 10조 1천억 원, 지방재정 보강 9조 7천억 원, 민생 안정 2조 8천억 원, 산업 피해 최소화·" +
        "공급망 안정 2조 6천억 원, 국채 상환 1조 원이다. 고유가 부담 완화에는 소득 하위 70%에게 1인당 10만~60만 원을 " +
        "주는 고유가 피해지원금 4조 8천억 원이 들어 있다.",
      assertionType: "FACT",
      sourceIds: ["src-mediapen-20260407", "src-daum-20260331"],
      verified: true,
    },
    {
      id: "claim-2026-funding",
      text:
        "재원은 반도체 호황·증시 호조에 따른 초과세수 25조 5천억 원과 기금 1조 원이고, 새로 국채를 발행하지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-mediapen-20260407", "src-heraldk-20260411"],
      verified: true,
    },
    {
      id: "claim-2026-passed",
      text:
        "국회는 2026년 4월 10일 본회의에서 정부안 규모(26조 2천억 원)대로 추경을 처리했다. 6·3 지방선거 약 두 달 " +
        "전이다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260410", "src-korea-20260411"],
      verified: true,
    },
    {
      id: "claim-election-critique",
      text:
        "국민의힘은 이 추경을 '선거 추경'이라고 비판했다. 장동혁 대표는 4월 2일 \"말로는 전쟁 추경이지만 실제로는 " +
        "선거 추경\"이라며 국민 70%에게 최대 60만 원을 주고 영화·숙박 할인까지 넣었다고 했다. 예결위 심사에서도 " +
        "\"지방선거를 대비한 선거용\"이라는 지적이 나왔다.",
      assertionType: "OPINION",
      sourceIds: ["src-dailian-20260402", "src-mediapen-20260407"],
      verified: true,
    },
    {
      id: "claim-government-reply",
      text:
        "정부·여당은 중동전쟁 충격에 대응하는 '전쟁 추경'이라고 설명했다. 박홍근 기획예산처 장관은 선거용이라는 " +
        "지적에 \"결코 그렇지 않다\"고 답했고, 더불어민주당은 국채 없이 초과세수로 마련한 추경이라고 강조했다.",
      assertionType: "CLAIM",
      assertedBy: "기획예산처·더불어민주당",
      sourceIds: ["src-mediapen-20260407", "src-heraldk-20260411"],
      verified: true,
    },
    {
      id: "claim-second-2026",
      text:
        "4월 1차 추경 처리 직후 정치권 일각에서 2차 추경론이 나오자, 정부는 \"검토 단계가 아니다\"라고 밝혔다. " +
        "2차 추경을 하면 적자국채 발행으로 이어질 가능성이 크다는 것이 재정당국과 전문가들의 시각이었다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20260411"],
      verified: true,
    },
    {
      id: "claim-surplus-use",
      text:
        "재정경제부는 2026년 10월 1일 올해 국세가 추경예산보다 63조 2천억 원 더 걷힐 것으로 보고, 10월 국고채 " +
        "발행을 계획보다 5조 원 줄인다고 발표했다. 초과세수의 상당 부분은 주거·일자리·서민금융 등 민생 분야에 쓰기로 " +
        "했다. 박홍근 장관은 10월 8일 국정감사에서 활용처가 아직 확정되지 않았다고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-supp-20261001", "src-asiae-20261008"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-election-critique"],
  timeline: [
    {
      id: "t-2025-first",
      date: "2025-05-01",
      datePrecision: "day",
      title: "2025년 1차 추경 13.8조 원 처리",
      summary: "이재명 정부 출범 전. 산불·통상 대응.",
      claimIds: ["claim-2025-first"],
    },
    {
      id: "t-2025-second",
      date: "2025-07-04",
      datePrecision: "day",
      title: "2025년 2차 추경 31.8조 원 확정",
      summary: "이재명 정부 첫 추경. 소비쿠폰 예산 포함.",
      claimIds: ["claim-2025-second"],
    },
    {
      id: "t-2026-proposal",
      date: "2026-03-31",
      datePrecision: "day",
      title: "2026년 1차 추경안 26.2조 원 국무회의 의결",
      summary: "중동전쟁 위기 극복 추경. 국채 발행 없이 초과세수로.",
      claimIds: ["claim-2026-proposal", "claim-2026-items", "claim-2026-funding"],
    },
    {
      id: "t-2026-passed",
      date: "2026-04-10",
      datePrecision: "day",
      title: "국회, 26.2조 원 추경 처리",
      summary: "정부안 규모대로. '전쟁 추경'과 '선거 추경' 공방.",
      claimIds: ["claim-2026-passed", "claim-election-critique", "claim-government-reply"],
    },
    {
      id: "t-local-election",
      date: "2026-06-03",
      datePrecision: "day",
      title: "6·3 지방선거",
      summary: "추경 처리 약 두 달 뒤.",
      claimIds: ["claim-2026-passed"],
    },
    {
      id: "t-surplus",
      date: "2026-10-01",
      datePrecision: "day",
      title: "초과세수 63.2조 원 전망, 국고채 발행 축소",
      summary: "추경이 아니라 국채 발행 축소와 민생 분야 활용.",
      claimIds: ["claim-surplus-use"],
    },
  ],
  gaps: [
    "2026년 10월 현재 정부가 2차 추경을 편성하지 않겠다고 공식 발표한 자료는 찾지 못했다. 4월의 \"검토 단계가 아니다\"와 10월의 초과세수 활용 발표까지만 확인했다.",
    "고유가 피해지원금 등 2026년 추경 사업의 최종 집행액은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-newsis-supp-20250501",
      title: "산불 피해 수습·관세대응 13.8조 추경 푼다…건설경기 보강 등 1.6조 증액",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20250501_0003161947",
      publishedAt: "2025-05-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-supp-20250704",
      title: "'31.8조' 2차 추경안 확정…'전국민 소비쿠폰' 7월 1차 지급",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2485025",
      publishedAt: "2025-07-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-daum-20260331",
      title: "'국민 70%' 3577만명에 '고유가 지원금'…최대 60만원 준다",
      publisher: "다음 뉴스",
      url: "https://v.daum.net/v/20260331134654505",
      publishedAt: "2026-03-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-20260402",
      title: "26.2조 '전쟁 추경'에…장동혁 \"실제로는 '현금 살포' 선거 추경\"",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1628655",
      publishedAt: "2026-04-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mediapen-20260407",
      title: "예결위, 26.2조 추경 심사...여 \"전쟁 추경\" vs 야 \"선거 추경\"",
      publisher: "미디어펜",
      url: "https://www.mediapen.com/news/view/1091902",
      publishedAt: "2026-04-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260410",
      title: "지선 앞 중동위기에 여야 손잡았다…李 중재 속 26.2조 추경 합의 처리",
      publisher: "뉴스1(네이트 뉴스)",
      url: "https://m.news.nate.com/view/20260410n32318",
      publishedAt: "2026-04-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-korea-20260411",
      title: "2026년 추가경정예산 국회 확정",
      publisher: "기획예산처(대한민국 정책브리핑)",
      url: "https://www.korea.kr/briefing/pressReleaseView.do?newsId=156754090",
      publishedAt: "2026-04-11",
      type: "official",
      license: "public",
    },
    {
      id: "src-heraldk-20260411",
      title: "26조 풀기도 전에 2차 추경론…재정건전성 악화 우려↑",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026041115122647267",
      publishedAt: "2026-04-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-supp-20261001",
      title: "초과세수 63.2조 활용해 국채시장 안정…10월 발행 5조 줄인다",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20261001001382",
      publishedAt: "2026-10-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20261008",
      title: "[2026국감]박홍근 \"초과세수 활용처 아직 확정 안돼…국채 발행 축소·기금 적립 협의\"",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026100818012988590",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
  ],
};

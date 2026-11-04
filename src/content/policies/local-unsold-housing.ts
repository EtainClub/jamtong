import type { PolicyInput } from "./schema";

/**
 * 지방 미분양과 정부 대책.
 *
 * 2026년 11월 3일 대통령 X 게시물(집값 하락 대비책)에 "지방은 집값 폭락과 미분양이 심한데 또 주택
 * 허가를 내주고 있으니 지방 시장도 살펴 달라"는 답글이 달렸다(잼통 Voice). 지방 준공 후 미분양
 * 통계, LH 매입, 세제 지원, 지방 인허가 흐름을 적는다.
 *
 * ★ 통계는 국토교통부 「2026년 9월 주택통계」를 보도로 옮긴 것이다.
 * ★ 수도권 집값 하락 대비책은 policy:home-price-drop-plan에 있다.
 * ★ 2026-11-04 처음 등록 — 잼통 Voice 이슈 #203.
 */
export const LOCAL_UNSOLD_HOUSING: PolicyInput = {
  slug: "local-unsold-housing",
  title: "지방 미분양과 정부 대책",
  scope:
    "2026년 9월 기준 지방 미분양·준공 후 미분양 통계, LH의 지방 준공 후 미분양 매입(2025년 2차 8,000호·2026년 3차 5,000호), 지방 미분양 취득세·양도세 특례, 비수도권 주택 인허가 감소",
  ministries: ["국토교통부", "재정경제부", "행정안전부"],
  categories: ["region", "economy"],
  asOf: "2026-11-04",
  rumors: [
    {
      id: "rumor-local-permits",
      text: "지방은 집값 폭락과 미분양이 심한데 정부가 또 주택 허가를 내주고 있다",
      claimIds: ["claim-unsold-stats", "claim-local-permits", "claim-lh-purchase-3", "claim-tax-support", "claim-critique-metro"],
    },
  ],
  claims: [
    {
      id: "claim-unsold-stats",
      text:
        "국토교통부 2026년 9월 주택통계에 따르면 9월 말 전국 미분양은 6만 5,941가구, 준공 후 미분양은 2만 7,549가구다. " +
        "지방 준공 후 미분양은 2만 3,067가구로 전국 준공 후 미분양의 83.7%이고, 지방 전체 미분양(4만 7,884가구)의 48.2%가 준공 후 물량이다. " +
        "전국 준공 후 미분양은 2022년 말 7,518가구에서 약 3.7배가 됐다.",
      assertionType: "FACT",
      sourceIds: ["src-asiatime-20261101"],
      verified: true,
    },
    {
      id: "claim-local-permits",
      text:
        "같은 통계에서 2026년 9월 비수도권 주택 인허가는 8,318가구로 1년 전보다 68.9% 줄었고, 1~9월 누계는 7만 6,197가구로 29.0% 줄었다. " +
        "같은 기간 비수도권 준공은 7만 9,308가구로 32.8% 줄었다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-20261030"],
      verified: true,
    },
    {
      id: "claim-lh-purchase-2",
      text:
        "국토교통부는 2025년 8월 28일 LH의 지방 준공 후 미분양 아파트 매입 물량을 3,000호에서 8,000호로 늘리고, 매입 상한가를 감정평가액의 83%에서 90%로 올렸다. " +
        "사들인 주택은 시세 90% 수준 전세로 6년 거주한 뒤 분양전환을 받을 수 있는 '분양전환형 든든전세'로 공급한다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-kr-20250828"],
      verified: true,
    },
    {
      id: "claim-lh-purchase-3",
      text:
        "국토교통부와 LH는 2026년 4월 10일 지방 준공 후 미분양 아파트 5,000가구 3차 매입 공고를 냈다. 공고일 기준 3개월 안에 준공 예정인 아파트도 대상에 넣었고, " +
        "비선호 유형을 빼고 일부 세대만 사는 부분 매입을 허용했다. 신청은 6월 5일까지 받았다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20260410"],
      verified: true,
    },
    {
      id: "claim-tax-support",
      text:
        "정부는 2025년 8월 14일 '지방중심 건설투자 보강방안'에서 비수도권 준공 후 미분양 주택을 사면 적용하던 양도세·종부세 1세대 1주택 특례와 주택 수 제외 특례를 1년 연장하고, " +
        "개인 취득자의 취득세를 한시적으로 50% 감면하기로 했다. 개정 지방세법에 따라 2026년 1월 1일부터 지방 준공 후 미분양 아파트(전용 85㎡·취득가 6억 원 이하)를 사는 개인은 취득세를 최대 50% 감면받는다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-kr-20250814", "src-khan-20260101"],
      verified: true,
    },
    {
      id: "claim-second-home",
      text:
        "같은 방안은 1주택자가 인구감소지역 주택을 추가로 사도 1세대 1주택 특례를 주는 '세컨드홈' 대상을 인구감소관심지역까지 넓히고, " +
        "양도세·종부세·재산세 특례 가액 기준을 공시가격 4억 원에서 9억 원으로, 취득세 특례 기준을 취득가 3억 원에서 12억 원으로 올렸다. 수도권과 광역시는 제외된다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-kr-20250814"],
      verified: true,
    },
    {
      id: "claim-critique-metro",
      text:
        "2026년 2월 말 지방 준공 후 미분양이 2만 7,015가구까지 늘자, 대한건설협회는 지방 미분양을 사서 5년 안에 팔면 양도세를 전액 면제하고 세컨드홈 특례를 지방 전역으로 넓히자고 건의했다. " +
        "권대중 한성대 교수는 미분양이 광역시와 그 외곽에 몰려 있는데 세컨드홈 특례는 미분양이 적은 인구감소지역에 한정돼 있다고 지적했다. 정부는 효과를 지켜본 뒤 추가 세제 개편을 검토하겠다는 입장이다.",
      assertionType: "CLAIM",
      assertedBy: "대한건설협회·권대중 한성대 교수",
      sourceIds: ["src-fnnews-20260419"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique-metro"],
  timeline: [
    {
      id: "t-tax",
      date: "2025-08-14",
      datePrecision: "day",
      title: "지방중심 건설투자 보강방안",
      summary: "지방 미분양 세제 특례 연장, 취득세 50% 감면, 세컨드홈 확대.",
      claimIds: ["claim-tax-support", "claim-second-home"],
    },
    {
      id: "t-lh-2",
      date: "2025-08-28",
      datePrecision: "day",
      title: "LH 매입 8,000호로 확대",
      summary: "매입 상한가 감정가 90%로 상향.",
      claimIds: ["claim-lh-purchase-2"],
    },
    {
      id: "t-acq-tax",
      date: "2026-01-01",
      datePrecision: "day",
      title: "지방 미분양 취득세 감면 시행",
      summary: "전용 85㎡·6억 원 이하 아파트, 최대 50%.",
      claimIds: ["claim-tax-support"],
    },
    {
      id: "t-lh-3",
      date: "2026-04-10",
      datePrecision: "day",
      title: "LH 3차 매입 공고",
      summary: "5,000가구, 준공 예정 단지와 부분 매입 허용.",
      claimIds: ["claim-lh-purchase-3"],
    },
    {
      id: "t-stats",
      date: "2026-10-30",
      datePrecision: "day",
      title: "2026년 9월 주택통계",
      summary: "지방 준공 후 미분양 2만 3,067가구, 비수도권 인허가 감소.",
      claimIds: ["claim-unsold-stats", "claim-local-permits"],
    },
  ],
  gaps: [
    "LH 1~3차 매입이 실제로 몇 가구 계약됐는지는 확인하지 못했다.",
    "취득세 50% 감면의 종료 시점은 자료마다 2026년 말과 2027년 말로 엇갈린다. 최종 법령으로 대조하지 못했다.",
    "지방 집값 하락 폭(지역별 매매가격지수)은 이 페이지에서 다루지 않았다.",
    "답글이 말한 '또 내주는 주택 허가'가 어느 지역·사업인지는 특정되지 않아 대조하지 못했다. 통계상 비수도권 인허가는 줄고 있다.",
  ],
  sources: [
    {
      id: "src-asiatime-20261101",
      title: "미분양은 줄었는데…다 짓고도 못 판 집 3.7배 급증",
      publisher: "아시아타임즈",
      url: "https://www.asiatime.co.kr/article/20261101500044",
      publishedAt: "2026-11-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-20261030",
      title: "9월 주택 인허가·착공 40%대 급감…수도권 공급 목표 '먹구름'",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2641870",
      publishedAt: "2026-10-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-korea-kr-20250828",
      title: "지방 '준공 후 미분양 주택' 매입, 3000가구→8000가구로 확대",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148948327",
      publishedAt: "2025-08-28",
      type: "official",
      license: "public",
    },
    {
      id: "src-hankyung-20260410",
      title: "국토부·LH, 지방 악성 미분양 5000가구 더 매입한다",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/202604103195i",
      publishedAt: "2026-04-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-korea-kr-20250814",
      title: "세컨드 홈·지방 미분양주택에 세제 혜택…\"지방 건설경기 활력\"",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148947601",
      publishedAt: "2025-08-14",
      type: "official",
      license: "public",
    },
    {
      id: "src-fnnews-20260419",
      title: "부양책에도 미분양 해소 더딘 지방... 광역시 포함 추가 세제지원 필요성",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202604191811120294",
      publishedAt: "2026-04-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260101",
      title: "올해부터 지방 미분양 아파트 사면 취득세 50% 깎아준다",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202601011557011",
      publishedAt: "2026-01-01",
      type: "press",
      license: "link-only",
    },
  ],
};

import type { PolicyInput } from "./schema";

/**
 * 전세의 월세화(2026년)와 서민 임차인 대책: 월세 비중, 전환율, '전월세 안심신탁'.
 *
 * 대통령 유튜브 영상 답글 13건에 "서민 지역 집값까지 크게 오르고 전세가 월세로 바뀌어 서민 주거난이 심해졌다", "한강벨트 집값보다 서민의 전세·월세 안정에 관심을 가져 달라"는
 * 말이 달렸다(잼통 Voice). 월세 비중이 실제로 얼마나 늘었는지와 정부가 내놓은 임차인 대책을 적는다.
 *
 * ★ 문재인 정부 시기와의 집값 상승폭 비교는 같은 기준의 통계로 대조하지 못했다(gaps).
 * ★ 대출 규제·공급 대책은 policy:housing-measures, 보편형 공공임대는 policy:universal-public-rental에 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #223.
 */
export const RENT_SHIFT_2026: PolicyInput = {
  slug: "rent-shift-2026",
  title: "전세의 월세화와 서민 임차인 대책 (2026년)",
  scope:
    "2026년 전월세 거래의 월세 비중(전국·서울), 서울 아파트 갱신 때 월세 전환 비중, HUG 전세보증 전월세 전환율 상향, 11월 '전월세 안심신탁' 첫 임대인 모집",
  ministries: ["국토교통부", "주택도시보증공사"],
  categories: ["welfare", "economy"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-monthly-rent",
      text: "서민이 사는 지역 집값까지 크게 오르고 전세가 월세로 바뀌어 서민 주거난이 심해졌다",
      claimIds: ["claim-share", "claim-seoul", "claim-renewal"],
    },
    {
      id: "rumor-focus",
      text: "한강벨트 같은 주요 지역 집값보다 서민의 전세·월세 주거 안정에 더 관심을 가져 달라",
      claimIds: ["claim-trust", "claim-trust-tax", "claim-conversion"],
    },
  ],
  claims: [
    {
      id: "claim-share",
      text: "KB부동산 10월 리뷰에 따르면 2026년 8월 전국 주택 전월세 거래 19만 9천 건 가운데 월세 비중이 70.0%까지 올랐다. 전세 거래가 크게 줄어든 것이 원인으로 꼽혔다.",
      assertionType: "FACT",
      sourceIds: ["src-kb-20261015"],
      verified: true,
    },
    {
      id: "claim-seoul",
      text:
        "서울은 2026년 4월까지 전월세 10건 중 7건이 월세였고 1년 새 6.4%p 올랐다. 토지거래허가제와 대출 규제로 전세 물량이 줄고 빌라 전세사기 여파로 월세 선호가 커진 것이 원인으로 분석됐다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260530"],
      verified: true,
    },
    {
      id: "claim-renewal",
      text:
        "2026년 1~9월 서울 아파트 전세 계약을 갱신하면서 월세로 바꾼 비중은 7.53%로 전년보다 1.27%p 올라 3년째 상승했다. 전세 매물은 연초보다 10.4% 줄었다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-6327185"],
      verified: true,
    },
    {
      id: "claim-conversion",
      text:
        "HUG 전세보증 가입 때 적용하는 전월세 전환율은 2026년 1월 30일부터 6.2%에서 6.4%로 올랐다(수도권 보증금 7억 원 이하, 그 외 5억 원 이하). 전환율이 오르면 보증 가입이 가능한 월세 상한도 높아진다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260113-rent"],
      verified: true,
    },
    {
      id: "claim-trust",
      text:
        "국토교통부와 HUG는 11월 4일 '전월세 안심신탁' 첫 임대인 모집을 시작했다. 임차인이 보증금을 HUG 전용 계좌에 맡기고 HUG가 이를 운용해 임대인에게 세전 연 4.35%를 매달 월세처럼 지급하는 3자 계약이다. " +
        "임차인은 주택임대차보호법상 갱신청구권과 5% 상한을 보장받고 별도 보증 가입이 필요 없다. 2027년 1월부터 순차 입주한다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeonggi-20261104", "src-news1-6342349"],
      verified: true,
    },
    {
      id: "claim-trust-tax",
      text: "국토부가 밝힌 임대인 소득세·법인세 50% 감면은 법 개정이 전제이며, 11월 초 기준 개정안은 아직 발의되지 않았다. 예치금은 PF 사업장 대출로 운용된다.",
      assertionType: "FACT",
      sourceIds: ["src-sideview-20643"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-share", "claim-renewal", "claim-trust-tax"],
  timeline: [
    {
      id: "t-conversion",
      date: "2026-01-30",
      datePrecision: "day",
      title: "HUG 전월세 전환율 6.4%로",
      summary: "전세보증 가입 기준.",
      claimIds: ["claim-conversion"],
    },
    {
      id: "t-trust",
      date: "2026-11-04",
      datePrecision: "day",
      title: "전월세 안심신탁 첫 모집",
      summary: "2027년 1월 입주.",
      claimIds: ["claim-trust", "claim-trust-tax"],
    },
  ],
  gaps: [
    "'서민 지역 집값이 문재인 정부 때보다 오래 크게 올랐다'는 비교는 같은 기준(지역·기간)의 통계로 대조하지 못했다.",
    "월세 세액공제 확대 등 월세 세입자 부담을 직접 줄이는 2026년 정부 대책은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-kb-20261015",
      title: "KB주택시장 리뷰 2026년 10월호 - 월세시장",
      publisher: "KB국민은행",
      url: "https://kbthink.com/realestate/insights/research/261015-5.html",
      publishedAt: "2026-10-15",
      type: "research",
      license: "link-only",
    },
    {
      id: "src-nate-20260530",
      title: "\"전세 구하기 하늘의 별 따기\"…서울 월세 비중 역대급",
      publisher: "네이트 뉴스",
      url: "https://m.news.nate.com/view/20260530n12246",
      publishedAt: "2026-05-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-6327185",
      title: "살던 전셋집도 월세로…서울 아파트 갱신 때 전환 비중 3년째 상승",
      publisher: "뉴스1",
      url: "https://www.news1.kr/realestate/general/6327185",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260113-rent",
      title: "전월세 전환율 6.2% → 6.4%…月주거비 오른다",
      publisher: "네이트 뉴스",
      url: "https://m.news.nate.com/view/20260113n32596",
      publishedAt: "2026-01-13",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kyeonggi-20261104",
      title: "국토부·HUG, '전월세 안심신탁' 첫 임대인 모집…보증금 공공 보관",
      publisher: "경기일보",
      url: "https://www.kyeonggi.com/article/20261104580116",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-6342349",
      title: "집주인엔 연 4.35%, 세입자엔 안전 전세…'전월세 안심신탁' 첫 모집",
      publisher: "뉴스1",
      url: "https://www.news1.kr/realestate/general/6342349",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sideview-20643",
      title: "전월세 안심신탁 첫 임대인 모집…연 4.35% 지급, 세액감면은 법 개정 전제",
      publisher: "사이드뷰",
      url: "https://www.sideview.co.kr/news/articleView.html?idxno=20643",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
  ],
};

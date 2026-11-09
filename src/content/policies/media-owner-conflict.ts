import type { PolicyInput } from "./schema";

/**
 * 건설사 등 언론사 대주주의 이해충돌과 보도 규제 수단.
 *
 * 대통령 X 게시물(집값 관련) 답글에 "건설사가 사주인 언론의 부동산 기사에는 이해상충이 있으니, 사주 사업에 관한 보도를 막는 장치가
 * 필요하다"는 말이 달렸다(잼통 Voice). 건설 자본의 언론 소유 실태와, 지금 쓸 수 있는 규제 수단·입법 시도를 적는다.
 *
 * ★ 이 정부의 공식 입장은 찾지 못했다(gaps). 규제 수단은 방송(방통위 승인 조건·방송심의)과 신문(신문법)이 다르다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #255.
 */
export const MEDIA_OWNER_CONFLICT: PolicyInput = {
  slug: "media-owner-conflict",
  title: "언론사 대주주(건설사)의 이해충돌과 보도 규제 수단",
  scope:
    "지역 신문·방송의 건설사 대주주 실태, 대주주 사업 홍보 보도에 대한 방송심의 제재 사례, 방통위의 최대주주 변경 승인 조건, 2023년 신문법 개정안",
  ministries: ["방송통신위원회", "문화체육관광부"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-owner",
      text: "건설사가 사주인 언론의 부동산 기사에는 이해상충이 있으니, 사주 사업에 관한 보도를 막는 장치가 필요하다",
      claimIds: ["claim-ownership", "claim-sanction", "claim-ytn", "claim-bill"],
    },
  ],
  claims: [
    {
      id: "claim-ownership",
      text:
        "한국기자협회 조사에서 지역 신문사 17곳 가운데 7곳, 지역 방송사 11곳 가운데 5곳의 대주주가 건설사였다. 기자들 사이에서는 대주주 관련 기사가 '보도의 성역'이 되는 분위기가 보고됐다.",
      assertionType: "FACT",
      sourceIds: ["src-journalist-46391"],
      verified: true,
    },
    {
      id: "claim-sanction",
      text:
        "방송은 심의로 제재할 수 있다. G1은 2018년 대주주 SG건설이 분양하는 아파트를 홍보하는 보도로 방송심의 법정제재 '경고'를 받았고, JIBS도 대주주 사업체를 홍보한 리포트로 '관계자 징계'를 받았다.",
      assertionType: "FACT",
      sourceIds: ["src-mediatoday-304069"],
      verified: false,
    },
    {
      id: "claim-ytn",
      text:
        "방송통신위원회는 2024년 YTN 최대주주 변경을 승인하면서 대주주에 유리한 보도나 홍보성 기사 강요를 금지하는 조건을 붙였다.",
      assertionType: "FACT",
      sourceIds: ["src-mediatoday-304069"],
      verified: false,
    },
    {
      id: "claim-bill",
      text:
        "신문에는 대주주 사업 보도를 제한하는 별도 규정이 없다. 2023년 2월 언론노조·시민단체와 국회 문체위원장이 참석한 가운데 발의를 알린 신문법 개정안은 신문사를 새로 등록·양수·합병하려는 자에게 " +
        "편집 독립성과 독자 권리 보호를 담은 '편집·제작운영계획서' 제출을 의무화하는 내용이었다.",
      assertionType: "FACT",
      sourceIds: ["src-mediatoday-308403"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-bill",
      date: "2023-02-08",
      datePrecision: "day",
      title: "신문법 개정안 발의 기자회견",
      summary: "편집·제작운영계획서 제출 의무화.",
      claimIds: ["claim-bill"],
    },
  ],
  gaps: [
    "언론사 대주주의 이해충돌 보도를 제한하는 데 대한 이재명 정부의 공식 입장이나 2025~2026년 발의 법안은 찾지 못했다.",
    "2023년 신문법 개정안의 처리 결과(21대 국회 임기 만료 폐기 여부)는 확인하지 못했다.",
    "지역 언론 대주주 실태 조사는 2019년 무렵 자료다. 최신 집계는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-journalist-46391",
      title: "지역 언론 점령한 건설사… 기자들에겐 '보도의 성역'",
      publisher: "한국기자협회",
      url: "http://www.journalist.or.kr/news/article.html?no=46391",
      publishedAt: "2019",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mediatoday-304069",
      title: "[미오 창간기획 ①] 건설·금융 자본이 언론을 삼키고 있다",
      publisher: "미디어오늘",
      url: "https://www.mediatoday.co.kr/news/articleView.html?idxno=304069",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mediatoday-308403",
      title: "언론사 인수 자본 횡포 막는 신문법, 이젠 통과할 수 있을까",
      publisher: "미디어오늘",
      url: "https://www.mediatoday.co.kr/news/articleView.html?idxno=308403",
      publishedAt: "2023-02-08",
      type: "press",
      license: "link-only",
    },
  ],
};

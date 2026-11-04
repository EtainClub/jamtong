import type { PolicyInput } from "./schema";

/**
 * 주택공급 법안의 국회 처리 현황.
 *
 * 2026년 11월 3일 대통령 X 게시물에 "정부가 공급 대책을 낸 지 오래인데 국회에서 주택공급 법안이
 * 하나도 통과되지 않았다"는 답글이 달렸다(잼통 Voice). 8월 20일 본회의를 통과한 법안과, 아직
 * 계류된 법안을 나눠 적는다.
 *
 * ★ 법안 현황은 날짜마다 바뀐다. 각 claim에 기준일을 적는다.
 * ★ 용산공원 본체 주택 논쟁은 policy:capital-area-housing-sites, 부동산감독원법은
 *   policy:real-estate-crime-crackdown에 있다.
 * ★ 2026-11-04 처음 등록 — 잼통 Voice 이슈 #207.
 */
export const HOUSING_SUPPLY_BILLS: PolicyInput = {
  slug: "housing-supply-bills",
  title: "주택공급 법안 국회 처리 현황",
  scope:
    "2026년 8월 20일 국회 본회의를 통과한 주택공급 관련 법안(주택법·공공주택특별법·부동산거래신고법 개정, 노후 공공청사·학교용지 복합개발 등 제정), 처리가 보류된 용산공원특별법 개정안, 본회의에 계류된 도시정비법 개정안",
  ministries: ["국토교통부"],
  categories: ["institution", "region"],
  asOf: "2026-11-04",
  rumors: [
    {
      id: "rumor-none-passed",
      text: "정부가 공급 대책을 낸 지 오래인데 국회에서 주택공급 법안이 하나도 통과되지 않았다",
      claimIds: ["claim-six-laws", "claim-housing-act", "claim-public-housing-act", "claim-yongsan-held", "claim-urban-renewal"],
    },
  ],
  claims: [
    {
      id: "claim-six-laws",
      text:
        "국회는 2026년 8월 20일 본회의에서 주택법·공공주택특별법·부동산거래신고법 개정안과 노후 공공청사·유휴 학교용지 복합개발 특별법 등 제정안을 처리했다. " +
        "국토교통부는 8월 21일 이를 '주택공급 6법'으로 발표했다. 민주당 주도로 통과됐고, 야당은 장기 방치 토지를 공공주택 용지로 돌리는 조항을 재산권 침해라며 반대했다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20260821", "src-ytn-20260820"],
      verified: true,
    },
    {
      id: "claim-housing-act",
      text:
        "개정 주택법은 인접 단지의 공동 리모델링을 허용하고, 준주거·상업·공업지역 도시형생활주택 상한을 300가구 미만에서 500가구 미만(역세권은 조례로 700가구 미만, 2030년까지 한시)으로 넓혔다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20260821"],
      verified: true,
    },
    {
      id: "claim-public-housing-act",
      text:
        "개정 공공주택특별법은 도심 공공주택 복합사업의 유효기간을 2029년 말까지 3년 연장하고, 장기간 방치된 비주택 공공개발 토지를 공공주택 용지로 바꾸는 재구조화 절차를 새로 만들었다. " +
        "개정 부동산거래신고법은 국토교통부 장관이 같은 시·도 안 일부 지역만 토지거래허가구역으로 지정할 수 있게 했다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20260821"],
      verified: true,
    },
    {
      id: "claim-yongsan-held",
      text:
        "용산 캠프킴 등 용산공원 주변 부지의 공원·녹지 기준을 완화하는 용산공원특별법 개정안은 2026년 8월 26일 본회의에서 처리가 보류됐다. " +
        "녹지 기준을 1인당 3㎡에서 가구당 3㎡ 수준으로 바꿔, 통과되면 캠프킴 주택은 1,400가구에서 2,500가구로 늘어난다(2029년 착공 계획). 국민의힘은 민주당이 국토교통위원회에서 단독 처리했다며 본회의 상정에 동의할 수 없다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-20260826", "src-etoday-campkim"],
      verified: true,
    },
    {
      id: "claim-urban-renewal",
      text:
        "9·7 공급대책 후속으로 재개발·재건축 기간을 줄이고 사업성을 높이는 도시정비법 개정안은 국토교통위원회를 여당 주도로 통과했지만 11월 1일 기준 본회의에 계류돼 있다. " +
        "공공 재개발 용적률을 법적 상한의 130%까지 허용하는 내용인데, 민주당은 민간 정비사업에 120%를, 국민의힘은 공공과 같은 130%를 요구해 맞서고 있다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20261101", "src-nate-20260210", "src-etoday-campkim"],
      verified: true,
    },
    {
      id: "claim-dp-plan",
      text: "더불어민주당 복기왕 의원은 국정감사 뒤 \"예산 작업이 끝나고 나면 법안 처리 시점이 온다\"며 도시정비법 처리에 속도를 내겠다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "복기왕 더불어민주당 의원",
      sourceIds: ["src-fnnews-20261101"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-six",
      date: "2026-08-20",
      datePrecision: "day",
      title: "주택공급 관련 법안 본회의 통과",
      summary: "주택법·공공주택특별법 개정 등.",
      claimIds: ["claim-six-laws", "claim-housing-act", "claim-public-housing-act"],
    },
    {
      id: "t-yongsan",
      date: "2026-08-26",
      datePrecision: "day",
      title: "용산공원특별법 개정안 보류",
      summary: "캠프킴 2,500가구 확대 법안.",
      claimIds: ["claim-yongsan-held"],
    },
    {
      id: "t-after-audit",
      date: "2026-11-01",
      datePrecision: "day",
      title: "국감 뒤 도시정비법 처리 추진",
      summary: "용적률 상한 120%·130% 이견.",
      claimIds: ["claim-urban-renewal", "claim-dp-plan"],
    },
  ],
  gaps: [
    "8월 20일 통과한 제정안 3건 가운데 하나의 정식 이름은 원문으로 확인하지 못했다(빈 건축물 정비 관련 법안이 거론된다).",
    "용산공원특별법 개정안과 도시재정비촉진법 개정안의 8월 26일 이후 처리 여부는 확인하지 못했다.",
    "통과된 법안들의 시행일과 실제 공급 효과는 확인하지 못했다.",
    "도시정비법 개정안의 국토위 통과 시점은 자료마다 2026년 2월 10일과 4월로 다르다.",
    "개정 주택법의 지역주택조합 요건은 보도마다 '모집신고 요건 강화'와 '토지 확보 비율 완화'로 엇갈려 싣지 않았다.",
  ],
  sources: [
    {
      id: "src-hankyung-20260821",
      title: "인접 단지 묶어 리모델링…주택공급 6법 국회 통과",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2026082152971",
      publishedAt: "2026-08-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ytn-20260820",
      title: "'공공주택법' 등 공급 법안, 민주 주도로 국회 본회의 통과",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0101_202608202329430664",
      publishedAt: "2026-08-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-20260826",
      title: "與野, 용산공원특별법 본회의 처리 보류…비쟁점법안 먼저 올린다",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10852526",
      publishedAt: "2026-08-26",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-campkim",
      title: "캠프킴 2500가구 들어서나⋯26일 본회의 '마지막 문턱'",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2617926",
      publishedAt: "2026-08-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261101",
      title: "국감 끝낸 與, 주택공급·메가프로젝트 입법 속도전 돌입",
      publisher: "파이낸셜뉴스",
      url: "https://fnnews.com/news/202611011819496520",
      publishedAt: "2026-11-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260210",
      title: "민간 정비사업도 활성화…상임위 통과한 도시정비법 개정안",
      publisher: "연합뉴스(네이트 뉴스)",
      url: "https://m.news.nate.com/view/20260210n29281",
      publishedAt: "2026-02-10",
      type: "press",
      license: "link-only",
    },
  ],
};

import type { PolicyInput } from "./schema";

/**
 * 행정수도 세종 추진 현황 (행정수도특별법·집무실·의사당).
 *
 * Voice 방문자가 "행정수도 이전 추진 현황" 자료를 요청했다(잼통 Voice). 국회에 묶여 있는
 * 행정수도특별법의 심사 단계와, 대통령 세종집무실·국회 세종의사당 일정을 적는다.
 *
 * ★ 법안은 아직 국회 상임위 소위 단계다. "이전이 확정됐다"고 쓰지 않는다.
 * ★ 공약 이행 점검의 세종 항목은 policy:pledge-check-2026에도 있다.
 * ★ 2026-11-05 처음 등록 — 잼통 Voice 이슈 #216.
 */
export const ADMINISTRATIVE_CAPITAL: PolicyInput = {
  slug: "administrative-capital",
  title: "행정수도 세종 추진 현황",
  scope:
    "국회에 계류된 행정수도특별법 제정안 5건과 행복도시법 개정안의 심사 경과(2026년 4·5·10월), 위헌 논란, 대통령 세종집무실·국회 세종의사당 일정",
  ministries: ["국토교통부", "행정중심복합도시건설청"],
  categories: ["region", "institution"],
  asOf: "2026-11-05",
  rumors: [],
  claims: [
    {
      id: "claim-bills",
      text:
        "국회 국토교통위원회에는 행정수도특별법 제정안 5건(황운하 의원안, 강준현·김종민·김태년 의원안, 복기왕·엄태영 의원 공동발의안)이 계류돼 있다. " +
        "세종시를 행정수도로 규정하고, 국회·대통령 등 헌법기관과 중앙행정기관 이전 근거, 대통령 소속 추진위원회 설치 등을 담았다.",
      assertionType: "FACT",
      sourceIds: ["src-ac-wikitree-20261028"],
      verified: true,
    },
    {
      id: "claim-constitution",
      text:
        "헌법재판소는 2004년 신행정수도 건설 특별법에 위헌 결정을 내렸다. 2026년 4월 국토법안심사소위는 위헌 여부와 국민적 공감대를 논의한 끝에 처리를 보류했고, " +
        "5월 국토교통위원회 공청회에서는 황운하 의원실에 따르면 진술인 4명 모두 합헌 가능성에 무게를 실었다.",
      assertionType: "FACT",
      sourceIds: ["src-ac-wikitree-20261028"],
      verified: true,
    },
    {
      id: "claim-october",
      text:
        "2026년 10월 28일 국토법안심사소위는 약 6개월 만에 심사를 재개해 헌법적 정당성 등 쟁점을 논의했지만 세부 조항 심사는 11월로 넘겼고, 11월 11일 조문별 축조심사를 하기로 했다. " +
        "외교·통일·법무·국방·성평등가족부를 세종 이전 대상에서 빼는 규정을 삭제하는 행복도시법 개정안은 이날 심사에 오르지 못했다.",
      assertionType: "FACT",
      sourceIds: ["src-cctoday-20261028"],
      verified: true,
    },
    {
      id: "claim-party-gov",
      text: "더불어민주당과 국토교통부는 10월 28일 당정협의회에서 행정수도법을 연내에 차질 없이 처리하기로 뜻을 모았다.",
      assertionType: "FACT",
      sourceIds: ["src-cctoday-20261028"],
      verified: true,
    },
    {
      id: "claim-office",
      text:
        "대통령 세종집무실은 2027년 8월 착공, 2029년 8월 입주를 목표로 추진 중이고, 국회 세종의사당은 국회사무처가 2026년 5월 마스터플랜 당선작을 선정했다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20260527"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-2004",
      date: "2004",
      datePrecision: "year",
      title: "헌법재판소, 신행정수도법 위헌 결정",
      summary: "관습헌법 논리.",
      claimIds: ["claim-constitution"],
    },
    {
      id: "t-april",
      date: "2026-04",
      datePrecision: "month",
      title: "국토소위 첫 심사, 보류",
      summary: "위헌 여부 논의.",
      claimIds: ["claim-constitution"],
    },
    {
      id: "t-october",
      date: "2026-10-28",
      datePrecision: "day",
      title: "국토소위 심사 재개",
      summary: "11월 11일 축조심사 예정.",
      claimIds: ["claim-october", "claim-party-gov"],
    },
  ],
  gaps: [
    "11월 11일 축조심사 결과와 연내 본회의 처리 여부는 기준일 뒤의 일이다.",
    "법안이 위헌 논란을 피하기 위해 국민투표나 개헌을 전제로 하는지, 각 법안의 차이는 원문으로 대조하지 못했다.",
    "국회 세종의사당 착공·준공 일정은 확정 발표를 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-ac-wikitree-20261028",
      title: "행정수도특별법, 28일 국토소위서 재심사…위헌 논란 넘을까",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1169885",
      publishedAt: "2026-10-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-cctoday-20261028",
      title: "행정수도특별법 연내 제정, 11월 국회 심사가 분수령",
      publisher: "충청투데이",
      url: "https://www.cctoday.co.kr/news/articleView.html?idxno=2239188",
      publishedAt: "2026-10-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-20260527",
      title: "李정부, 행정수도 세종 본궤도…대통령 집무실·국회의사당 속도낸다",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2026052717877",
      publishedAt: "2026-05-27",
      type: "press",
      license: "link-only",
    },
  ],
};

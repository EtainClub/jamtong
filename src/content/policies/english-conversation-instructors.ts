import type { PolicyInput } from "./schema";

/**
 * 영어회화전문강사 고용 안정.
 *
 * 대통령 X 게시물 답글에 "4년마다 다시 채용 시험을 치는 영어회화전문강사를 무기계약직으로
 * 전환해 달라"는 요청이 달렸다(잼통 Voice). 제도의 구조, 법원·인권위 판단, 2026년 기간제법
 * 개정 논의를 적는다.
 *
 * ★ 이재명 정부가 영어회화전문강사 무기계약 전환을 발표한 적은 확인되지 않는다. 요청에 답하는
 *   정책이 없다는 것도 사실로 적는다.
 * ★ 2026-10-24 처음 등록 — 잼통 Voice 이슈 #70.
 */
export const ENGLISH_CONVERSATION_INSTRUCTORS: PolicyInput = {
  slug: "english-conversation-instructors",
  title: "영어회화전문강사 고용 안정",
  scope:
    "초·중등학교 영어회화전문강사의 계약 구조(1년 단위·최대 4년), 무기계약 전환을 둘러싼 법원·인권위 판단, " +
    "2026년 기간제법 개정 논의",
  ministries: ["교육부", "고용노동부", "시·도교육청"],
  categories: ["welfare", "institution"],
  asOf: "2026-10-24",
  rumors: [
    {
      id: "rumor-convert",
      text: "4년마다 다시 채용 시험을 치는 영어회화전문강사를 무기계약직으로 전환해 달라",
      claimIds: ["claim-structure", "claim-shrink", "claim-court", "claim-nhrck", "claim-moe-view", "claim-law-debate"],
    },
  ],
  claims: [
    {
      id: "claim-structure",
      text:
        "영어회화전문강사는 2009년 도입된 교원 정원 외 계약직이다. 1년 단위로 계약하고, 필요하면 4년을 넘지 않는 " +
        "범위에서 연장할 수 있다. 정규 교원 임용에 어떤 우선권도 없다. 그래서 4년마다 계약이 끝나고 공개 채용을 다시 " +
        "거친다.",
      assertionType: "FACT",
      sourceIds: ["src-incheon-recruit-2026", "src-khan-20260415"],
      verified: true,
    },
    {
      id: "claim-shrink",
      text: "강사 수는 2011년 6,255명에서 2026년 4월 보도 기준 1,724명으로 줄었다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260415"],
      verified: true,
    },
    {
      id: "claim-court",
      text:
        "대법원은 2020년 8월 20일(2018다51201) 부산 사건에서, 계약 사이에 짧은 공백이 있어도 실질적으로 계속 " +
        "근무해 4년을 넘겼다면 기간의 정함이 없는 근로자로 볼 수 있다고 판단했다. 공백을 두었다는 이유만으로 무기계약 " +
        "전환을 피할 수는 없다는 취지다. 다만 사안마다 계약 구조와 공백 기간을 따로 본다.",
      assertionType: "FACT",
      sourceIds: ["src-worklaw-20200825"],
      verified: true,
    },
    {
      id: "claim-nhrck",
      text: "국가인권위원회는 교육부에 영어회화전문강사의 무기계약직 전환 등 고용안정대책을 마련하라고 권고했다.",
      assertionType: "FACT",
      sourceIds: ["src-nhrck-recommendation"],
      verified: true,
    },
    {
      id: "claim-moe-view",
      text:
        "교육부와 교육청은 영어회화전문강사를 기간제법상 무기계약 전환의 예외로 보고, 4년을 채우면 퇴직 후 신규 " +
        "채용하는 방식을 유지하고 있다.",
      assertionType: "CLAIM",
      assertedBy: "교육부·시도교육청(노무관리 매뉴얼)",
      sourceIds: ["src-busan-manual-2026"],
      verified: false,
    },
    {
      id: "claim-law-debate",
      text:
        "정부는 2026년 기간제법의 사용기간 상한을 2년에서 3~4년으로 늘리는 방안을 논의하고 있다. 노동계와 강사들은 " +
        "기간만 늘려서는 4년마다 계약이 끊기는 고용 불안이 풀리지 않는다며 구조 개선을 요구한다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260415"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-law-debate"],
  timeline: [
    {
      id: "t-introduce",
      date: "2009",
      datePrecision: "year",
      title: "영어회화전문강사 제도 도입",
      summary: "정원 외 계약직, 최대 4년.",
      claimIds: ["claim-structure"],
    },
    {
      id: "t-court",
      date: "2020-08-20",
      datePrecision: "day",
      title: "대법원, 4년 넘게 계속 근무하면 무기계약 판단",
      summary: "2018다51201.",
      claimIds: ["claim-court"],
    },
    {
      id: "t-law-debate",
      date: "2026-04",
      datePrecision: "month",
      title: "기간제법 사용기간 연장 논의",
      summary: "2년→3~4년. 강사들은 구조 개선 요구.",
      claimIds: ["claim-law-debate"],
    },
  ],
  gaps: [
    "국가인권위원회 권고의 날짜와 교육부의 수용 여부를 원문으로 확인하지 못했다.",
    "이재명 정부나 교육부가 영어회화전문강사 고용 안정 대책을 따로 발표했는지 찾지 못했다. 2026년 10월 현재 발표된 것은 확인되지 않는다.",
    "기간제법 개정안이 영어회화전문강사에게 어떻게 적용될지는 정부안이 나오지 않아 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-incheon-recruit-2026",
      title: "2026학년도 영어회화전문강사 채용 공고(인천 관교여자중학교)",
      publisher: "대한민국 정책브리핑 채용정보",
      url: "https://www.korea.kr/archive/recruitInfoView.do?dataId=367275",
      publishedAt: "2026-01-28",
      type: "official",
      license: "public",
    },
    {
      id: "src-khan-20260415",
      title: "\"4년 계약도 희망고문\"…기간제 늘려도 '고용 단절'은 그대로",
      publisher: "경향신문(네이트 뉴스)",
      url: "https://m.news.nate.com/view/20260415n28632",
      publishedAt: "2026-04-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-worklaw-20200825",
      title: "대법원 \"공립학교 영어회화 강사도 무기계약직 전환\"...정규직 되나",
      publisher: "월간 노동법률",
      url: "https://www.worklaw.co.kr/main2022/view/view.asp?bi_pidx=31160",
      publishedAt: "2020-08-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nhrck-recommendation",
      title: "\"교육부, 영어회화전문강사 무기계약직 전환 등 고용안정대책 마련해야\"",
      publisher: "국가인권위원회",
      url: "https://www.humanrights.go.kr/site/program/board/basicboard/view?currentpage=158&menuid=001004002001&pagesize=10&boardtypeid=24&boardid=608372",
      type: "official",
      license: "public",
    },
    {
      id: "src-busan-manual-2026",
      title: "교육공무직원 노무관리 매뉴얼(부산교육 2026-81)",
      publisher: "부산광역시교육청",
      url: "https://www.pen.go.kr/upload/dep12/na/bbs_2564/ntt_1172431/doc_47davfb3f=21v71=4dvf7=a8v44=53d9v39e6v2b72_v7409.pdf",
      publishedAt: "2026",
      type: "official",
      license: "public",
    },
  ],
};

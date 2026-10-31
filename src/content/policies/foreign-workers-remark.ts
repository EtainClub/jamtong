import type { PolicyInput } from "./schema";

/**
 * 외국인 노동자 관련 대통령 국무회의 발언(2026년 10월 27일)과 외국인력 도입 규모.
 *
 * 「극단적 진영주의는 경계해야」 등 10월 말 X 게시물 답글에 "이번 외국인 노동자 발언은 실언이다",
 * "건설 인력시장을 외국인이 차지해 고령 내국인이 일거리를 잃는다", "서민 일자리는 저임금 외국인에게
 * 열면서 전문직은 열지 않는다"는 말이 달렸다(잼통 Voice). 발언의 원문과 맥락, 반발, 외국인력
 * 도입 규모를 적는다.
 *
 * ★ 발언이 국가 경제 기여를 어떻게 평가하는지는 해석의 문제라 판정하지 않는다.
 *   원문과 대통령 측 설명, 비판을 나란히 둔다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #115, #175.
 */
export const FOREIGN_WORKERS_REMARK: PolicyInput = {
  slug: "foreign-workers-remark",
  title: "외국인 노동자 관련 대통령 발언(2026년 10월)과 외국인력 도입 규모",
  scope:
    "2026년 10월 27일 국무회의에서 나온 외국인 노동자 발언의 원문·맥락, 대통령 측 설명과 노동계·정당 비판, 고용허가제(E-9) 도입 규모와 외국인주민 수",
  ministries: ["고용노동부", "농림축산식품부", "행정안전부"],
  categories: ["economy", "welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-gaffe",
      text: "이번 외국인 노동자 관련 대통령 발언은 실언이다",
      claimIds: ["claim-remark", "claim-context", "claim-explain", "claim-critique"],
    },
    {
      id: "rumor-construction",
      text: "건설 현장 인력시장을 외국인 노동자가 차지해 고령 내국인 노동자가 일거리를 잃고 있다",
      claimIds: ["claim-quota", "claim-residents"],
    },
    {
      id: "rumor-fairness",
      text: "서민·청년 일자리는 저임금 외국인 노동자에게 열면서 고소득 전문직은 열지 않는 것은 불공정하다",
      claimIds: ["claim-quota", "claim-context"],
    },
  ],
  claims: [
    {
      id: "claim-remark",
      text:
        "이재명 대통령은 10월 27일 국무회의에서 \"외국인 노동자들 불러다가 (일을) 해도 국가 경제에 크게 도움이 안 되고 " +
        "전부 다 (본국에) 송금해버리고\"라고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-20261028", "src-huffpost-261614"],
      verified: true,
    },
    {
      id: "claim-context",
      text:
        "발언은 농업 인력난을 논의하던 중 나왔다. 대통령은 송미령 농림축산식품부 장관에게 내국인 농업 노동자의 생계가 " +
        "가능한 수준의 인건비 지원 방안을 기획예산처와 검토하라고 지시했다.",
      assertionType: "FACT",
      sourceIds: ["src-huffpost-261614", "src-ytn-20261028"],
      verified: true,
    },
    {
      id: "claim-explain",
      text:
        "한 매체가 '크게'를 뺀 채 보도하자 대통령은 SNS에서 정정을 요구했다. 청와대 관계자들은 외국인 노동자의 기여는 " +
        "분명하지만 앞뒤 맥락을 자른 보도는 적절하지 않다고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "대통령·청와대",
      sourceIds: ["src-ytn-20261028"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "정의당은 10월 28일 논평에서 임금을 본국에 보내는 것은 정당한 경제활동이며, 언론에 사과를 요구하기 전에 " +
        "이주노동자에게 사과하라고 했다. 이주노동자 단체도 규탄 성명을 냈다.",
      assertionType: "CLAIM",
      assertedBy: "정의당·이주노동자 단체",
      sourceIds: ["src-huffpost-261614", "src-ytn-20261028"],
      verified: true,
    },
    {
      id: "claim-quota",
      text:
        "정부는 2025년 12월 외국인력정책위원회에서 2026년 고용허가제(E-9) 도입 규모를 8만 명(업종별 7만 명, 탄력 배정 " +
        "1만 명)으로 정했다. 고용허가제는 내국인을 구하지 못한 사업장이 신청하는 비전문 취업 제도다.",
      assertionType: "FACT",
      sourceIds: ["src-youthassembly-967134"],
      verified: false,
    },
    {
      id: "claim-residents",
      text:
        "행정안전부가 10월 28일 발표한 집계로 2025년 11월 1일 기준 외국인주민은 266만 2,967명으로 1년 전보다 3.1% 늘었고, " +
        "총인구의 5.1%다. 늘어난 인원의 절반 넘게가 유학생이다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20000342658"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-remark",
      date: "2026-10-27",
      datePrecision: "day",
      title: "국무회의 발언",
      summary: "농업 인력난 논의 중 외국인 노동자 송금 언급.",
      claimIds: ["claim-remark", "claim-context"],
    },
    {
      id: "t-critique",
      date: "2026-10-28",
      datePrecision: "day",
      title: "정의당 논평·이주노동자 단체 성명",
      summary: "혐오 발언이라는 비판과 사과 요구.",
      claimIds: ["claim-critique"],
    },
  ],
  gaps: [
    "건설업 현장의 외국인 노동자 비중과 내국인 고령 노동자의 일자리 변화에 대한 2026년 공식 통계는 찾지 못했다.",
    "고소득 전문직의 외국인 개방 범위(전문인력 비자 E-1~E-7)는 이 페이지에서 정리하지 못했다.",
    "고용노동부의 2026년 E-9 도입 규모 보도자료 원문은 대조하지 못했다.",
    "대통령이 정정을 요구한 X 게시물 원문은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-ytn-20261028",
      title: "이 대통령 '외국인 노동자·다문화' 발언 논란...진보진영 반발",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0101_202610282211528176",
      publishedAt: "2026-10-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-huffpost-261614",
      title: "정의당, 이재명 '외국인 노동자' 발언 문제점 직격 : 노동자가 임금 받아 송금한 게 타박받을 일인가",
      publisher: "허프포스트코리아",
      url: "https://huffingtonpost.kr/article/261614",
      publishedAt: "2026-10-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-youthassembly-967134",
      title: "외국인력 1만2630명 추가 도입…제조업·농축산업 집중 배정, 비수도권 고용 한도도 상향",
      publisher: "청년의회",
      url: "https://www.youthassembly.kr/news/967134",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbsbiz-20000342658",
      title: "국내 외국인 주민 266만명 역대 최대…총인구의 5.1%",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000342658",
      publishedAt: "2026-10-28",
      type: "press",
      license: "link-only",
    },
  ],
};

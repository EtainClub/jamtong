import type { PolicyInput } from "./schema";

/**
 * 정유 4사 유가 담합 기소(2026년 7월)와 공정위 조사.
 *
 * 답글에 "석유 담합 신고 사건을 공정위가 빨리 처리하고 신고자를 보호해 달라"는 요청이 달렸다
 * (잼통 Voice). 검찰 기소 내용과 공정위 조사 상황을 적는다.
 *
 * ★ 기소 단계다. 혐의는 검찰의 주장이며 법원 판단은 나오지 않았다.
 * ★ 유가 상한제는 policy:oil-price-cap에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #144.
 */
export const REFINERY_CARTEL: PolicyInput = {
  slug: "refinery-cartel",
  title: "정유 4사 유가 담합 기소와 공정위 조사",
  scope:
    "2026년 7월 서울중앙지검의 정유 4사·임원 기소 내용(담합 기간·규모·증거인멸), 공정위의 별도 조사, 첫 공판과 국정감사 답변",
  ministries: ["공정거래위원회", "법무부"],
  categories: ["economy", "institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-ftc",
      text: "석유 담합 신고 사건을 공정위가 빨리 처리하고 신고자를 보호해 달라",
      claimIds: ["claim-indictment", "claim-scale", "claim-evidence", "claim-ftc"],
    },
  ],
  claims: [
    {
      id: "claim-indictment",
      text:
        "서울중앙지검 공정거래조사부는 2026년 7월 6일 HD현대오일뱅크·SK에너지·GS칼텍스·S-OIL 4사와 임원 4명을 공정거래법 위반 등으로 " +
        "기소했다. 2024년 7월부터 2026년 2월까지 가격 인상 시기와 폭을 맞췄다는 혐의다.",
      assertionType: "CLAIM",
      assertedBy: "서울중앙지검",
      sourceIds: ["src-mt-20260707"],
      verified: true,
    },
    {
      id: "claim-scale",
      text: "검찰은 직접 담합 관련 매출을 약 14조 2천억 원, 뒤따라 가격을 올린 효과까지 합친 경쟁 제한 규모를 약 26조 원으로 추산했다.",
      assertionType: "CLAIM",
      assertedBy: "서울중앙지검",
      sourceIds: ["src-mt-20260707"],
      verified: true,
    },
    {
      id: "claim-evidence",
      text: "검찰은 일부 회사 관계자가 공정위 현장조사를 앞두고 경쟁사 가격 자료와 내부 메신저 대화를 지우게 했다고 보고 증거인멸 혐의도 적용했다.",
      assertionType: "CLAIM",
      assertedBy: "서울중앙지검",
      sourceIds: ["src-mt-20260707"],
      verified: true,
    },
    {
      id: "claim-ftc",
      text:
        "공정위는 형사 수사와 별도로 행정 심사를 하며 과징금은 따로 산정한다는 입장이다. 첫 공판은 8월 20일 열렸다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260710", "src-mtn-20260819"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-indict",
      date: "2026-07-06",
      datePrecision: "day",
      title: "정유 4사 기소",
      summary: "담합 관련 매출 14조 2천억 원.",
      claimIds: ["claim-indictment", "claim-scale", "claim-evidence"],
    },
    {
      id: "t-trial",
      date: "2026-08-20",
      datePrecision: "day",
      title: "첫 공판",
      summary: "형사재판 시작.",
      claimIds: ["claim-ftc"],
    },
  ],
  gaps: [
    "공정위의 정유사 담합 사건 심사 일정과 처분 시점은 확인하지 못했다.",
    "답글이 말하는 '석유 담합 신고 사건'이 이 사건인지, 신고자 보호 조치가 어떻게 됐는지는 확인하지 못했다.",
    "공정위 담합 신고 포상금 제도의 현행 기준은 정리하지 못했다.",
  ],
  sources: [
    {
      id: "src-mt-20260707",
      title: "전쟁 틈타 26조 담합, 정유4사 법정 선다",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/article/2026070619514324448",
      publishedAt: "2026-07-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260710",
      title: "정유 4사 '14조 담합' 발표한 검찰…공정위는 신중모드",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260710_0003704774",
      publishedAt: "2026-07-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-20260819",
      title: "정유4사 담합 20일 첫 공판…반기보고서 기재는 '제각각'",
      publisher: "MTN",
      url: "https://news.mtn.co.kr/news-detail/2026081914172285093",
      publishedAt: "2026-08-19",
      type: "press",
      license: "link-only",
    },
  ],
};

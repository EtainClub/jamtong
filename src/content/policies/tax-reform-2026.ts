import type { PolicyInput } from "./schema";

/**
 * 2026년 세제개편안(8월 3일 발표): 보유세(종부세) 개편 방향, 세수 효과, '세금 폭탄' 공방, 국회 심의.
 *
 * 대통령 유튜브 영상 답글에 "세금 폭탄을 매겼으니 원래대로 되돌리라"는 비판(이슈 #253)이 달렸고, Voice 방문자가
 * "보유세 개편 방향"(이슈 #276) 자료를 찾았다(잼통 Voice). 2026년 세제개편안이 누구의 세금을 얼마나 바꾸는지와 여야 평가를 적는다.
 *
 * ★ 국토보유세 공약과 종부세 개편의 관계는 policy:land-holding-tax에 있다.
 * ★ 세제개편안은 정부안이다. 국회 의결 전이므로 확정 세법이 아니다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #253, #276.
 */
export const TAX_REFORM_2026: PolicyInput = {
  slug: "tax-reform-2026",
  title: "2026년 세제개편안: 보유세 개편 방향과 '세금 폭탄' 공방",
  scope:
    "2026년 8월 3일 정부 세제개편안의 종합부동산세 개편(가액 기준 일원화·실거주 공제 차등·세부담 상한), 5년 세수 효과, 다주택자 양도세 중과 한시 완화, 여야 평가와 국회 심의 일정",
  ministries: ["재정경제부"],
  categories: ["economy"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-tax-bomb",
      text: "세금 폭탄을 매겼으니 원래대로 되돌리라",
      claimIds: ["claim-revenue", "claim-ccomprehensive", "claim-relief", "claim-politics"],
    },
  ],
  claims: [
    {
      id: "claim-ccomprehensive",
      text:
        "2026년 세제개편안은 주택분 종합부동산세 세율을 주택 수가 아니라 주택 가액 기준으로 단계적으로 일원화하고, 과세표준 6억~12억 원 구간 세율을 1.0%에서 1.3%로 올린다. " +
        "1세대 1주택 기본공제는 실거주하면 12억 원에서 14억 원으로 올리고, 거주하지 않으면 9억 원으로 낮춘다. 종부세 세부담 상한은 150%에서 200%로 높인다.",
      assertionType: "FACT",
      sourceIds: ["src-taxnet-4802", "src-intn-2052313"],
      verified: true,
    },
    {
      id: "claim-relief",
      text:
        "같은 개편안은 시장 충격을 줄이고 매도 기회를 준다며 다주택자의 조정대상지역 양도소득세 중과를 2027~2028년 한시적으로 완화한다. 장기보유특별공제에는 10억 원 한도를 둔다.",
      assertionType: "FACT",
      sourceIds: ["src-taxnet-4802", "src-intn-2052313"],
      verified: true,
    },
    {
      id: "claim-revenue",
      text:
        "정부가 추산한 이 세제개편안 전체의 세수 효과는 2027~2031년 5년간 3조 4,430억 원 증가다. 부담이 늘어나는 쪽은 초고가·비거주 주택 보유자이며, 실거주 1주택자는 공제가 커진다.",
      assertionType: "FACT",
      sourceIds: ["src-taxnet-4802", "src-intn-2052313"],
      verified: true,
    },
    {
      id: "claim-politics",
      text:
        "국민의힘은 종부세 강화를 '징벌적 증세', '세금폭탄 선언'이라고 비판했고 여당은 '조세 정상화'라고 맞섰다. 조국 전 법무부 장관은 예외와 특례가 늘어 기대에 못 미친다고 평가했다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-10830261"],
      verified: true,
    },
    {
      id: "claim-schedule",
      text:
        "국회 재정경제기획위원회 여당 간사 오기형 의원은 조세소위원회와 상임위에서 차례로 논의하겠다고 밝혔고, 심의는 11월 말까지 이어진다. 민주당 이소영 의원은 그 전까지 문제점을 바로잡겠다고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-10830261"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-politics"],
  timeline: [
    {
      id: "t-announce",
      date: "2026-08-03",
      datePrecision: "day",
      title: "2026년 세제개편안 발표",
      summary: "종부세 가액 기준 일원화.",
      claimIds: ["claim-ccomprehensive", "claim-relief", "claim-revenue"],
    },
    {
      id: "t-assembly",
      date: "2026-11",
      datePrecision: "month",
      title: "국회 조세소위 심의",
      summary: "11월 말까지.",
      claimIds: ["claim-schedule"],
    },
  ],
  gaps: [
    "종부세 개편만 따로 떼어 낸 세수 효과(전체 3조 4,430억 원 중 몫)는 확인하지 못했다.",
    "국회 조세소위의 수정 내용과 최종 의결 결과는 11월 9일 현재 나오지 않았다.",
  ],
  sources: [
    {
      id: "src-taxnet-4802",
      title: "2026년 세제개편 (08.03 발표) 핵심이슈 한눈에 살펴보기",
      publisher: "택스넷",
      url: "https://www.taxnet.co.kr/contents/insightpreview/post-detail?id=4802&gubunCode=TP0020",
      publishedAt: "2026-08",
      type: "research",
      license: "link-only",
    },
    {
      id: "src-intn-2052313",
      title: "2026 세법개정안 발표…초고가·비거주주택 종부세 인상, 장특공제 10억원 한도",
      publisher: "일간NTN",
      url: "https://www.intn.co.kr/news/articleView.html?idxno=2052313",
      publishedAt: "2026-08-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-10830261",
      title: "\"조세 정상화\" vs \"세금폭탄 선언\"…與野, 세제개편안 시각차 극명",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10830261",
      publishedAt: "2026-08",
      type: "press",
      license: "link-only",
    },
  ],
};

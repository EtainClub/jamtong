import type { PolicyInput } from "./schema";

/**
 * 재개발·재건축 이주자의 정책대출: 버팀목 전세대출 재건축 확대와 이주비대출 규제.
 *
 * 11월 초 대통령 X 게시물 답글 두 건에 "재개발·재건축으로 이사할 때 성실 상환자는 기존 저금리 정책대출을 상환 없이 유지하게 해 달라"는
 * 요청이 달렸다(잼통 Voice). 이주자에게 지금 쓸 수 있는 정책대출과 규제를 확인된 만큼 적는다.
 *
 * ★ 기존 디딤돌·버팀목 대출을 그대로 들고 이주하는 특례는 공식 자료에서 찾지 못했다(gaps).
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #234.
 */
export const REDEVELOPMENT_POLICY_LOANS: PolicyInput = {
  slug: "redevelopment-policy-loans",
  title: "재개발·재건축 이주자의 정책대출과 이주비 규제",
  scope:
    "주택도시기금 버팀목 전세대출의 재건축 이주자 확대(2026년 3월 은행 취급), 6·27 대책 뒤 이주비대출 LTV·한도와 승계 제한",
  ministries: ["국토교통부", "주택도시보증공사", "금융위원회"],
  categories: ["welfare", "economy"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-keep-loan",
      text: "재개발·재건축으로 이사할 때 성실 상환자는 기존 저금리 정책대출을 상환 없이 유지하게 해 달라",
      claimIds: ["claim-buttimmok", "claim-migration-loan"],
    },
  ],
  claims: [
    {
      id: "claim-buttimmok",
      text:
        "은행권은 2026년 3월 17일부터 HUG 버팀목 전세대출을 재건축 이주자에게도 취급하기 시작했다. 재개발 이주자만 받던 것을 안전진단 D·E등급 재건축 단지에 1년 이상 산 세입자와 실거주 1주택 소유주로 넓혔다. " +
        "환산보증금 3억 원 이하, 한도 1억 2,000만 원이며, 입주 뒤 안전진단을 신청해 D·E등급을 받은 단지는 제외된다.",
      assertionType: "FACT",
      sourceIds: ["src-dnews-20260324"],
      verified: true,
    },
    {
      id: "claim-migration-loan",
      text:
        "6·27 대책 이후 다주택자의 이주비대출 LTV는 0%이고 한도는 6억 원이다. 버팀목 대출은 이주비대출(6억 원)과 함께 받을 수 있어 최대 7억 2,000만 원까지 가능하다. HUG는 두 대출을 활용한 편법 거래를 막기 위해 사후관리를 강화한다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-dnews-20260324"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-buttimmok",
      date: "2026-03-17",
      datePrecision: "day",
      title: "버팀목 대출 재건축 이주자 취급 시작",
      summary: "은행권.",
      claimIds: ["claim-buttimmok"],
    },
  ],
  gaps: [
    "재개발·재건축으로 이주할 때 기존 디딤돌(구입자금)·버팀목(전세자금) 대출을 상환 없이 새 거주지로 옮겨 유지하는 특례는 주택도시기금 공식 안내에서 찾지 못했다. 버팀목의 '목적물 변경'은 민간 안내 글에만 있어 싣지 않았다.",
  ],
  sources: [
    {
      id: "src-dnews-20260324",
      title: "재개발ㆍ재건축 실거주자 이주비대출 늘어난다…버팀목 대출 재건축 지원",
      publisher: "대한경제",
      url: "https://www.dnews.co.kr/uhtml/view.jsp?idxno=202603241329295050410",
      publishedAt: "2026-03-24",
      type: "press",
      license: "link-only",
    },
  ],
};

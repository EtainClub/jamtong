import type { PolicyInput } from "./schema";

/**
 * 법원 경매로 넘어간 주택의 양도소득세.
 *
 * 10월 말 X 게시물 답글에 "사업 실패로 담보 주택이 법원 경매로 넘어간 사람에게까지 양도소득세를
 * 물리지 말아 달라"는 요청이 달렸다(잼통 Voice). 현행 판례가 경매를 어떻게 보는지 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #135.
 */
export const AUCTION_CAPITAL_GAINS: PolicyInput = {
  slug: "auction-capital-gains",
  title: "법원 경매로 넘어간 주택의 양도소득세",
  scope: "담보권 실행 경매로 소유권이 넘어갈 때 양도소득세 과세 여부와 납세의무자에 대한 대법원 판례, 구상권을 행사할 수 없을 때의 쟁점",
  ministries: ["재정경제부", "국세청"],
  categories: ["economy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-auction",
      text: "사업 실패로 담보 주택이 법원 경매로 넘어간 사람에게까지 양도소득세를 물리지 말아 달라",
      claimIds: ["claim-taxable", "claim-surety", "claim-2021"],
    },
  ],
  claims: [
    {
      id: "claim-taxable",
      text:
        "대법원은 1986년 저당권 실행을 위한 임의경매도 양도소득세 과세대상인 '양도'라고 판단했다(85누968). 낙찰자가 소유권을 " +
        "넘겨받고 낙찰대금은 원래 소유자에게 귀속되므로, 그 소유자가 납세의무를 진다.",
      assertionType: "FACT",
      sourceIds: ["src-nepla-85nu968"],
      verified: true,
    },
    {
      id: "claim-surety",
      text:
        "남의 빚을 위해 자기 집을 담보로 제공한 사람(물상보증인)이 경매로 집을 잃고 채무자에게 돈을 돌려받을 수 없게 돼도, 같은 " +
        "판결은 양도소득 성립에 영향이 없다고 봤다.",
      assertionType: "FACT",
      sourceIds: ["src-nepla-85nu968"],
      verified: true,
    },
    {
      id: "claim-2021",
      text:
        "대법원은 2021년 4월 물상보증인이 경매로 소유권을 잃고 채무자 파산으로 구상이 막힌 사건에서, 이를 세금을 다시 계산해 달라는 " +
        "후발적 경정청구 사유로 볼 수 있는지를 따져 원심을 파기환송했다(2020두53699).",
      assertionType: "FACT",
      sourceIds: ["src-scourt-2020du53699"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [],
  gaps: [
    "1세대 1주택 비과세(양도가액 12억 원 이하)가 경매로 넘어간 주택에도 그대로 적용되는지는 법령 원문으로 정리하지 못했다.",
    "경매로 집을 잃은 사람의 양도세를 감면하자는 법안이나 정부 검토는 찾지 못했다.",
    "2020두53699 사건의 파기환송 뒤 최종 결론은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-nepla-85nu968",
      title: "대법원 1986. 3. 25. 선고 85누968 판결",
      publisher: "nepla(판례 데이터베이스)",
      url: "https://www.nepla.ai/case/대법원/85누968",
      publishedAt: "1986-03-25",
      type: "judicial",
      license: "public",
    },
    {
      id: "src-scourt-2020du53699",
      title: "대법원 2021. 4. 8. 선고 2020두53699 판결",
      publisher: "대법원",
      url: "https://www.scourt.go.kr/sjudge/1618475389132_172949.pdf",
      publishedAt: "2021-04-08",
      type: "judicial",
      license: "public",
    },
  ],
};

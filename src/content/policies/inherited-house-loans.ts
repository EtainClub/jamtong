import type { PolicyInput } from "./schema";

/**
 * 상속 주택의 주택 수 산정과 주택담보대출 규제 (2026년).
 *
 * 대통령 유튜브 영상 답글에 "사람이 살 수 없는 시골 폐가를 물려받았을 뿐인데 1가구 2주택이 돼 이사할 집 대출이 막히니 예외를 두어 달라"는
 * 요청이 달렸다(잼통 Voice). 2026년 대출 규제에서 상속 주택을 어떻게 다루는지 확인된 만큼 적는다.
 *
 * ★ 상속을 '불가피한 취득'으로 보는 예외는 다주택자 주담대 만기연장 제한에 한정된다. 신규 대출 전반에 적용된다고 쓰지 않는다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #251.
 */
export const INHERITED_HOUSE_LOANS: PolicyInput = {
  slug: "inherited-house-loans",
  title: "상속 주택의 주택 수 산정과 주택담보대출 규제",
  scope:
    "2026년 가계부채 관리방안의 다주택자 주담대 만기연장 제한과 주택 수 산정 예외(상속·증여 구분), 8·13 대책의 상속 지분 보유자 생애최초 LTV 심사",
  ministries: ["금융위원회", "금융감독원"],
  categories: ["economy"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-inherited",
      text: "사람이 살 수 없는 시골 폐가를 물려받았을 뿐인데 1가구 2주택이 돼 이사할 집 대출이 막히니 예외를 두어 달라",
      claimIds: ["claim-maturity", "claim-inherit-vs-gift", "claim-first-home"],
    },
  ],
  claims: [
    {
      id: "claim-maturity",
      text:
        "금융위원회의 2026년 가계부채 관리방안(4월)은 다주택자가 가진 수도권·규제지역 아파트 담보대출의 만기연장을 원칙적으로 허용하지 않는다. 같은 은행 안에서 증액 없이 대환하는 것도 원칙적으로 안 된다. " +
        "다만 매도계약이 체결된 주택, 어린이집, 준공 후 미분양주택 등 규제를 적용하기 곤란한 주택은 주택 수에서 뺀다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1628317", "src-fnnews-20260413"],
      verified: true,
    },
    {
      id: "claim-inherit-vs-gift",
      text:
        "금융당국 FAQ는 상속처럼 불가피한 취득과 달리 증여는 선택할 수 있는 행위라며 증여 주택을 예외에서 뺐다. 예외는 차주가 증빙서류를 금융회사에 내는 방식으로 심사하며, " +
        "이 주택 수 산정 예외는 만기연장 제한에만 적용되고 세제나 다른 대출 규제로 자동 확장되지 않는다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20260413", "src-dailian-1628317"],
      verified: true,
    },
    {
      id: "claim-first-home",
      text:
        "8·13 부동산 대책은 미성년자 때 주택 지분을 상속받는 등 불가피한 사유가 있으면 금융회사 여신심사위원회 심사를 거쳐 생애최초 LTV 혜택을 적용할 수 있게 했다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-10879563"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-plan",
      date: "2026-04-01",
      datePrecision: "day",
      title: "2026년 가계부채 관리방안",
      summary: "다주택자 만기연장 제한, 상속·증여 구분.",
      claimIds: ["claim-maturity", "claim-inherit-vs-gift"],
    },
  ],
  gaps: [
    "이사할 집을 사며 받는 신규 주택담보대출에서 상속받은 저가·노후 주택(폐가)을 주택 수에서 빼 주는 규정은 공식 자료에서 찾지 못했다.",
    "상속 지분 보유자의 생애최초 LTV 적용 사례에 대한 금융당국 유권해석은 아직 나오지 않은 것으로 보도됐다.",
  ],
  sources: [
    {
      id: "src-dailian-1628317",
      title: "[Q&A] 가계대출 죄고 다주택자 압박… 금융위 '2026년 가계부채 관리방안'",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1628317/",
      publishedAt: "2026-04-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20260413",
      title: "금융위 \"다주택자 주담대 증액 없어도 자행대환 불가\"",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202604131536532808",
      publishedAt: "2026-04-13",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-10879563",
      title: "\"어릴 때 물려받은 집 지분 때문에 탈락?\"…생애최초 LTV 적용 기준 나온다",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10879563",
      publishedAt: "2026-08",
      type: "press",
      license: "link-only",
    },
  ],
};

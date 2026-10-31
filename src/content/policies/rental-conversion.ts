import type { PolicyInput } from "./schema";

/**
 * 임대주택 분양전환 가격과 감정평가 분쟁.
 *
 * 10월 말 X 게시물 답글에 "민간임대 분양전환은 계약대로 감정평가하고 그 내역을 투명하게 공개해
 * 달라", "혜택을 받은 민간임대사업자에게도 책임을 물어야 한다"는 요청이 달렸다(잼통 Voice).
 * 분쟁이 생기는 구조와 2026년 사례를 적는다.
 *
 * ★ 2026년 국토교통부의 제도 개선안은 찾지 못했다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #123.
 */
export const RENTAL_CONVERSION: PolicyInput = {
  slug: "rental-conversion",
  title: "임대주택 분양전환 가격과 감정평가 분쟁",
  scope:
    "공공·민간 임대주택의 분양전환가를 감정평가로 정하면서 생기는 입주민 분쟁, 판교·하남 감일 사례, 분쟁조정위원회 조정",
  ministries: ["국토교통부"],
  categories: ["region", "welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-appraisal",
      text: "민간임대 분양전환은 계약대로 감정평가하고, 그 내역을 투명하게 공개해 사업자에게도 책임을 물어 달라",
      claimIds: ["claim-pangyo", "claim-gamil"],
    },
  ],
  claims: [
    {
      id: "claim-pangyo",
      text:
        "판교 민간임대 아파트에서는 2025년 말 감정평가로 정해진 분양전환가가 크게 올라 입주민이 반발했다. 입주민들은 \"차라리 그때 " +
        "집을 살 걸\"이라고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20251217"],
      verified: false,
    },
    {
      id: "claim-gamil",
      text:
        "하남 감일 10단지 분양전환 갈등은 2026년 4월 임대주택 분쟁조정위원회가 조정안을 냈지만, LH가 조정에 참여하지 않아 가격 " +
        "산정 방식 논란이 남았다고 보도됐다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20260415"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-gamil",
      date: "2026-04-15",
      datePrecision: "day",
      title: "하남 감일10단지 조정안",
      summary: "임대주택 분쟁조정위원회.",
      claimIds: ["claim-gamil"],
    },
  ],
  gaps: [
    "민간임대특별법·공공주택특별법이 정한 분양전환가 산정 방식(감정평가 선정 주체, 공개 의무)은 법령 원문으로 정리하지 못했다.",
    "2026년 국토교통부의 분양전환 제도 개선안이나 감정평가 내역 공개 의무화 논의는 찾지 못했다.",
    "답글이 가리키는 단지가 어디인지는 답글에 나오지 않아 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-segye-20251217",
      title: "판교 민간임대 분양전환가 논란…입주민들 \"차라리 그때 집 살 걸\"",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20251217510712",
      publishedAt: "2025-12-17",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20260415",
      title: "하남 감일10단지 분양전환 갈등 '조정안' 도출",
      publisher: "서울신문",
      url: "https://m.go.seoul.co.kr/news/2026/04/15/20260415500130",
      publishedAt: "2026-04-15",
      type: "press",
      license: "link-only",
    },
  ],
};

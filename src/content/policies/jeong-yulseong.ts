import type { PolicyInput } from "./schema";

/**
 * 광주 정율성 기념사업 논란.
 *
 * 「어렵게 만든 민주주의를 꼭 지켜냅시다」 답글에 "북한과 중국 군가를 만든 정율성을 광주가 기리는
 * 것은 민주주의와 맞지 않는다"는 말이 달렸다(잼통 Voice). 기념사업은 광주시·남구의 지자체 사업이다.
 * 경과를 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #146.
 */
export const JEONG_YULSEONG: PolicyInput = {
  slug: "jeong-yulseong",
  title: "광주 정율성 기념사업 논란",
  scope: "광주시의 정율성 역사공원 사업 중단(2023년)과 생가 복원, 남구 흉상 훼손과 복원 검토(2025년), 기념사업 주체",
  ministries: ["광주광역시"],
  categories: ["region"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-honor",
      text: "북한과 중국 군가를 만든 정율성을 광주가 기리는 것은 민주주의와 맞지 않는다",
      claimIds: ["claim-who", "claim-2023", "claim-2025"],
    },
  ],
  claims: [
    {
      id: "claim-who",
      text:
        "정율성은 광주 출신으로 항일단체 조선의열단에서 활동했고, 중국 인민해방군가와 북한 조선인민군 행진곡을 작곡해 중국에서 " +
        "'3대 음악가'로 꼽힌다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20250814", "src-segye-20230823"],
      verified: true,
    },
    {
      id: "claim-2023",
      text:
        "광주시는 동구 불로동 878㎡ 부지에 48억 원을 들여 정율성 역사공원을 만들려 했다. 2023년 박민식 당시 국가보훈부 장관이 북한·중국 활동 전력을 문제 삼아 중단을 요구하자, 광주시는 역사공원 조성을 멈추고 생가만 " +
        "복원했다. 같은 해 10월 남구 양림동 흉상은 두 차례 훼손돼 임시 보관 중이다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20250814", "src-segye-20230823"],
      verified: true,
    },
    {
      id: "claim-2025",
      text:
        "2025년 8월 김병내 광주 남구청장은 흉상 복원을 검토하겠다고 했고, 광주시는 2026년 종합계획 수립 용역 예산을 반영했다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20250814"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-2023",
      date: "2023-08",
      datePrecision: "month",
      title: "보훈부 장관 중단 요구",
      summary: "역사공원 중단, 생가만 복원.",
      claimIds: ["claim-2023"],
    },
    {
      id: "t-2025",
      date: "2025-08-14",
      datePrecision: "day",
      title: "재개 움직임 보도",
      summary: "흉상 복원 검토.",
      claimIds: ["claim-2025"],
    },
  ],
  gaps: [
    "2026년 광주시 종합계획 용역의 결과와 흉상 복원 여부는 확인하지 못했다.",
    "이재명 정부가 이 사업에 대해 밝힌 입장은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-seoul-20250814",
      title: "이념 갈등에 멈춘 '정율성 기념사업' 재개 움직임",
      publisher: "서울신문",
      url: "https://m.go.seoul.co.kr/news/2025/08/14/20250814020011",
      publishedAt: "2025-08-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20230823",
      title: "[사설] '北·中 영웅' 작곡가 정율성 기념사업, 백지화해야 옳다",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20230823514994",
      publishedAt: "2023-08-24",
      type: "press",
      license: "link-only",
    },
  ],
};

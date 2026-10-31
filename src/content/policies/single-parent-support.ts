import type { PolicyInput } from "./schema";

/**
 * 한부모·조손가족 아동양육비 (2026년).
 *
 * 10월 말 X 게시물 답글에 "다문화가정만큼 한부모·조손가정 아이들도 어려우니 지역마다 꼼꼼히 살펴
 * 지원해 달라"는 요청이 달렸다(잼통 Voice). 2026년 한부모가족 복지급여를 적는다.
 *
 * ★ 다문화가족 우대 검토 발언은 policy:multicultural-review에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #187.
 */
export const SINGLE_PARENT_SUPPORT: PolicyInput = {
  slug: "single-parent-support",
  title: "한부모·조손가족 아동양육비 (2026년)",
  scope: "2026년 한부모가족 아동양육비·추가 지원(조손가족 포함)·학용품비, 소득 기준(기준중위소득 65%)과 신청 방법",
  ministries: ["성평등가족부"],
  categories: ["welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-single-parent",
      text: "다문화가정만큼 한부모·조손가정 아이들도 어려우니 지역마다 꼼꼼히 살펴 지원해 달라",
      claimIds: ["claim-allowance", "claim-income", "claim-extra"],
    },
  ],
  claims: [
    {
      id: "claim-allowance",
      text:
        "2026년 한부모가족(조손가족 포함) 아동양육비는 18세 미만 자녀 1인당 월 23만 원이다. 미혼모·부 가구와 조손가족의 5세 이하 자녀, " +
        "청년(25~34세) 한부모의 자녀에게는 월 10만 원을 더 준다.",
      assertionType: "FACT",
      sourceIds: ["src-bokjiro-1309148"],
      verified: true,
    },
    {
      id: "claim-income",
      text:
        "대상은 소득인정액이 기준중위소득 65% 이하인 가구로, 2026년에 넓어졌다(3인 가구 월 348만 원). 근로·사업소득은 30%를 공제하고 계산한다.",
      assertionType: "FACT",
      sourceIds: ["src-bokjiro-1309148"],
      verified: true,
    },
    {
      id: "claim-extra",
      text: "초·중·고 자녀 1인당 학용품비 연 10만 원, 한부모가족 복지시설 입소 가구 생활보조금 월 10만 원도 있다. 신청은 주민센터나 복지로에서 한다.",
      assertionType: "FACT",
      sourceIds: ["src-bokjiro-1309148"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [],
  gaps: [
    "2027년 예산안의 한부모·조손가족 지원 단가 변화는 확인하지 못했다.",
    "지역별 한부모·조손가정 발굴 실적과 사각지대 규모는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-bokjiro-1309148",
      title: "한부모가족 아동양육비 신청하세요!",
      publisher: "복지로",
      url: "https://www.bokjiro.go.kr/ssis-tbu/cms/pc/news/promotion/1309148_1118.html",
      publishedAt: "2025-12-29",
      type: "official",
      license: "public",
    },
  ],
};

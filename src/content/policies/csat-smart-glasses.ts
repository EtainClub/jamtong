import type { PolicyInput } from "./schema";

/**
 * 수능 스마트안경(AI 기기) 부정행위 대책 (2027학년도).
 *
 * 「어렵게 만든 민주주의를 꼭 지켜냅시다」 답글에 "수능에서 AI 안경 같은 기기로 부정행위를 하는 문제에
 * 강한 처벌 대책을 내 달라"는 요청이 달렸다(잼통 Voice). 2027학년도 수능 수험생 유의사항을 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #171.
 */
export const CSAT_SMART_GLASSES: PolicyInput = {
  slug: "csat-smart-glasses",
  title: "수능 스마트안경 부정행위 대책 (2027학년도)",
  scope: "한국교육과정평가원의 2027학년도 수능 수험생 유의사항 가운데 스마트안경 반입 금지·제재와 감독 방식, 현장 교사들의 우려",
  ministries: ["교육부", "한국교육과정평가원"],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-ai-glasses",
      text: "수능에서 AI 안경 같은 기기로 부정행위를 하는 문제에 강한 처벌 대책을 내 달라",
      claimIds: ["claim-ban", "claim-sanction", "claim-supervise"],
    },
  ],
  claims: [
    {
      id: "claim-ban",
      text: "평가원은 10월 15일 공개한 2027학년도 수능 유의사항에서 스마트안경을 시험장 반입 금지 물품으로 처음 명시했다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2015468"],
      verified: true,
    },
    {
      id: "claim-sanction",
      text:
        "시험 중 스마트안경을 착용하면 그 해 시험이 무효가 되고 다음 해 수능 응시 자격도 정지된다(수능 관리규정 제19조). 반입하거나 " +
        "소지만 해도 시험은 무효다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2015468"],
      verified: true,
    },
    {
      id: "claim-supervise",
      text:
        "감독관은 시험 중에도 안경 확인을 요청할 수 있고, 수험생이 따르지 않으면 중대한 부정행위로 조치할 수 있다. 교사 단체는 식별 " +
        "부담을 감독 교사 개인에게 지우는 구조를 고치라고 요구했다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-2015468"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-notice",
      date: "2026-10-15",
      datePrecision: "day",
      title: "2027학년도 수능 유의사항 공개",
      summary: "스마트안경 반입 금지.",
      claimIds: ["claim-ban", "claim-sanction"],
    },
  ],
  gaps: [
    "스마트안경을 가려낼 장비 도입 등 감독 매뉴얼의 구체적 내용은 확인하지 못했다.",
    "형사 처벌(업무방해 등) 적용 여부에 대한 교육부 방침은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-inews24-2015468",
      title: "'스마트 안경' 착용시 수능 무효...다음해 응시자격도 정지",
      publisher: "아이뉴스24",
      url: "https://inews24.com/view/2015468",
      publishedAt: "2026-10-15",
      type: "press",
      license: "link-only",
    },
  ],
};

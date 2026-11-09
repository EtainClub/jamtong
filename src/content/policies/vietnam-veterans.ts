import type { PolicyInput } from "./schema";

/**
 * 월남전 참전유공자 수당과 고엽제 피해 보상 체계 (2026년).
 *
 * 대통령 유튜브 영상 답글에 "월남전 참전용사 수당을 정부가 가져간 것을 돌려주고, 고엽제법 이전에 숨진 분들에게도 소급 적용해 달라"는
 * 요청이 달렸다(잼통 Voice). 지금 국가·지자체가 주는 수당, 고엽제 후유증·후유의증의 차이와 2026년 국감 지적을 적는다.
 *
 * ★ '정부가 가져갔다'는 말이 무엇을 가리키는지(기초생활보장 소득 산정 등)는 답글만으로 알 수 없어 gaps에 적었다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #257.
 */
export const VIETNAM_VETERANS: PolicyInput = {
  slug: "vietnam-veterans",
  title: "월남전 참전유공자 수당과 고엽제 피해 보상 (2026년)",
  scope:
    "국가 참전명예수당 금액, 지자체 참전명예수당의 지역 격차와 보훈부 인상 권고(2026년 10월), 고엽제 후유증·후유의증 이원화에 대한 2026년 국정감사 지적",
  ministries: ["국가보훈부", "지방자치단체"],
  categories: ["welfare"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-veterans",
      text: "월남전 참전용사 수당을 정부가 가져간 것을 돌려주고, 고엽제법 이전에 숨진 분들에게도 소급 적용해 달라",
      claimIds: ["claim-national", "claim-local", "claim-guideline", "claim-agent-orange"],
    },
  ],
  claims: [
    {
      id: "claim-national",
      text:
        "국가보훈부는 6·25전쟁과 월남전 참전유공자에게 국가 참전명예수당을 매달 15일 지급한다. 2026년 국가 지급액은 월 49만 원이다.",
      assertionType: "FACT",
      sourceIds: ["src-mpva-122", "src-seoul-20260624-veterans"],
      verified: true,
    },
    {
      id: "claim-local",
      text:
        "지방정부도 조례로 참전명예수당을 따로 주는데 금액 차이가 크다. 2026년 6월 보도 기준 전북 정읍시·전주시는 월 14만 원, 강원 화천군은 월 66만 원이었다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20260624-veterans"],
      verified: true,
    },
    {
      id: "claim-guideline",
      text:
        "보훈부는 2026년 10월 지자체에 2029년 초까지 기초자치단체는 월 12만 원, 광역자치단체는 월 11만 원 이상을 지급하도록 권고하는 가이드라인을 냈다. " +
        "이행되면 지방정부 최소 지급액이 월 14만 원에서 23만 원으로 오를 것으로 보훈부는 전망했다.",
      assertionType: "FACT",
      sourceIds: ["src-newswhoplus-71327", "src-seoul-20260624-veterans"],
      verified: true,
    },
    {
      id: "claim-agent-orange",
      text:
        "고엽제 피해는 '후유증'과 '후유의증'으로 나뉜다. 후유증은 상이군경 국가유공자로 등록돼 사망 때 지위가 유족에게 승계되지만, 후유의증은 장애등급에 따른 수당 중심이다. " +
        "전현희 의원은 2026년 10월 6일 보훈부 국정감사에서 같은 피해자를 차별하는 이원화 제도를 전면 재검토하라고 요구했다.",
      assertionType: "FACT",
      sourceIds: ["src-ajunews-20261006"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-agent-orange"],
  timeline: [
    {
      id: "t-guideline",
      date: "2026-10-08",
      datePrecision: "day",
      title: "보훈부, 지자체 참전수당 인상 권고",
      summary: "2029년까지 최소 23만 원 목표.",
      claimIds: ["claim-guideline"],
    },
    {
      id: "t-audit",
      date: "2026-10-06",
      datePrecision: "day",
      title: "국감 '고엽제 이원화 재검토' 요구",
      summary: "전현희 의원.",
      claimIds: ["claim-agent-orange"],
    },
  ],
  gaps: [
    "답글의 '정부가 가져간 수당'이 무엇을 가리키는지 확인하지 못했다. 기초생활보장 소득인정액에 참전명예수당 일부가 반영되는 문제를 말하는 것일 수 있으나, 2026년 공제 기준을 공식 자료로 대조하지 못했다.",
    "고엽제법 시행 전에 숨진 참전자에게 소급 보상을 하는 제도나 개정안은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-mpva-122",
      title: "참전유공자 지원내용",
      publisher: "국가보훈부",
      url: "https://www.mpva.go.kr/mpva/contents.do?key=122",
      type: "official",
      license: "public",
    },
    {
      id: "src-seoul-20260624-veterans",
      title: "월 14만원 vs 월 66만원…참전명예수당, 지자체마다 '천차만별'",
      publisher: "서울신문",
      url: "https://www.seoul.co.kr/news/society/2026/06/24/20260624500263",
      publishedAt: "2026-06-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newswhoplus-71327",
      title: "참전명예수당 평균 30만원대로…보훈부, 전국 지자체에 인상 권고",
      publisher: "뉴스후플러스",
      url: "https://www.newswhoplus.com/news/articleView.html?idxno=71327",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ajunews-20261006",
      title: "[2026 국정감사] 전현희 \"고엽제 질병 인정 체계 이원화 제도, 전면 재검토 필요\"",
      publisher: "아주경제",
      url: "https://www.ajunews.com/view/20261006162921555",
      publishedAt: "2026-10-06",
      type: "press",
      license: "link-only",
    },
  ],
};

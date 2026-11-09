import type { PolicyInput } from "./schema";

/**
 * 공공 안전을 해치는 사유지 사용을 규제하는 현행 수단.
 *
 * 11월 초 대통령 X 게시물 답글에 "공공 안전을 해치는 사유지 사용은 사유지라도 규제할 수 있어야 한다"는 말이 달렸다(잼통 Voice).
 * 답글이 어떤 사례를 두고 한 말인지는 알 수 없어(gaps), 사유지라도 공공 안전·통행을 이유로 제한할 수 있는 현행 법적 수단을 적는다.
 *
 * ★ 법조문 요지는 법령 검색 결과와 판례 정리로 확인했다. 원문 대조 전이라 verified: false로 둔 것이 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #237.
 */
export const PRIVATE_LAND_SAFETY: PolicyInput = {
  slug: "private-land-safety",
  title: "공공 안전을 해치는 사유지 사용을 막는 현행 수단",
  scope:
    "재난안전법의 위험구역 설정·출입 제한, 건축법의 기존 건축물 안전점검·시정명령과 빈집 직권 철거, 사유지 통행로를 막을 때의 일반교통방해죄 판례",
  ministries: ["행정안전부", "국토교통부", "지방자치단체"],
  categories: ["institution", "disaster"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-private-land",
      text: "공공 안전을 해치는 사유지 사용은 사유지라도 규제할 수 있어야 한다",
      claimIds: ["claim-danger-zone", "claim-building", "claim-road"],
    },
  ],
  claims: [
    {
      id: "claim-danger-zone",
      text:
        "재난 및 안전관리 기본법 제41조는 재난이 발생하거나 발생할 우려가 있으면 시장·군수·구청장 등이 위험구역을 설정하고, 응급조치에 종사하지 않는 사람의 출입을 제한·금지하거나 퇴거·대피를 명할 수 있게 한다. " +
        "명령을 따르지 않아 위급하면 강제로 대피·퇴거시키거나 차량 등을 견인할 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-law-disaster-41"],
      verified: false,
    },
    {
      id: "claim-building",
      text:
        "건축법 제81조는 기존 건축물의 안전점검과 시정명령을, 제81조의2·3은 빈집 정비를 다루며 건축위원회 심의를 거쳐 빈집을 직권 철거할 수 있게 한다.",
      assertionType: "FACT",
      sourceIds: ["src-law-building-81"],
      verified: false,
    },
    {
      id: "claim-road",
      text:
        "법원은 소유권과 관계없이 사실상 일반 공중이 통행하는 길은 형법상 '육로'로 본다. 대법원은 주민들이 오래 쓰던 사유지 통행로에 펜스를 쳐 차량 통행을 어렵게 한 사건(2016도15285)에서 일반교통방해죄 유죄(벌금 100만 원)를 확정했다. " +
        "반면 교인용으로 만든 사설 도로에 철문을 단 사건은 불특정 다수가 쓰는 길이 아니라며 무죄로 판단된 사례가 있다.",
      assertionType: "FACT",
      sourceIds: ["src-r114-road", "src-lawtalk-42684"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [],
  gaps: [
    "답글이 어떤 사유지 사용(시설물·통행로 차단·위험 방치 등)을 두고 한 말인지 원 게시물 맥락을 확인하지 못했다.",
    "2026년 정부가 사유지의 공공 안전 규제를 넓히는 입법을 추진한다는 발표는 찾지 못했다.",
    "법조문은 국가법령정보센터 원문과 대조하지 못했다(미검증).",
  ],
  sources: [
    {
      id: "src-law-disaster-41",
      title: "재난 및 안전관리 기본법 제41조(위험구역의 설정)",
      publisher: "국가법령정보센터",
      url: "https://www.law.go.kr/법령/재난및안전관리기본법/제41조",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-law-building-81",
      title: "건축법 제81조(기존의 건축물에 대한 안전점검 및 시정명령 등)",
      publisher: "국가법령정보센터",
      url: "https://www.law.go.kr/법령/건축법/제81조",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-r114-road",
      title: "골목길 사도(개인 도로) 주차장 분쟁, 대법원은 누구 손을 들어줄까?",
      publisher: "부동산R114",
      url: "https://r114.com/trends/wiki/policy/38a4a6fa-284b-80c6-a90e-e83fe5d5599e",
      type: "research",
      license: "link-only",
    },
    {
      id: "src-lawtalk-42684",
      title: "교회 사유지 도로 막아도 교통방해죄 무죄",
      publisher: "로톡",
      url: "https://www.lawtalk.co.kr/case-lenses/42684",
      type: "judicial",
      license: "link-only",
    },
  ],
};

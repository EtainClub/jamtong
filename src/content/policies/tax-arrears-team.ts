import type { PolicyInput } from "./schema";

/**
 * 지방세입 체납관리단: 운영 방식, 징수 실적, 복지 연계.
 *
 * 「당장 먹을 쌀조차 없는 국민이 있다면」(10월 19일) 답글에 "체납관리단을 상시 일자리로
 * 넓혀 달라", "쌀을 나눠 주는 건 배급제다", "체납 세금을 다 걷어 국민 부담 없이 지원한다는
 * 근거가 뭔가"라는 말이 달렸다(잼통 Voice). 체납관리단이 어떻게 운영되고, 무엇을 걷고,
 * 어떤 사람을 복지로 잇는지 적는다.
 *
 * ★ 대통령 글은 words:rice-first에 있다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #111.
 */
export const TAX_ARREARS_TEAM: PolicyInput = {
  slug: "tax-arrears-team",
  title: "지방세입 체납관리단: 운영 방식, 징수 실적, 복지 연계",
  scope:
    "2026년 8월 행정안전부와 지자체가 출범한 지방세입 체납관리단의 채용·운영 기간, 두 달 징수 실적과 인건비, 생계형 체납자 복지 연계 실적",
  ministries: ["행정안전부"],
  categories: ["welfare", "economy"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-permanent",
      text: "체납관리단을 몇 달짜리 사업이 아닌 상시 일자리로 넓히고, 60대 등 더 많은 사람이 참여할 길을 열어 달라",
      claimIds: ["claim-launch", "claim-period"],
    },
    {
      id: "rumor-ration",
      text: "집은 못 사게 막으면서 쌀을 나눠 주는 것은 국가가 배급하는 공산주의식 정책이다",
      claimIds: ["claim-welfare"],
    },
    {
      id: "rumor-funding",
      text: "체납 세금을 다 걷어 국민 부담 없이 지원한다는데, 전액 징수와 사업비 충당의 근거가 무엇인가",
      claimIds: ["claim-results", "claim-cost"],
    },
  ],
  claims: [
    {
      id: "claim-launch",
      text:
        "행정안전부는 2026년 8월 전국 지자체와 함께 '지방세입 체납관리단'을 출범시켰다. 청년 구직자·경력단절 여성·" +
        "은퇴자 등 실태조사원 2,029명을 채용해 100만 원 미만 소액 체납 가구를 전화 상담과 방문으로 살폈다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1702737"],
      verified: true,
    },
    {
      id: "claim-period",
      text:
        "지자체 체납관리단은 대개 기간제로 8~9월부터 11월 말까지 운영한다. 예컨대 성남시는 9월 1일~11월 30일 근무하는 " +
        "44명을 생활임금(시급 1만 2,520원)으로 모집했다.",
      assertionType: "FACT",
      sourceIds: ["src-kgnews-902729", "src-vision21-602031"],
      verified: true,
    },
    {
      id: "claim-results",
      text:
        "9월 말까지 136만 명의 생활 실태를 확인했고, 33만 명이 밀린 세금 414억 원을 냈다. 2만 340명에게는 분할 납부를 " +
        "허용하고, 2만 2,526명은 체납 처분을 잠정 중단하는 '정리보류'를 결정했다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1702737"],
      verified: true,
    },
    {
      id: "claim-cost",
      text:
        "투입 인건비는 104억 원으로 징수액의 약 4분의 1이다. 징수한 체납액으로 인건비를 충당하는 구조인지는 보도와 발표에 " +
        "나오지 않는다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1702737"],
      verified: true,
    },
    {
      id: "claim-welfare",
      text:
        "실직·폐업·질병 등으로 형편이 어려운 생계형 체납자 787명을 찾아 복지 지원(706명), 긴급 주거 지원(14명), 일자리 " +
        "연결(67명)로 이었다. 긴급 쌀 지원은 이런 복지 연계 사례 가운데 하나로, 모든 국민에게 나눠 주는 배급이 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1702737", "src-gangdong-15417"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-launch",
      date: "2026-08",
      datePrecision: "month",
      title: "지방세입 체납관리단 출범",
      summary: "실태조사원 2,029명.",
      claimIds: ["claim-launch"],
    },
    {
      id: "t-results",
      date: "2026-10-18",
      datePrecision: "day",
      title: "두 달 실적 발표",
      summary: "414억 원 징수, 787명 복지 연계.",
      claimIds: ["claim-results", "claim-welfare"],
    },
  ],
  gaps: [
    "체납관리단을 상시 조직으로 바꾸거나 2027년에 이어 운영하겠다는 행정안전부 계획은 찾지 못했다.",
    "실태조사원 채용의 연령 제한 여부는 지자체마다 달라 정리하지 못했다.",
    "행정안전부 보도자료(10월 18일) 원문은 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-dailian-1702737",
      title: "투입 인건비 4배 거둔 체납관리단…징수 실적과 취약계층 구제 '두 토끼' 잡았다",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1702737/",
      publishedAt: "2026-10-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kgnews-902729",
      title: "성남시, 지방세 체납관리단 44명 공개 모집…맞춤형 조사·복지 연계 강화",
      publisher: "경기신문",
      url: "https://kgnews.co.kr/mobile/article.html?no=902729",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-vision21-602031",
      title: "이천시, 8월 3일부터 '지방세입 체납관리단' 운영 개시",
      publisher: "비전21뉴스",
      url: "https://www.vision21.kr/news/article.html?no=602031",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-gangdong-15417",
      title: "강동구청 보도자료 (지방세입 체납관리단)",
      publisher: "서울 강동구",
      url: "https://gangdong.go.kr/web/newportal/press/15417",
      type: "official",
      license: "public",
    },
  ],
};

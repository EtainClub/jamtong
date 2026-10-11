import type { PolicyInput } from "./schema";

/**
 * 미국 당국자의 '정보·방첩 동맹 기준' 발언 (2026년 10월).
 *
 * "백악관이 한국에 최후통첩을 날렸다"는 글이 돈다. 실제로 있었던 일은 미국 행정부
 * 고위 당국자가 익명으로 한국 언론의 서면 질의에 답하며 정보·방첩 분야의 동맹 기준
 * 준수를 기대한다고 말한 것이다. 이례적으로 수위가 높은 메시지라는 평가는 있지만,
 * 기한이나 조치를 내건 '최후통첩'은 확인되지 않는다.
 *
 * ★ 대북 정보 공유 제한은 실제 쟁점이다. 합참의장도 국감에서 일부 제한을 인정했다.
 *   메시지가 가볍다고 쓰지 않는다. 표현의 정도만 바로잡는다.
 * ★ 2026-10-11 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #8.
 */
export const US_INTEL_STANDARDS: PolicyInput = {
  slug: "us-intel-standards",
  title: "미국 당국자의 '정보·방첩 동맹 기준' 발언",
  scope: "2026년 10월 9일 미국 행정부 고위 당국자 발언의 내용·형식과 한미 대북 정보 공유 제한 보도",
  ministries: ["외교부", "국방부", "국가정보원"],
  categories: ["diplomacy"],
  asOf: "2026-10-11",
  rumors: [
    {
      id: "rumor-ultimatum",
      text: "백악관이 한국에 최후통첩을 날렸다",
      claimIds: ["claim-statement", "claim-form", "claim-no-specifics"],
    },
  ],
  claims: [
    {
      id: "claim-statement",
      text:
        "미국 행정부 고위 당국자는 2026년 10월 9일(현지시간) 한미 정보 협력 상황을 묻는 " +
        "연합뉴스의 서면 질의에 '우리는 한국이 수십 년간 이어져 온 양국 동맹의 기준을 준수하길 " +
        "기대한다. 특히 정보 및 방첩 관련 사안과 관련해 그렇다'고 답했다.",
      assertionType: "CLAIM",
      assertedBy: "미국 행정부 고위 당국자(익명)",
      sourceIds: ["src-etoday-20261010", "src-newdaily-20261010"],
      verified: true,
    },
    {
      id: "claim-form",
      text:
        "발언은 익명 당국자가 언론 서면 질의에 답한 형식이었다. 보도는 발언자를 '미국 행정부 " +
        "고위 당국자'로 적었고 백악관이라고 특정하지 않았다. 정부 간 공식 서한이나 성명은 " +
        "아니었다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-20261010", "src-newdaily-20261010"],
      verified: true,
    },
    {
      id: "claim-no-specifics",
      text:
        "당국자는 '동맹의 기준'이 구체적으로 무엇인지, 한국이 이를 위반했다고 보는지는 말하지 " +
        "않았다. 기한이나 불이행 시 조치도 언급하지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-20261010", "src-newdaily-20261010"],
      verified: true,
    },
    {
      id: "claim-intel-restriction",
      text:
        "미국은 2026년 3월 정동영 통일부 장관이 평안북도 구성의 우라늄 농축시설을 공개적으로 " +
        "언급한 뒤 반년 넘게 한국에 대북 정보 공유를 일부 제한해 온 것으로 전해졌다.",
      assertionType: "CLAIM",
      assertedBy: "언론 보도(뉴데일리 등)",
      sourceIds: ["src-newdaily-20261010"],
      verified: false,
    },
    {
      id: "claim-jcs",
      text:
        "진영승 합참의장은 10월 8일 국정감사에서 미국의 북핵 관련 정보 공유가 '일부는 " +
        "제한되지만, 우리가 대비 태세에 임하는 데는 문제가 없다'며 '빨리 해소가 되는 게 " +
        "최선'이라고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "진영승 합동참모의장",
      sourceIds: ["src-newdaily-20261010", "src-etoday-20261010"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-intel-restriction", "claim-jcs"],
  timeline: [
    {
      id: "t-uranium-remark",
      date: "2026-03",
      datePrecision: "month",
      title: "통일부 장관, 구성 농축시설 언급 (보도)",
      summary: "이후 대북 정보 공유 일부 제한으로 전해짐.",
      claimIds: ["claim-intel-restriction"],
    },
    {
      id: "t-jcs",
      date: "2026-10-08",
      datePrecision: "day",
      title: "합참의장 국감 발언",
      summary: "정보 공유 일부 제한 인정.",
      claimIds: ["claim-jcs"],
    },
    {
      id: "t-statement",
      date: "2026-10-09",
      datePrecision: "day",
      title: "미 고위 당국자 서면 답변",
      summary: "정보·방첩 동맹 기준 준수 기대.",
      claimIds: ["claim-statement", "claim-no-specifics"],
    },
  ],
  gaps: [
    "발언의 영어 원문과 당국자의 소속 부처(백악관·국무부 등)를 확인하지 못했다.",
    "이 발언에 대한 외교부·대통령실의 공식 입장을 확인하지 못했다.",
    "대북 정보 공유 제한의 범위와 시작 시점은 익명 소식통을 인용한 보도로만 확인했다.",
    "같은 게시물이 언급한 국정원장 등의 미국 비자 거부 논란은 확인하지 못해 싣지 않았다.",
    "2026년 7월 쿠팡·플랫폼 규제를 둘러싼 백악관 당국자 발언을 야당이 '최후통첩'이라 부른 일이 있었다고 보도됐으나 원문을 대조하지 못해 싣지 않았다.",
  ],
  sources: [
    {
      id: "src-etoday-20261010",
      title: "美 \"韓, 정보·방첩 분야서 동맹 기준 준수해야\"",
      publisher: "이투데이(연합뉴스 인용)",
      url: "https://www.etoday.co.kr/news/view/2634192",
      publishedAt: "2026-10-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newdaily-20261010",
      title: "한미동맹 이상 기류에 … 美 \"韓, 정보·방첩 분야서 수십년 된 '동맹 기준' 준수 기대\"",
      publisher: "뉴데일리",
      url: "https://www.newdaily.co.kr/site/data/html/2026/10/10/2026101000031.html",
      publishedAt: "2026-10-10",
      type: "press",
      license: "link-only",
    },
  ],
};

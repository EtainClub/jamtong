import type { PolicyInput } from "./schema";

/**
 * 잇따른 해킹·개인정보 유출과 정부의 사이버 보안 대응 (2025~2026).
 *
 * 대통령 유튜브 영상 답글에 "해킹 피해가 잇따르니 해킹범을 잡고 국가 기관이 크게 해킹당하지 않도록 대응해 달라"는 요청이 달렸다(잼통 Voice).
 * 2025년 대형 사고 이후 정부가 내놓은 대책, 2026년 제재 강화, 11월 대통령의 '사이버 보안 차르' 지시를 적는다.
 *
 * ★ 한미 정보협력 갈등은 policy:us-intel-standards, 쿠팡 유출 수사는 policy:coupang-dispute에 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #273.
 */
export const CYBER_SECURITY: PolicyInput = {
  slug: "cyber-security",
  title: "해킹·개인정보 유출과 정부의 사이버 보안 대응 (2025~2026)",
  scope:
    "2025년 SKT·KT·롯데카드 사고 뒤 범부처 정보보호 종합대책(10월 22일), 2026년 개인정보보호법 과징금 상한 상향과 KT 제재, 11월 공군 1호기 탑승자 정보 유출과 '사이버 보안 차르' 기구 검토 지시",
  ministries: ["국가안보실", "과학기술정보통신부", "개인정보보호위원회", "국가정보원", "금융위원회"],
  categories: ["institution", "diplomacy"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-hacking",
      text: "해킹 피해가 잇따르니 해킹범을 잡고 국가 기관이 크게 해킹당하지 않도록 대응해 달라",
      claimIds: ["claim-2025-plan", "claim-penalty", "claim-czar", "claim-af1"],
    },
  ],
  claims: [
    {
      id: "claim-2025-incidents",
      text:
        "2025년에는 SK텔레콤에서 약 2,300만 명의 유심 정보가 유출된 데 이어 롯데카드 고객정보 유출, KT 펨토셀 관리 부실로 인한 무단 소액결제가 잇따랐다. 국무총리는 KT 무단 소액결제 피해를 362명, 2억 4,000만 원이라고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-byline-20251022", "src-ddaily-20251025"],
      verified: true,
    },
    {
      id: "claim-2025-plan",
      text:
        "정부는 2025년 10월 22일 관계부처 합동 '범부처 정보보호 종합대책'을 발표했다. 공공기관·금융·통신 등 1,600여 개 IT 시스템의 보안 취약점을 점검하고, 이동통신 3사에 실제 해킹 방식의 불시 점검을 하며, " +
        "국가안보실을 컨트롤타워로 해킹 조사 체계를 정비하고 정보보호 공시 대상 확대·직권조사권 강화를 추진하는 내용이다.",
      assertionType: "FACT",
      sourceIds: ["src-byline-20251022", "src-boannews-139892"],
      verified: true,
    },
    {
      id: "claim-penalty",
      text:
        "2026년 2월 국회를 통과한 개인정보보호법 개정으로 고의·중과실이나 반복·대규모 유출에는 전체 매출액의 10%까지 과징금을 매길 수 있게 됐다. 개인정보보호위원회는 2026년 7월 KT에 과징금 539억 7,900만 원을 부과했다.",
      assertionType: "FACT",
      sourceIds: ["src-boannews-142162", "src-sbsbiz-20000325530"],
      verified: true,
    },
    {
      id: "claim-af1",
      text:
        "2026년 11월 초 대통령 부부를 포함한 공군 1호기 탑승자 168명의 여권번호·생년월일이 유출된 사실이 보도됐다. 외교부는 해킹보다 개인정보 유출로 보고 있다고 밝혔고, 청와대는 유출 경위·관리 책임 조사와 순방 보안관리 점검을 지시했다.",
      assertionType: "FACT",
      sourceIds: ["src-ajunews-20261103"],
      verified: true,
    },
    {
      id: "claim-czar",
      text:
        "이 대통령은 11월 3일 국무회의에서 \"흩어져 있는 보안 기능을 총괄 조정할 수 있는 강력하고 실효적인 사이버 보안 차르 기구 구성을 적극 검토해 주기 바란다\"고 지시했다. " +
        "사후 점검 중심 체계로는 AI로 고도화되는 해킹에 대응하기 어렵다며 공격 징후 사전 탐지, 정보 신속 공유, 통신·에너지·금융 등 핵심 인프라 취약점 보완을 주문했다.",
      assertionType: "FACT",
      sourceIds: ["src-ajunews-20261103"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-plan",
      date: "2025-10-22",
      datePrecision: "day",
      title: "범부처 정보보호 종합대책",
      summary: "1,600여 개 시스템 점검.",
      claimIds: ["claim-2025-plan"],
    },
    {
      id: "t-kt",
      date: "2026-07",
      datePrecision: "month",
      title: "KT 과징금 539억 원",
      summary: "개인정보위.",
      claimIds: ["claim-penalty"],
    },
    {
      id: "t-czar",
      date: "2026-11-03",
      datePrecision: "day",
      title: "'사이버 보안 차르' 기구 검토 지시",
      summary: "공군 1호기 탑승자 정보 유출 직후.",
      claimIds: ["claim-czar", "claim-af1"],
    },
  ],
  gaps: [
    "2025년 대형 해킹 사고의 해커(공격 주체) 검거·기소 결과는 확인하지 못했다.",
    "사이버 보안 차르 기구의 형태·출범 시기와, 국회에 계류된 사이버안보 기본법안의 처리 상황은 11월 9일까지 나오지 않았다.",
  ],
  sources: [
    {
      id: "src-byline-20251022",
      title: "연이은 굵직한 해킹 사고에…정부 '범부처 정보보호 대책' 발표",
      publisher: "바이라인네트워크",
      url: "https://byline.network/2025/10/22-493/",
      publishedAt: "2025-10-22",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ddaily-20251025",
      title: "한국은 해킹 무법지대…공공·민간 다 뚫린 뒤 칼뽑은 정부",
      publisher: "디지털데일리",
      url: "https://www.ddaily.co.kr/page/view/2025102501362238380",
      publishedAt: "2025-10-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-boannews-139892",
      title: "국정원 \"AI로 자체 해킹 탐지 고도화하겠다\"...범부처 정보보호 종합대책 일문일답",
      publisher: "보안뉴스",
      url: "https://m.boannews.com/html/detail.html?idx=139892",
      publishedAt: "2025-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-boannews-142162",
      title: "개인정보 유출 과징금, 전체 매출 10%까지 부과... 개정안 국회 본회의 통과",
      publisher: "보안뉴스",
      url: "https://m.boannews.com/html/detail.html?idx=142162",
      publishedAt: "2026-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbsbiz-20000325530",
      title: "해커 1년간 KT 내부망 활보…과징금 540억 부과",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000325530",
      publishedAt: "2026-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ajunews-20261103",
      title: "李, '사이버 보안 차르' 지시…사상 초유 '대통령 개인정보 유출' 속 보안 재정비",
      publisher: "아주경제",
      url: "https://www.ajunews.com/view/20261103145909300",
      publishedAt: "2026-11-03",
      type: "press",
      license: "link-only",
    },
  ],
};

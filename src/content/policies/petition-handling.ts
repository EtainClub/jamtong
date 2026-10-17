import type { PolicyInput } from "./schema";

/**
 * 국민신문고 민원 처리 실태와 정부 대응.
 *
 * "국민신문고 민원이 부처의 탁상행정으로 형식적으로 처리되니 대통령이 민심을
 * 직접 들어 달라"는 답글이 돈다(2026년 10월). 정부가 공개한 것은 민원의 양과
 * 반복민원 분석, 대통령의 지시, 권익위의 대책이다. 답변이 형식적인지 재는 공식
 * 지표는 찾지 못했다 — 그 공백을 그대로 적는다.
 *
 * ★ 권익위 1주년 성과 숫자는 권익위 자체 발표다. CLAIM으로 적는다.
 * ★ 2026-10-17 처음 등록 — 잼통 Voice voice-gap 이슈 #39.
 */
export const PETITION_HANDLING: PolicyInput = {
  slug: "petition-handling",
  title: "국민신문고 민원 처리 실태와 정부 대응",
  scope:
    "이재명 정부 출범 뒤 국민신문고 민원 규모·반복민원 분석, 민원 응대에 대한 대통령 지시, " +
    "국민사서함, 국민권익위원회의 반복민원·AI 국민신문고 대책",
  ministries: ["국민권익위원회", "청와대"],
  categories: ["institution"],
  asOf: "2026-10-17",
  rumors: [
    {
      id: "rumor-formal",
      text: "국민신문고 민원이 부처의 탁상행정으로 형식적으로 처리되니 대통령이 민심을 직접 들어 달라",
      claimIds: ["claim-president-x", "claim-mailbox", "claim-quality-gap"],
    },
  ],
  claims: [
    {
      id: "claim-volume",
      text:
        "청와대와 국민권익위원회가 2026년 2월 2일 공개한 분석에 따르면 2025년 6월 4일부터 12월 31일까지 " +
        "국민신문고에 접수된 민원은 662만여 건이다. 국가정보자원관리원 화재로 운영이 약 한 달 멈춘 기간을 " +
        "빼면 월평균 약 111만 건이다. 분야는 교통이 56.4%로 가장 많았다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-20260201"],
      verified: true,
    },
    {
      id: "claim-repeat",
      text:
        "같은 기간 1,000건 넘게 민원을 낸 91명이 약 30만 건(전체의 약 4.5%)을 냈다. 법원 판결·수사 결과 " +
        "불복, 민원 담당 공무원 감사·징계 요구, 선호시설 유치·기피시설 반대가 주된 내용이었다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-20260201"],
      verified: true,
    },
    {
      id: "claim-plan",
      text:
        "청와대는 이 분석을 바탕으로 권익위 집단갈등조정국 전문 인력을 늘리고 시민상담관을 100명 넘게 " +
        "위촉하며, 기관마다 집단갈등관리담당관을 두겠다고 밝혔다. 전성환 경청통합수석은 \"민원의 총량을 " +
        "줄여서 해결할 수 있는 민원에 집중하는 것이 필요하다\"고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "청와대",
      sourceIds: ["src-herald-20260201"],
      verified: true,
    },
    {
      id: "claim-president-x",
      text:
        "이재명 대통령은 2026년 5월 12일 자신의 X 계정에 민원을 \"국정개혁 과제들이 가득찬 보물창고 같은 " +
        "것\"이라 쓰고, 공직자의 \"회피성 희망 고문은 절대 금물\"이라고 했다. 같은 글에서 각 부처에 " +
        "갈등조정담당관을 신설하는 정책을 소개했다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeonggi-20260512"],
      verified: true,
    },
    {
      id: "claim-mailbox",
      text:
        "대통령실은 2025년 6월 24일부터 대통령에게 직접 질문을 보내는 '국민사서함'을 구글 폼으로 운영한다. " +
        "접수된 질문은 모두 대통령에게 보고되고, 공감대가 높거나 시의성 있는 질문에는 대통령이 직접 답할 " +
        "계획이라고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-20250624"],
      verified: true,
    },
    {
      id: "claim-acrc-result",
      text:
        "국민권익위원회는 2026년 6월 1일 출범 1년 성과로 집단민원 70건을 조정해 3만 498명의 고충을 " +
        "해결하고 반복민원을 약 15만 건 줄였다고 밝혔다. AI 국민신문고는 4개 기관이 쓰고 있으며 2027년 " +
        "전체 중앙행정기관으로 넓힐 계획이다.",
      assertionType: "CLAIM",
      assertedBy: "국민권익위원회",
      sourceIds: ["src-newspim-20260601"],
      verified: true,
    },
    {
      id: "claim-quality-gap",
      text:
        "권익위가 공개하는 처리 지표는 기관별 처리 건수와 처리기한 준수 여부다. 답변이 실질적이었는지, " +
        "민원인이 만족했는지를 재는 공개 통계는 찾지 못했다. 그래서 '형식적으로 처리된다'는 주장은 " +
        "공개 자료로 맞다고도 틀리다고도 확인할 수 없다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-datagokr-deadline"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-quality-gap"],
  timeline: [
    {
      id: "t-mailbox",
      date: "2025-06-24",
      datePrecision: "day",
      title: "국민사서함 운영 시작",
      summary: "대통령에게 직접 보내는 질문 창구.",
      claimIds: ["claim-mailbox"],
    },
    {
      id: "t-analysis",
      date: "2026-02-02",
      datePrecision: "day",
      title: "민원 662만 건 분석 공개",
      summary: "1,000건 넘게 낸 91명이 약 30만 건.",
      claimIds: ["claim-volume", "claim-repeat", "claim-plan"],
    },
    {
      id: "t-x",
      date: "2026-05-12",
      datePrecision: "day",
      title: "대통령 X 글 '민원은 보물창고'",
      summary: "회피성 답변 금지, 부처 갈등조정담당관.",
      claimIds: ["claim-president-x"],
    },
    {
      id: "t-acrc",
      date: "2026-06-01",
      datePrecision: "day",
      title: "권익위 1년 성과 발표",
      summary: "반복민원 약 15만 건 감소(권익위 발표).",
      claimIds: ["claim-acrc-result"],
    },
  ],
  gaps: [
    "국민신문고 처리기한 준수율(권익위 분기 공개 자료)의 실제 수치는 이 페이지에 옮기지 않았다.",
    "국민사서함에 접수된 질문 수와 대통령이 직접 답한 건수는 확인하지 못했다.",
    "반복민원 약 15만 건 감소는 권익위 발표이며, 산정 방식은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-herald-20260201",
      title: "\"우리 아이 초등학교\"…'30대 남성' 국민신문고에 가장 많은 민원 제기",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026020117513614192",
      publishedAt: "2026-02-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kyeonggi-20260512",
      title: "이재명 대통령 \"민원은 국정개혁 보물창고…'회피성 희망고문' 절대 금물\"",
      publisher: "경기일보",
      url: "https://www.kyeonggi.com/article/20260512580595",
      publishedAt: "2026-05-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-korea-20250624",
      title: "이 대통령, 국민과의 소통 강화…오늘부터 '국민사서함' 운영",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148944892",
      publishedAt: "2025-06-24",
      type: "official",
      license: "public",
    },
    {
      id: "src-newspim-20260601",
      title: "집단·반복 민원 감축부터 AI국민신문고 운영…권익위 1주년 성과 발표",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20260601000456",
      publishedAt: "2026-06-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-datagokr-deadline",
      title: "국민권익위원회_정부민원신청 처리기간 준수현황",
      publisher: "국민권익위원회(공공데이터포털)",
      url: "https://www.data.go.kr/data/3070147/fileData.do",
      publishedAt: "2026-06-30",
      type: "statistics",
      license: "public",
    },
  ],
};

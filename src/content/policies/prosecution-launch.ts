import type { PolicyInput } from "./schema";

/**
 * 검찰청 폐지 이후 — 중대범죄수사청·공소청 출범.
 *
 * 업적 「검찰개혁」(prosecution-reform)은 법이 정해진 데까지를 다루고 기준일이
 * 2026-09-19다. 시행일(10-02) 뒤 실제로 무엇이 달라졌는지는 여기 쌓는다.
 *
 * SNS에서 도는 말은 두 갈래다. "결국 검찰청 그대로다/중수청은 무산됐다"는 출범
 * 사실과 어긋나고, "출범했으니 수사가 정상적으로 돈다"는 인력·시스템 사정과
 * 어긋난다. 둘 다 이 페이지의 claim으로 대조할 수 있게 쓴다.
 *
 * ★ 부처 보도자료 원문은 아직 확인하지 못했다. 출범 사실과 정원 수치는 둘 이상의
 *   언론이 같은 내용을 전한 것만 FACT로 두고, 장관 발언과 관계자 설명은 CLAIM이다.
 */
export const PROSECUTION_LAUNCH: PolicyInput = {
  slug: "prosecution-launch",
  title: "검찰청 폐지 이후: 중수청·공소청 출범",
  scope: "2026년 10월 2일 검찰청 폐지와 중대범죄수사청·공소청 출범 직후의 상황",
  ministries: ["행정안전부", "법무부"],
  categories: ["institution"],
  asOf: "2026-10-09",
  rumors: [
    {
      id: "rumor-not-launched",
      text: "검찰청은 그대로이고 중수청·공소청 설치는 무산됐다",
      claimIds: ["claim-launch"],
    },
    {
      id: "rumor-fully-running",
      text: "중수청이 출범과 동시에 정원을 다 갖추고 정상 수사를 시작했다",
      claimIds: ["claim-staffing", "claim-acting", "claim-system"],
    },
  ],
  claims: [
    {
      id: "claim-launch",
      text:
        "2026년 10월 2일 검찰청이 폐지되고 중대범죄수사청(중수청)과 공소청이 같은 날 " +
        "출범했다. 중수청은 개청식과 현판 제막식을 열었고, 공소청은 옛 대검찰청 청사에서 " +
        "비공개 출범식을 열었다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-launch-1002", "src-fn-launch-1009"],
      verified: true,
    },
    {
      id: "claim-acting",
      text:
        "두 기관 모두 청장 없이 출범했다. 중수청은 전종민 차장이, 공소청은 이정현 " +
        "직무대행이 이끌었다. 김지용 중수청장 후보자의 국회 인사청문회는 2026년 " +
        "10월 14일로 잡혔다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-launch-1002", "src-fn-launch-1009"],
      verified: true,
    },
    {
      id: "claim-staffing",
      text:
        "중수청 직제상 정원은 2,874명이고, 출범일까지 임용된 인원은 1,900명(66.1%)이었다.",
      assertionType: "FACT",
      sourceIds: ["src-fn-launch-1009", "src-asiatoday-audit-1006"],
      verified: true,
    },
    {
      id: "claim-minister",
      text:
        "윤호중 행정안전부 장관은 2026년 국정감사에서 청장 인사청문 요청이 늦어진 데 " +
        "대해 사과했고, 정원의 15% 정도는 경력경쟁 채용으로 경찰·변호사·회계사 등을 " +
        "충원하고 10%는 다음 해 신규 채용분으로 남겨 두겠다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "윤호중 행정안전부 장관",
      sourceIds: ["src-asiatoday-audit-1006"],
      verified: true,
    },
    {
      id: "claim-system",
      text:
        "출범 직후 중수청에는 자체 형사사법정보시스템(KICS)이 없어 고소·고발 접수부터 " +
        "사건 배당까지 수기로 처리했고, 경찰과 사건을 나누는 이첩 기준도 내부에 아직 " +
        "정해지지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "중수청 관계자(뉴스1 보도)",
      sourceIds: ["src-fn-launch-1009"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-launch",
      date: "2026-10-02",
      datePrecision: "day",
      title: "검찰청 폐지, 중수청·공소청 출범",
      summary: "두 기관 모두 청장 직무대행 체제로 시작했다.",
      claimIds: ["claim-launch", "claim-acting"],
    },
    {
      id: "t-audit",
      date: "2026-10-06",
      datePrecision: "day",
      title: "국정감사에서 인력·수장 공백 지적",
      summary: "행정안전부 장관이 사과하고 충원 계획을 밝혔다.",
      claimIds: ["claim-minister", "claim-staffing"],
    },
    {
      id: "t-hearing",
      date: "2026-10-14",
      datePrecision: "day",
      title: "중수청장 후보자 인사청문회 예정",
      summary: "이 날짜는 예정이다. 결과는 아직 없다.",
      claimIds: ["claim-acting"],
    },
  ],
  gaps: [
    "법무부·행정안전부의 출범 보도자료 원문을 확인하지 못했다. 정원·임용 수치는 언론 보도 기준이다.",
    "공소청의 인력과 사건 처리 현황은 확인하지 못했다.",
    "중수청이 실제로 수사에 착수한 사건 수와 경찰 이첩 기준이 정해졌는지는 아직 알 수 없다.",
  ],
  sources: [
    {
      id: "src-khan-launch-1002",
      title: "'화려한 출발' 중수청, '무거운 적막' 공소청…출범 첫날 엇갈린 표정",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202610021546001/",
      publishedAt: "2026-10-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fn-launch-1009",
      title: "'중수청 개문발차' 일주일…청장 공백부터 정치적 중립성까지 '과제'",
      publisher: "파이낸셜뉴스(뉴스1)",
      url: "https://www.fnnews.com/news/202610090610286257",
      publishedAt: "2026-10-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiatoday-audit-1006",
      title: "[2026 국감] 청장도 인력도 부족한 중수청…여야 '개문발차' 질타",
      publisher: "아시아투데이",
      url: "https://www.asiatoday.co.kr/kn/view.php?key=20261006010001548",
      publishedAt: "2026-10-06",
      type: "press",
      license: "link-only",
    },
  ],
};

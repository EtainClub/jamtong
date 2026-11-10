import type { PolicyInput } from "./schema";

/**
 * 산불 원인 조사와 예방 대책 (2026년).
 *
 * 11월 대통령 X 게시물 답글에 "산불과 화재가 잦은데 정부는 그 원인을 제대로 조사하고 있는가"라는 물음이 달렸다(잼통 Voice).
 * 산림청 원인별 통계, 원인 제공자 검거율, 처벌 강화, 올해 방지대책을 적는다.
 *
 * ★ 산불 피해 복구 추경은 policy:supplementary-budget에 있다.
 * ★ 2026-11-11 처음 등록 — 잼통 Voice 이슈 #282.
 */
export const WILDFIRE_CAUSES: PolicyInput = {
  slug: "wildfire-causes",
  title: "산불 원인 조사와 예방 대책 (2026년)",
  scope: "산림청 산불 원인별 통계, 원인 제공자 검거율, 산림재난방지법 개정(실화 처벌 강화), 2026년 봄·가을 산불방지대책",
  ministries: ["산림청", "행정안전부"],
  categories: ["disaster"],
  asOf: "2026-11-11",
  rumors: [
    {
      id: "rumor-causes",
      text: "산불과 화재가 잦은데 정부는 그 원인을 제대로 조사하고 있는가",
      claimIds: ["claim-stats-2026", "claim-arrest", "claim-law", "claim-other"],
    },
  ],
  claims: [
    {
      id: "claim-share",
      text:
        "김인호 산림청장은 2026년 1월 19일 전국 산불방지 종합대책 브리핑에서 산불 원인은 입산자 실화가 약 30%로 가장 많고 소각 산불이 22%로 뒤를 잇는다고 밝혔다. " +
        "지난해 산불 원인의 68%는 산림 밖에서 시작됐다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "산림청",
      sourceIds: ["src-korea-briefing-156740261"],
      verified: true,
    },
    {
      id: "claim-stats-2026",
      text:
        "산림청 산불발생현황 표에 따르면 2026년 산불은 457건, 피해 면적은 739.63ha다. 원인별로는 입산자 실화 79건, 쓰레기 소각 48건, 건축물 화재 비화 45건, " +
        "담뱃불 실화 34건, 농산부산물 소각 17건, 기타 234건이다. 2025년은 756건·24,797ha였고 10년(2016~2025) 평균은 536.8건·3,559.64ha다.",
      assertionType: "FACT",
      sourceIds: ["src-forest-stats"],
      verified: true,
    },
    {
      id: "claim-other",
      text:
        "같은 표에서 원인이 '기타'로 잡힌 산불이 234건으로 2026년 전체의 절반을 넘는다. 이 표만으로는 기타에 원인을 밝히지 못한 산불이 얼마나 들었는지 알 수 없다.",
      assertionType: "FACT",
      sourceIds: ["src-forest-stats"],
      verified: true,
    },
    {
      id: "claim-arrest",
      text:
        "산림당국이 2023~2025년 산불 1,334건을 분석한 결과 원인 제공자 검거율은 32.9%로 일반 방화 사건(85.1%)보다 크게 낮았고, 재판에서 실형이 선고된 것은 3건이었다. " +
        "같은 기간 산림 인접지 불법 소각·무단 입산 등으로 과태료를 매긴 사례는 4,672건이다.",
      assertionType: "CLAIM",
      assertedBy: "산림청(보도)",
      sourceIds: ["src-safetynews-247626"],
      verified: true,
    },
    {
      id: "claim-forensic",
      text: "산림당국은 대형 산불이 나면 디지털 증거 분석(포렌식) 등 과학 수사 기법으로 원인 제공자를 끝까지 추적·검거하고, 고의·과실을 가리지 않고 엄정 대응하겠다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "산림청(보도)",
      sourceIds: ["src-safetynews-247626"],
      verified: true,
    },
    {
      id: "claim-law",
      text:
        "11월 13일 시행되는 개정 산림재난방지법은 실수로 산불을 낸 경우의 법정형을 3년 이하에서 5년 이하 징역으로 올리고, 허가 없이 불을 피운 경우의 과태료를 " +
        "200만 원에서 300만 원으로 올린다. 산림청은 원인 제공자에게 진화 비용과 피해 복구 비용을 적극 청구하겠다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-148974453", "src-khan-202610281548001"],
      verified: true,
    },
    {
      id: "claim-spring",
      text:
        "1월 종합대책은 봄철 산불조심기간 시작을 2월 1일에서 1월 20일로 앞당기고, 공중진화대를 104명에서 200명으로, 특수진화대를 435명에서 555명으로 늘리며, " +
        "감시 CCTV 220대를 더 설치하는 내용이다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-briefing-156740261"],
      verified: true,
    },
    {
      id: "claim-autumn",
      text:
        "10월 28일 발표한 가을철 대책은 범부처 진화 헬기를 261대에서 315대로, 고성능·다목적 진화차를 29대에서 108대로 늘렸다. 산림 인접지 화목보일러 사용 가구를 일제 점검하고, " +
        "산주가 동의하면 건축물 25m 이내 나무를 허가 없이 벨 수 있게 했다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-148974453", "src-khan-202610281548001"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-arrest", "claim-other"],
  timeline: [
    {
      id: "t-spring",
      date: "2026-01-19",
      datePrecision: "day",
      title: "전국 산불방지 종합대책",
      summary: "조심기간 앞당김, 진화대 증원.",
      claimIds: ["claim-share", "claim-spring"],
    },
    {
      id: "t-arrest",
      date: "2026-04-14",
      datePrecision: "day",
      title: "원인 제공자 검거율 32.9% 분석",
      summary: "2023~2025년.",
      claimIds: ["claim-arrest", "claim-forensic"],
    },
    {
      id: "t-autumn",
      date: "2026-10-28",
      datePrecision: "day",
      title: "가을철 산불방지대책",
      summary: "헬기 315대, 진화차 108대.",
      claimIds: ["claim-autumn"],
    },
    {
      id: "t-law",
      date: "2026-11-13",
      datePrecision: "day",
      title: "개정 산림재난방지법 시행",
      summary: "실화 최대 징역 5년.",
      claimIds: ["claim-law"],
    },
  ],
  gaps: [
    "원인 '기타' 234건 가운데 원인 미상이 몇 건인지는 공개 통계에서 확인하지 못했다.",
    "산림청 산불발생현황 표는 머리글 기준일(2026.11.11)과 본문 설명 기준일(5월 7일)이 다르게 적혀 있어 정확한 집계 시점을 확인하지 못했다.",
    "2026년 산불 원인 제공자 검거율과 구상권(진화·복구 비용) 실제 청구 사례는 찾지 못했다.",
    "개정법 조문(구상권 근거·요건)은 법령 원문과 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-korea-briefing-156740261",
      title: "2026년도 전국 산불방지 종합대책",
      publisher: "대한민국 정책브리핑(산림청)",
      url: "https://www.korea.kr/briefing/policyBriefingView.do?newsId=156740261",
      publishedAt: "2026-01-19",
      type: "official",
      license: "public",
    },
    {
      id: "src-forest-stats",
      title: "산불발생현황 — 10년간 원인별 산불발생 현황",
      publisher: "산림청",
      url: "https://forest.go.kr/kfsweb/kfi/kfs/frfr/selectFrfrStatsNow.do?mn=AR04_01_03",
      publishedAt: "2026-11-11",
      type: "statistics",
      license: "public",
    },
    {
      id: "src-safetynews-247626",
      title: "산불 낸 자 검거율, 일반 방화보다 크게 낮고 실형 선고 3건 불과",
      publisher: "안전신문",
      url: "http://www.safetynews.co.kr/news/articleView.html?idxno=247626",
      publishedAt: "2026-04-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-korea-148974453",
      title: "정부, 가을 산불 대응체계 강화…실화 처벌 '징역 5년'으로 상향",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148974453",
      publishedAt: "2026-10-28",
      type: "official",
      license: "public",
    },
    {
      id: "src-khan-202610281548001",
      title: "'진화헬기 261대→315대, 실화자 징역 3년→5년'···산림청, 가을 산불방지대책 추진",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202610281548001/",
      publishedAt: "2026-10-28",
      type: "press",
      license: "link-only",
    },
  ],
};

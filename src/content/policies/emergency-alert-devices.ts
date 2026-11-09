import type { PolicyInput } from "./schema";

/**
 * 위급 상황 자동 감지·신고 체계: 응급안전안심서비스와 웨어러블 자동신고, 심정지 생존율.
 *
 * 대통령 유튜브 영상 답글에 "심정지 같은 위급 상황을 감지하는 전자팔찌 등으로 누구나 제때 구조받는 체계를 만들자"는
 * 제안이 달렸다(잼통 Voice). 이미 운영 중인 정부 서비스, 민간 기기 자동신고의 현장 사례, 심정지 통계를 적는다.
 *
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #259.
 */
export const EMERGENCY_ALERT_DEVICES: PolicyInput = {
  slug: "emergency-alert-devices",
  title: "위급 상황 자동 감지·신고: 응급안전안심서비스와 웨어러블",
  scope:
    "보건복지부 응급안전안심서비스(독거노인·장애인 가정의 활동·화재 감지, 응급호출)의 대상·실적, 스마트워치 낙상감지 자동 119 신고 사례, 급성심정지 생존율",
  ministries: ["보건복지부", "소방청", "질병관리청"],
  categories: ["welfare", "disaster"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-bracelet",
      text: "심정지 같은 위급 상황을 감지하는 전자팔찌 등으로 누구나 제때 구조받는 체계를 만들자",
      claimIds: ["claim-service", "claim-service-target", "claim-wearable", "claim-cardiac"],
    },
  ],
  claims: [
    {
      id: "claim-service",
      text:
        "보건복지부 응급안전안심서비스는 독거노인·장애인 가정에 활동감지·화재감지 센서와 응급호출기를 설치해 위급 상황을 응급관리요원과 119에 알리는 사업이다. " +
        "2020년 사업 시작 후 약 30만 독거노인 가구에 제공 중이며, 2025년 한 해 응급호출 2만 5,050건, 화재감지 8,111건, 활동 미감지 안전확인 35만 1,872건 등 38만 5,033건에 대응했다.",
      assertionType: "FACT",
      sourceIds: ["src-mohw-1489949"],
      verified: false,
    },
    {
      id: "claim-service-target",
      text:
        "대상은 실제 혼자 사는 65세 이상 노인(소득 무관하게 검토)과 장애인활동지원 수급자 가운데 독거·취약가구 등이다. 2020년 설치된 노후 장비 약 9만 대를 교체하는 사업도 진행 중이다.",
      assertionType: "FACT",
      sourceIds: ["src-vegannews-390558", "src-mohw-1489949"],
      verified: false,
    },
    {
      id: "claim-wearable",
      text:
        "2026년 7월 세종에서는 쓰러진 60대의 스마트워치 낙상감지 기능이 119에 자동으로 사고를 접수했으나 위치정보 오차로 상황실이 카카오톡 프로필 사진 등 다른 단서로 위치를 찾았다. " +
        "세종소방본부는 웨어러블 기기의 자동 사고 신고가 늘고 있어 대응 역량을 강화하겠다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260703"],
      verified: true,
    },
    {
      id: "claim-cardiac",
      text:
        "질병관리청 발표에 따르면 2025년 상반기 급성심정지 환자 생존율은 9.4%였다. 일반인이 심폐소생술을 한 경우 생존율은 15.3%로 하지 않은 경우(5.6%)의 약 2.7배였다. " +
        "발생 장소는 가정이 47.0%로 가장 많았다.",
      assertionType: "FACT",
      sourceIds: ["src-medipharm-117190", "src-nate-20260618"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [],
  gaps: [
    "독거노인·장애인 외 일반 국민의 웨어러블 기기를 119와 정식으로 연동하는 정부 계획은 찾지 못했다.",
    "응급안전안심서비스의 2026년 전국 목표 가구 수는 사업안내 원문으로 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-mohw-1489949",
      title: "30만 독거 어르신들의 24시간 안전 지킴이 응급안전안심서비스 노후 장비 9만대 교체",
      publisher: "보건복지부",
      url: "https://mohw.go.kr/board.es?act=view&bid=0027&list_no=1489949&mid=a10503010100",
      type: "official",
      license: "public",
    },
    {
      id: "src-vegannews-390558",
      title: "응급안전안심서비스 대상과 신청 절차, 노인·장애인 기준",
      publisher: "비건뉴스",
      url: "https://www.vegannews.co.kr/news/article.html?no=390558",
      publishedAt: "2026",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260703",
      title: "'스마트 워치'로 위치 특정 못한 응급환자···'카톡 프로필'서 찾아냈다",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202607031020001/",
      publishedAt: "2026-07-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-medipharm-117190",
      title: "급성심장정지 생존율 상승세…일반인 심폐소생술이 생명 살렸다",
      publisher: "메디팜헬스뉴스",
      url: "https://www.medipharmhealth.co.kr/news/article.html?no=117190",
      publishedAt: "2026-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260618",
      title: "급성심장정지 환자 생존률 9.4%로 늘었지만, 뇌 기능 회복률↓…CPR 중요",
      publisher: "네이트 뉴스",
      url: "https://m.news.nate.com/view/20260618n31623",
      publishedAt: "2026-06-18",
      type: "press",
      license: "link-only",
    },
  ],
};

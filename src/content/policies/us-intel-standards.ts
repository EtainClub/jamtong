import type { PolicyInput } from "./schema";

/**
 * 한미 정보협력 갈등과 미국 쪽 경고 (2026년).
 *
 * "백악관이 한국에 최후통첩을 날렸다"는 글이 돈다. 실제로 있었던 일은 미국 행정부
 * 고위 당국자가 익명으로 한국 언론의 서면 질의에 답하며 정보·방첩 분야의 동맹 기준
 * 준수를 기대한다고 말한 것이다. 이례적으로 수위가 높은 메시지라는 평가는 있지만,
 * 기한이나 조치를 내건 '최후통첩'은 확인되지 않는다.
 *
 * ★ 대북 정보 공유 제한은 실제 쟁점이다. 합참의장도 국감에서 일부 제한을 인정했다.
 *   메시지가 가볍다고 쓰지 않는다. 표현의 정도만 바로잡는다.
 * ★ 같은 게시물에서 나온 두 주장도 여기서 다룬다. '미국 요구로 국정원이 북한 대응
 *   회의에서 빠졌다'는 6월 한미일 사이버 실무그룹 회의 이야기이고, '미국 의회가
 *   경고했다'는 하원 중국특위 위원장 한 사람이 국무장관에게 보낸 서한이다.
 * ★ 2026-10-11 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #8.
 *   2026-10-12 이슈 #14·#15를 더했다.
 */
export const US_INTEL_STANDARDS: PolicyInput = {
  slug: "us-intel-standards",
  title: "한미 정보협력 갈등과 미국 쪽 경고 (2026년)",
  scope:
    "미국 당국자의 '정보·방첩 동맹 기준' 발언, 한미일 북한 사이버 회의의 국정원 불참, " +
    "대북 정보 공유 제한 보도, 미 하원 중국특위 위원장의 한중관계 우려 서한",
  ministries: ["외교부", "국방부", "국가정보원"],
  categories: ["diplomacy"],
  asOf: "2026-10-12",
  rumors: [
    {
      id: "rumor-ultimatum",
      text: "백악관이 한국에 최후통첩을 날렸다",
      claimIds: ["claim-statement", "claim-form", "claim-no-specifics"],
    },
    {
      id: "rumor-nis-excluded",
      text: "미국의 요구로 북한 대응 회의에서 국정원이 배제되었다",
      claimIds: ["claim-nis-absent", "claim-nis-reason-reported", "claim-nis-position", "claim-state-dept"],
    },
    {
      id: "rumor-congress-warning",
      text: "미국 의회가 중국에 기우는 한국이 미국 이익에 중대한 위험이라고 경고했다",
      claimIds: ["claim-moolenaar-letter", "claim-moolenaar-asks", "claim-korea-response"],
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
    {
      id: "claim-nis-absent",
      text:
        "2026년 6월 워싱턴에서 열린 '제5차 북한 사이버 위협 대응 한미일 실무그룹 회의'에 " +
        "국가정보원이 참석하지 않았다. 이 회의는 2023년 캠프데이비드 한미일 정상회의 합의로 " +
        "만들어져 북한의 가상자산 탈취와 IT 인력 외화벌이 대응을 논의하며, 국정원은 이전 " +
        "회의에는 참석해 왔다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-20261008", "src-wikileaks-kr-20261008"],
      verified: true,
    },
    {
      id: "claim-nis-reason-reported",
      text:
        "언론은 전·현직 정부 소식통을 인용해 미국이 국정원의 기밀정보 관리를 우려해 참석을 " +
        "원하지 않았다고 보도했다. 미국 정부는 배제를 요청했는지, 그 이유가 무엇인지 공식적으로 " +
        "밝히지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "언론 보도(정부 소식통 인용)",
      sourceIds: ["src-hankook-20261008", "src-spnews-20261010"],
      verified: true,
    },
    {
      id: "claim-nis-position",
      text:
        "국정원은 10월 8일 '수개월 전 일부 오해가 있었으나 이미 지난 일'이며 '현재 한미 " +
        "정보당국 간 오해는 없다'고 밝혔다. 미국이 배제를 요구한 이유는 공개하지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "국가정보원",
      sourceIds: ["src-wikileaks-kr-20261008", "src-spnews-20261010"],
      verified: true,
    },
    {
      id: "claim-state-dept",
      text:
        "미 국무부 당국자는 국정원 배제 보도에 대한 VOA 질의에 '모든 동맹국이 정보와 방첩 " +
        "사안을 적절히 처리하길 기대한다'고 답했다. 배제 요청 여부는 확인하지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "미 국무부 당국자",
      sourceIds: ["src-spnews-20261010"],
      verified: true,
    },
    {
      id: "claim-moolenaar-letter",
      text:
        "존 물레나르 미 하원 미중전략경쟁특별위원회 위원장은 9월 28일 마코 루비오 국무장관에게 " +
        "보낸 서한에서 '한국의 중국을 향한 경제, 기술, 외교적 입장의 최근 변화는 미국에 중대한 " +
        "위험을 초래하고 있다'고 썼다. 위원회나 하원의 결의가 아니라 위원장 명의의 서한이다.",
      assertionType: "CLAIM",
      assertedBy: "존 물레나르 미 하원 중국특위 위원장",
      sourceIds: ["src-voa-20261001"],
      verified: true,
    },
    {
      id: "claim-moolenaar-asks",
      text:
        "서한은 한미동맹이 '여전히 필수불가결'하다고 하면서, 한중 정상 교류 확대와 수출통제·공급망 " +
        "대화 채널을 문제 삼았다. 국무부에 10월 31일까지 한중관계 동향과 행정부 대응을 브리핑해 " +
        "달라고 요구했다.",
      assertionType: "FACT",
      sourceIds: ["src-voa-20261001"],
      verified: true,
    },
    {
      id: "claim-korea-response",
      text:
        "주미 한국대사관은 '한미동맹은 우리 외교정책의 근간'이며 한미가 경제안보·첨단기술·공급망 " +
        "등에서 그 어느 때보다 긴밀히 협력하고 있다고 밝혔다. 미국 기업 차별 지적에는 모든 기업을 " +
        "국내법에 따라 비차별적으로 대우한다고 반박했다.",
      assertionType: "CLAIM",
      assertedBy: "주미 한국대사관·한국 정부 당국자",
      sourceIds: ["src-voa-20261006"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-intel-restriction", "claim-jcs", "claim-nis-reason-reported", "claim-moolenaar-letter"],
  timeline: [
    {
      id: "t-cyber-meeting",
      date: "2026-06",
      datePrecision: "month",
      title: "한미일 북한 사이버 회의, 국정원 불참",
      summary: "워싱턴, 제5차 실무그룹.",
      claimIds: ["claim-nis-absent", "claim-nis-reason-reported"],
    },
    {
      id: "t-moolenaar",
      date: "2026-09-28",
      datePrecision: "day",
      title: "미 하원 중국특위 위원장 서한",
      summary: "국무장관에게 한중관계 우려.",
      claimIds: ["claim-moolenaar-letter", "claim-moolenaar-asks"],
    },
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
    "같은 게시물이 언급한 국정원장 등의 미국 비자 거부 논란은 확인하지 못해 싣지 않았다. 국정원은 원장 방미 무산설을 '사실무근'이라고 했다.",
    "미국이 국정원 불참을 요청했다는 것은 익명 소식통 보도다. 한미 어느 정부도 요청 사실과 이유를 공식 확인하지 않았다.",
    "물레나르 위원장 서한의 영어 원문을 확인하지 못했다. '중대한 위험'은 VOA의 번역이다.",
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
    {
      id: "src-hankook-20261008",
      title: "국정원, 한미일 北 해킹 대응 회의 배제됐다… 방미 무산설까지 '이상기류'",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2026100810440004498",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-wikileaks-kr-20261008",
      title: "[WIKI 이슈] 불안한 韓美 정보협력…국정원 北사이버 회의 배제 인정, 합참 \"일부 제한\"",
      publisher: "위키리크스한국",
      url: "http://www.wikileaks-kr.org/news/articleView.html?idxno=193021",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-spnews-20261010",
      title: "美 국무부, '국정원 배제' 보도에 \"동맹국, 정보·방첩 사안 적절히 처리해야\"",
      publisher: "서울평양뉴스(VOA 인용)",
      url: "https://www.spnews.co.kr/news/articleView.html?idxno=111469",
      publishedAt: "2026-10-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-voa-20261001",
      title: "하원 중국특위위원장 \"한중관계 변화, 미국에 중대한 위험\"",
      publisher: "VOA 한국어",
      url: "https://www.voakorea.com/a/south-korea-china-relationship-letter-093026/8206287.html",
      publishedAt: "2026-10-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-voa-20261006",
      title: "한국 정부, 하원 중국특위 한중관계 개선 우려에 \"한미동맹은 외교정책 근간\"",
      publisher: "VOA 한국어",
      url: "https://www.voakorea.com/a/8208013.html",
      publishedAt: "2026-10-06",
      type: "press",
      license: "link-only",
    },
  ],
};

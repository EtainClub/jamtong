import type { PolicyInput } from "./schema";

/**
 * 다자녀 가구 주택 공급 기준과 공공임대 면적.
 *
 * 2026년 11월 3일 대통령 X 게시물에 "세 자녀 이상 다자녀 가정에 공급하는 주택의 면적을 넓혀
 * 달라"는 답글이 달렸다(잼통 Voice). 다자녀 특별공급의 자녀 기준, 공공임대 면적 제한의 도입과
 * 폐지, 2026년 7월 중형 공공임대 비율 상향을 적는다.
 *
 * ★ 다자녀 특공 2자녀 완화와 세대원수별 면적 제한·폐지는 윤석열 정부 때 일이다.
 *   이재명 정부의 조치는 2026년 7월 중형 비율 상향이다.
 * ★ 2026-11-04 처음 등록 — 잼통 Voice 이슈 #208.
 */
export const MULTI_CHILD_HOUSING: PolicyInput = {
  slug: "multi-child-housing",
  title: "다자녀 가구 주택 공급 기준과 공공임대 면적",
  scope:
    "공공분양·민영 다자녀 특별공급 자녀 기준(3자녀→2자녀)과 배점, 2024년 공공임대 세대원수별 면적 제한의 도입·폐지, 2026년 7월 공공주택 업무처리지침의 중형(전용 60~85㎡) 공공임대 비율 상한 상향",
  ministries: ["국토교통부"],
  categories: ["welfare", "region"],
  asOf: "2026-11-04",
  rumors: [
    {
      id: "rumor-wider",
      text: "세 자녀 이상 다자녀 가정에 공급하는 주택의 면적을 넓혀 달라",
      claimIds: ["claim-mid-size-2026", "claim-size-cap-lifted", "claim-two-children"],
    },
  ],
  claims: [
    {
      id: "claim-two-children",
      text:
        "국토교통부는 2023년 8월 23일 공공분양 다자녀 특별공급 대상을 3자녀 이상에서 2자녀 이상으로 넓히는 개정안을 냈다. 자녀 수 배점은 2자녀 25점, 3자녀 35점이고, " +
        "2023년 3월 28일 이후 출산 가구는 미성년 자녀 1명당 소득·자산 요건을 10%포인트씩(최대 20%포인트) 완화한다. 2024년 3월 25일부터는 민영·공공주택 모두 다자녀 특별공급 기준이 자녀 2명 이상이다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-kr-20230823", "src-fnnews-20240324"],
      verified: true,
    },
    {
      id: "claim-size-cap-2024",
      text:
        "2024년 3월부터 공공건설임대에는 세대원 수별 면적 제한이 적용됐다. 1명은 전용 35㎡ 이하, 2명은 44㎡ 이하, 3명은 50㎡ 이하, 4명 이상은 44㎡ 초과 주택에 입주하도록 했다.",
      assertionType: "FACT",
      sourceIds: ["src-bizwatch-20241028"],
      verified: true,
    },
    {
      id: "claim-size-cap-lifted",
      text:
        "국민청원 등 반발이 이어지자 저출산고령사회위원회가 2024년 7월 29일 이 제한의 폐지 방침을 밝혔고, 국토교통부는 10월 28일 폐지 개정안을 입법예고했다.",
      assertionType: "FACT",
      sourceIds: ["src-bizwatch-20241028"],
      verified: true,
    },
    {
      id: "claim-mid-size-2026",
      text:
        "국토교통부는 공공주택 업무처리지침을 고쳐 2026년 7월 3일부터 공공주택지구 공공임대의 전용 60㎡ 이하 비율 하한을 80% 이상에서 60% 이상으로 낮추고, " +
        "전용 60~85㎡ 중형 비율 상한을 20% 미만에서 40% 이하로 올렸다. 40%는 상한이며 사업마다 채워야 하는 의무 물량은 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-mediapen-20260818", "src-thepublic-20260708", "src-koscaj-20260706"],
      verified: true,
    },
    {
      id: "claim-president-lh",
      text:
        "이 대통령은 2025년 12월 업무보고에서 LH가 좋은 부지에는 분양주택을, 외곽의 열악한 부지에는 공공임대를 몰아 지어 공공임대가 '싸구려'로 인식된다고 비판했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-thepublic-20260708"],
      verified: true,
    },
    {
      id: "claim-critique-small",
      text:
        "최은영 한국도시연구소장은 한정된 물량에서 중형을 늘리면 중형 한 채 대신 지을 수 있는 청년용 소형 여러 채가 줄어든다고 지적했다. 1~2인 가구는 전체 가구의 66.1%다. " +
        "LH는 정부 재정지원 단가가 실제 건설·매입비보다 낮아 중형 공급에 부담이 있다는 입장이다.",
      assertionType: "CLAIM",
      assertedBy: "최은영 한국도시연구소장·LH",
      sourceIds: ["src-mediapen-20260818"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique-small"],
  timeline: [
    {
      id: "t-2023",
      date: "2023-08-23",
      datePrecision: "day",
      title: "다자녀 특공 2자녀로 확대 예고",
      summary: "공공분양, 배점 2자녀 25점.",
      claimIds: ["claim-two-children"],
    },
    {
      id: "t-2024-cap",
      date: "2024-03-25",
      datePrecision: "day",
      title: "주택공급규칙 개정 시행",
      summary: "민영·공공 다자녀 특공 2자녀, 공공임대 세대원수별 면적 제한.",
      claimIds: ["claim-two-children", "claim-size-cap-2024"],
    },
    {
      id: "t-2024-lift",
      date: "2024-10-28",
      datePrecision: "day",
      title: "면적 제한 폐지 입법예고",
      summary: "7월 저출산고령사회위원회 방침에 따름.",
      claimIds: ["claim-size-cap-lifted"],
    },
    {
      id: "t-2026-mid",
      date: "2026-07-03",
      datePrecision: "day",
      title: "중형 공공임대 상한 40%",
      summary: "60㎡ 이하 하한 80%→60%.",
      claimIds: ["claim-mid-size-2026"],
    },
  ],
  gaps: [
    "세 자녀 이상 가구에만 더 넓은 주택을 배정하는 별도 기준(예: 다자녀 전용 대형 평형 공급 비율)은 찾지 못했다.",
    "세대원수별 면적 제한 폐지 개정안의 최종 시행일은 원문으로 확인하지 못했다.",
    "중형 비율 상향 뒤 실제로 중형 공공임대가 몇 가구 계획됐는지는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-korea-kr-20230823",
      title: "11월부터 2자녀도 '다자녀 특공'…소득·자산 요건도 완화",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148919279",
      publishedAt: "2023-08-23",
      type: "official",
      license: "public",
    },
    {
      id: "src-fnnews-20240324",
      title: "25일부터 신생아 특별·우선 공급제도 시행.. 다자녀 특공 2자녀 완화",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202403241143546627",
      publishedAt: "2024-03-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-bizwatch-20241028",
      title: "연말엔 1인세대도 공공임대 84㎡ 청약할 수 있다",
      publisher: "비즈워치",
      url: "https://news.bizwatch.co.kr/article/real_estate/2024/10/28/0009",
      publishedAt: "2024-10-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-koscaj-20260706",
      title: "공공임대 중형평형 공급 확대···다자녀·중산층 주거수요 반영",
      publisher: "대한전문건설신문",
      url: "https://www.koscaj.com/news/articleView.html?idxno=325070",
      publishedAt: "2026-07-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-thepublic-20260708",
      title: "\"좋은 땅에 넓게 지어라\"… 베일 벗은 공공임대 '국평 40%' 로드맵",
      publisher: "더퍼블릭",
      url: "https://www.thepublic.kr/news/articleView.html?idxno=310534",
      publishedAt: "2026-07-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mediapen-20260818",
      title: "좁았던 공공임대, 넓어진다…'중형' 실제 물량이 관건",
      publisher: "미디어펜",
      url: "https://www.mediapen.com/news/view/1117060",
      publishedAt: "2026-08-18",
      type: "press",
      license: "link-only",
    },
  ],
};

import type { PolicyInput } from "./schema";

/**
 * 허위조작정보 대응과 언론 자유: 개정 정보통신망법, 경찰 수사, 언론자유지수.
 *
 * 대통령 X 글 여럿에 "고의로 사실을 비튼 보도와 허위정보 유포에 법적 책임을 물어라",
 * "허위·명예훼손 댓글을 방치하는 포털을 제재하라", "아이들이 보는 AI 조작 영상과 가짜 광고를
 * 규제하라", "언론인들이 대통령에게 찍힐까 두려워한다"는 답글이 달렸다(잼통 Voice). 2026년
 * 7월 시행된 개정 정보통신망법이 무엇을 정했는지, 경찰이 어떻게 수사하는지, 국제 언론자유
 * 평가는 어떤지 적는다.
 *
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #94, #105.
 */
export const DISINFORMATION_RESPONSE: PolicyInput = {
  slug: "disinformation-response",
  title: "허위조작정보 대응과 언론 자유: 개정 정보통신망법, 경찰 수사, 언론자유지수",
  scope:
    "2026년 7월 7일 시행된 개정 정보통신망법(이른바 허위조작정보 근절법)의 책임 요건·예외·플랫폼 의무, 경찰의 허위정보 전담 수사, 대통령의 10월 29일 글, RSF 2026 언론자유지수",
  ministries: ["방송미디어통신위원회", "경찰청"],
  categories: ["institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-liability",
      text: "고의로 사실을 비튼 보도와 허위정보 유포에는 법적 책임을 물어야 한다",
      claimIds: ["claim-law", "claim-requirements", "claim-exceptions", "claim-police"],
    },
    {
      id: "rumor-portal",
      text: "허위사실·명예훼손 댓글을 방치하는 포털을 제재하고 AI로 걸러 내야 한다",
      claimIds: ["claim-platform", "claim-critique"],
    },
    {
      id: "rumor-ai-video",
      text: "아이들이 보는 AI 조작 영상과 가짜 광고를 규제해 달라",
      claimIds: ["claim-platform", "claim-requirements"],
    },
    {
      id: "rumor-press-fear",
      text: "언론인들이 이전 민주당 대통령 때와 달리 대통령에게 찍힐까 두려워한다",
      claimIds: ["claim-rsf", "claim-rsf-warning"],
    },
  ],
  claims: [
    {
      id: "claim-law",
      text:
        "개정 정보통신망법(법률 제21305호)은 2026년 1월 6일 공포돼 7월 7일 시행됐다. 별도의 '허위조작정보 근절법'이 " +
        "있는 것이 아니라 이 개정 법률을 부르는 통칭이다.",
      assertionType: "FACT",
      sourceIds: ["src-lawtalk-169323", "src-lawtimes-214692"],
      verified: true,
    },
    {
      id: "claim-requirements",
      text:
        "책임은 허위·조작임을 알면서, 손해를 끼치거나 부당이익을 얻을 목적으로 유통해, 실제로 인격권·재산권이나 공공의 " +
        "이익을 침해했을 때 인정된다. 고의·중과실이 인정되면 법원이 손해액의 최대 5배까지 배상을 명할 수 있고, " +
        "판결로 확정된 허위조작정보를 2회 이상 반복 유통하면 최대 10억 원의 과징금을 물릴 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-lawtalk-169323", "src-lawtimes-214692"],
      verified: true,
    },
    {
      id: "claim-exceptions",
      text:
        "풍자·패러디와 공익 목적의 정보는 규율 대상에서 빠지고, 공익 목적의 보도나 진실이라고 믿을 만한 상당한 이유가 " +
        "있으면 가중 손해배상에서도 빠진다. 정부는 사적 대화나 일반 이용자의 단순 댓글을 처벌하는 조항은 없다고 " +
        "설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-lawtalk-169323"],
      verified: true,
    },
    {
      id: "claim-platform",
      text:
        "하루 평균 이용자 100만 명 이상인 SNS·온라인 커뮤니티·동영상 공유 서비스는 불법·허위조작정보에 대한 자율 " +
        "운영정책을 세우고, 신고를 받아 처리 결과를 알리고, 6개월마다 투명성 보고서를 공표해야 한다. 검색·거래중개 " +
        "서비스는 빠진다. 게시물을 지울지는 일차적으로 플랫폼이 판단한다.",
      assertionType: "FACT",
      sourceIds: ["src-lawtalk-169323"],
      verified: true,
    },
    {
      id: "claim-police",
      text:
        "경찰은 2026년 4월 허위정보 모니터링을 전담하는 사이버분석팀을 만들고, 국가수사본부의 허위정보 대응 TF를 중심으로 " +
        "중동전쟁·5·18·이태원 참사 관련 허위 주장 등을 수사해 왔다. 1월에는 이태원 참사가 조작이라는 영상·게시물 " +
        "700여 개를 올린 60대가 구속됐다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20260419", "src-ytn-20260104"],
      verified: false,
    },
    {
      id: "claim-president",
      text:
        "대통령은 10월 29일 위안부 피해자에 대한 허위사실을 유포한 대학생이 입건됐다는 기사를 공유하며 \"허위사실 " +
        "유포는 범죄입니다\"라고 썼다. 경찰이 전담팀을 꾸려 집중 수사하고 있다며, 모르고 한 일일 가능성이 높지만 " +
        "죄가 되는 줄 몰랐다고 용인되는 것은 아니니 신중하라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-x-20261029-false"],
      verified: true,
    },
    {
      id: "claim-rsf",
      text:
        "국경없는기자회(RSF)의 2026년 언론자유지수에서 한국은 180개국 중 47위로 2025년(61위)보다 14계단 올랐다. 정치·" +
        "법·경제·사회문화·안전 다섯 분야 점수가 모두 올랐다. 일본은 62위, 미국은 64위였다.",
      assertionType: "FACT",
      sourceIds: ["src-journalist-60811", "src-rfa-20260430"],
      verified: true,
    },
    {
      id: "claim-rsf-warning",
      text:
        "한국은 3년 연속 '문제 있음' 등급에 머물렀다. RSF는 한국에서 허위정보 확산을 막으려 도입된 정부 조치들이 " +
        "언론 자유 단체들의 비판을 받고 있다고 지적했다.",
      assertionType: "FACT",
      sourceIds: ["src-journalist-60871"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "업계와 전문가들은 플랫폼이 법적 위험을 피하려 사실관계가 확정되지 않은 의혹이나 공인 비판 게시물까지 미리 " +
        "지우는 '과잉 삭제'를 우려했다. 시민단체는 표현의 자유 침해를 들어 비판했고, 경향신문은 '독소조항' 손질 없이 " +
        "시행됐다고 보도했다.",
      assertionType: "OPINION",
      sourceIds: ["src-lawtalk-169323", "src-dis-khan-20260706"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-rsf-warning", "claim-critique"],
  timeline: [
    {
      id: "t-promulgate",
      date: "2026-01-06",
      datePrecision: "day",
      title: "개정 정보통신망법 공포",
      summary: "법률 제21305호.",
      claimIds: ["claim-law"],
    },
    {
      id: "t-rsf",
      date: "2026-04-30",
      datePrecision: "day",
      title: "RSF 언론자유지수 한국 47위",
      summary: "61위에서 14계단 상승, '문제 있음' 등급 유지.",
      claimIds: ["claim-rsf", "claim-rsf-warning"],
    },
    {
      id: "t-effective",
      date: "2026-07-07",
      datePrecision: "day",
      title: "개정 정보통신망법 시행",
      summary: "최대 5배 배상, 대형 플랫폼 투명성 보고서.",
      claimIds: ["claim-requirements", "claim-platform"],
    },
    {
      id: "t-post",
      date: "2026-10-29",
      datePrecision: "day",
      title: "대통령 \"허위사실 유포는 범죄\"",
      summary: "경찰 전담팀 집중 수사 언급.",
      claimIds: ["claim-president"],
    },
  ],
  gaps: [
    "법 조문 원문과 시행령은 국가법령정보센터에서 대조하지 못했다. 법률 해설과 보도로 확인했다.",
    "AI로 만든 조작 영상과 허위 광고만을 겨냥한 별도 규제의 추진 현황은 확인하지 못했다.",
    "경찰의 10월 허위정보 전담팀 구성 발표 원문과 입건 건수는 찾지 못했다.",
    "언론인이 체감하는 위축을 측정한 국내 조사는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-lawtalk-169323",
      title: "정보통신망법 개정 '허위조작정보 근절법', 7월 7일부터 무엇이 달라졌나",
      publisher: "로톡뉴스",
      url: "https://www.lawtalk.co.kr/posts/169323",
      publishedAt: "2026-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-lawtimes-214692",
      title: "개정 정보통신망법(소위 \"허위조작정보근절법\")의 주요 내용",
      publisher: "법률신문",
      url: "https://www.lawtimes.co.kr/news/articleViewAmp.html?idxno=214692",
      type: "research",
      license: "link-only",
    },
    {
      id: "src-heraldk-20260419",
      title: "'원유 90만 배럴 북한에 유입' 중동전쟁 가짜뉴스 기승…경찰 전담팀 꾸렸다 [세상&]",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026041920450051269",
      publishedAt: "2026-04-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ytn-20260104",
      title: "경찰, 이태원 참사 피해자 ’2차 가해’ 피의자 구속...유가족 \"엄벌 촉구\"",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0103_202601041041159649",
      publishedAt: "2026-01-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-x-20261029-false",
      title: "허위사실 유포는 범죄입니다",
      publisher: "이재명 X (@Jaemyung_Lee)",
      url: "https://x.com/Jaemyung_Lee/status/2115709466620645837",
      publishedAt: "2026-10-29",
      type: "interview",
      license: "quotable",
    },
    {
      id: "src-journalist-60811",
      title: "한국 언론자유 순위 47위, 14계단 올랐지만…",
      publisher: "기자협회보",
      url: "https://www.journalist.or.kr/news/article.html?no=60811",
      publishedAt: "2026-04-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-journalist-60871",
      title: "언론자유지수 상승… 자축은 이르다",
      publisher: "기자협회보",
      url: "https://journalist.or.kr/m/m_article.html?no=60871",
      publishedAt: "2026-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-rfa-20260430",
      title: "북 '언론자유지수' 최하위권...\"지구상 가장 폐쇄적 정권\"",
      publisher: "자유아시아방송",
      url: "https://rfa.org/korean/in-focus/2026/04/30/north-korea-press-freedom-bottom/",
      publishedAt: "2026-04-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dis-khan-20260706",
      title: "‘가짜뉴스’ 징벌적 손배, 독소조항 손질 없이 시행",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202607062143005",
      publishedAt: "2026-07-06",
      type: "press",
      license: "link-only",
    },
  ],
};

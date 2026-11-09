import type { PolicyInput } from "./schema";

/**
 * 친형 강제입원 의혹과 가족 통화 녹음: 판결과 사과의 기록.
 *
 * 대통령 유튜브 영상 답글에 "대통령이 아버지를 잃은 조카에게 강제입원을 협박하고도 사과하지 않았다"는 주장이 달렸다(잼통 Voice).
 * 이 주장의 뿌리인 친형 고 이재선 씨 강제입원 의혹이 법원에서 어떻게 판단됐는지, 2022년 공개된 통화 녹음과 당시 사과를 적는다.
 *
 * ★ '조카에게 강제입원을 협박했다'는 구체 발언은 확인하지 못했다(gaps). 녹음은 주로 형·형수와의 통화다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #244.
 */
export const PRESIDENT_FAMILY_DISPUTE: PolicyInput = {
  slug: "president-family-dispute",
  title: "친형 강제입원 의혹과 가족 통화 녹음: 판결과 사과",
  scope:
    "성남시장 시절 친형 강제입원 추진 의혹에 대한 형사재판(대법원 전원합의체 2020년 7월, 파기환송심 무죄 확정), 2022년 1월 공개된 가족 통화 녹음과 당시 후보의 사과",
  ministries: [],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-nephew",
      text: "대통령이 아버지를 잃은 조카에게 강제입원을 협박하고도 사과하지 않았다",
      claimIds: ["claim-court", "claim-recording", "claim-apology"],
    },
  ],
  claims: [
    {
      id: "claim-court",
      text:
        "친형 강제입원 관련 발언으로 기소된 공직선거법 위반(허위사실 공표) 사건에서 2심은 벌금 300만 원을 선고했으나, 대법원 전원합의체는 2020년 7월 16일 7대 5로 " +
        "\"공직선거법상 허위사실 공표에 해당하지 않는다\"며 무죄 취지로 파기환송했다. 2020년 10월 16일 파기환송심이 무죄를 선고해 확정됐다. 직권남용 혐의는 1·2심 모두 무죄였다.",
      assertionType: "FACT",
      sourceIds: ["src-lawtimes-163004", "src-newstomato-1001283"],
      verified: true,
    },
    {
      id: "claim-recording",
      text:
        "2022년 1월 대선 기간에 국민의힘 측 장영하 변호사가 이 후보가 형·형수와 통화한 160분 분량 녹음을 공개했다. 욕설과 막말, 정신병원 입원을 압박하는 듯한 음성이 담겼다고 보도됐다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20220118", "src-dt-11428042"],
      verified: true,
    },
    {
      id: "claim-apology",
      text:
        "이 후보는 \"그것도 저의 과거의 한 부분이고 책임져야 할 부분이라 깊이 사과드린다\"고 말했다. 민주당 선대위는 형과 형수가 어머니에게 폭언을 해 자식으로서 참을 수 없어 생긴 일이며, " +
        "상대측이 많은 통화를 녹음한 뒤 일부만 골라 왜곡해 유포했다고 주장했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20220118", "src-pressian-20220121"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-recording"],
  timeline: [
    {
      id: "t-supreme",
      date: "2020-07-16",
      datePrecision: "day",
      title: "대법원 전원합의체 파기환송",
      summary: "7대 5.",
      claimIds: ["claim-court"],
    },
    {
      id: "t-final",
      date: "2020-10-16",
      datePrecision: "day",
      title: "파기환송심 무죄 확정",
      summary: "수원고법.",
      claimIds: ["claim-court"],
    },
    {
      id: "t-recording",
      date: "2022-01-18",
      datePrecision: "day",
      title: "통화 녹음 공개와 사과",
      summary: "대선 기간.",
      claimIds: ["claim-recording", "claim-apology"],
    },
  ],
  gaps: [
    "공개된 녹음 가운데 조카에게 강제입원을 언급한 대목이 있는지, 조카에게 따로 사과했는지는 확인하지 못했다.",
    "2025년 취임 이후 이 사안에 대해 대통령이 새로 밝힌 입장은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-lawtimes-163004",
      title: "[판결] 이재명 지사 대법원서 기사회생… 무죄 취지 파기환송",
      publisher: "법률신문",
      url: "https://www.lawtimes.co.kr/news/articleViewAmp.html?idxno=163004",
      publishedAt: "2020-07-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstomato-1001283",
      title: "이재명 '친형 강제입원' 혐의, 671일만에 무죄 확정(종합)",
      publisher: "뉴스토마토",
      url: "https://newstomato.com/ReadNews.aspx?no=1001283",
      publishedAt: "2020-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20220118",
      title: "이재명 욕설 담긴 통화 녹음 공개···김건희 '7시간 녹취록' 맞불?",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202201181731001",
      publishedAt: "2022-01-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dt-11428042",
      title: "욕설.막말 담긴 이재명 '160분 통화' 녹취록 공개…'김건희 통화 방송'에 맞불",
      publisher: "디지털타임스",
      url: "https://www.dt.co.kr/article/11428042",
      publishedAt: "2022-01-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-pressian-20220121",
      title: "[전문] 이재명 \"형수가 어머니에 욕설, 자식으로 참을 수 없어 발생한 일\"",
      publisher: "프레시안",
      url: "https://www.pressian.com/pages/articles/2022012107480193836",
      publishedAt: "2022-01-21",
      type: "press",
      license: "link-only",
    },
  ],
};

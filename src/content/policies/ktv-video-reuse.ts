import type { PolicyInput } from "./schema";

/**
 * KTV 영상의 2차 활용 조건 — 누가, 무엇을, 어디까지 쓸 수 있나.
 *
 * "정부 성과를 알리는 2차 제작이 쉽도록 KTV 영상에 저작권 걱정 없는 음악을
 * 써 달라"는 답글이 돈다(2026년 10월). 요청 자체는 사실 확인 대상이 아니다.
 * 여기에는 KTV 영상의 이용 조건(공공누리 유형·예외)과, 음원 문제에 대해
 * 대통령이 X에서 밝힌 설명을 둔다.
 *
 * ★ 9월 29일 대통령 X 게시물 원문은 직접 보지 못했다. 언론 두 곳이 전한
 *   내용만 CLAIM으로 적는다.
 * ★ 2026-10-18 처음 등록 — 잼통 Voice voice-gap 이슈 #47.
 */
export const KTV_VIDEO_REUSE: PolicyInput = {
  slug: "ktv-video-reuse",
  title: "KTV 영상의 2차 활용 조건",
  scope: "KTV 국민방송 영상의 공공저작물 개방, 나누리 포털 이용 조건, 배경음악 저작권과 광고 수익 문제",
  ministries: ["문화체육관광부", "청와대"],
  categories: ["institution"],
  asOf: "2026-10-18",
  rumors: [
    {
      id: "rumor-music",
      text: "KTV 영상에 저작권 있는 음악이 들어 있어 정부 성과를 알리는 2차 제작이 어렵다",
      claimIds: ["claim-open", "claim-nanuri", "claim-music"],
    },
  ],
  claims: [
    {
      id: "claim-open",
      text:
        "대통령실은 2025년 7월 9일 KTV 영상 저작물이 저작권법 제24조의2 제1항에 따라 누구나 자유롭게 쓸 수 " +
        "있는 공공저작물이라며, 언론사나 플랫폼을 가리지 않고 모든 언론과 시민에게 개방한다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-tongilnews-ktv-open-20250709"],
      verified: true,
    },
    {
      id: "claim-nanuri",
      text:
        "KTV는 2025년 9월 8일 '나누리 포털'을 열었다. 권리 정비가 끝난 약 3만 개 클립을 촬영 원본·방송본 등으로 " +
        "순차 공개하고, 공공누리 제1유형(출처 표시, 상업적·비상업적 이용, 변형 등 2차 저작물 작성 가능)으로 " +
        "쓸 수 있다. 가입하고 약관에 동의하면 바로 내려받을 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-ktv-nanuri-open-20250908"],
      verified: true,
    },
    {
      id: "claim-exception",
      text:
        "방송 송출용 시사·교양·다큐 프로그램 완성본은 나누리 포털에서 아직 개방하지 않았다. KTV는 저작권·" +
        "저작인접권·초상 등에 대한 법률 검토를 거쳐 단계적으로 개방하겠다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-ktv-nanuri-open-20250908"],
      verified: true,
    },
    {
      id: "claim-music",
      text:
        "대통령은 2026년 9월 29일 X에서 KTV 영상의 음원 문제를 설명했다. 보도에 따르면 KTV는 광고 수익이 없어 " +
        "음원 사용이 조정돼 있지만, 민간 채널이 저작권 음원이 든 영상을 다시 올리면 광고 수익이 음원 권리자에게 " +
        "갈 수 있다. 수익을 내려면 나누리 포털에서 저작권 음원이 없는 '클린본'을 받아 무료 음원이나 이용권을 " +
        "확보한 음악을 넣으면 된다는 설명이다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령 X 게시물(아주경제·현대경제 보도)",
      sourceIds: ["src-ajunews-ktv-20260929", "src-hdnews-ktv-20260929"],
      verified: true,
    },
    {
      id: "claim-request",
      text:
        "같은 게시물에서 KTV 측에 앞으로 가능하면 저작권 문제가 없는 음악을 쓰도록 요청했다고 밝혔다. 다만 모든 " +
        "영상에서 저작권 음원을 빼면 완성도가 떨어질 수 있어 전면적인 해결에는 한계가 있다는 취지도 함께 전해졌다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령 X 게시물(아주경제·현대경제 보도)",
      sourceIds: ["src-ajunews-ktv-20260929", "src-hdnews-ktv-20260929"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-open",
      date: "2025-07-09",
      datePrecision: "day",
      title: "KTV 영상 저작물 전면 개방 발표",
      summary: "누구나 쓸 수 있는 공공저작물이라고 밝혔다.",
      claimIds: ["claim-open"],
    },
    {
      id: "t-nanuri",
      date: "2025-09-08",
      datePrecision: "day",
      title: "나누리 포털 개방",
      summary: "공공누리 제1유형으로 클립 공개를 시작했다. 방송 완성본은 제외됐다.",
      claimIds: ["claim-nanuri", "claim-exception"],
    },
    {
      id: "t-music",
      date: "2026-09-29",
      datePrecision: "day",
      title: "대통령, KTV 영상 음원 문제 설명",
      summary: "클린본 활용을 안내하고 KTV에 저작권 걱정 없는 음악 사용을 요청했다고 밝혔다.",
      claimIds: ["claim-music", "claim-request"],
    },
  ],
  critiqueIds: ["claim-exception", "claim-request"],
  gaps: [
    "9월 29일 대통령 X 게시물 원문은 직접 확인하지 못했다. 내용은 언론 보도 기준이다.",
    "나누리 포털에서 어떤 영상에 클린본이 있는지, 그 범위는 확인하지 못했다.",
    "KTV가 음원 사용 방침을 바꿨다는 공식 발표는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-tongilnews-ktv-open-20250709",
      title: "대통령실 \"KTV 영상, 모든 국민·매체가 활용 보장\"",
      publisher: "통일뉴스",
      url: "https://www.tongilnews.com/news/articleView.html?idxno=213940",
      publishedAt: "2025-07-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ktv-nanuri-open-20250908",
      title: "KTV 공공저작물 <나누리 포털> 본격 개방",
      publisher: "KTV 국민방송",
      url: "https://www.ktv.go.kr/ktvnews/press/view?board_num=201414",
      publishedAt: "2025-09-08",
      type: "official",
      license: "public",
    },
    {
      id: "src-ajunews-ktv-20260929",
      title: "李, KTV 영상 저작권 해법 공유…\"클린본 활용 가능\"",
      publisher: "아주경제",
      url: "https://www.ajunews.com/view/20260929090617680",
      publishedAt: "2026-09-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hdnews-ktv-20260929",
      title: "KTV 영상 저작권 논란에 李대통령 직접 답변…\"클린본 활용해 수익 가능\"",
      publisher: "현대경제",
      url: "https://www.hdnews.co.kr/news/articleView.html?idxno=358338",
      publishedAt: "2026-09-29",
      type: "press",
      license: "link-only",
    },
  ],
};

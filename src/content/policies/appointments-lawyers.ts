import type { PolicyInput } from "./schema";

/**
 * 대통령 사건 변호인 출신 인사 기용과 '보은 인사' 논란.
 *
 * 대통령 X 글 여럿에 "자신의 재판을 맡았던 변호사들에게 자리를 준다", "측근·변호인 출신을
 * 요직과 사외이사에 앉히는 보은 인사"라는 답글이 달렸다(잼통 Voice). 보도로 확인되는 변호인
 * 출신 인사의 현황과 정부의 인선 설명, 비판을 나란히 적는다.
 *
 * ★ 인원 집계는 매체마다 다르다(12명·13명·최소 14명·약 15명). 이 페이지는 이름과 직위가
 *   함께 보도된 목록을 기준으로 적는다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #97.
 */
export const APPOINTMENTS_LAWYERS: PolicyInput = {
  slug: "appointments-lawyers",
  title: "대통령 사건 변호인 출신 인사 기용과 '보은 인사' 논란",
  scope:
    "이재명 대통령 관련 사건의 변호인과 그 가족이 정부·공공기관·국회 요직에 기용된 현황(2026년 10월 보도 기준), 대통령실·부처의 인선 설명, 야권과 언론의 비판",
  ministries: ["청와대"],
  categories: ["institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-lawyers",
      text: "자신의 재판을 맡았던 변호사들에게 자리를 주는 것은 개혁이 아니다",
      claimIds: ["claim-list", "claim-explanation", "claim-critique"],
    },
    {
      id: "rumor-board",
      text: "측근과 개인 재판 변호인 출신을 요직과 사외이사에 잇따라 앉히는 것은 보은 인사다",
      claimIds: ["claim-list", "claim-chief-of-staff", "claim-critique"],
    },
    {
      id: "rumor-principle",
      text: "친하다고 자리를 주면 안 된다던 말과 달리 측근·변호인 출신을 기관장에 앉힌다",
      claimIds: ["claim-list", "claim-explanation"],
    },
  ],
  claims: [
    {
      id: "claim-list",
      text:
        "위키트리(10월 15일)가 정리한 대통령 사건 변호인 출신 기용 사례에는 조원철 법제처장(위례·대장동·백현동), 이찬진 " +
        "금융감독원장(공직선거법·대북송금), 김희수 국가정보원 기획조정실장(대북송금), 정일연 국민권익위원장(이화영 전 " +
        "부지사 사건), 차지훈 주유엔대사(공직선거법), 김성식 예금보험공사 사장, 대통령실 이태형 공직기강·전치영 " +
        "민정·이장형 법무비서관, 나승철 국무총리비서실 민정실장, 조상호 법무부 장관 정책보좌관 등이 있다. 박균택 " +
        "의원도 대장동 사건 변호인 출신이다.",
      assertionType: "FACT",
      sourceIds: ["src-wikitree-1166580"],
      verified: true,
    },
    {
      id: "claim-chief-of-staff",
      text:
        "10월 임명된 임광현 대통령비서실장은 대장동 사건 변호인 이승엽 변호사의 매형이고, 임 실장의 배우자는 주휴스턴 " +
        "총영사다. 이승엽 변호사 본인은 공직에 임명되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-wikitree-1166580", "src-koreancenter-1424575"],
      verified: true,
    },
    {
      id: "claim-explanation",
      text:
        "대통령실은 임광현 실장 인선 배경으로 행정 경험과 정무 감각을, 정일연 위원장은 법관 경력과 전문성을 들었다. " +
        "외교부는 차지훈 대사의 국제 현안 이해와 국제중재·협상 경험을 들었다. 변호인 출신 법률 참모들에 대해서는 법령 " +
        "해석의 전문가로 업무 수행에 문제가 없다는 입장이다.",
      assertionType: "CLAIM",
      assertedBy: "대통령실",
      sourceIds: ["src-wikitree-1166580", "src-segye-20250715"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "국민의힘 안철수 의원은 임 실장 인선을 \"대장동 패밀리 보은 인사의 결정판\"이라 했고, 나경원 의원은 국가 요직을 " +
        "통한 변호사비 대납이 아니냐고 비판했다. 세계일보는 사설에서 정일연 위원장 임명을 \"지나친 보은 인사\"라며 " +
        "이해충돌과 권익위 독립성 훼손을 우려했다.",
      assertionType: "OPINION",
      sourceIds: ["src-wikitree-1166580", "src-segye-20260303"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-acrc",
      date: "2026-03-03",
      datePrecision: "day",
      title: "정일연 국민권익위원장 임명",
      summary: "이화영 전 부지사 변호인 출신.",
      claimIds: ["claim-list", "claim-critique"],
    },
    {
      id: "t-chief",
      date: "2026-10",
      datePrecision: "month",
      title: "임광현 대통령비서실장 임명",
      summary: "대장동 사건 변호인의 매형.",
      claimIds: ["claim-chief-of-staff"],
    },
  ],
  gaps: [
    "공공기관 사외이사로 간 변호인 출신 인사는 정리된 자료를 찾지 못했다.",
    "대통령이 과거 '친하다고 자리를 주면 안 된다'고 말했다는 답글의 원 발언은 찾지 못했다.",
    "국무위원 공석이 얼마나 오래 이어졌는지는 이 페이지에서 정리하지 못했다.",
  ],
  sources: [
    {
      id: "src-wikitree-1166580",
      title: "\"보은 인사 결정판\"…대통령 변호했던 법조인들, 가족까지 요직 진출",
      publisher: "위키트리",
      url: "https://www.wikitree.co.kr/articles/1166580",
      publishedAt: "2026-10-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-koreancenter-1424575",
      title: "강훈식 사의표명 23일 만…정치인 기용 세간 예측 깬 임광현 카드",
      publisher: "연합뉴스",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1424575",
      publishedAt: "2026-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20250715",
      title: "[사설] ‘李 변호인’ 12명이나 요직에… 보은 인사 아닌가",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20250715515193",
      publishedAt: "2025-07-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20260303",
      title: "[사설] 이화영 변호인 출신 권익위원장에, 지나친 보은 인사",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20260303516567",
      publishedAt: "2026-03-03",
      type: "press",
      license: "link-only",
    },
  ],
};

import type { Source } from "@/content/schema";

/**
 * 대통령 형사재판 페이지들이 함께 쓰는 자료.
 *
 * 같은 기사를 여러 사건 페이지가 인용한다. 그런데 위키 앵커 `source:<id>`는 id
 * 하나로 자료를 찾으므로 정책끼리 id가 겹치면 안 된다(scripts/validate-content.ts).
 * 그래서 자료는 여기 한 번만 적고, 각 페이지가 `sourcesFor(접두어, …)`로 제 접두어를
 * 붙인 사본을 가져간다. claim의 sourceIds도 같은 접두어를 쓴다.
 *
 * ★ 1차 자료와 언론 보도를 구별한다.
 *   `type`이 judicial·official인 것(대법원 보도자료·판결문, 법무부 보도자료, 헌법
 *   조문)은 원문을 받아 대조했다. 그런 자료로 문장 전체가 확인되는 claim만
 *   `verified: true`다. 보도에만 기댄 부분은 claim을 나눠 `verified: false`로 둔다.
 */
type Entry = Omit<Source, "id" | "type" | "license"> &
  Partial<Pick<Source, "type" | "license">>;

const ENTRIES = {
  constitution: {
    title: "대한민국헌법 제84조",
    publisher: "국가법령정보센터",
    url: "https://www.law.go.kr/법령/대한민국헌법",
    type: "official",
    license: "public",
  },
  "scourt-0501": {
    title: "대법원 선고 2025도4697 공직선거법위반 사건에 관한 보도자료",
    publisher: "대법원",
    url: "https://www.scourt.go.kr/portal/news/NewsViewAction.work?seqnum=2803&gubun=6",
    publishedAt: "2025-05-01",
    type: "judicial",
    license: "public",
  },
  "scourt-2025do810": {
    title: "대법원 2025. 6. 5. 선고 2025도810 판결(첨부 판결문)",
    publisher: "대법원",
    url: "https://www.scourt.go.kr/portal/news/NewsViewAction.work?seqnum=5757&gubun=2",
    publishedAt: "2025-06-05",
    type: "judicial",
    license: "public",
  },
  "moj-0610": {
    title: "법무부 「검찰인권존중미래위원회」 발족 및 1차 조사 대상 사건 선정 및 조사 권고",
    publisher: "법무부",
    url: "https://www.moj.go.kr/bbs/moj/182/607406/artclView.do",
    publishedAt: "2026-06-10",
    type: "official",
    license: "public",
  },
  "moj-0814": {
    title: "검찰인권존중미래위원회 '검찰권 남용 의혹 사건' 12건 추가 조사 대상 사건 선정",
    publisher: "법무부",
    url: "https://www.moj.go.kr/bbs/moj/182/609415/artclView.do",
    publishedAt: "2026-08-14",
    type: "official",
    license: "public",
  },
  "edaily-0609": {
    title: "李대통령 파기환송심 사실상 중단…남은 재판은(종합)",
    publisher: "이데일리",
    url: "https://v.daum.net/v/20250609160458917",
    publishedAt: "2025-06-09",
  },
  "edaily-0610": {
    title: "李대통령 대장동 재판도 사실상 중지…법원 \"추후 지정\"",
    publisher: "이데일리",
    url: "https://edaily.co.kr/News/Read?mediaCodeNo=257&newsId=04037686642200408",
    publishedAt: "2025-06-10",
  },
  "newsis-0722": {
    title: "李대통령 대북송금 재판도 '연기'…5개 형사재판 다 중단(종합)",
    publisher: "뉴시스",
    url: "https://www.newsis.com/view/NISX20250722_0003261515",
    publishedAt: "2025-07-22",
  },
  "lawtimes-0501": {
    title: "대법, 이재명 선거법 사건 유죄 취지 파기환송",
    publisher: "법률신문",
    url: "https://www.lawtimes.co.kr/news/207715",
    publishedAt: "2025-05-01",
  },
  "ohmy-0501": {
    title: "대법원, 이재명 선거법 유죄 취지 파기환송",
    publisher: "오마이뉴스",
    url: "https://v.daum.net/v/20250501153602515",
    publishedAt: "2025-05-01",
  },
  "lawtimes-1125": {
    title: "이재명 '위증교사' 1심 무죄…\"고의 없어\"",
    publisher: "법률신문",
    url: "https://www.lawtimes.co.kr/news/203218",
    publishedAt: "2024-11-25",
  },
  "dailian-0322": {
    title: "이재명 불구속 기소 '4895억 배임·133억 뇌물'…남은 수사도 줄줄이",
    publisher: "데일리안",
    url: "https://www.dailian.co.kr/news/view/1214432/",
    publishedAt: "2023-03-22",
  },
  "inews-1012": {
    title: "검찰, 이재명 대표 불구속 기소…\"백현동 먼저\"(종합)",
    publisher: "아이뉴스24",
    url: "https://www.inews24.com/view/1641278",
    publishedAt: "2023-10-12",
  },
  "segye-1031": {
    title: "‘대장동 개발 비리’ 김만배·유동규 등 1심 실형…李대통령 개입 여부 판단 안 해",
    publisher: "세계일보",
    url: "https://www.segye.com/newsView/20251031514639",
    publishedAt: "2025-10-31",
  },
  "seoul-0704": {
    title: "이재명 국회의원 각종 의혹 경기남부경찰청으로(종합)",
    publisher: "서울신문",
    url: "https://m.go.seoul.co.kr/news/2022/07/04/20220704500210",
    publishedAt: "2022-07-04",
  },
  "seoul-0612": {
    title: "검찰, '쌍방울 대북송금' 이재명 기소…李 \"검찰 창작 수준 갈수록 떨어져\"",
    publisher: "서울신문",
    url: "https://m.seoul.co.kr/news/2024/06/12/20240612500190",
    publishedAt: "2024-06-12",
  },
  "newsis-1219": {
    title: "'대북송금' 이화영, 연어·술파티 회유 주장…법원은 \"납득 어려워\"",
    publisher: "뉴시스",
    url: "https://mobile.newsis.com/view/NISX20241219_0003004193",
    publishedAt: "2024-12-19",
  },
  "dailian-0605": {
    title: "대법, 이화영 '대북송금' 징역 7년8개월 확정…李 대통령 재판 영향 주목",
    publisher: "데일리안",
    url: "https://www.dailian.co.kr/news/view/1507191/",
    publishedAt: "2025-06-05",
  },
  "khan-0505": {
    title: "고검 TF \"이화영 조사 때 술자리\" 결론…박상용 \"소환 한 번 않고 '답정너' 수사\"",
    publisher: "경향신문",
    url: "https://www.khan.co.kr/article/202605052051005/",
    publishedAt: "2026-05-05",
  },
  "chosun-0620": {
    title: "'연어 술자리 위증' 이화영 1심 징역 4개월...\"진술 일관성 없어\"",
    publisher: "조선일보",
    url: "https://v.daum.net/v/20260620034718138",
    publishedAt: "2026-06-20",
  },
  "wkhan-1007": {
    title: "\"이화영, 대통령에게 매우 화가 나…가석방 요구\"",
    publisher: "주간경향",
    url: "https://weekly.khan.co.kr/article/202610071753001",
    publishedAt: "2026-10-07",
  },
  "newsis-1119": {
    title: "'또 기소' 이번엔 경기도 법카 1억 유용…이재명 재판 5개",
    publisher: "뉴시스",
    url: "https://www.newsis.com/view/NISX20241119_0002964445",
    publishedAt: "2024-11-19",
  },
  "nocut-0610": {
    title: "검찰미래위 출범…'대장동·대북송금' 등 7건 조사대상 선정",
    publisher: "CBS노컷뉴스",
    url: "https://m.news.nate.com/view/20260610n29790",
    publishedAt: "2026-06-10",
  },
  "inews-0814": {
    title: "'성남FC·법카'도…檢미래위, '李재판 관련사건 6건'으로 늘어",
    publisher: "아이뉴스24",
    url: "https://m.news.nate.com/view/20260814n27722",
    publishedAt: "2026-08-14",
  },
  "seoul-0918": {
    title: "李대통령 \"국회, 조작기소 특검 권한에서 공소취소 조항 삭제해달라\"",
    publisher: "서울신문",
    url: "https://www.seoul.co.kr/news/politics/2026/09/18/20260918500135",
    publishedAt: "2026-09-18",
  },
  "ilyo-1009": {
    title: "공소취소 빼고 속도 내더니…민주당 '조작기소 특검법' 급제동 속사정",
    publisher: "일요신문",
    url: "https://m.news.nate.com/view/20261009n09671",
    publishedAt: "2026-10-09",
  },
  "inews-0908": {
    title: "민주당, 이재명 기소에 \"반드시 심판\"…국힘 \"정치공세 중단하라\"",
    publisher: "아이뉴스24",
    url: "https://www.inews24.com/view/1517979",
    publishedAt: "2022-09-08",
  },
  "tf-1115": {
    title: "'선거법 위반' 이재명 1심 의원직 상실형…백현동 발언 모두 유죄(종합)",
    publisher: "더팩트",
    url: "https://news.tf.co.kr/read/life/2151955.htm",
    publishedAt: "2024-11-15",
  },
  "seoul-0326": {
    title: "이재명 '무죄'에 희비…與 \"대단히 유감\" 野 \"국민의 승리\"",
    publisher: "서울신문",
    url: "https://m.seoul.co.kr/news/2025/03/26/20250326500179",
    publishedAt: "2025-03-26",
  },
  "lawtimes-0930": {
    title: "이재명 '위증교사 혐의' 1심, 11월 25일 선고…공직선거법 선고 열흘 뒤",
    publisher: "법률신문",
    url: "https://www.lawtimes.co.kr/news/201721",
    publishedAt: "2024-09-30",
  },
  "yna-1119": {
    title: "경찰은 불송치한 이재명 '법카 유용 의혹'…검찰 수사는 달랐다(종합)",
    publisher: "연합뉴스",
    url: "https://news.nate.com/view/20241119n34628",
    publishedAt: "2024-11-19",
  },
  "dailian-1119": {
    title: "\"해도해도 너무하네\"…검찰, '법카 유용' 이재명 추가 기소에 민주당 발끈",
    publisher: "데일리안",
    url: "https://www.dailian.co.kr/news/view/1430786/",
    publishedAt: "2024-11-19",
  },
  "kbmaeil-1120": {
    title: "\"법카 유용 증거 없지만 기소\" 이재명 대표, 검찰 강력 비판",
    publisher: "경북매일",
    url: "https://kbmaeil.com/article/202411200411501",
    publishedAt: "2024-11-20",
  },
  "segye-1114": {
    title: "'선거법 위반' 김혜경 벌금 150만원… 이재명 \"죽고 싶을 만큼 미안\"",
    publisher: "세계일보",
    url: "https://www.segye.com/newsView/20241114514036",
    publishedAt: "2024-11-14",
  },
  "dailian-0519": {
    title: "김혜경, '선거법 위반' 2심 벌금형에 상고…법조계 \"결론 뒤집힐 가능성 작아\"",
    publisher: "데일리안",
    url: "https://www.dailian.co.kr/news/view/1499282/",
    publishedAt: "2025-05-19",
  },
} satisfies Record<string, Entry>;

export type TrialSourceKey = keyof typeof ENTRIES;

/** 접두어를 붙인 출처 id. claim의 sourceIds에 쓴다. */
export function sid(prefix: string, key: TrialSourceKey): string {
  return `${prefix}--${key}`;
}

/** 이 페이지가 쓰는 자료만, 접두어를 붙여서. */
export function sourcesFor(prefix: string, keys: TrialSourceKey[]): Source[] {
  return keys.map((key) => {
    const entry: Entry = ENTRIES[key];
    return {
      type: "press",
      license: "link-only",
      ...entry,
      id: sid(prefix, key),
    };
  });
}

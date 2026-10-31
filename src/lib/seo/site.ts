/**
 * 사이트의 기준 주소.
 *
 * `metadataBase`와 같은 값을 본다. 여기서 한 번 더 적는 이유는 sitemap과
 * robots가 **절대 주소**를 내야 하기 때문이다 — 그 둘은 Metadata가 아니라
 * 파일이라 metadataBase가 붙여 주지 않는다.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jamtong.kr";

/** 경로 하나를 절대 주소로. 슬래시가 겹치거나 빠지지 않게 한 곳에서 붙인다. */
export function abs(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** 사이트 이름. 검색 결과와 공유 카드, 구조화 데이터가 같은 이름을 쓴다. */
export const SITE_NAME = "이재명 업적 위키";
export const SITE_BRAND = "잼통";

/**
 * 사이트 한 줄 설명.
 *
 * 검색 결과 밑에 뜨는 문장이고, AI 에이전트가 이 사이트를 무엇으로 소개할지도
 * 대개 이 문장에서 시작한다. 사람들이 실제로 찾는 낱말(업적·언행·자서전·공약)을
 * 앞에 두고, 이 사이트가 다른 곳과 다른 점(출처·층 구분)을 뒤에 둔다.
 */
export const SITE_DESCRIPTION =
  "이재명 대통령의 업적·언행·저서·대선 공약·카르텔 조치·정책 팩트를 한곳에 모은 위키. " +
  "모든 문장에 출처를 달고, 사실과 주장을 갈라 보입니다.";

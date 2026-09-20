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

import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/site";

/**
 * robots.txt.
 *
 * /my와 /s/의 색인 제외는 각 페이지의 noindex가 맡는다.
 * 여기서 크롤링을 막으면 검색엔진이 그 noindex를 읽을 수 없다.
 * 두 경로는 사이트맵에서도 계속 제외한다.
 * 개인 데이터 보호는 robots.txt가 아니라 인증과 Firestore 보안 규칙이 맡는다.
 *
 * 공유 카드가 사용하는 /api/share-card, /api/wiki-card와 페이지 렌더링에
 * 필요한 정적 자원도 막지 않는다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

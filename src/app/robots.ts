import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/site";

/**
 * robots.txt.
 *
 * 막는 것은 둘뿐이다.
 *   /my  — 내 계정과 내가 물어본 이력. 남이 볼 화면이 아니다.
 *   /s/  — 공유 링크가 지나가는 자리. 같은 내용이 업적 주소로 이미 있고,
 *          이쪽은 메타데이터로도 noindex다. 색인에 두 벌이 서면 안 된다.
 *
 * ★ /api를 막지 않는다.
 *   공유 카드 그림이 `/api/share-card`에서 나온다. 크롤러는 robots.txt를 보고
 *   그림을 가져갈지 정하므로, 여기서 막으면 카드가 통째로 비어서 뜬다.
 *   나머지 API는 POST 전용이라 크롤러가 얻어 갈 것이 없다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/my", "/s/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

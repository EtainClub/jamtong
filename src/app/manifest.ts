import type { MetadataRoute } from "next";

/**
 * 홈 화면에 추가했을 때의 모습. 모바일 우선 앱이므로 설치 경로를 비워 두지 않는다.
 *
 * maskable 아이콘을 따로 두는 이유: 안드로이드는 아이콘을 원형·스쿼클로 잘라내므로
 * 안전 영역(약 60%) 밖은 사라진다. 같은 그림을 여백만 더 준 판으로 하나 더 넣는다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "잼통 — 이재명 업적 위키",
    short_name: "잼통",
    description: "읽는 위키가 아니라 이해하는 위키.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdfcfc",
    theme_color: "#fdfcfc",
    lang: "ko",
    icons: [
      { src: "/images/jamtong-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/jamtong-icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/images/jamtong-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

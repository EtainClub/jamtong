import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/lib/firebase/auth";
import { SITE_BRAND, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo/site";

/*
 * 본문은 Pretendard(한글 가변폭), 수치는 IBM Plex Mono.
 * Pretendard는 구글 폰트에 없어 globals.css에서 CDN 서브셋을 가져온다.
 */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

/*
 * 검색엔진 소유 확인. 값은 구글 서치 콘솔·네이버 서치어드바이저에서 받아
 * 환경변수로 넣는다(빌드 때 읽으므로 apphosting.yaml에서 BUILD에 열어 둔다).
 * 없으면 태그를 내지 않는다.
 */
const verification: Metadata["verification"] = {
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : {}),
  ...(process.env.NAVER_SITE_VERIFICATION
    ? { other: { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION } }
    : {}),
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_BRAND}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_BRAND,
  keywords: ["이재명", "이재명 업적", "이재명 대통령", "이재명 언행", "이재명 자서전", "이재명 공약", "잼통"],
  verification,
  alternates: {
    // 네이버 서치어드바이저와 피드 리더가 새 글을 찾는 자리.
    types: { "application/rss+xml": [{ url: "/rss.xml", title: SITE_NAME }] },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
  },
  // 카드가 작게 뜨면 숫자가 안 읽힌다. 큰 카드로 고정한다.
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`h-full antialiased ${plexMono.variable}`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-eggshell focus:font-semibold"
        >
          본문으로 건너뛰기
        </a>
        {/* 로그인 상태는 화면 전체가 본다 — 상단 바, MY, AI 안내가 모두 같은 사용자를 쓴다. */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

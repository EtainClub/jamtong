import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://jamtong.kr"),
  title: {
    default: "이재명 업적 위키",
    template: "%s · 이재명 업적 위키",
  },
  description: "읽는 위키가 아니라 이해하는 위키. 업적·사건·맥락·근거를 시각적으로 탐색합니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "이재명 업적 위키",
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
        {children}
      </body>
    </html>
  );
}

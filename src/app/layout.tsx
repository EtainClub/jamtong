import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.invalid"),
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-ink-800 text-text-primary">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-ice-500 focus:px-4 focus:py-2 focus:text-ink-900 focus:font-semibold"
        >
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
  );
}

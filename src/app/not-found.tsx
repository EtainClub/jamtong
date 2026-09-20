import Link from "next/link";
import type { Metadata } from "next";

import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";

export const metadata: Metadata = {
  title: "없는 주소",
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * 기본 화면은 영어 한 줄이고 나갈 길이 없다. 들어온 사람 대부분은 남이 건넨
 * 링크를 타고 온 사람이고, 그 링크가 낡았다는 것이지 찾던 것이 없다는 뜻은
 * 아니다. 그래서 어디로 갈 수 있는지를 적는다.
 *
 * 색인하지 않는다(follow는 둔다 — 아래 링크는 타고 가도 된다).
 */
const WAYS = [
  { href: "/explore", label: "업적", hint: "분야별로 모아 둔 곳" },
  { href: "/words", label: "언행", hint: "본인이 한 말과 자서전" },
  { href: "/wiki", label: "위키", hint: "업적과 언행을 가로지르는 글" },
  { href: "/timeline", label: "타임라인", hint: "같은 때에 무엇이 있었는지" },
];

export default function NotFound() {
  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-10">
        <p className="text-[12px] font-semibold text-ash">404</p>
        <h1 className="mt-2 text-2xl font-light tracking-[-0.02em] text-ink">
          이 주소에는 아무것도 없습니다
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-smoke">
          주소가 바뀌었거나, 아직 만들지 않은 화면입니다. 아래에서 찾으시던 것에
          가까운 곳으로 가실 수 있습니다.
        </p>

        <ul className="mt-6 space-y-2">
          {WAYS.map((way) => (
            <li key={way.href}>
              <Link
                href={way.href}
                className="block rounded-card border border-stone px-4 py-3 transition-colors hover:border-graphite"
              >
                <span className="text-[14px] font-bold text-ink">{way.label}</span>
                <span className="mt-0.5 block text-[12px] leading-relaxed text-smoke">
                  {way.hint}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[12px] leading-relaxed text-ash">
          있던 화면이 사라진 것 같으면{" "}
          <Link href="/feedback" className="font-semibold text-navy underline underline-offset-2">
            피드백
          </Link>
          으로 알려 주세요.
        </p>
      </main>

      <BottomNav />
    </>
  );
}

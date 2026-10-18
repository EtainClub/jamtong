import type { Metadata } from "next";
import Image from "next/image";

import { SISTER_APPS } from "@/content/apps";
import { hostOf } from "@/content/links";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";

export const metadata: Metadata = {
  title: "자매 앱",
  description: "잼통과 같은 곳에서 만드는 앱을 모았습니다. 임통, 통통, 이재명 뉴스, 잼통 신고 센터, 잼통 Voice.",
  alternates: { canonical: "/apps" },
};

/**
 * 자매 앱 모음.
 *
 * 앱마다 카드 한 장. 이미지가 무슨 앱인지 먼저 알리고, 소개 한 단락이
 * 무엇을 하는지 말하고, 카드 전체가 그 앱으로 가는 링크다. 버튼을 따로 두면
 * 휴대폰에서 누를 자리가 작아진다.
 */
export default function AppsPage() {
  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">자매 앱</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          잼통과 같은 곳에서 만드는 앱입니다. 잼통이 업적을 다룬다면, 이 앱들은 인물과
          보도, 정책 활용, 가짜 뉴스 대응, 시민 목소리 해설을 맡습니다.
        </p>

        <ul className="mt-7 space-y-4">
          {SISTER_APPS.map((app, i) => (
            <li key={app.id}>
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-card border border-stone bg-taupe transition-colors hover:border-graphite"
              >
                <div className="relative aspect-[1200/630] w-full bg-stone">
                  <Image
                    src={app.image}
                    alt={`${app.name} 소개 이미지`}
                    fill
                    sizes="(max-width: 560px) calc(100vw - 32px), 528px"
                    preload={i === 0}
                    className="object-cover"
                  />
                </div>
                <div className="px-4 py-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[17px] font-bold text-ink">{app.name}</span>
                    <span className="text-[12px] font-medium text-navy">{app.tagline}</span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-smoke">{app.description}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="tabular text-[11px] text-ash">{hostOf(app.url)}</span>
                    <span className="text-[12px] font-semibold text-navy">
                      열기 <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </main>

      <BottomNav />
    </>
  );
}

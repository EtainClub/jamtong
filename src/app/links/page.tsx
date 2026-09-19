import type { Metadata } from "next";

import { LINK_GROUPS, KIND_LABEL, KIND_NOTE, hostOf } from "@/content/links";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";

export const metadata: Metadata = {
  title: "관련 사이트",
  description: "이재명 대통령 관련 사이트를 성격별로 모았습니다.",
};

/**
 * 관련 사이트.
 *
 * 성격별로 묶고, 묶음마다 그 성격이 무엇을 뜻하는지 먼저 적는다. 본인 계정과
 * 커뮤니티를 한 줄에 늘어놓으면 읽는 사람이 둘을 같은 무게로 받는다.
 */
export default function LinksPage() {
  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">관련 사이트</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          이재명 대통령과 관련된 곳들을 성격별로 모았습니다. 잼통이 운영하지 않는
          사이트이며, 그곳의 내용에 대해서는 각 사이트가 책임집니다.
        </p>

        {LINK_GROUPS.map(({ kind, links }) => (
          <section key={kind} aria-labelledby={`grp-${kind}`} className="mt-9">
            <h2 id={`grp-${kind}`} className="text-[15px] font-bold text-ink">
              {KIND_LABEL[kind]}
            </h2>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ash">{KIND_NOTE[kind]}</p>

            <ul className="mt-3 space-y-2.5">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-card border border-stone bg-taupe px-4 py-3.5 transition-colors hover:border-graphite"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-[15px] font-semibold text-ink">{link.title}</span>
                      <span className="tabular text-[11px] text-ash">{hostOf(link.url)}</span>
                      <span aria-hidden="true" className="ml-auto text-[13px] text-ash">
                        ↗
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-smoke">
                      {link.description}
                    </p>
                    {link.note && (
                      <p className="mt-2 border-l-2 border-stone pl-3 text-[12px] leading-relaxed text-ash">
                        {link.note}
                      </p>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-10 border-l-2 border-stone pl-4 text-[12px] leading-relaxed text-ash">
          빠진 곳이 있거나 잘못된 링크가 있으면 알려 주세요. 다만 공식 채널이
          아닌 곳을 공식인 것처럼 적지는 않습니다.
        </p>
      </main>

      <BottomNav />
    </>
  );
}

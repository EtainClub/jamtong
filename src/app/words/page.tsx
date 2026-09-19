import Link from "next/link";
import type { Metadata } from "next";

import { STATEMENTS } from "@/content/words";
import { KIND_LABEL } from "@/content/words/schema";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";

export const metadata: Metadata = {
  title: "언행",
  description: "이재명 대통령이 직접 공개적으로 한 말과 행동을 원문 그대로 모읍니다.",
};

/**
 * 언행 목록.
 *
 * 업적과 나란히 두지 않고 따로 세운 이유: 업적은 남이 확인해 준 사실을 모아
 * 근거를 매다는 일이고, 여기는 본인이 한 말 그 자체다. 둘을 한 줄에 늘어놓으면
 * "대통령이 그렇게 말했다"와 "그 일이 그렇게 되었다"가 같은 무게로 읽힌다.
 */
export default function WordsPage() {
  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">
          이재명 대통령의 언행
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          본인이 직접, 공개적으로 한 말과 행동을 원문 그대로 모읍니다. 긴 글에는
          쉬운 말로 옮긴 것을 함께 둡니다.
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-ash">
          여기 실린 글은 고치지 않습니다. 띄어쓰기와 줄바꿈까지 올라온 그대로입니다.
        </p>

        <ul className="mt-8 space-y-3">
          {STATEMENTS.map((statement) => (
            <li key={statement.id}>
              <Link
                href={`/words/${statement.slug}`}
                className="block rounded-card border border-stone px-5 py-4 transition-colors hover:border-graphite"
              >
                <div className="flex items-center gap-2 text-[11px] font-semibold text-ash">
                  <span className="rounded-full bg-taupe px-2 py-0.5 text-navy">
                    {KIND_LABEL[statement.kind]}
                  </span>
                  <span>{statement.displayDate}</span>
                </div>

                <h2 className="mt-2 text-[17px] font-bold tracking-tight text-ink">
                  {statement.title}
                </h2>

                {/*
                  * 목록에는 원문의 앞머리를 보인다. 우리가 쓴 요약문을 앞세우면
                  * 목록을 훑는 사람은 우리 문장만 읽고 지나간다.
                  */}
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-smoke">
                  {statement.body.split("\n").filter(Boolean).slice(1).join(" ")}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-ash">
                  <span>{statement.channel}</span>
                  {statement.easy && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>쉽게 보기 있음</span>
                    </>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <BottomNav />
    </>
  );
}

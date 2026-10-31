import Link from "next/link";
import type { Metadata } from "next";

import { CHEERS } from "@/content/cheers";
import { STATEMENTS } from "@/content/words";
import { KIND_LABEL } from "@/content/words/schema";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { JsonLd, collectionPageLd } from "@/lib/seo/jsonld";
import { BooksPanel } from "@/features/books/BooksPanel";
import { CheerBoard } from "@/features/words/CheerBoard";
import { SpeechCard, speechVideoId } from "@/features/words/SpeechCard";
import { WordsTabs } from "@/features/words/WordsTabs";

export const metadata: Metadata = {
  title: "언행",
  description: "이재명 대통령이 직접 공개적으로 한 말과 행동을 원문 그대로 모읍니다.",
  alternates: { canonical: "/words" },
};

/**
 * 언행 목록.
 *
 * 업적과 나란히 두지 않고 따로 세운 이유: 업적은 남이 확인해 준 사실을 모아
 * 근거를 매다는 일이고, 여기는 본인이 한 말 그 자체다. 둘을 한 줄에 늘어놓으면
 * "대통령이 그렇게 말했다"와 "그 일이 그렇게 되었다"가 같은 무게로 읽힌다.
 *
 * 탭이 둘이지만 판단은 하나다. 왼쪽은 본인이 한 말, 오른쪽은 지지자들이 만든
 * 응원 영상이다. 같은 화면에 두되 섞지 않는다 — 섞는 순간 응원이 원문의
 * 권위를 빌려 쓰게 된다. 두 패널은 여기서 서버가 만들고, 탭은 어느 쪽을
 * 보일지만 고른다.
 */
export default function WordsPage() {
  return (
    <>
      <JsonLd
        data={collectionPageLd({
          path: "/words",
          name: "이재명 언행",
          description: "이재명 대통령이 직접 공개적으로 한 말과 행동을 원문 그대로 모읍니다.",
          items: STATEMENTS.map((s) => ({ name: s.title, path: `/words/${s.slug}` })),
        })}
      />
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">언행</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          이재명 대통령이 직접 한 말과 행동, 지지자들이 만들어 올린 응원 영상,
          그리고 본인이 쓴 책을 나누어 둡니다.
        </p>

        <WordsTabs words={<WordsPanel />} cheers={<CheerPanel />} books={<BooksPanel />} />
      </main>

      <BottomNav />
    </>
  );
}

/**
 * 대통령의 언행.
 *
 * 유튜브로 틀 수 있는 연설은 위에 따로 묶는다. 연설은 듣는 것이 본래 모습이라
 * 목록에서 바로 틀고 읽을 수 있게 둔다. 영상이 없는 연설은 글과 같은 줄에 남는다.
 */
function WordsPanel() {
  const speeches = STATEMENTS.flatMap((statement) => {
    const videoId = speechVideoId(statement);
    return videoId ? [{ statement, videoId }] : [];
  });
  const others = STATEMENTS.filter((statement) => !speechVideoId(statement));

  return (
    <>
      <p className="mt-6 text-[13px] leading-relaxed text-smoke">
        본인이 직접, 공개적으로 한 말과 행동을 모읍니다. 원문을 확인한 항목은 원문을 싣고,
        전문이 없는 연설은 영상 자료와 제공된 개요를 표시합니다.
      </p>

      {speeches.length > 0 && (
        <section aria-labelledby="speech-videos" className="mt-8">
          <h2 id="speech-videos" className="text-[13px] font-bold text-ink">
            연설 영상 <span className="font-normal text-ash">{speeches.length}</span>
          </h2>
          <ul className="mt-3 space-y-3">
            {speeches.map(({ statement, videoId }) => (
              <li key={statement.id}>
                <SpeechCard statement={statement} videoId={videoId} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <h2 className="mt-10 text-[13px] font-bold text-ink">
        글과 발언 <span className="font-normal text-ash">{others.length}</span>
      </h2>
      <ul className="mt-3 space-y-3">
        {others.map((statement) => (
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

              <h3 className="mt-2 text-[17px] font-bold tracking-tight text-ink">
                {statement.title}
              </h3>

              <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-smoke">
                {statement.body
                  ? statement.body.split("\n").filter(Boolean).slice(1).join(" ")
                  : statement.overview}
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-ash">
                <span>{statement.channel}</span>
                {statement.easy && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>쉽게 보기 있음</span>
                  </>
                )}
                {statement.media.length > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{statement.body ? "영상 자료 있음" : "영상 개요 · 영상 자료"}</span>
                  </>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * 지지자 응원.
 *
 * 영상에 붙는 "우리가 확인한 것이 아니다" 안내는 영상 칸 맨 위로 옮겼다
 * (CheerBoard의 VideoNotice). 한 줄과 영상을 두 칸으로 가르면서, 영상에만
 * 해당하는 말이 한 줄 칸 위에 서 있을 이유가 없어졌다.
 */
function CheerPanel() {
  return (
    <>
      <p className="mt-6 text-[13px] leading-relaxed text-smoke">
        지지자들이 남긴 응원입니다. 누구나 바로 쓰는 한 줄 응원과, 직접 만들어
        올린 응원 영상이 있습니다.
      </p>

      <CheerBoard seed={CHEERS} />
    </>
  );
}

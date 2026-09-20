import type { Metadata } from "next";

import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { AskWikiBox } from "@/features/wiki/AskWikiBox";
import { WikiNotes } from "@/features/wiki/WikiNotes";
import { allPages, getPage } from "@/lib/wiki/load";
import { renderWiki } from "@/lib/wiki/markdown";

export const metadata: Metadata = {
  title: "위키",
  description:
    "업적과 언행을 가로지르는 지식층. 에이전트가 쓰고 사람이 읽습니다. 모든 단정문에 원자료 앵커가 붙습니다.",
};

/**
 * 위키 카탈로그.
 *
 * `wiki/index.md`를 그대로 띄운다. 이 파일은 에이전트가 ingest할 때마다
 * 갱신하므로, 화면을 따로 관리하면 두 곳이 갈라진다.
 */
export default function WikiIndexPage() {
  const index = getPage("index");
  const titles = new Map(allPages().map((page) => [page.name, page.title]));
  const rendered = index ? renderWiki(index.body, titles) : null;

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10">
        <p className="mt-6 text-[11px] font-semibold tracking-[0.08em] text-ash">
          LLM WIKI
        </p>

        <AskWikiBox />

        <div className="mt-8">{rendered?.nodes}</div>
        {rendered && <WikiNotes notes={rendered.notes} />}
      </main>

      <BottomNav />
    </>
  );
}

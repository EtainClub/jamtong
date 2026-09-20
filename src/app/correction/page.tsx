import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { CorrectionForm } from "@/features/correction/CorrectionForm";

export const metadata: Metadata = {
  title: "정정·반론",
  description: "실린 내용이 사실과 다르거나 반론을 함께 실어야 한다면 여기로 알려 주세요.",
};

/**
 * 정정·반론 창구 (검토 문서 3장).
 *
 * ★ 피드백과 나란히 두되 섞지 않는다.
 *   피드백은 사이트에 바라는 것이고 공개가 기능이다. 이쪽은 실린 내용이
 *   틀렸다는 주장이라 운영자에게만 간다 — 공개 게시판에 두면 남을 두고
 *   쓰는 자리가 되고, 그 글 자체를 이 사이트가 싣게 된다.
 *
 * ★ 창구가 있다는 사실이 화면에 보여야 한다.
 *   접수함을 숨겨 두면 없는 것과 같다. 업적과 언행 화면 아래에서 이 주소로
 *   들어오고, 그때 어느 화면이었는지가 `?page=`로 따라온다.
 */
export default function CorrectionPage() {
  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">정정·반론</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          실린 내용이 사실과 다르면 고칩니다. 사실 관계를 다투기 어려운 자리라면
          반론을 함께 싣습니다. 어느 쪽이든 <strong className="font-semibold">근거를
          보고 판단</strong>하며, 고치지 않기로 하면 왜 그런지 남깁니다.
        </p>

        <ul className="mt-4 space-y-2 rounded-card border border-stone bg-taupe px-4 py-3 text-[12px] leading-relaxed text-ash">
          <li>· 접수한 것은 공개되지 않습니다. 운영자만 봅니다.</li>
          <li>· 고친 내용은 해당 화면에 반영되고, 바뀐 자리는 저장소 기록에 남습니다.</li>
          <li>· 이름 없이 접수됩니다. 회신을 받으시려면 연락처를 적어 주세요.</li>
        </ul>

        <Suspense fallback={null}>
          <CorrectionForm />
        </Suspense>

        <p className="mt-6 text-[12px] leading-relaxed text-ash">
          사이트가 불편하거나 있었으면 하는 것이 있다면{" "}
          <Link href="/feedback" className="font-semibold text-navy underline underline-offset-2">
            피드백
          </Link>
          으로 남겨 주세요. 그쪽은 남긴 것이 모두에게 보입니다.
        </p>
      </main>

      <BottomNav />
    </>
  );
}

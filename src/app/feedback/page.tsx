import type { Metadata } from "next";

import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { FeedbackBoard } from "@/features/feedback/FeedbackBoard";

export const metadata: Metadata = {
  title: "피드백",
  description: "잼통에 바라는 것을 남기고, 남들이 남긴 것을 함께 봅니다.",
  alternates: { canonical: "/feedback" },
};

/**
 * 피드백.
 *
 * 남긴 것을 모두가 본다. 건의함을 닫아 두면 같은 이야기가 계속 들어오고,
 * 보낸 사람은 자기 말이 닿았는지 알 수 없다. 열어 두면 "이미 있네" 하고
 * 나도요를 누르게 된다.
 */
export default function FeedbackPage() {
  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">피드백</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          잼통에 바라는 것을 남겨 주세요. 남긴 것은 모두에게 보입니다. 같은 생각이
          이미 있으면 새로 쓰는 대신 <strong className="font-semibold">나도요</strong>를
          눌러 주세요 — 그래야 같은 이야기가 쌓이지 않습니다.
        </p>

        {/*
          * 익명의 뜻을 좁게 적는다. "익명"이라고만 두면 아무것도 안 남는다고
          * 읽히는데, 제 글을 지우려면 누가 썼는지는 저장해야 한다.
          */}
        <p className="mt-3 rounded-card border border-stone bg-taupe px-4 py-3 text-[12px] leading-relaxed text-ash">
          이름 없이 올라갑니다. 화면에 누가 썼는지는 나오지 않습니다. 다만 본인이
          지울 수 있어야 하므로 계정 식별자는 저장되며, 이름이나 이메일은 담지
          않습니다. 개인정보나 남에 대한 이야기는 적지 말아 주세요. 그런 글은
          운영자가 지웁니다.
        </p>

        <FeedbackBoard />
      </main>

      <BottomNav />
    </>
  );
}

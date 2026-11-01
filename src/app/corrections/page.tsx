import Link from "next/link";
import type { Metadata } from "next";

import {
  CORRECTIONS,
  CORRECTIONS_SINCE,
  CORRECTION_KIND_LABEL,
  REPO_HISTORY_URL,
} from "@/content/corrections";
import { formatDate } from "@/content/labels";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";

export const metadata: Metadata = {
  title: "정정 기록",
  description: "잼통에 실린 내용을 고친 기록입니다. 무엇을, 언제, 왜 고쳤는지 공개합니다.",
  alternates: { canonical: "/corrections" },
};

/**
 * 정정 기록 — 고친 것을 모두 보이는 곳.
 *
 * 접수 창구(/correction)는 운영자에게만 가고, 이곳은 누구나 본다. 접수한
 * 사람이 아니어도 "이 사이트는 틀렸을 때 고치는가"를 확인할 수 있어야 한다.
 */
export default function CorrectionsPage() {
  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">정정 기록</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          실린 내용이 틀렸거나, 출처가 맞지 않았거나, 반론을 더 실어야 해서 고친 것을
          적습니다. 무엇을 언제 왜 고쳤는지 남깁니다.
        </p>

        <ul className="mt-4 space-y-1.5 rounded-card border border-stone bg-taupe px-4 py-3 text-[12px] leading-relaxed text-ash">
          <li>· {formatDate(CORRECTIONS_SINCE, "day")}부터 적습니다.</li>
          <li>
            · 그 전의 수정과 모든 변경은{" "}
            <a
              href={REPO_HISTORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-navy underline underline-offset-2"
            >
              공개 저장소 기록
            </a>
            에 남아 있습니다.
          </li>
          <li>· 새 업적을 더하거나 문장을 다듬은 것은 정정이 아니어서 여기 적지 않습니다.</li>
        </ul>

        {CORRECTIONS.length === 0 ? (
          <p className="mt-6 rounded-card border border-dashed border-stone px-4 py-6 text-center text-[13px] text-smoke">
            {formatDate(CORRECTIONS_SINCE, "day")} 이후 고친 것이 아직 없습니다.
          </p>
        ) : (
          <ol className="mt-6 space-y-3">
            {CORRECTIONS.map((c) => (
              <li key={c.id} id={c.id} className="rounded-card border border-stone bg-taupe px-4 py-3.5">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-full bg-pending-tint px-2 py-0.5 font-bold text-pending">
                    {CORRECTION_KIND_LABEL[c.kind]}
                  </span>
                  <span className="tabular text-ash">{formatDate(c.date, "day")}</span>
                  {c.reported && <span className="text-ash">· 정정 요청으로 고침</span>}
                </div>
                <p className="mt-2 text-[14px] font-semibold leading-snug text-ink">{c.summary}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-smoke">{c.reason}</p>
                <div className="mt-2.5 flex flex-wrap gap-3 text-[12px]">
                  <Link href={c.page} className="font-medium text-navy underline underline-offset-2">
                    고친 화면 보기
                  </Link>
                  {c.commit && (
                    <a
                      href={`https://github.com/EtainClub/jamtong/commit/${c.commit}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-navy underline underline-offset-2"
                    >
                      바뀐 줄 보기 ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-6 text-[12px] leading-relaxed text-ash">
          틀린 것을 보셨다면{" "}
          <Link href="/correction" className="font-semibold text-navy underline underline-offset-2">
            정정·반론을 요청
          </Link>
          해 주세요.
        </p>
      </main>

      <BottomNav />
    </>
  );
}

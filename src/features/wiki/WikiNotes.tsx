import Link from "next/link";

import type { ResolvedAnchor } from "@/lib/wiki/anchors";

/**
 * 각주 — 위키가 문장마다 단 앵커를 여기 모은다.
 *
 * 이 목록이 이 화면의 값어치다. 위키의 문장은 전부 raw source의 id를
 * 가리키고, 그 id가 여기서 실제 업적·언행·1차 자료로 이어진다. 읽는 사람이
 * 위키를 믿을 필요가 없다.
 */
export function WikiNotes({ notes }: { notes: ResolvedAnchor[] }) {
  if (notes.length === 0) return null;

  return (
    <section aria-labelledby="notes" className="mt-10 border-t border-stone pt-6">
      <h2 id="notes" className="text-[13px] font-bold text-ink">
        근거 {notes.length}
      </h2>
      <p className="mt-1.5 text-[12px] leading-relaxed text-ash">
        위키의 모든 단정문에는 원자료를 가리키는 앵커가 붙습니다. 앵커를 달 수 없는
        문장은 위키에 들어오지 못합니다.
      </p>

      <ol className="mt-4 space-y-2">
        {notes.map((note, n) => (
          <li
            key={note.raw}
            id={`note-${n + 1}`}
            className="flex gap-2 scroll-mt-20 text-[12px] leading-relaxed"
          >
            <span className="w-4 shrink-0 text-right font-semibold text-ash">{n + 1}</span>
            <span className="min-w-0">
              <span className="mr-1.5 rounded-full bg-taupe px-1.5 py-0.5 text-[10px] font-semibold text-navy">
                {note.kind}
              </span>
              {note.href ? (
                note.external ? (
                  <a
                    href={note.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-navy hover:underline"
                  >
                    {note.label} ↗
                  </a>
                ) : (
                  <Link href={note.href} className="text-navy hover:underline">
                    {note.label}
                  </Link>
                )
              ) : (
                <span className="text-smoke">{note.label}</span>
              )}
              {note.detail && <span className="ml-1 text-ash">· {note.detail}</span>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

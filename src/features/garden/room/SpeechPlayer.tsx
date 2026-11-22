"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { quietGardenMusic } from "../feedback";
import { speechEmbed, speechOriginal, type SpeechVideo } from "./speeches";

/**
 * 연설 상영관 — 언행에 실린 연설 영상을 골라 원본 플레이어로 본다. 가구를 누른 뒤에만 마운트한다.
 * 목록은 처음 열 때 한 번 받는다(app/garden/speeches.json).
 */
let loading: Promise<SpeechVideo[]> | null = null;
function loadSpeeches(): Promise<SpeechVideo[]> {
  loading ??= fetch("/garden/speeches.json")
    .then((r) => (r.ok ? (r.json() as Promise<SpeechVideo[]>) : Promise.reject(new Error(String(r.status)))))
    .catch((error) => {
      loading = null;
      throw error;
    });
  return loading;
}

export function SpeechPlayer() {
  /** undefined=받는 중, null=받지 못했다. */
  const [list, setList] = useState<SpeechVideo[] | null | undefined>(undefined);
  const [pick, setPick] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let alive = true;
    loadSpeeches()
      .then((x) => alive && setList(x))
      .catch((error) => {
        console.error("[garden] 연설 영상 목록을 받지 못했다", error);
        if (alive) setList(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const restore = quietGardenMusic();
    const hide = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", hide);
    return () => { restore(); document.removeEventListener("visibilitychange", hide); };
  }, [playing]);

  if (list === undefined) return <p className="mt-3 text-[13px] text-smoke">연설 목록을 불러오는 중…</p>;
  if (list === null) return <p className="mt-3 text-[13px] text-smoke">연설 목록을 불러오지 못했어요. 잠시 뒤 다시 열어 주세요.</p>;
  if (list.length === 0) return <p className="mt-3 text-[13px] text-smoke">아직 언행에 실린 연설 영상이 없어요.</p>;

  const current = list.find((s) => s.video === pick) ?? list[0];
  return (
    <section className="mt-3" aria-label="연설 영상 보기">
      <div className="aspect-video overflow-hidden rounded-xl border border-[var(--d-line)] bg-black">
        {playing ? (
          <iframe key={current.video} className="h-full w-full" title={current.mediaTitle} src={speechEmbed(current.video)} allow="autoplay; encrypted-media; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        ) : (
          <button type="button" className="flex h-full w-full flex-col items-center justify-center gap-1 px-4 text-center text-white" onClick={() => setPlaying(true)}>
            <span className="text-[28px]" aria-hidden>▶</span>
            <span className="text-[13px] leading-snug">{current.title}</span>
          </button>
        )}
      </div>
      <p className="mt-2 text-[13px] font-semibold leading-snug">{current.title}</p>
      <p className="text-[12px] text-smoke">{current.displayDate}{current.credit ? ` · 영상 ${current.credit}` : ""}</p>
      <div className="mt-1 flex flex-wrap gap-x-4">
        <Link className="inline-block min-h-[44px] py-3 underline" href={`/words/${current.slug}`}>언행 원문·쉽게 보기 →</Link>
        <a className="inline-block min-h-[44px] py-3 underline" href={speechOriginal(current.video)} target="_blank" rel="noopener noreferrer">유튜브 원본 ↗</a>
      </div>
      <ul className="mt-1 max-h-60 space-y-1.5 overflow-y-auto" aria-label="연설 고르기">
        {list.map((s) => (
          <li key={s.video}>
            <button
              type="button"
              className="w-full rounded-xl border border-[var(--d-line)] px-3 py-2 text-left text-[12.5px] leading-snug aria-pressed:bg-[var(--g-panel)] aria-pressed:font-semibold"
              aria-pressed={s.video === current.video}
              onClick={() => { setPick(s.video); setPlaying(true); }}
            >
              {s.title}
              <span className="mt-0.5 block text-[11.5px] font-normal text-smoke">{s.displayDate}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11.5px] text-smoke">언행에 실린 영상을 유튜브 원본 그대로 틀어요. 재생하는 동안 방 배경음악은 줄어들어요.</p>
    </section>
  );
}

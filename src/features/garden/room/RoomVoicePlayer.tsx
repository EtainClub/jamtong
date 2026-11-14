"use client";

import { useEffect, useState } from "react";
import { quietGardenMusic } from "../feedback";
import { VOICE_CLIPS, VOICE_CONTEXT, VOICE_SOURCE, voiceEmbed, voiceOriginal, type VoiceClipId } from "./activities";

/** 소품을 누른 뒤에만 마운트. 화면을 숨기거나 시트를 닫으면 플레이어도 없어진다. */
export function RoomVoicePlayer({ clips }: { clips: readonly VoiceClipId[] }) {
  const [clip, setClip] = useState(clips[0]);
  const [playing, setPlaying] = useState(true);
  const [take, setTake] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const restore = quietGardenMusic();
    const hide = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", hide);
    return () => { restore(); document.removeEventListener("visibilitychange", hide); };
  }, [playing]);
  const current = VOICE_CLIPS[clip];
  return (
    <section className="mt-3" aria-label="실제 목소리 듣기">
      <p className="text-[12px] leading-relaxed text-smoke">{VOICE_CONTEXT}</p>
      <div className="my-2 flex flex-wrap gap-2" role="group" aria-label="음성짤 고르기">
        {clips.map((id) => <button key={id} type="button" className="garden-chip-btn" aria-pressed={id === clip} onClick={() => { setClip(id); setTake((n) => n+1); setPlaying(true); }}>{VOICE_CLIPS[id].title} · {VOICE_CLIPS[id].end-VOICE_CLIPS[id].start}초</button>)}
      </div>
      <div className="aspect-video overflow-hidden rounded-xl border border-[var(--d-line)] bg-black">
        {playing ? <iframe key={`${clip}-${take}`} className="h-full w-full" title={`실제 목소리: ${current.title} (2022년 영상)`} src={voiceEmbed(clip)} allow="autoplay; encrypted-media; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <div className="flex h-full items-center justify-center text-white">재생을 멈췄어요.</div>}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="garden-diary-btn" onClick={() => { setTake((n) => n+1); setPlaying(true); }}>▶ {playing ? "처음부터 다시 듣기" : "재생"}</button>
        <button type="button" className="garden-diary-btn" disabled={!playing} onClick={() => setPlaying(false)}>■ 정지</button>
      </div>
      <p className="mt-2 text-[11.5px] text-smoke">소리가 안 나면 영상의 재생 버튼을 눌러 주세요. 재생하는 동안 방 배경음악은 줄어들어요.</p>
      <div className="mt-1 flex flex-wrap gap-x-4">
        <a className="inline-block min-h-[44px] py-3 underline" href={voiceOriginal(clip)} target="_blank" rel="noopener noreferrer">원본 영상 · 재밍 ↗</a>
        <a className="inline-block min-h-[44px] py-3 underline" href={VOICE_SOURCE} target="_blank" rel="noopener noreferrer">당시 영상 소개 기사 ↗</a>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { keyAudio, quietGardenMusic } from "../feedback";
import { PIANO_DEFAULT, PIANO_MIN, PIANO_MAX, PIANO_DURATION, PIANO_EVENT_MAX, pianoNoteLabel, pianoNotes, pianoSong, type PianoEvent } from "./piano";
import { PianoAudio } from "./pianoSound";

type Phase = "idle" | "recording" | "playing";

export function PianoPlayer({ notes, song, onChange, onSave, preview = false }: {
  notes: number[];
  song: PianoEvent[];
  onChange?: (notes: number[]) => void;
  onSave?: (song: PianoEvent[]) => boolean;
  preview?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [down, setDown] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const run = useRef<{ phase: Phase; start: number; events: PianoEvent[] }>({ phase: "idle", start: 0, events: [] });
  const audio = useRef<PianoAudio | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const end = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flash = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canCompose = Boolean(onSave);

  const clear = () => {
    if (tick.current) clearInterval(tick.current);
    if (end.current) clearTimeout(end.current);
    tick.current = null;
    end.current = null;
    audio.current?.stop();
    audio.current = null;
    run.current.phase = "idle";
  };
  const stop = () => {
    const recording = run.current.phase === "recording";
    clear();
    setPhase("idle");
    setElapsed(0);
    setDown(null);
    setMessage(recording ? "연주를 취소했어요. 이전 곡은 그대로예요." : "재생을 멈췄어요.");
  };
  const clock = () => {
    tick.current = setInterval(() => setElapsed(Math.min(PIANO_DURATION, performance.now() - run.current.start)), 50);
  };
  const record = () => {
    if (!onSave) return;
    clear();
    audio.current = new PianoAudio();
    run.current = { phase: "recording", start: performance.now(), events: [] };
    setPhase("recording");
    setElapsed(0);
    setMessage("지금부터 15초! 건반을 눌러 곡을 만들어 보세요.");
    clock();
    end.current = setTimeout(() => {
      const take = pianoSong(run.current.events);
      clear();
      setPhase("idle");
      setElapsed(PIANO_DURATION);
      if (!take.length) { setMessage("누른 건반이 없어 저장하지 않았어요. 다시 연주해 보세요."); return; }
      setMessage(onSave(take) ? (preview ? "체험 곡이 완성됐어요. 재생해 보세요." : "15초 연주를 저장했어요. 방문자가 피아노를 누르면 이 곡을 들어요.") : "저장하지 못했어요. 피아노가 방에 놓여 있는지 확인해 주세요.");
    }, PIANO_DURATION);
  };
  const play = () => {
    const saved = pianoSong(song);
    if (!saved.length) return;
    clear();
    audio.current = new PianoAudio();
    if (!audio.current.play(saved)) { setMessage("소리를 재생할 수 없어요. 다시 재생을 눌러 주세요."); return; }
    run.current = { phase: "playing", start: performance.now(), events: [] };
    setPhase("playing");
    setElapsed(0);
    setMessage("방 주인이 만든 15초 연주를 듣고 있어요.");
    clock();
    end.current = setTimeout(() => { clear(); setPhase("idle"); setElapsed(PIANO_DURATION); setMessage("연주가 끝났어요. 다시 들을 수 있어요."); }, PIANO_DURATION);
  };
  const press = (i: number) => {
    if (!canCompose || run.current.phase === "playing") return;
    if (run.current.phase === "recording") {
      const t = Math.floor(performance.now() - run.current.start);
      if (t >= PIANO_DURATION || run.current.events.length >= PIANO_EVENT_MAX) return;
      run.current.events.push({ t, n: notes[i] });
    }
    audio.current ??= new PianoAudio();
    audio.current.note(notes[i]);
    setDown(i);
    if (flash.current) clearTimeout(flash.current);
    flash.current = setTimeout(() => setDown(null), 140);
  };
  const actions = useRef({ press, stop, play });
  useEffect(() => { actions.current = { press, stop, play }; });
  useEffect(() => {
    const releaseMusic = quietGardenMusic();
    const key = (e: KeyboardEvent) => {
      if (!canCompose || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if ((e.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable=true]")) return;
      const i = "asdfghjk".indexOf(e.key.toLowerCase());
      if (i < 0) return;
      e.preventDefault();
      actions.current.press(i);
    };
    const hidden = () => { if (document.hidden) actions.current.stop(); };
    window.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", hidden);
    // 방문자는 방의 피아노를 누른 직후 저장된 곡을 한 번 듣는다.
    const autoplay = !canCompose ? setTimeout(() => { if (!document.hidden) actions.current.play(); }, 0) : null;
    return () => {
      if (autoplay) clearTimeout(autoplay);
      if (tick.current) clearInterval(tick.current);
      if (end.current) clearTimeout(end.current);
      if (flash.current) clearTimeout(flash.current);
      audio.current?.stop();
      releaseMusic();
      window.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [canCompose]);

  return <div className="mt-3">
    <p className="text-[13px] text-smoke">{canCompose ? "15초 동안 건반을 눌러 나만의 곡을 남겨 보세요. 방문자가 피아노를 누르면 저장한 곡이 재생돼요." : song.length ? "방 주인이 직접 만든 15초 피아노 연주예요." : "아직 방 주인이 저장한 연주가 없어요."}</p>
    <div className="mt-3 flex flex-wrap gap-2">
      {canCompose && phase !== "recording" && <button type="button" className="garden-diary-btn" onClick={record}>{song.length ? "새로 15초 연주하기" : "15초 연주 시작"}</button>}
      {phase === "idle" && <button type="button" disabled={!song.length} className="garden-diary-btn disabled:opacity-40" onClick={play}>▶ 저장한 곡 듣기</button>}
      {phase !== "idle" && <button type="button" className="garden-diary-btn" onClick={stop}>{phase === "recording" ? "연주 취소" : "■ 재생 정지"}</button>}
    </div>
    {phase !== "idle" && <div className="mt-3"><p className="text-[13px] font-semibold">{phase === "recording" ? "● 연주 기록 중" : "♪ 재생 중"} · {(elapsed / 1000).toFixed(1)} / 15초</p><progress aria-label={phase === "recording" ? "연주 시간" : "재생 시간"} className="mt-1 w-full" max={PIANO_DURATION} value={elapsed} /></div>}
    <p role="status" className="mt-2 min-h-[20px] text-[12px] text-smoke">{message}</p>
    {canCompose && <>
      <p className="mt-3 text-[12px] text-smoke">화면 건반 또는 A S D F G H J K로 연주해요. 시작 전에는 자유롭게 연습할 수 있어요.</p>
      <div className="mt-3 flex gap-1 rounded-xl bg-[#292725] p-2" role="group" aria-label="피아노 건반">
        {notes.map((note, i) => <button key={i} type="button" disabled={phase === "playing"} aria-label={`${i + 1}번 건반 ${pianoNoteLabel(note)}`} className={`min-h-[112px] min-w-0 flex-1 rounded-b-lg border-b-4 px-0.5 pt-14 text-[11px] font-bold text-[#292725] ${down === i ? "border-[#c28a35] bg-[#ffe7aa]" : "border-[#c9c2b6] bg-[#fffdf5] active:bg-[#ffe7aa]"}`} onPointerDown={(e) => { if (e.button === 0) { e.preventDefault(); press(i); } }} onPointerUp={() => keyAudio()} onClick={(e) => { if (e.detail === 0) press(i); }}>{pianoNoteLabel(note)}<span className="block text-[10px] opacity-60">{"ASDFGHJK"[i]}</span></button>)}
      </div>
      {onChange && <fieldset className="mt-4" disabled={phase !== "idle"}>
        <legend className="text-[13px] font-semibold">연주할 건반의 음</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">{notes.map((note, i) => <label key={i} className="text-[12px]">{i + 1}번 건반<select aria-label={`${i + 1}번 건반 음`} value={note} className="ml-2 min-h-[44px] rounded-lg border border-stone bg-paper p-2" onChange={(e) => onChange(notes.map((n, at) => at === i ? Number(e.target.value) : n))}>{Array.from({ length: PIANO_MAX - PIANO_MIN + 1 }, (_, n) => n + PIANO_MIN).map((n) => <option key={n} value={n}>{pianoNoteLabel(n)}</option>)}</select></label>)}</div>
        <button type="button" className="garden-diary-btn mt-2" onClick={() => onChange([...PIANO_DEFAULT])}>기본 음으로 되돌리기</button>
      </fieldset>}
    </>}
  </div>;
}

export function PianoPreview() {
  const [notes, setNotes] = useState(pianoNotes(undefined));
  const [song, setSong] = useState<PianoEvent[]>([]);
  return <PianoPlayer notes={notes} song={song} onChange={setNotes} onSave={(take) => { setSong(take); return true; }} preview />;
}

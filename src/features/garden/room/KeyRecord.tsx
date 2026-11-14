"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { deleteKeyRec, uploadKeyRec } from "@/lib/firebase/roomKeys";

import { gardenFeedback } from "../feedback";
import { useGarden } from "../store";
import { KEY_REC_MAX_BYTES, nextVer, REC } from "./keyboard";
import { KeyRecorder, RECORD_ERROR_TEXT, recordErrorOf } from "./recorder";
import { applyVoice, DEFAULT_VOICE, encodeWav, MAX_RECORD_SECONDS, VOICE_MODES, type Take, type VoiceMode } from "./voice";

/**
 * 키에 목소리를 녹음한다(docs/garden-miniroom.md §4.5).
 *
 * ★ 처음 녹음하기 전에 두 문장으로 알린다: 올라가고, 방에 오는 누구나 듣는다. 이름·학교·연락처는 말하지 않기.
 * ★ 기본은 🤖 로봇. 고른 목소리로 이 기기에서 바꾼 뒤 그 소리만 올린다 — 원래 녹음은 메모리에서 버려진다(voice.ts).
 *   🙂 원래 목소리는 따로 확인을 받아야 올라간다.
 * ★ 1.5초, 16kHz 모노 WAV. 들어 보는 소리가 곧 올라가는 소리다(같은 Blob).
 * ★ 방을 연 사람만 녹음한다. 녹음은 손님이 듣는 소리다 — 방을 열지 않으면 들을 사람이 없다.
 */

const NOTICE_KEY = "jamtong-key-rec-notice";

type Phase = "notice" | "idle" | "opening" | "count" | "rec" | "review" | "upload";

function noticeSeen(): boolean {
  try {
    return localStorage.getItem(NOTICE_KEY) === "1";
  } catch {
    return false;
  }
}

function markNotice() {
  try {
    localStorage.setItem(NOTICE_KEY, "1");
  } catch {
    // 비공개 창. 다음에 또 알린다.
  }
}

export function KeyRecord({
  slot,
  uid,
  shareOn,
  say,
  onUploaded,
}: {
  slot: number;
  uid: string | null;
  /** 방을 열었는가. */
  shareOn: boolean;
  say: (text: string) => void;
  onUploaded: () => void;
}) {
  const [phase, setPhase] = useState<Phase>(() => (noticeSeen() ? "idle" : "notice"));
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(3);
  const [level, setLevel] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [take, setTake] = useState<Take | null>(null);
  const [mode, setMode] = useState<VoiceMode>(DEFAULT_VOICE);
  const [originalOk, setOriginalOk] = useState(false);
  const recorder = useRef<KeyRecorder | null>(null);
  const levelRef = useRef(0);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const preview = useRef<HTMLAudioElement | null>(null);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  useEffect(
    () => () => {
      clearTimers();
      recorder.current?.close();
      preview.current?.pause();
    },
    [],
  );

  // 들어 보는 소리 = 올라가는 소리. 목소리를 바꿀 때마다 이 기기에서 다시 만든다.
  const wav = useMemo(() => (take ? encodeWav(applyVoice(take.raw, mode)) : null), [take, mode]);
  const wavUrl = useMemo(() => (wav ? URL.createObjectURL(wav) : null), [wav]);
  useEffect(() => () => {
    if (wavUrl) URL.revokeObjectURL(wavUrl);
  }, [wavUrl]);

  if (!shareOn) {
    return (
      <p className="garden-key-note mt-2">
        방을 열면 목소리를 녹음할 수 있어요. 녹음은 내 방에 온 손님이 듣는 소리라서, 방을 열지 않으면 들을 사람이 없어요.
      </p>
    );
  }

  const stop = () => {
    clearTimers();
    const r = recorder.current;
    if (!r) return;
    recorder.current = null;
    const got = r.finish();
    if (!got || got.raw.length === 0) {
      setError("소리가 들어오지 않았어요. 마이크 가까이에서 다시 해 보세요.");
      setPhase("idle");
      return;
    }
    setTake(got);
    setOriginalOk(false);
    setPhase("review");
  };

  const start = async () => {
    setError(null);
    setTake(null);
    setPhase("opening");
    const r = new KeyRecorder({
      onLevel: (v) => {
        levelRef.current = v;
      },
      onAutoStop: () => timers.current.push(setTimeout(stop, 0)),
    });
    recorder.current = r;
    try {
      await r.open();
    } catch (e) {
      recorder.current = null;
      setError(RECORD_ERROR_TEXT[recordErrorOf(e)]);
      setPhase("idle");
      return;
    }
    // 소리 크기 막대: 조각마다 오는 값을 60ms마다 화면에.
    const tick = () => {
      setLevel(levelRef.current);
      timers.current.push(setTimeout(tick, 60));
    };
    tick();
    // 3·2·1 뒤에 1.5초.
    setPhase("count");
    [3, 2, 1].forEach((n, i) => timers.current.push(setTimeout(() => setCount(n), i * 450)));
    timers.current.push(
      setTimeout(() => {
        r.begin();
        setPhase("rec");
        const t0 = performance.now();
        const run = () => {
          const e = (performance.now() - t0) / 1000;
          setElapsed(Math.min(e, MAX_RECORD_SECONDS));
          if (e < MAX_RECORD_SECONDS + 0.3) timers.current.push(setTimeout(run, 50));
          else stop(); // 스스로 멈추지 않았으면(조각이 늦게 오는 기기) 여기서.
        };
        run();
      }, 3 * 450),
    );
  };

  const upload = async () => {
    const stored = useGarden.getState().data?.room.keys[slot];
    if (!uid || !stored || !wav) return say("잠시 뒤 다시 해 보세요");
    if (mode === "original" && !originalOk) return;
    if (wav.size >= KEY_REC_MAX_BYTES) return say("녹음이 너무 커요. 다시 녹음해 주세요");
    setPhase("upload");
    const ver = nextVer(stored);
    try {
      await uploadKeyRec(uid, slot, ver, wav);
    } catch (e) {
      console.error("[keyboard] 녹음을 올리지 못했다", e);
      say("녹음을 올리지 못했어요. 잠시 뒤 다시 해 보세요");
      setPhase("review");
      return;
    }
    const now = useGarden.getState().data?.room.keys[slot] ?? stored;
    useGarden.getState().setKey(slot, { ...now, sound: REC, ver });
    // 옛 판은 올리기가 끝난 뒤에 지운다. 못 지우면 어디에도 묶이지 않은 파일이 남는다(배포 메모의 "남은 녹음 치우기").
    if (now.sound === REC && now.ver > 0 && now.ver !== ver) {
      deleteKeyRec(uid, slot, now.ver).catch((e) => console.error("[keyboard] 옛 녹음을 지우지 못했다", e));
    }
    track("key_record", { mode });
    gardenFeedback("reward");
    say(`🎙 ${slot + 1}번 키에 ${VOICE_MODES.find((m) => m.id === mode)?.label ?? ""} 소리를 올렸어요`);
    setTake(null);
    setPhase("idle");
    onUploaded();
  };

  if (phase === "notice") {
    return (
      <div className="garden-key-note mt-2">
        <p className="font-bold">🎙 녹음하기 전에</p>
        <p className="mt-1">녹음한 소리는 인터넷에 올라가고, 내 방에 오는 사람은 누구나 들을 수 있어요. 이름·학교·전화번호 같은 건 말하지 마세요.</p>
        <button
          type="button"
          className="garden-diary-btn mt-2 min-h-[44px]"
          onClick={() => {
            markNotice();
            setPhase("idle");
          }}
        >
          알겠어요
        </button>
      </div>
    );
  }

  const meter = (
    <div className="garden-meter mt-2" aria-hidden="true">
      <span style={{ width: `${Math.round(level * 100)}%` }} />
    </div>
  );

  return (
    <div className="garden-key-rec mt-2">
      <p className="text-[12px] leading-relaxed text-smoke">
        1.5초까지 녹음해요. 내 방에 오는 누구나 들어요 — 이름·학교·연락처는 말하지 마세요.
      </p>

      {(phase === "idle" || phase === "opening") && (
        <button type="button" className="garden-rec-btn mt-2" disabled={phase === "opening"} onClick={() => void start()}>
          {phase === "opening" ? "마이크를 여는 중…" : "🔴 녹음하기"}
        </button>
      )}
      {error && (
        <p className="mt-2 text-[12.5px] font-bold text-[#b0412f]" role="alert">
          {error}
        </p>
      )}

      {phase === "count" && (
        <div className="mt-2 text-center" role="status">
          <p className="text-[28px] font-black text-[var(--d-orange)]">{count}</p>
          <p className="text-[12px] text-smoke">곧 녹음해요</p>
          {meter}
        </div>
      )}

      {phase === "rec" && (
        <div className="mt-2" role="status">
          <p className="text-[13px] font-bold text-[#b0412f]">● 녹음 중 · {Math.max(0, MAX_RECORD_SECONDS - elapsed).toFixed(1)}초</p>
          <div className="garden-meter is-time mt-1" aria-hidden="true">
            <span style={{ width: `${(elapsed / MAX_RECORD_SECONDS) * 100}%` }} />
          </div>
          {meter}
          <button type="button" className="garden-diary-btn is-quiet mt-2 min-h-[44px]" onClick={stop}>
            ■ 멈추기
          </button>
        </div>
      )}

      {(phase === "review" || phase === "upload") && take && (
        <div className="mt-2">
          {take.tooQuiet && <p className="text-[12.5px] font-bold text-[#b0412f]">소리가 작아요. 다시 녹음해 볼까요?</p>}
          <p className="mt-1 text-[13px] font-bold">어떤 목소리로 올릴까요?</p>
          <div className="garden-voice-modes mt-1.5" role="radiogroup" aria-label="목소리 고르기">
            {VOICE_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={mode === m.id}
                className="garden-sound-btn"
                onClick={() => {
                  setMode(m.id);
                  setOriginalOk(false);
                }}
              >
                <span aria-hidden="true" className="text-[20px] leading-none">{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
          {mode === "original" ? (
            <label className="garden-key-note mt-2 flex items-start gap-2">
              <input type="checkbox" className="garden-switch mt-0.5" checked={originalOk} onChange={(e) => setOriginalOk(e.target.checked)} />
              <span>원래 목소리가 그대로 올라가고, 방을 공개하면 누구나 들을 수 있어요. 알고 올릴게요.</span>
            </label>
          ) : (
            <p className="mt-2 text-[12px] leading-relaxed text-smoke">
              바꾼 목소리만 올라가요. 원래 녹음은 이 기기에서 버려지고 올라가지 않아요. 바꾼 목소리도 아는 사람은 알아챌 수 있어요.
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="garden-diary-btn is-quiet min-h-[44px]"
              disabled={!wavUrl}
              onClick={() => {
                if (!wavUrl) return;
                preview.current?.pause();
                const el = new Audio(wavUrl);
                preview.current = el;
                void el.play().catch(() => say("들려주지 못했어요"));
              }}
            >
              ▶ 들어 보기
            </button>
            <button type="button" className="garden-diary-btn is-quiet min-h-[44px]" disabled={phase === "upload"} onClick={() => void start()}>
              ↺ 다시 녹음
            </button>
            <button
              type="button"
              className="garden-diary-btn min-h-[44px]"
              disabled={phase === "upload" || (mode === "original" && !originalOk)}
              onClick={() => void upload()}
            >
              {phase === "upload" ? "올리는 중…" : "⬆ 이 소리로 올리기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

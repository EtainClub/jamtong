"use client";

import { holdMicSession, keyAudio } from "../feedback";
import { finishRecording, MAX_RECORD_SECONDS, type Take } from "./voice";

/**
 * 키 녹음 — getUserMedia → AudioWorklet(없으면 ScriptProcessor) → Float32 조각을 모은다.
 * keycap-creator(같은 만든이의 다른 앱)의 audio-engine/recorder.ts를 옮겨 고쳤다.
 *
 * ★ 1.5초가 차면 스스로 멈춘다. 다 모으면 마이크를 곧바로 끈다(기기의 마이크 표시가 꺼져야 믿는다).
 * ★ 정원의 AudioContext 하나를 같이 쓴다(iOS는 여럿을 두면 소리가 엉킨다). 녹음하는 동안만 오디오 세션을 녹음용으로.
 * ★ 원래 녹음은 이 객체와 그것을 받은 화면의 메모리에만 있다. 어디에도 보내지 않는다.
 */

const PROCESSOR = "jamtong-key-recorder";

const WORKLET_SOURCE = `
class JamtongKeyRecorder extends AudioWorkletProcessor {
  constructor() {
    super();
    this.active = true;
    this.port.onmessage = (e) => { if (e.data === "stop") this.active = false; };
  }
  process(inputs) {
    if (!this.active) return false;
    const input = inputs[0];
    // 한 번에 128칸씩 오는 버퍼는 다시 쓰이므로 복사해서 보낸다.
    if (input && input[0]) this.port.postMessage(new Float32Array(input[0]));
    return true;
  }
}
registerProcessor(${JSON.stringify(PROCESSOR)}, JamtongKeyRecorder);
`;

let workletUrl: string | null = null;
const workletLoaded = new WeakSet<AudioContext>();

/** 마이크를 열지 못한 까닭. 화면이 사람의 말로 바꾼다(RECORD_ERROR_TEXT). */
export type RecordError = "unsupported" | "denied" | "no-mic" | "busy" | "failed";

export const RECORD_ERROR_TEXT: Record<RecordError, string> = {
  unsupported: "이 브라우저에서는 녹음할 수 없어요. 최신 Safari·Chrome에서 해 보세요.",
  denied: "마이크를 쓰지 못하게 되어 있어요. 브라우저(또는 휴대폰 설정)에서 이 사이트의 마이크를 허용한 뒤 다시 눌러 주세요.",
  "no-mic": "마이크를 찾지 못했어요.",
  busy: "다른 앱이 마이크를 쓰고 있어요. 그 앱을 닫고 다시 해 보세요.",
  failed: "녹음을 시작하지 못했어요. 잠시 뒤 다시 해 보세요.",
};

export function recordErrorOf(error: unknown): RecordError {
  const name = (error as { name?: string })?.name;
  if (name === "NotAllowedError" || name === "SecurityError") return "denied";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "no-mic";
  if (name === "NotReadableError" || name === "AbortError") return "busy";
  if ((error as Error)?.message === "unsupported") return "unsupported";
  return "failed";
}

export class KeyRecorder {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private node: AudioWorkletNode | ScriptProcessorNode | null = null;
  private sink: GainNode | null = null;
  private chunks: Float32Array[] = [];
  private collected = 0;
  private recording = false;
  private held = false;

  constructor(private events: { onLevel?: (level: number) => void; onAutoStop?: () => void } = {}) {}

  /** 마이크를 연다. 사용자 터치 안에서 부른다. 실패하면 RecordError를 담은 Error를 던진다. */
  async open(): Promise<void> {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof window === "undefined" || !window.isSecureContext) {
      throw new Error("unsupported");
    }
    holdMicSession(true);
    this.held = true;
    const audio = keyAudio();
    if (!audio) {
      this.close();
      throw new Error("unsupported");
    }
    const ctx = audio.ctx;
    this.ctx = ctx;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: false, noiseSuppression: true, autoGainControl: true },
      });
      if (ctx.state !== "running") await ctx.resume().catch(() => {});
      this.source = ctx.createMediaStreamSource(this.stream);
      if (ctx.audioWorklet && typeof AudioWorkletNode !== "undefined") {
        try {
          if (!workletLoaded.has(ctx)) {
            workletUrl ??= URL.createObjectURL(new Blob([WORKLET_SOURCE], { type: "application/javascript" }));
            await ctx.audioWorklet.addModule(workletUrl);
            workletLoaded.add(ctx);
          }
          const node = new AudioWorkletNode(ctx, PROCESSOR, { numberOfInputs: 1, numberOfOutputs: 0, channelCount: 1 });
          node.port.onmessage = (e: MessageEvent<Float32Array>) => this.collect(e.data);
          this.node = node;
        } catch (error) {
          console.warn("[keyboard] AudioWorklet을 쓰지 못해 옛 길로 녹음한다", error);
        }
      }
      if (!this.node) {
        // 옛 길: ScriptProcessor는 출력이 어딘가에 이어져야 돈다. 소리는 0으로 줄여 내보낸다.
        const sp = ctx.createScriptProcessor(2048, 1, 1);
        sp.onaudioprocess = (e) => this.collect(new Float32Array(e.inputBuffer.getChannelData(0)));
        this.sink = ctx.createGain();
        this.sink.gain.value = 0;
        sp.connect(this.sink).connect(ctx.destination);
        this.node = sp;
      }
      this.source.connect(this.node);
    } catch (error) {
      this.close();
      throw error;
    }
  }

  private collect(chunk: Float32Array) {
    const level = levelOf(chunk);
    if (!this.recording || !this.ctx) {
      this.events.onLevel?.(level);
      return;
    }
    const limit = Math.floor(this.ctx.sampleRate * MAX_RECORD_SECONDS);
    const room = limit - this.collected;
    if (room <= 0) return;
    const piece = chunk.length > room ? chunk.slice(0, room) : chunk;
    this.chunks.push(piece);
    this.collected += piece.length;
    this.events.onLevel?.(level);
    if (this.collected >= limit) {
      this.recording = false;
      this.events.onAutoStop?.();
    }
  }

  /** 지금부터 모은다(세기가 끝난 순간). */
  begin() {
    this.chunks = [];
    this.collected = 0;
    this.recording = true;
  }

  /** 모은 것을 다듬어 돌려주고 마이크를 끈다. */
  finish(): Take | null {
    this.recording = false;
    const rate = this.ctx?.sampleRate ?? 48_000;
    const take = this.collected > 0 ? finishRecording(this.chunks, rate) : null;
    this.close();
    return take;
  }

  /** 마이크를 끈다. 몇 번 불러도 된다. */
  close() {
    this.recording = false;
    if (this.node && "port" in this.node) {
      try {
        this.node.port.postMessage("stop");
        this.node.port.onmessage = null;
      } catch {
        // 이미 닫혔다.
      }
    }
    if (this.node && "onaudioprocess" in this.node) this.node.onaudioprocess = null;
    this.source?.disconnect();
    this.node?.disconnect();
    this.sink?.disconnect();
    this.stream?.getTracks().forEach((t) => t.stop());
    if (this.held) holdMicSession(false);
    this.held = false;
    this.stream = null;
    this.source = null;
    this.node = null;
    this.sink = null;
    this.chunks = [];
    this.collected = 0;
  }
}

function levelOf(chunk: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < chunk.length; i++) sum += chunk[i] * chunk[i];
  return Math.min(1, Math.sqrt(sum / Math.max(1, chunk.length)) * 4);
}

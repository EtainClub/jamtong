import type { Furniture } from "./catalog";

export type RoomMotion = "hop" | "sway" | "spin" | "glow";
export type RoomSound = "bark" | "stone" | "bubble" | "bounce" | "chime" | "musicbox";
export interface RoomActivity {
  motion: RoomMotion;
  message: string;
  sound?: RoomSound;
  clips?: readonly VoiceClipId[];
}

/** 재밍 채널 원본(2022-03-03). 영상/자동 자막에서 구간 확인, 파일 재배포 없이 원본 플레이어로 재생. */
export const VOICE_CLIPS = {
  love: { title: "사랑해 버린다", video: "ma7wDvLxH54", start: 1, end: 12 },
  courage: { title: "보란 듯이 성공하자", video: "ma7wDvLxH54", start: 22, end: 30 },
  tears: { title: "2006 감성 · 눈물", video: "ma7wDvLxH54", start: 43, end: 59 },
} as const;
export type VoiceClipId = keyof typeof VOICE_CLIPS;
export const VOICE_CONTEXT = "2022년 대선 당시 재밍 채널에 공개된 사전투표 홍보 영상이에요. 이재명 당시 후보가 옛 블로그 감성 글을 읽는 실제 목소리예요.";
export const VOICE_SOURCE = "https://www.huffingtonpost.kr/article/117138";
export function voiceEmbed(id: VoiceClipId): string {
  const c = VOICE_CLIPS[id];
  return `https://www.youtube-nocookie.com/embed/${c.video}?autoplay=1&playsinline=1&rel=0&start=${c.start}&end=${c.end}`;
}
export function voiceOriginal(id: VoiceClipId): string {
  const c = VOICE_CLIPS[id];
  return `https://www.youtube.com/watch?v=${c.video}&t=${c.start}s`;
}

const ACTIVITIES: Readonly<Record<string, RoomActivity>> = {
  "babi-mini": { motion: "hop", sound: "bark", message: "바비가 반갑게 폴짝! 멍멍 소리는 잼통이 만든 효과음이에요." },
  "go-board": { motion: "glow", sound: "stone", message: "딱! 바둑 한 수의 소리." },
  "trout-aquarium": { motion: "sway", sound: "bubble", message: "찰랑찰랑, 무지개송어의 작은 물결." },
  "soccer-ball": { motion: "hop", sound: "bounce", message: "통통! 축구공을 튕겼어요." },
  "tennis-racket": { motion: "sway", sound: "bounce", message: "톡! 라켓을 가볍게 휘둘렀어요." },
  "puer-tea": { motion: "glow", sound: "bubble", message: "보글보글, 차 한 잔 쉬어 가요." },
  "blog-diary": { motion: "sway", message: "감성 다이어리를 펼쳐 볼까요? 이야기 보기에서 글귀를 읽어요." },
  "play-musicbox": { motion: "spin", sound: "musicbox", message: "또르르, 잼통의 짧은 오르골 멜로디." },
  "play-chime": { motion: "sway", sound: "chime", message: "딩동, 바람종이 흔들려요." },
  "voice-tv": { motion: "glow", clips: ["love", "tears"], message: "2006 감성을 읽는 실제 목소리를 들어요." },
  "voice-mic": { motion: "hop", clips: ["courage"], message: "보란 듯이 성공하자! 짧은 응원을 들어요." },
};
export const activityOf = (id: string): RoomActivity | undefined => ACTIVITIES[id];

export const PLAY_FURNITURE: Furniture[] = [
  { id: "play-musicbox", label: "빙글빙글 오르골", kind: "floor", size: 1, price: 260, art: "play-musicbox", hint: "누르면 빙글 돌며 짧은 오르골 멜로디를 들려줘요.", newUntil: "2026-12-14" },
  { id: "play-chime", label: "딩동 바람종", kind: "wall", size: 1, price: 150, art: "play-chime", hint: "누르면 살랑 흔들리며 맑은 종소리가 나요.", newUntil: "2026-12-14" },
  { id: "voice-tv", label: "감성 음성 TV", kind: "floor", size: 2, price: 380, art: "voice-tv", hint: "누르면 2022년 당시의 실제 목소리로 사랑·눈물 감성 글을 듣는 영상이 열려요.", newUntil: "2026-12-14" },
  { id: "voice-mic", label: "할 수 있어 응원 마이크", kind: "floor", size: 1, price: 240, art: "voice-mic", hint: "누르면 ‘보란 듯이 성공하자’ 구간을 실제 영상으로 들어요. 2022년 선거 영상에서 가져온 짧은 응원이에요.", newUntil: "2026-12-14" },
];

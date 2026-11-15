import type { Furniture } from "./catalog";

/** 특정 팬덤의 상품을 복제하지 않은 잼통 창작 응원봉과 짧은 자체 멜로디. */
export const LIGHTSTICKS = [
  { id: "led-blue", label: "푸른 빛 LED 응원봉", shape: "orb", color: "#54baff", sound: "led-blue", voice: "맑은 종", notes: [523, 659, 784, 1047], price: 240 },
  { id: "led-heart", label: "마음 모아 LED 응원봉", shape: "heart", color: "#ff87b5", sound: "led-heart", voice: "통통 하트", notes: [659, 784, 659, 1047, 988], price: 280 },
  { id: "led-star", label: "희망 별 LED 응원봉", shape: "star", color: "#ffe269", sound: "led-star", voice: "반짝 별빛", notes: [1047, 1319, 1568, 1319, 1047], price: 320 },
  { id: "led-rainbow", label: "오색 광장 LED 응원봉", shape: "crystal", color: "#ab92ff", sound: "led-rainbow", voice: "오색 아르페지오", notes: [523, 587, 659, 784, 880, 1047], price: 380 },
  { id: "led-flower", label: "활짝 민주주의 LED 응원봉", shape: "flower", color: "#8fe0ae", sound: "led-flower", voice: "꽃잎 오르골", notes: [784, 659, 523, 659, 880], price: 350 },
  { id: "led-wave", label: "빛의 물결 LED 응원봉", shape: "wave", color: "#79dfe8", sound: "led-wave", voice: "찰랑 물결", notes: [587, 784, 880, 784, 587, 523], price: 420 },
] as const;
export type LightstickSound = (typeof LIGHTSTICKS)[number]["sound"];
export const lightstickOf = (id: string) => LIGHTSTICKS.find((l) => l.id === id);

export const LIGHTSTICK_FURNITURE: Furniture[] = LIGHTSTICKS.map((l) => ({
  id: l.id, label: l.label, art: l.id, kind: "floor", size: 1, price: l.price,
  collection: "lights", newUntil: "2026-12-15",
  hint: `누르면 빛을 두르며 흔들리고 ${l.voice} 소리가 나요. 구매 전에도 눌러 볼 수 있어요.`,
  story: { kind: "inspired", source: "lights", text: "이재명 대통령은 2025년 광복절 경축사에서 ‘빛의 혁명’을 여러 색의 응원봉 불빛과 연결해 설명했어요. 그 기록에서 착안한 잼통 창작 LED 응원봉이에요. 실제 사용 제품이나 특정 팬덤의 응원봉을 재현한 것은 아니에요." },
}));

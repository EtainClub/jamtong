import {
  BLOOM_BONUS,
  BLOOM_CARE,
  CASE_PER_DAY,
  formatLeft,
  GROW_MIN,
  MINUTE,
  PLAZA_SPEED,
  SHOP_SLOT,
  TOOL_ORDER,
  TOOLS,
  TRAIL_PER_DAY,
} from "./rules";
import type { Place } from "./nav";
import type { Plant } from "./types";

/**
 * 정원 코치 — 처음 온 사람을 첫 한 바퀴(거두기 → 잼 → 심기 → 상점)로 이끈다.
 *
 * ★ 새 정원은 곧 익는 새싹 한 포기가 심긴 채로 시작한다(docs/garden-miniroom.md §8의 1).
 *   첫 걸음이 심기가 아니라 거두기다 — 첫 수확 전에 72%가 떠났다. 심기는 거둔 뒤에 배운다.
 *   그 새싹이 없는 정원(옛 정원, 갈아엎은 정원)은 예전처럼 심기(sow)부터.
 * ★ 단계는 "다음" 버튼이 아니라 정원 상태로 넘어간다. 이미 아는 사람은 하던 대로
 *   하면 저절로 끝나고, 모르는 사람만 카드를 읽는다.
 * ★ 상태로 알 수 없는 것(잼으로 졸였다, 씨앗을 샀다)만 marks에 적는다.
 * ★ 순수 함수만 둔다. 화면은 GardenCoach.tsx.
 */

export interface CoachData {
  /**
   * 2부터 있다. 1(값 없음)은 "이미 거둔 정원은 끈다"로 저장돼서 기존 사람 모두에게
   * 코치가 꺼져 있었다 — normalizeCoach가 다시 켠다.
   */
  v: 2;
  /** 상태로 알 수 없는 첫 경험. "sold" | "bought". */
  marks: string[];
  /** 퀘스트를 마쳤거나 건너뛰었다. */
  off: boolean;
  /** 첫 방문 팁을 닫은 탭. */
  tips: string[];
}

export type CoachMark = "sold" | "bought";

/** sow=첫 수확 전에 심기(새싹이 없는 정원), plant=거둔 뒤 빈 밭에 심기. */
export type CoachStep = "sow" | "grow" | "harvest" | "sell" | "plant" | "buy" | "done";

export const COACH_STEPS: CoachStep[] = ["sow", "grow", "harvest", "sell", "plant", "buy", "done"];

/** 진행 점. sow는 grow와 같은 첫 칸이다 — 둘 다 "첫 열매를 기다린다". */
export const COACH_DOTS: CoachStep[] = ["grow", "harvest", "sell", "plant", "buy"];

export function coachDot(step: CoachStep): number {
  return step === "sow" ? 0 : step === "done" ? COACH_DOTS.length : COACH_DOTS.indexOf(step);
}

/**
 * 첫 방문 팁이 있는 자리(nav.ts의 칸). 텃밭은 퀘스트가 맡는다.
 * 저장된 tips에는 옛 탭 이름(shop·flowers·plaza·greenhouse·dex)이 있다 — 칸 이름이 같아 그대로 맞는다.
 */
export type TipTab = "room" | "shop" | "flowers" | "plaza" | "greenhouse" | "dex" | "friends";
export const TIP_TABS: TipTab[] = ["room", "shop", "flowers", "plaza", "greenhouse", "dex", "friends"];

interface CoachInput {
  coach: CoachData;
  beds: Array<Plant | null>;
  basket: unknown[];
  dex: Record<string, unknown>;
}

/**
 * 새 정원의 코치. 이미 해 본 사람도 켠 채로 시작한다 — 단계가 정원 상태로 정해지므로
 * 이미 거둔 사람은 심기·거두기를 건너뛰고 남은 단계만 본다.
 */
export function initialCoach(): CoachData {
  return { v: 2, marks: [], off: false, tips: [] };
}

/**
 * 저장된 코치를 맞춘다. v1은 거둔 적 있는 정원을 자동으로 껐으므로 다시 켠다.
 * 다만 v1에서 실제로 한 바퀴를 마친 정원(졸이고 산 기록이 있다)은 끈 채로 둔다.
 */
export function normalizeCoach(saved: Partial<CoachData> | undefined): CoachData {
  if (saved?.v === 2) return saved as CoachData;
  const marks = saved?.marks ?? [];
  const finished = Boolean(saved?.off) && marks.includes("sold") && marks.includes("bought");
  return { v: 2, marks, off: finished, tips: [] };
}

/** 지금 보여 줄 단계. 꺼져 있으면 null. */
export function coachStep(d: CoachInput, now: number): CoachStep | null {
  if (d.coach.off) return null;
  const marks = new Set(d.coach.marks);
  const harvested = Object.keys(d.dex).length > 0;
  if (!harvested) {
    if (!d.beds.some(Boolean)) return "sow";
    return d.beds.some((p) => p && p.ripeAt <= now) ? "harvest" : "grow";
  }
  // 거둔 열매가 바구니에 있으면 졸이기부터. 바구니가 비었는데 졸인 적이 없으면 넘어간다.
  if (!marks.has("sold") && d.basket.length > 0) return "sell";
  // 밭이 다 비었으면 심기. 씨앗을 산 뒤로는 묻지 않는다 — 한 바퀴를 돈 사람이다.
  if (!marks.has("bought") && !d.beds.some(Boolean)) return "plant";
  if (!marks.has("bought")) return "buy";
  return "done";
}

/** 가장 먼저 익는 포기까지 남은 시간. */
export function firstRipeLeft(beds: Array<Plant | null>, now: number): number | null {
  const times = beds.filter((p): p is Plant => Boolean(p)).map((p) => p.ripeAt - now);
  return times.length ? Math.max(0, Math.min(...times)) : null;
}

export interface CoachCard {
  title: string;
  body: string;
  /** 다른 자리로 보내는 버튼. */
  go?: { tab: Place; label: string };
}

const range = ([lo, hi]: [number, number]) => `${lo}–${hi}분`;

/** 곧 익는다고 말하는 거리. 새 정원의 첫 새싹(1분)이 여기 든다. */
const SOON = 3 * MINUTE;

export function coachCard(step: CoachStep, ctx: { now: number; beds: Array<Plant | null>; hasSeeds: boolean }): CoachCard {
  switch (step) {
    case "sow":
      return ctx.hasSeeds
        ? {
            title: "씨앗을 심어 보세요",
            body: `빈 흙밭을 누르고 씨앗을 고르세요. 처음 받은 새싹 씨앗은 ${range(GROW_MIN.sprout)}이면 익어요.`,
          }
        : {
            title: "씨앗부터 사 와요",
            body: "씨앗 주머니가 비었어요. 상점에서 잼으로 씨앗을 사세요.",
            go: { tab: "shop", label: "상점 가기" },
          };
    case "grow": {
      const left = firstRipeLeft(ctx.beds, ctx.now);
      if (left !== null && left <= SOON) {
        return {
          title: "곧 익어요! 잠깐만 기다려요",
          body: `첫 새싹이 ${formatLeft(left)} 뒤면 익어요. 익으면 텃밭에서 눌러 거둬요.`,
          go: { tab: "beds", label: "텃밭 보기" },
        };
      }
      return {
        title: "쑥쑥 자라는 중이에요",
        body: `첫 열매까지 ${left === null ? "조금" : formatLeft(left)}. 그동안 온실에서 사건을 풀면 씨앗과 잼을 받아요. 창을 닫아도 계속 자라요.`,
        go: { tab: "greenhouse", label: "온실 가 보기" },
      };
    }
    case "harvest":
      return {
        title: "다 익었어요! 열매를 눌러 거두세요",
        body: "거둔 열매는 아래 바구니에 담겨요. 열매마다 쪽지가 한 장 들어 있어요.",
        go: { tab: "beds", label: "텃밭 보기" },
      };
    case "sell":
      return {
        title: "쪽지를 읽고 잼으로 졸여요",
        body: "쪽지는 콘텐츠의 한 줄이에요. ‘근거 보기’를 열면 원본 광택(잼 ×1.5)이 붙어요. 안 읽어도 손해는 없어요. 다 봤으면 ‘잼’ 버튼을 누르세요.",
        go: { tab: "beds", label: "바구니 보기" },
      };
    case "plant":
      return ctx.hasSeeds
        ? {
            title: "빈 밭에 씨앗을 심어요",
            body: `빈 흙밭을 누르고 씨앗 주머니에서 골라요. 새싹 씨앗은 ${range(GROW_MIN.sprout)}이면 익어요.`,
            go: { tab: "beds", label: "텃밭 가기" },
          }
        : {
            title: "씨앗부터 사 와요",
            body: "씨앗 주머니가 비었어요. 상점에서 잼으로 씨앗을 사세요.",
            go: { tab: "shop", label: "상점 가기" },
          };
    case "buy":
      return {
        title: "잼으로 새 씨앗을 사요",
        body: `상점 진열은 ${SHOP_SLOT / MINUTE}분마다 바뀌고, 모두가 같은 진열을 봐요. 산 씨앗은 텃밭 빈칸에 심어요.`,
        go: { tab: "shop", label: "상점 가기" },
      };
    case "done":
      return {
        title: "한 바퀴 끝! 🎉",
        body: "심고, 거두고, 잼을 졸여 씨앗을 사는 게 정원의 전부예요. 단비·별똥별 같은 날씨와 확률은 ‘? 안내’에 있어요.",
      };
  }
}

/** 첫 방문 팁. section은 "자세히"가 여는 안내(GardenGuide)의 절. 수치는 rules.ts에서 읽는다. */
export const TIPS: Record<TipTab, { title: string; body: string; section: string }> = {
  room: {
    title: "내 방",
    section: "room",
    body: "거둔 열매를 바구니에서 ‘전시하기’로 방에 놓고, 도감의 쪽지는 액자에 걸어요. 가구는 상점에서 잼으로 사요 — 꾸밈일 뿐 효과는 없어요.",
  },
  shop: {
    title: "상점",
    section: "shop",
    body: `씨앗 진열은 ${SHOP_SLOT / MINUTE}분마다 바뀌어요. 업적 씨앗은 비싸고 오래 자라지만 잼을 많이 줘요. ‘도구’ 칸의 비료(${TOOL_ORDER.map((id) => TOOLS[id].label).join("·")})를 주면 작물이 빨리 자라요. 가구와 벽지는 ‘가구’·‘벽·바닥’ 칸에.`,
  },
  flowers: {
    title: "꽃밭",
    section: "flowers",
    body: `업적 열매를 거두거나 그 쪽지의 근거를 열면 가꿈이 쌓여요. 모두의 가꿈이 ${BLOOM_CARE}이 되면 만개하고, 만개한 업적마다 모두의 잼이 ${BLOOM_BONUS.each * 100}% 늘어요. 가장 많이 가꾼 사람이 정원지기예요.`,
  },
  plaza: {
    title: "광장",
    section: "plaza",
    body: `모두가 함께 쓰는 정원이에요. 잡초를 문질러 뽑으면 잼을 받아요. 광장이 깨끗하면 모두의 텃밭이 ${PLAZA_SPEED.clean}배 빨리 자라요. 무성해지면 거대 잡초가 나타나는데, 혼자서는 못 잡아요 — 정각과 30분의 ‘빈틈’에 친구와 함께 치면 두 배로 들어가요!`,
  },
  greenhouse: {
    title: "탐정 온실",
    section: "greenhouse",
    body: `SNS에서 도는 주장에 답하는 내용을 카드 셋 중에서 찾아요. 하루 ${CASE_PER_DAY}건, 틀려도 잃는 건 없어요.`,
  },
  dex: {
    title: "도감",
    section: "dex",
    body: `거둔 품종과 쪽지가 모여요. 지도에서 이어진 품종의 원본을 읽으면 그 씨앗을 받아요(하루 ${TRAIL_PER_DAY}번). 쪽지는 액자에 걸어 방에 둘 수 있어요.`,
  },
  friends: {
    title: "1촌",
    section: "visit",
    body: "1촌을 맺으면 서로의 방 소식을 보고, 1촌에게 준 물은 15% 줄여요. 아래에는 이번 주 다 같이 쌓은 것과 정원지기 명패. 순위표는 없어요.",
  },
};

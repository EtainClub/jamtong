/**
 * 거대 잡초의 손맛 — 화면에서만 도는 놀이 규칙. 서버(firestore.rules)는 이것을 모른다.
 *
 * ★ 여기 있는 것은 "몇 번 문질러야 한 방인가"와 연출뿐이다. 한 방의 크기·간격·내 몫은
 *   rules.ts와 firestore.rules가 정한다. 그래서 이 값들을 바꿔도 혼자 잡을 수는 없다.
 * ★ 합동 게이지·약점·반격·종류별 성질은 모두 같은 숫자(합계 hits)를 보고 그린다.
 *   합동 게이지는 모두의 합계에서 셈하므로, 보는 사람 모두에게 거의 같은 때 터진다.
 */
import { RAID_RUBS_PER_STRIKE, type RaidKindId } from "./rules";

/** 체력 단계. 0=멀쩡, 1=75% 아래, 2=50% 아래, 3=25% 아래. */
export function raidStage(hits: number, hp: number): 0 | 1 | 2 | 3 {
  const left = 1 - Math.min(hits, hp) / hp;
  return left > 0.75 ? 0 : left > 0.5 ? 1 : left > 0.25 ? 2 : 3;
}

export const STAGE_LINE = ["", "흔들려요!", "비틀거려요!", "쓰러지기 직전이에요!"] as const;

/** 합동 게이지 한 칸 = 체력의 이만큼. 모두의 타격으로 찬다. */
export const SURGE_EVERY = 0.2;
/** 게이지가 차면 이만큼 "광장의 햇살"이 된다. */
export const SURGE_MS = 10_000;

/** 지금까지 찬 게이지 수와 다음 칸까지 찬 비율(0–1). */
export function raidSurge(hits: number, hp: number): { count: number; fill: number } {
  const step = Math.max(1, Math.round(hp * SURGE_EVERY));
  const h = Math.min(hits, hp);
  // 마지막 칸(체력 100%)은 쓰러뜨리는 순간이라 햇살로 치지 않는다.
  const count = Math.min(Math.floor(h / step), Math.ceil(1 / SURGE_EVERY) - 1);
  return { count, fill: h >= hp ? 1 : (h % step) / step };
}

export interface RaidCounter {
  icon: string;
  /** 경고 문구. */
  warn: string;
  /** 피하는 버튼. */
  dodge: string;
  /** 맞았을 때. */
  hurt: string;
  /** 반격 사이(평균). */
  everyMs: number;
  /** 맞으면 손이 묶이는 시간. */
  stunMs: number;
}

export interface RaidGimmick {
  /** 한 줄 성질(화면 안내). */
  rule: string;
  counter: RaidCounter;
  weak: {
    /** 약점을 문지르면 이만큼 센다. */
    value: number;
    icon: string;
    label: string;
    /** 가짜 약점이 섞이는 비율. 가짜는 세지 않는다. */
    fake?: { ratio: number; icon: string; label: string };
  };
  /** 체력이 이 비율 아래면 방패 — 한 방에 문지르기가 더 든다. */
  shield?: { below: number; rubs: number };
  /** 단계가 바뀔 때마다 덩굴이 몸을 감는다. 이만큼 문질러 끊어야 본체가 맞는다. */
  vines?: number;
}

export const RAID_GIMMICKS: Record<RaidKindId, RaidGimmick> = {
  troll: {
    rule: "가시를 자주 날려요. 경고가 뜨면 재빨리 피하세요",
    counter: { icon: "🌵", warn: "가시를 날려요!", dodge: "피하기", hurt: "가시에 찔렸어요", everyMs: 13_000, stunMs: 2_500 },
    weak: { value: 2, icon: "🎯", label: "약점" },
  },
  hate: {
    rule: "쐐기에 맞으면 오래 따끔해요",
    counter: { icon: "⚡", warn: "쐐기를 퍼뜨려요!", dodge: "손잡기", hurt: "쐐기에 쏘였어요", everyMs: 19_000, stunMs: 4_000 },
    weak: { value: 2, icon: "🎯", label: "약점" },
  },
  rumor: {
    rule: "가짜 약점이 섞여 나와요. '출처'가 있는 것만 진짜예요",
    counter: { icon: "📢", warn: "가짜뉴스를 퍼뜨려요!", dodge: "팩트 체크", hurt: "가짜뉴스에 휩쓸렸어요", everyMs: 17_000, stunMs: 3_000 },
    weak: { value: 2, icon: "📎", label: "출처", fake: { ratio: 0.4, icon: "❓", label: "카더라" } },
  },
  bribe: {
    rule: "장부를 찾아 문지르면 세 배로 들어가요",
    counter: { icon: "💰", warn: "돈다발을 내밀어요!", dodge: "거절하기", hurt: "돈다발에 눈이 멀었어요", everyMs: 18_000, stunMs: 3_000 },
    weak: { value: 3, icon: "📒", label: "장부" },
  },
  bossy: {
    rule: "체력이 절반 아래로 내려가면 방패를 들어요",
    counter: { icon: "📣", warn: "호통을 쳐요!", dodge: "맞서기", hurt: "호통에 움츠러들었어요", everyMs: 17_000, stunMs: 3_000 },
    weak: { value: 2, icon: "🎯", label: "약점" },
    shield: { below: 0.5, rubs: 6 },
  },
  grab: {
    rule: "흔들릴 때마다 덩굴로 몸을 감아요. 먼저 끊어야 해요",
    counter: { icon: "🌿", warn: "덩굴로 휘감아요!", dodge: "끊어내기", hurt: "덩굴에 감겼어요", everyMs: 18_000, stunMs: 3_000 },
    weak: { value: 2, icon: "🎯", label: "약점" },
    vines: 6,
  },
};

/**
 * 한 방에 드는 문지르기. 기본 RAID_RUBS_PER_STRIKE, 방패면 더, 광장의 햇살이면 절반.
 */
export function raidRubsPerStrike(kind: RaidKindId, hits: number, hp: number, surge: boolean): number {
  const g = RAID_GIMMICKS[kind];
  const left = 1 - Math.min(hits, hp) / hp;
  const base = g.shield && left <= g.shield.below ? g.shield.rubs : RAID_RUBS_PER_STRIKE;
  return surge ? Math.max(1, Math.ceil(base / 2)) : base;
}

/** 콤보가 끊기는 쉼. */
export const COMBO_GAP = 2_500;
/** 콤보 구간. 넘을 때마다 글자가 커진다. */
export const COMBO_TIERS = [10, 25, 50] as const;

export function comboTier(combo: number): 0 | 1 | 2 | 3 {
  return combo >= COMBO_TIERS[2] ? 3 : combo >= COMBO_TIERS[1] ? 2 : combo >= COMBO_TIERS[0] ? 1 : 0;
}

/** 이만큼 안에 다른 사람이 친 방이 이만큼 이상이면 "합동 공격". */
export const TEAM_WINDOW = 1_500;
export const TEAM_MIN = 3;
/** "지금 함께 치는 중"으로 보는 시간. */
export const ACTIVE_WINDOW = 10_000;

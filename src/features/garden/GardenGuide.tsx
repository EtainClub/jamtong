"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { FRAME_BLANK, FURNITURE_BY_ID } from "./room/catalog";
import { ROOM_SIZES } from "./room/rules";
import { CHEER_MIN, KIT, KIT_ORDER, ROOTS_CHEER, ROOTS_ESCAPE, ROOTS_FULL, SAMPLES_PER_TROPHY, SPORE_COUNT, STAR_MINUTES } from "./raid/rules";

import {
  BLOOM_BONUS,
  BLOOM_CARE,
  CARE,
  CARE_PER_DAY,
  CASE_BOX_EVERY,
  CASE_JAM,
  CASE_PER_DAY,
  GROW_MIN,
  HOUR,
  JAM_VALUE,
  LEAF_JAM,
  LEAF_PER_DAY,
  METEOR_LENGTH,
  METEOR_START,
  METEOR_WEEKDAYS,
  MINUTE,
  MONSOON_LENGTH,
  MONSOON_START,
  MUTATION,
  MUTATION_ORDER,
  NECTAR,
  NEW_VARIETY_BONUS,
  NEW_VARIETY_DAYS,
  PLAZA_LABEL,
  PLAZA_SPEED,
  PLOT_UPGRADES,
  INVITE_CAP,
  QUIET_FROM,
  QUIET_UNTIL,
  TITLE_ORDER,
  TITLES,
  RAID_BOX,
  RAID_EVERY_HOURS,
  RAID_FIRST_HOUR,
  RAID_GAP,
  RAID_USES_PER_PERSON,
  RAID_AID_ORDER,
  RAID_AIDS,
  RAID_BOX_FAST_PERENNIAL,
  RAID_FRENZY_GAP_MINUTES,
  RAID_GAP_MINUTES,
  RAID_GAP_MULT,
  RAID_HP_MIN,
  RAID_KINDS,
  RAID_LIFE,
  RAID_MAX_FIGHTERS,
  RAID_MIN_FIGHTERS,
  RAID_PER_DAY,
  FINISHER_ORDER,
  FINISHERS,
  raidNeed,
  RAIN_LENGTH,
  RAIN_SPEED,
  RAIN_STARTS,
  REGROW_MIN,
  SEED_PRICE,
  SHINE_PER_DAY,
  SHOP_ODDS,
  SHOP_SIZE,
  SHOP_SLOT,
  START_PLOTS,
  TIER_LABEL,
  TOOL_ORDER,
  TOOLS,
  TRAIL_PER_DAY,
  WATER_CUT,
  WATER_PER_DAY,
  WEED,
  WEED_REWARD_PER_DAY,
  WEED_SEED_ODDS,
} from "./rules";
import type { Tier } from "./types";

/**
 * 정원 안내 — 규칙과 확률을 한곳에 둔다.
 *
 * ★ 수치는 손으로 적지 않는다. 모두 rules.ts의 상수에서 읽는다 — 규칙을 고치면
 *   안내도 같이 바뀐다.
 * ★ 무작위 보상의 확률은 여기서 빠짐없이 공개한다(docs/garden-game.md §1).
 */

const TIERS: Tier[] = ["sprout", "common", "flagship", "perennial"];
const ORIGIN: Record<Tier, string> = {
  sprout: "언행",
  common: "정책",
  flagship: "업적",
  perennial: "여러 해에 걸친 업적",
};
const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

const pct = (p: number) => `${Math.round(p * 1000) / 10}%`;
const clock = (offset: number) => {
  const h = Math.floor(offset / HOUR);
  const m = Math.round((offset % HOUR) / MINUTE);
  return `${h}:${String(m).padStart(2, "0")}`;
};
const minutes = (ms: number) => `${Math.round(ms / MINUTE)}분`;
const duration = (min: number) => (min < 60 ? `${min}분` : min % 60 ? `${Math.floor(min / 60)}시간 ${min % 60}분` : `${min / 60}시간`);
const span = ([lo, hi]: [number, number]) => `${duration(lo)}–${duration(hi)}`;

const FRAME_PRICE = FURNITURE_BY_ID.get(FRAME_BLANK)?.price ?? 0;

export const GUIDE_SECTIONS = [
  { id: "loop", label: "기본" },
  { id: "seeds", label: "씨앗" },
  { id: "weather", label: "날씨" },
  { id: "mutations", label: "변이" },
  { id: "shop", label: "상점" },
  { id: "tools", label: "도구" },
  { id: "plaza", label: "광장" },
  { id: "flowers", label: "꽃밭" },
  { id: "greenhouse", label: "온실" },
  { id: "dex", label: "도감" },
  { id: "room", label: "내 방" },
  { id: "visit", label: "친구" },
] as const;

export function GardenGuide({ section, onClose }: { section: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    element?.querySelector(`#guide-${section}`)?.scrollIntoView({ block: "start" });
    return () => element?.close();
  }, [section]);

  const jump = (id: string) => dialog.current?.querySelector(`#guide-${id}`)?.scrollIntoView({ block: "start", behavior: "smooth" });

  return (
    <dialog
      ref={dialog}
      aria-labelledby="garden-guide-title"
      className="garden-seed-dialog fixed inset-0 z-50 m-0 h-dvh max-h-none w-full max-w-none items-end border-0 bg-transparent p-0 text-inherit open:flex"
      onClick={onClose}
      onCancel={onClose}
    >
      <div
        className="garden-guide mx-auto max-h-[85vh] w-full max-w-[560px] overflow-y-auto rounded-t-3xl bg-[var(--g-bg)] px-4 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="garden-guide-head sticky top-0 z-10 -mx-4 bg-[var(--g-bg)] px-4 pb-2 pt-4">
          <div className="flex items-center justify-between">
            <h2 id="garden-guide-title" className="text-[17px] font-extrabold">정원 안내</h2>
            <button type="button" onClick={onClose} className="text-[13px] text-smoke">
              닫기
            </button>
          </div>
          <nav aria-label="안내 목차" className="garden-guide-toc mt-2 flex gap-1.5 overflow-x-auto pb-1">
            {GUIDE_SECTIONS.map((s) => (
              <button key={s.id} type="button" onClick={() => jump(s.id)}>
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        <Section id="loop" title="한 바퀴">
          <p className="garden-guide-loop" aria-label="심기, 기다리기, 거두기, 쪽지 읽기, 잼 졸이기, 씨앗 사기">
            🌱 심기 → ⏳ 기다리기 → 🧺 거두기 → 📜 쪽지 → 🍯 잼 → 🏡 씨앗 사기
          </p>
          <ul>
            <li>씨앗 하나가 콘텐츠 한 건이에요. 거둔 열매마다 그 콘텐츠의 한 줄(쪽지)이 들어 있어요.</li>
            <li>
              쪽지의 ‘근거 보기’를 열면 원본 광택(잼 ×{MUTATION.shine.multiplier})이 붙어요. 하루 {SHINE_PER_DAY}번까지.
              안 읽어도 잼은 그대로 받아요.
            </li>
            <li>쪽지에는 사실뿐 아니라 주장·반론·비판도 섞여 나와요. 그게 정상이에요.</li>
            <li>
              텃밭은 {START_PLOTS}칸으로 시작해서 상점에서 늘릴 수 있어요
              ({PLOT_UPGRADES.map((u) => `${u.plots}칸 ${u.price}잼`).join(" · ")}).
            </li>
            <li>창을 닫아도 작물은 계속 자라요. 계정이 있으면 다른 기기에서도 이어져요.</li>
          </ul>
        </Section>

        <Section id="seeds" title="씨앗 등급">
          <table>
            <thead>
              <tr>
                <th scope="col">등급</th>
                <th scope="col">익는 시간</th>
                <th scope="col">잼</th>
                <th scope="col">씨앗값</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => (
                <tr key={t}>
                  <th scope="row">
                    {TIER_LABEL[t]}
                    <small>{ORIGIN[t]}</small>
                  </th>
                  <td>{span(GROW_MIN[t])}</td>
                  <td>
                    {JAM_VALUE[t][0]}–{JAM_VALUE[t][1]}
                  </td>
                  <td>{SEED_PRICE[t]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul>
            <li>시간과 잼은 품종마다 범위 안에서 하나로 정해져 있어요.</li>
            <li>다년생은 거둔 뒤에도 {span(REGROW_MIN)}마다 다시 열려요.</li>
            <li>
              새로 들어온 품종(신품종)은 {NEW_VARIETY_DAYS}일 동안 잼이 {pct(NEW_VARIETY_BONUS)} 더 나와요.
            </li>
          </ul>
        </Section>

        <Section id="weather" title="날씨">
          <p>날씨는 정해진 시각(한국 시각)에 와요. 모두가 같은 날씨를 봐요. 위쪽 날씨 알림을 누르면 이 안내가 열려요.</p>
          <ul>
            <li>
              🌧 <b>단비</b> — 매일 {RAIN_STARTS.map(clock).join(", ")}부터 {minutes(RAIN_LENGTH)}. 이 동안 작물이 ×{RAIN_SPEED}로 자라요.
            </li>
            <li>
              🌠 <b>별똥별</b> — {METEOR_WEEKDAYS.map((d) => WEEKDAY[d]).join("·")}요일 {clock(METEOR_START)}부터{" "}
              {minutes(METEOR_LENGTH)}. 이때 자란 열매에 반짝 변이가 붙을 수 있어요.
            </li>
            <li>
              🌦 <b>신품종 장마</b> — 새 품종이 들어온 날 {clock(MONSOON_START)}–{clock(MONSOON_START + MONSOON_LENGTH)}. 상점에
              새 씨앗이 꼭 나와요.
            </li>
          </ul>
        </Section>

        <Section id="mutations" title="변이와 확률">
          <p>거둘 때 변이가 붙으면 잼이 곱해져요. 확률은 심을 때 정해져서 새로고침해도 바뀌지 않아요.</p>
          <table>
            <thead>
              <tr>
                <th scope="col">변이</th>
                <th scope="col">확률</th>
                <th scope="col">잼</th>
              </tr>
            </thead>
            <tbody>
              {MUTATION_ORDER.map((m) => (
                <tr key={m}>
                  <th scope="row">
                    {MUTATION[m].label}
                    <small>{MUTATION[m].hint}</small>
                  </th>
                  <td>{MUTATION[m].odds}</td>
                  <td>×{MUTATION[m].multiplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul>
            <li>촉촉·반짝·광장의 축복은 조건(단비·별똥별·깨끗한 광장)이 맞을 때만 그 확률로 붙어요.</li>
            <li>변이가 여러 개면 모두 곱해요.</li>
          </ul>
        </Section>

        <Section id="shop" title="씨앗 상점">
          <p>
            {minutes(SHOP_SLOT)}마다 진열 {SHOP_SIZE}칸이 바뀌고, 모두가 같은 진열을 봐요. 칸마다 등급이 나올 확률:
          </p>
          <p className="garden-guide-odds">
            {SHOP_ODDS.map((o) => `${TIER_LABEL[o.tier]} ${pct(o.p)}`).join(" · ")}
          </p>
          <p>현금 결제도, 사람끼리 사고파는 것도 없어요. 잼은 이 정원 안에서만 써요.</p>
        </Section>

        <Section id="tools" title="도구">
          <p>상점의 ‘도구’ 칸에서 늘 같은 값으로 팔아요. 무작위는 없어요.</p>
          <ul>
            {TOOL_ORDER.map((id) => (
              <li key={id}>
                {TOOLS[id].icon} <b>{TOOLS[id].label}</b> — 🍯 {TOOLS[id].price}, 하루 {TOOLS[id].perDay}개까지. {TOOLS[id].hint}{" "}
              </li>
            ))}
            <li>텃밭에서 자라는 작물을 누르면 쓸 수 있어요. 한 작물이 한 번 익는 동안 비료는 종류와 상관없이 하나만 줄 수 있어요.</li>
          </ul>
        </Section>

        <Section id="plaza" title="광장">
          <ul>
            <li>모두가 함께 쓰는 정원이에요. 잡초를 문질러 뽑으면 잼을 받아요.</li>
            <li>
              잡초 잼: {(Object.keys(WEED) as Array<keyof typeof WEED>).map((k) => `${WEED[k].label} ${WEED[k].jam}`).join(" · ")}. 하루{" "}
              {WEED_REWARD_PER_DAY}포기까지 보상이 있어요.
            </li>
            <li>잡초에서 씨앗이 나올 확률은 {pct(WEED_SEED_ODDS)}예요.</li>
            <li>
              광장 상태에 따라 새로 심는 작물이 빨리 자라요:{" "}
              {(Object.keys(PLAZA_SPEED) as Array<keyof typeof PLAZA_SPEED>).map((k) => `${PLAZA_LABEL[k]} ×${PLAZA_SPEED[k]}`).join(" · ")}.
            </li>
            <li>
              광장이 무성해지면 거대 잡초가 나타나요. 하루 {RAID_PER_DAY}번까지,{" "}
              {Array.from({ length: RAID_PER_DAY }, (_, i) => `${RAID_FIRST_HOUR + RAID_EVERY_HOURS * i}시`).join("·")}부터 하나씩
              열려요. 앞 거대 잡초가 끝나고 {duration(RAID_GAP / MINUTE)}이 지나야 다음이 나와요.
            </li>
            <li>
              한 사람은 거대 잡초 하나에 기력 {RAID_USES_PER_PERSON}번까지 쓸 수 있어요. 매 시 정각과 30분부터 {RAID_GAP_MINUTES}분은
              ‘빈틈’이라 그때 친 한 번은 ×{RAID_GAP_MULT}로 들어가요(도망 30분 전 폭주 때는 빈틈이 {RAID_FRENZY_GAP_MINUTES}분). 체력은 적어도{" "}
              {RAID_HP_MIN}이라 혼자서도 둘이서도 못 잡아요 — 모두 빈틈에 모이면 {RAID_MIN_FIGHTERS}–4명, 아무 때나 치면 5–{RAID_MAX_FIGHTERS}명이 들어요.
            </li>
            <li>
              거대 잡초는 사회를 갉아먹는 악초예요. 하루 {RAID_PER_DAY}번 서로 다른 놈이 나오고, 종류마다 체력이 달라요:{" "}
              {RAID_KINDS.map((k) => `${k.name} ${k.hp}(${raidNeed(k.hp).least}–${raidNeed(k.hp).most}명)`).join(" · ")}.
            </li>
            <li>
              지원은 기력과 따로, 1분에 한 번 걸어요(지원 도구가 있으면 20초):{" "}
              {RAID_AID_ORDER.map((id) => `${RAID_AIDS[id].icon} ${RAID_AIDS[id].label} — ${RAID_AIDS[id].effect}`).join(" · ")}. 센 값은 바뀌지 않고 손맛만 바뀌어요.
              체력이 절반이 되면 광장 칸에 포자 {SPORE_COUNT}개가 돋고, 다 뽑으면 다음 빈틈 동안 내 문지르기가 절반이에요.
            </li>
            <li>
              싸움 도구(잼, 하루 상한, 무작위 없음):{" "}
              {FINISHER_ORDER.map((id) => `${FINISHERS[id].icon} ${FINISHERS[id].label} 🍯${FINISHERS[id].price}·하루 ${FINISHERS[id].perDay}`).join(" · ")} ·{" "}
              {KIT_ORDER.map((id) => `${KIT[id].icon} ${KIT[id].label} 🍯${KIT[id].price}·하루 ${KIT[id].perDay}`).join(" · ")}. 기력을 더 주는 도구는 없어요.
            </li>
            <li>
              {duration(RAID_LIFE / MINUTE)} 안에 쓰러뜨리면 한 번이라도 쳤거나 지원한 모두가 잼 {RAID_BOX.jam}과 희귀 씨앗 상자를 받아요
              ({RAID_BOX.odds.map((o) => `${TIER_LABEL[o.tier]} ${pct(o.p)}`).join(" · ")}, ★★★이면 {TIER_LABEL.flagship} {pct(1 - RAID_BOX_FAST_PERENNIAL)} ·{" "}
              {TIER_LABEL.perennial} {pct(RAID_BOX_FAST_PERENNIAL)}). 같은 물결·같은 사람이면 같은 씨앗이에요.
            </li>
            <li>
              🌰 뿌리 조각: 빠른 처치 ★★★({STAR_MINUTES[0]}분 안) 3 · ★★({STAR_MINUTES[1]}분 안) 2 · ★ 1, 기력을 다 쓰면 +{ROOTS_FULL}, 지원 {CHEER_MIN}번 이상이면 +{ROOTS_CHEER}.
              도망가면 친 사람에게 {ROOTS_ESCAPE}. 뿌리 조각은 상점 🏆 전리품에서만 쓰고, 잼으로 사거나 남에게 줄 수 없어요.
            </li>
            <li>
              쓰러뜨릴 때마다 그 악초의 표본 조각 하나. {SAMPLES_PER_TROPHY}개면 그 악초의 박제가 방에 생기고, 여섯 박제를 다 모으면 벽지 ‘광장을 지킨 방’을 받아요.
              가장 많이 친 사람은 뽑지 않아요 — 쓰러뜨린 뒤에는 함께한 사람들의 이름이 한 줄에 올라요.
            </li>
            <li>
              가끔 떨어지는 시든 잎은 링크가 열리지 않았던 출처예요. 열리는지 확인해 주면 잼 {LEAF_JAM}을 받아요(하루{" "}
              {LEAF_PER_DAY}장). ‘모르겠어요’도 같은 보상이에요.
            </li>
          </ul>
        </Section>

        <Section id="flowers" title="꽃밭">
          <ul>
            <li>
              업적(대표·다년생) 열매를 거두면 가꿈 +{CARE.harvest}, 그 쪽지의 근거를 열면 +{CARE.shine}. 한 업적에 하루{" "}
              {CARE_PER_DAY}까지 줄 수 있어요.
            </li>
            <li>
              모두의 가꿈이 {BLOOM_CARE}이 되면 만개해요. 만개한 업적마다 모두의 잼이 {pct(BLOOM_BONUS.each)} 늘어요(최대{" "}
              {pct(BLOOM_BONUS.max)}).
            </li>
            <li>그 업적을 가장 많이 가꾼 사람이 정원지기가 되고, 만개한 업적마다 하루 한 번 꽃꿀 {NECTAR}잼을 받아요.</li>
          </ul>
        </Section>

        <Section id="greenhouse" title="탐정 온실">
          <ul>
            <li>SNS에서 도는 주장 하나에, 그 말에 답하는 내용을 카드 셋 중에서 찾아요.</li>
            <li>
              하루 {CASE_PER_DAY}건. 처음에 맞히면 잼 {CASE_JAM.first}, 다시 골라 맞히면 {CASE_JAM.later}. 틀려도 잃는 건 없어요.
            </li>
            <li>
              사건 {CASE_BOX_EVERY}건을 풀 때마다 온실 상자가 열려요(
              {RAID_BOX.odds.map((o) => `${TIER_LABEL[o.tier]} ${pct(o.p)}`).join(" · ")}).
            </li>
          </ul>
        </Section>

        <Section id="dex" title="도감">
          <ul>
            <li>거둔 품종, 본 변이, 모은 쪽지가 쌓여요.</li>
            <li>
              지도에서 거둔 품종과 이어진 품종은 실루엣으로 보여요. 그 원본을 읽으면 씨앗을 받아요(품종마다 한 번, 하루{" "}
              {TRAIL_PER_DAY}번).
            </li>
          </ul>
        </Section>

        <Section id="room" title="내 방">
          <ul>
            <li>바구니의 열매를 잼으로 졸이는 대신 ‘전시하기’로 방에 둘 수 있어요. 다년생은 나무, 나머지는 화분이 되고, 변이는 화분 빛깔로 남아요. 전시한 열매는 다시 열매로 되돌릴 수 없어요.</li>
            <li>도감의 쪽지를 ‘액자에 걸기’로 벽에 걸어요(빈 액자틀 🍯 {FRAME_PRICE}). 반론·한계 쪽지도 같은 액자예요. 액자를 누르면 쪽지 전문과 출처, 원본 페이지가 열려요.</li>
            <li>가구·벽지·바닥재는 상점의 ‘가구’·‘벽·바닥’ 칸에서 정해진 값에 사요. 무작위로 나오는 것은 없고, 효과도 없어요 — 꾸밈일 뿐이에요. 책장은 도감, 라디오는 음악으로 가는 바로가기예요.</li>
            <li>방 넓히기: {ROOM_SIZES.map((r) => `${r.label} 벽 ${r.width}칸${r.price ? `(🍯 ${r.price.toLocaleString()})` : ""}`).join(" → ")}.</li>
            <li>‘자랑하기’를 켜면 방도 함께 보여요. 액자는 쪽지 번호만 싣고, 글은 보는 화면이 원본에서 읽어요.</li>
          </ul>
        </Section>

        <Section id="visit" title="친구 정원">
          <ul>
            <li>‘자랑하기’를 켜면 내 정원 링크가 생겨요. 닉네임만 보이고, 언제든 끌 수 있어요.</li>
            <li>
              친구 정원에 물을 주면 친구 텃밭과 내 텃밭의 자라는 작물이 남은 시간을 {pct(WATER_CUT)}씩 덜어요. 한 정원에 하루
              한 번, 하루 {WATER_PER_DAY}곳까지.
            </li>
            <li>
              내가 보낸 정원 링크로 처음 온 친구가 첫 열매를 거두면 둘 다 희귀 씨앗 상자를 받아요(
              {RAID_BOX.odds.map((o) => `${TIER_LABEL[o.tier]} ${pct(o.p)}`).join(" · ")}). 초대한 사람은 평생 {INVITE_CAP}명까지, 초대받은 사람은 한 번.
              링크를 보낸 횟수에는 보상이 없어요.
            </li>
            <li>
              칭호: {TITLE_ORDER.map((id) => `${TITLES[id].icon} ${TITLES[id].name}(${TITLES[id].what} ${TITLES[id].steps.join("·")}${TITLES[id].unit})`).join(", ")}.
              모을수록 ★이 늘어요. 내 정원과 공개한 정원에만 보이고, 순위표는 없어요.
            </li>
            <li>
              텃밭의 ‘다 익으면 알려 줄까요?’로 익는 시각을 내 캘린더에 넣을 수 있어요. 잼통이 알림을 보내지는 않아요.
              밤 {QUIET_FROM}시~아침 {QUIET_UNTIL}시에 익으면 아침 {QUIET_UNTIL}시로 맞춰요.
            </li>
          </ul>
        </Section>
      </div>
    </dialog>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={`guide-${id}`} aria-labelledby={`guide-${id}-title`} className="garden-guide-section">
      <h3 id={`guide-${id}-title`}>{title}</h3>
      {children}
    </section>
  );
}

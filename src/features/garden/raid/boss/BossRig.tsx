import { useId } from "react";

import type { RaidKindId } from "../../rules";
import type { RaidForm } from "../forms";
import { bossy, bossyPal } from "./bossy";
import { bribe, bribePal } from "./bribe";
import { grab, grabPal } from "./grab";
import { hate, hatePal } from "./hate";
import type { BossDraw, Paint, Palette } from "./parts";
import { rumor, rumorPal } from "./rumor";
import { troll, trollPal } from "./troll";

/**
 * 보스 그림 — 종류와 형태를 받아 겹을 쌓는다(docs/garden-raid-boss.md §2).
 *
 * 겹마다 <g className="boss-l boss-…">로 나뉘어 있어 CSS(garden.module.css의 "보스 리그")가 따로 움직인다.
 * 그림판 밖으로 뻗는 것(3형의 날개·덩굴)이 잘리지 않게 넘침을 보인다.
 */
const BOSS: Record<RaidKindId, { draw: BossDraw; pal: [Palette, Palette, Palette] }> = {
  troll: { draw: troll, pal: trollPal },
  hate: { draw: hate, pal: hatePal },
  rumor: { draw: rumor, pal: rumorPal },
  bribe: { draw: bribe, pal: bribePal },
  bossy: { draw: bossy, pal: bossyPal },
  grab: { draw: grab, pal: grabPal },
};

export function BossRig({
  kind,
  form,
  className = "",
  still,
}: {
  kind: RaidKindId;
  form: RaidForm;
  className?: string;
  /** 다른 그림 안에 작게, 움직이지 않게 놓는다(박제). 바깥 svg의 좌표다. */
  still?: { x: number; y: number; size: number };
}) {
  // 한 화면에 여럿(박제 진열)이 놓여도 그라데이션 id가 겹치지 않게.
  const uid = `boss${useId().replace(/[^a-zA-Z0-9]/g, "")}${kind}${form}`;
  const pal = BOSS[kind].pal[form - 1];
  const paint: Paint = { body: `url(#${uid}b)`, aura: `url(#${uid}a)`, glow: `url(#${uid}g)`, metal: `url(#${uid}m)` };
  const layers = BOSS[kind].draw(form, paint, pal);
  const place = still ? { x: still.x, y: still.y, width: still.size, height: still.size, className: "boss-still" } : { overflow: "visible", className: `boss-rig is-${kind} form-${form} ${className}` };
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" {...place}>
      <defs>
        <linearGradient id={`${uid}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pal.body[0]} />
          <stop offset="1" stopColor={pal.body[1]} />
        </linearGradient>
        <radialGradient id={`${uid}a`}>
          <stop offset="0" stopColor={pal.glow} stopOpacity=".6" />
          <stop offset=".55" stopColor={pal.glow} stopOpacity=".18" />
          <stop offset="1" stopColor={pal.glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}g`}>
          <stop offset="0" stopColor={pal.glow} stopOpacity=".95" />
          <stop offset="1" stopColor={pal.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={pal.metal[0]} />
          <stop offset="1" stopColor={pal.metal[1]} />
        </linearGradient>
      </defs>
      <g className="boss-l boss-aura">{layers.aura}</g>
      {layers.back && <g className="boss-l boss-back">{layers.back}</g>}
      <g className="boss-l boss-body">{layers.body}</g>
      {layers.armor && <g className="boss-l boss-armor">{layers.armor}</g>}
      <g className="boss-l boss-head">{layers.head}</g>
      {layers.front && <g className="boss-l boss-front">{layers.front}</g>}
    </svg>
  );
}

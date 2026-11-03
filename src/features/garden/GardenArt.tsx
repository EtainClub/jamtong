import type { CSSProperties } from "react";

import { fruitIcon } from "./rules";
import type { Species } from "./types";

/** Small local vector assets: no image requests or rendering engine on the game loop. */
export function PlantArt({ species, progress = 1, flower = false }: { species?: Species; progress?: number; flower?: boolean }) {
  const ripe = progress >= 1;
  const tree = species?.tier === "perennial";
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="garden-plant-art">
      <ellipse cx="60" cy="105" rx="32" ry="8" fill="#302d19" opacity=".18" />
      <path d={tree ? "M55 103 56 44 65 44 68 103Z" : "M57 103Q63 77 59 42"} fill={tree ? "#a26e40" : "none"} stroke={tree ? "#795132" : "#3c8642"} strokeWidth="5" strokeLinecap="round" />
      <path d="M59 87Q28 90 24 64Q51 59 60 82" fill="#56a94a" stroke="#34833d" strokeWidth="2" />
      <path d="M61 72Q89 77 97 49Q71 47 61 66" fill="#8bcf56" stroke="#4b9a42" strokeWidth="2" />
      <path d="M32 69 56 84M88 55 65 69" stroke="#c1e77f" strokeWidth="2" strokeLinecap="round" />
      {progress > .45 && <path d="M59 55Q35 54 35 31Q56 30 60 48" fill="#78be4e" stroke="#409042" strokeWidth="2" />}
      {tree && <><path d="M25 53 36 22 57 12 83 18 101 43 91 65 38 70Z" fill="#479f50" stroke="#35823d" strokeWidth="3" /><path d="m36 22 21-10 26 6 6 27-35 5Z" fill="#87c954" /></>}
      {flower ? <g transform="translate(59 39)"><g fill="#f4a9c7" stroke="#db7198" strokeWidth="2">{[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cy="-15" rx="11" ry="17" transform={`rotate(${a})`} />)}</g><circle r="11" fill="#ffe387" /><circle cx="-3" cy="-3" r="4" fill="#fff3b6" /></g> : ripe && species ? <text x="59" y={tree ? 64 : 68} textAnchor="middle" fontSize={tree ? 37 : 52}>{fruitIcon(species)}</text> : <path d="M60 45Q41 26 54 18Q71 15 68 35Z" fill="#a4d866" stroke="#579e44" strokeWidth="2" />}
      {ripe && <g fill="#fff5b0"><path d="m94 24 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" /><path d="m21 44 1 4 4 1-4 1-1 4-1-4-4-1 4-1Z" /></g>}
    </svg>
  );
}

export function WeedArt({ variant = 0, tough = false }: { variant?: number; tough?: boolean }) {
  return (
    <svg viewBox="0 0 80 88" aria-hidden="true" className="garden-weed-art">
      <ellipse cx="40" cy="76" rx="25" ry="7" fill="#345b2b" opacity=".2" />
      <path d="M39 74 36 83 41 80 46 84 43 73" fill="#cc9c60" />
      <g stroke="#398044" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M40 75Q37 54 40 26" fill="none" strokeWidth="4" />
        <path d="M39 65Q15 68 12 44Q31 38 39 60Z" fill="#6eb64c" />
        <path d="M42 60Q67 62 70 35Q49 34 42 54Z" fill="#94cc58" />
        <path d="M39 46Q19 45 23 21Q42 22 40 42Z" fill="#87c754" />
        <path d="M41 40Q55 28 48 12Q32 20 41 40Z" fill="#b4dd6c" />
        {tough && <path d="M37 72Q12 80 7 62Q25 52 37 67ZM44 70Q65 75 73 58Q54 49 44 65Z" fill="#54a451" />}
      </g>
      <path d="m18 48 17 14m28-20-17 14M27 27l10 15" stroke="#d1e995" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {variant === 1 && <g transform="translate(48 15)" fill="#f9eaa3"><circle cx="-4" cy="-3" r="4" /><circle cx="4" cy="-3" r="4" /><circle cy="4" r="4" /><circle r="3" fill="#e7b64b" /></g>}
      {variant === 2 && <g fill="#c2a5df"><circle cx="24" cy="23" r="4" /><circle cx="48" cy="12" r="4" /></g>}
    </svg>
  );
}

export function GardenScenery({ raining }: { raining: boolean }) {
  return (
    <div className={`garden-scenery ${raining ? "is-raining" : ""}`} aria-hidden="true">
      <div className="garden-sun" />
      <div className="garden-cloud cloud-one" /><div className="garden-cloud cloud-two" />
      <svg viewBox="0 0 560 180" preserveAspectRatio="none" className="garden-hills">
        <path d="M0 102Q80 33 210 102T560 80V180H0Z" fill="#a4cc78" />
        <path d="M0 140Q150 65 310 125T560 103V180H0Z" fill="#76b767" />
        <path d="M0 161Q170 119 340 153T560 139V180H0Z" fill="#5ea356" />
        <path d="M340 180 300 148 330 143 400 180Z" fill="#e1c28c" />
        <g fill="#3f8a4a"><path d="m26 126 15-59 18 59Z" /><path d="m482 126 18-70 21 70Z" /></g>
        <g fill="#f7eccb" stroke="#d6bc8b" strokeWidth="2"><path d="M0 150H560V157H0Z" />{Array.from({ length: 20 }, (_, i) => <path key={i} d={`m${i * 30 + 8} 169v-32l5-6 5 6v32Z`} />)}</g>
      </svg>
      <svg className="garden-butterfly" width="24" height="20" viewBox="0 0 24 20"><path d="M12 10C-3-8-3 17 10 13C-1 26 18 20 12 10ZM12 10C27-8 27 17 14 13C25 26 6 20 12 10Z" fill="#ffdf8b" stroke="#d5a15b" strokeWidth=".6" /><path d="M12 6v10" stroke="#88663e" strokeWidth="2" strokeLinecap="round" /></svg>
      {raining && <div className="garden-raindrops">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ left: `${i * 6.4}%`, animationDelay: `${-i * .17}s` }} />)}</div>}
    </div>
  );
}

export function GroundDetails() {
  return <div className="garden-ground-details" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} style={{ left: `${4 + (i * 37) % 92}%`, top: `${6 + (i * 23) % 88}%`, "--delay": `${-i * .4}s` } as CSSProperties}>{i % 3 === 0 ? "✿" : "ˬ"}</span>)}</div>;
}

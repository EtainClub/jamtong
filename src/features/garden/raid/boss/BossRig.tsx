import { useEffect } from "react";

import type { RaidKindId } from "../../rules";
import type { RaidForm } from "../forms";

/**
 * 보스 그림 — 종류(여섯)와 형태(셋)마다 그림 한 장(docs/garden-raid-boss.md §2, 3.1에서 그림으로 바꿨다).
 *
 * 그림은 public/images/raid/<종류>-<형태>.webp(640px, 투명 바탕). 잼통을 위해 새로 그린 것이다 — 이미지 생성 모델(GPT)로
 * 만들고 고른 것이며, 어떤 게임의 캐릭터도 본뜨지 않았다. 원본(1024px PNG)은 저장소에 두지 않는다.
 *
 * 움직임은 CSS(garden.module.css의 "보스 리그")가 준다 — 숨쉬기, 뒤의 빛, 맞을 때 흔들림.
 * 다음 형태 그림은 미리 받아 둔다. 변신하는 순간 빈 칸이 보이지 않게.
 */
export const BOSS_GLOW: Record<RaidKindId, string> = {
  troll: "#ff3d6e",
  hate: "#ffb23a",
  rumor: "#d98aff",
  bribe: "#ffcf2a",
  bossy: "#c98aff",
  grab: "#c8e04a",
};

export function bossSrc(kind: RaidKindId, form: RaidForm): string {
  return `/images/raid/${kind}-${form}.webp`;
}

export function BossRig({
  kind,
  form,
  className = "",
  still,
}: {
  kind: RaidKindId;
  form: RaidForm;
  className?: string;
  /** 다른 그림(svg) 안에 작게, 움직이지 않게 놓는다(박제). 바깥 svg의 좌표다. */
  still?: { x: number; y: number; size: number };
}) {
  // 다음 형태를 미리 받아 둔다.
  useEffect(() => {
    if (still || form >= 3) return;
    const next = new Image();
    next.src = bossSrc(kind, (form + 1) as RaidForm);
  }, [kind, form, still]);

  if (still) return <image href={bossSrc(kind, form)} x={still.x} y={still.y} width={still.size} height={still.size} preserveAspectRatio="xMidYMid meet" />;
  return (
    <span className={`boss-rig is-${kind} form-${form} ${className}`} style={{ ["--boss-glow" as string]: BOSS_GLOW[kind] }} aria-hidden="true">
      <span className="boss-aura" />
      {/* eslint-disable-next-line @next/next/no-img-element -- 이미 640px webp로 줄여 둔 정적 그림이다. 이미지 최적화 서버를 거치지 않는다. */}
      <img className="boss-img" src={bossSrc(kind, form)} alt="" width={640} height={640} draggable={false} decoding="async" />
    </span>
  );
}

import { BossRig } from "./raid/boss/BossRig";
import type { RaidForm } from "./raid/forms";
import type { RaidKindId } from "./rules";

/**
 * 거대 잡초 그림 — 종류(rules.ts RAID_KINDS)와 형태(raid/forms.ts)마다 생김새가 다르다.
 *
 * 그림은 raid/boss/에 있다(docs/garden-raid-boss.md §2). 광장의 작은 잡초(WeedArt)는 순한 풀이지만,
 * 거대 잡초는 사회를 갉아먹는 악초의 우두머리다 — 세게 그린다. 유혈 표현만 하지 않는다.
 * 여기는 싸움터 밖에서 쓰는 두 모습(쓰러지는 순간, 박제)을 낸다.
 */
export function RaidWeedArt({ kind, form = 1 }: { kind: RaidKindId; form?: RaidForm }) {
  return <BossRig kind={kind} form={form} className="garden-weed-art garden-raid-art" />;
}

/**
 * 악초 박제 — 쓰러뜨린 거대 잡초를 유리 덮개 아래 나무 받침에 세운 방 전시품(docs/garden-miniroom.md §7.4).
 * 몸은 1형 그림을 그대로 작게, 움직이지 않게 쓴다. 잼통 고유의 그림이다.
 */
export function RaidTrophyArt({ kind }: { kind: RaidKindId }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="garden-raid-trophy">
      <rect x="18" y="98" width="84" height="14" rx="2" fill="#9a6439" stroke="#3a2f2a" strokeWidth="3" />
      <rect x="40" y="102" width="40" height="6" fill="#ffd85c" stroke="#3a2f2a" strokeWidth="1.5" />
      <path d="M22 98V40Q22 10 60 10T98 40V98Z" fill="#2a2430" />
      <BossRig kind={kind} form={1} still={{ x: 24, y: 26, size: 72 }} />
      <path d="M22 98V40Q22 10 60 10T98 40V98" fill="#cfeefc" fillOpacity=".18" stroke="#3a2f2a" strokeWidth="3" />
      <path d="M32 40Q34 22 50 17" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".8" />
    </svg>
  );
}

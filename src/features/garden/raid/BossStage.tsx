import type { RaidKind } from "../rules";
import { FORM_ORDER, formName, type RaidForm } from "./forms";

/**
 * 보스의 무대 장치 — 변신 컷과 3형의 침범 겹(docs/garden-raid-boss.md §2.4·§2.5).
 *
 * 둘 다 그림일 뿐이다. 손을 막지 않는다(pointer-events: none) — 침범이 단추를 가리면 싸움이 아니라 고장이다.
 * 움직임은 CSS(garden.module.css의 "보스 무대")가 준다. 움직임 줄이기에서는 멈춘 그림으로 남는다.
 */

/** 형태가 바뀌는 순간의 컷. 번쩍임 → 충격파 → 이름 띠. 지켜보던 사람에게만 뜬다. */
export function MorphCut({ kind, form, prize = 0 }: { kind: RaidKind; form: RaidForm; prize?: number }) {
  return (
    <div className="raid-morph" role="status" aria-live="assertive">
      <span className="raid-morph-flash" aria-hidden="true" />
      <span className="raid-morph-ring" aria-hidden="true" />
      <span className="raid-morph-ring is-late" aria-hidden="true" />
      <p className="raid-morph-band">
        <small>{FORM_ORDER[form]}</small>
        <b>{formName(kind.id, form)}</b>
        {prize > 0 && <em>{form - 1}형 격파! 잼 +{prize.toLocaleString()}</em>}
      </p>
    </div>
  );
}

/** 가장자리를 따라 안으로 돋는 톱니. depth는 그림판(100×100) 단위. */
function teeth(depth: number, n: number): string {
  const top: string[] = [];
  const bottom: string[] = [];
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * 100;
    const d = i % 2 ? depth * (0.6 + ((i * 7) % 5) / 6) : 0;
    top.push(`${t.toFixed(1)} ${d.toFixed(1)}`);
    bottom.push(`${(100 - t).toFixed(1)} ${(100 - d).toFixed(1)}`);
    right.push(`${(100 - d * 0.55).toFixed(1)} ${t.toFixed(1)}`);
    left.push(`${(d * 0.55).toFixed(1)} ${(100 - t).toFixed(1)}`);
  }
  return `M0 0L${top.join("L")}L${right.join("L")}L${bottom.join("L")}L${left.join("L")}Z M-5 -5H105V105H-5Z`;
}

const COINS = [6, 18, 31, 44, 57, 69, 82, 93];

/**
 * 3형이 화면을 침범한다 — 전체 화면 무대의 가장자리에서 종류마다 다른 것이 자란다.
 * 악플: 가시 / 혐오: 불길과 가운데의 금 / 가짜뉴스: 속보 띠 / 검은돈: 쏟아지는 금화 / 갑질: 위에서 덮는 그림자 / 땅투기: 휘감는 덩굴.
 */
export function Invade({ kind }: { kind: RaidKind }) {
  const sharp = kind.id === "grab" ? 26 : kind.id === "bossy" ? 12 : 40;
  return (
    <div className={`raid-invade is-${kind.id}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={teeth(kind.id === "hate" ? 5 : 4, sharp)} fillRule="evenodd" />
      </svg>
      {kind.id === "hate" && <span className="raid-invade-crack" />}
      {kind.id === "bossy" && <span className="raid-invade-shade" />}
      {kind.id === "rumor" && (
        <span className="raid-invade-ticker">
          <span>속보 · 단독 · 카더라 · 속보 · 아니면 말고 · 단독 · 카더라 · 속보 · 단독 · 카더라 · 속보 · 아니면 말고 · </span>
        </span>
      )}
      {kind.id === "bribe" &&
        COINS.map((x, i) => (
          <span key={x} className="raid-invade-coin" style={{ left: `${x}%`, animationDelay: `${(i * 0.43) % 3}s`, animationDuration: `${2.6 + (i % 3) * 0.7}s` }}>
            ₩
          </span>
        ))}
    </div>
  );
}

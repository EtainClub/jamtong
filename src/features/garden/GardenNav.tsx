"use client";

import { gardenFeedback } from "./feedback";
import { SEGMENTS, TABS, type GardenTab, type Segment } from "./nav";

/**
 * 정원의 하단 탭 — /garden에서는 사이트 하단 탭(BottomNav) 대신 이것을 그린다
 * (docs/garden-miniroom.md §3.1). 엄지가 닿는 자리다. 정보 페이지로 돌아가는 길은
 * 위쪽 바의 "← 잼통"이 맡는다.
 *
 * 탭 목록(tablist) 의미는 예전 위쪽 탭과 같다 — 화살표·Home·End로 옮겨 다닌다.
 */
export function GardenNav({
  tab,
  onTab,
  ripe,
  overgrown,
  knocks = 0,
}: {
  tab: GardenTab | null;
  onTab: (tab: GardenTab) => void;
  ripe: number;
  overgrown: boolean;
  /** 받은 1촌 신청 수. */
  knocks?: number;
}) {
  return (
    <nav aria-label="정원 메뉴" className="garden-bottom-nav">
      <div role="tablist" aria-label="정원" className="garden-bottom-tabs">
        {TABS.map((t, index) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              id={`garden-tab-${t.id}`}
              aria-controls={on ? `garden-panel-${t.id}` : undefined}
              aria-selected={on}
              tabIndex={on || (tab === null && index === 0) ? 0 : -1}
              onKeyDown={(e) => {
                const at = Math.max(0, TABS.findIndex((item) => item.id === tab));
                const next = e.key === "ArrowRight" ? (at + 1) % TABS.length : e.key === "ArrowLeft" ? (at + TABS.length - 1) % TABS.length : e.key === "Home" ? 0 : e.key === "End" ? TABS.length - 1 : -1;
                if (next < 0) return;
                e.preventDefault();
                onTab(TABS[next].id);
                document.getElementById(`garden-tab-${TABS[next].id}`)?.focus();
              }}
              onClick={() => { gardenFeedback("tap"); onTab(t.id); }}
              className="garden-bottom-tab"
            >
              <span aria-hidden="true" className="garden-bottom-icon">{t.icon}</span>
              <span>{t.label}</span>
              {t.id === "beds" && ripe > 0 && (
                <span className="garden-badge" aria-label={`익은 밭 ${ripe}칸`}>{ripe}</span>
              )}
              {t.id === "friends" && knocks > 0 && (
                <span className="garden-badge" aria-label={`받은 1촌 신청 ${knocks}`}>{knocks}</span>
              )}
              {t.id === "plaza" && overgrown && (
                <span className="garden-badge is-weed" aria-label="광장이 무성해요">!</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/** 탭 안의 두 칸 전환([텃밭 | 온실], [광장 | 꽃밭]). 칸이 하나면 그리지 않는다. */
export function SegmentSwitch({ tab, seg, onSeg }: { tab: GardenTab; seg: Segment; onSeg: (seg: Segment) => void }) {
  const segs = SEGMENTS[tab];
  if (segs.length < 2 || tab === "room") return null;
  return (
    <div role="group" aria-label="칸 전환" className="garden-segment">
      {segs.map((s) => (
        <button key={s.id} type="button" aria-pressed={seg === s.id} onClick={() => { gardenFeedback("tap"); onSeg(s.id); }}>
          {s.label}
        </button>
      ))}
    </div>
  );
}

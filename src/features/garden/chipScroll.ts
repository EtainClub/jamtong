/**
 * 가로로 넘치는 칩 줄(.garden-chips)을 데스크톱에서도 넘긴다.
 *
 * 모바일은 손가락으로 밀면 되지만, 데스크톱 마우스는 세로 휠만 돌고 스크롤바도 숨겨 두어
 * 오른쪽 칩(옷장·음원 등)에 닿을 길이 없었다(2026-11-22). 칩 줄이 여러 화면에 흩어져 있어
 * 하나씩 고치지 않고 문서에 한 번 건다:
 *   - 세로 휠 → 가로로 넘긴다(넘칠 때만, 끝에 닿으면 페이지가 대신 내려간다).
 *   - 마우스로 끌어 넘긴다. 끌었으면 손을 뗄 때의 클릭은 먹는다.
 */

const SELECTOR = ".garden-chips";
const DRAG_PX = 5;

function rowOf(target: EventTarget | null): HTMLElement | null {
  const row = target instanceof Element ? target.closest<HTMLElement>(SELECTOR) : null;
  return row && row.scrollWidth > row.clientWidth + 1 ? row : null;
}

export function installChipScroll(doc: Document = document): () => void {
  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
    const row = rowOf(e.target);
    if (!row) return;
    const max = row.scrollWidth - row.clientWidth;
    const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    if ((delta < 0 && row.scrollLeft <= 0) || (delta > 0 && row.scrollLeft >= max - 1)) return;
    e.preventDefault();
    row.scrollLeft += delta;
  };

  let drag: { row: HTMLElement; x: number; left: number; moved: boolean } | null = null;
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const row = rowOf(e.target);
    if (row) drag = { row, x: e.clientX, left: row.scrollLeft, moved: false };
  };
  const onMove = (e: PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < DRAG_PX) return;
    drag.moved = true;
    drag.row.scrollLeft = drag.left - dx;
  };
  const onUp = () => {
    if (!drag?.moved) {
      drag = null;
      return;
    }
    // 끈 직후 뒤따르는 click 하나만 막는다.
    const swallow = (ev: MouseEvent) => {
      ev.stopPropagation();
      ev.preventDefault();
    };
    doc.addEventListener("click", swallow, { capture: true, once: true });
    setTimeout(() => doc.removeEventListener("click", swallow, { capture: true }), 0);
    drag = null;
  };

  doc.addEventListener("wheel", onWheel, { passive: false });
  doc.addEventListener("pointerdown", onDown);
  doc.addEventListener("pointermove", onMove);
  doc.addEventListener("pointerup", onUp);
  doc.addEventListener("pointercancel", onUp);
  return () => {
    doc.removeEventListener("wheel", onWheel);
    doc.removeEventListener("pointerdown", onDown);
    doc.removeEventListener("pointermove", onMove);
    doc.removeEventListener("pointerup", onUp);
    doc.removeEventListener("pointercancel", onUp);
  };
}

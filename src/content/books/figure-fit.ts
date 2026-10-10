/**
 * 도형 글자가 칸에 들어가는가.
 *
 * 도형은 320×240 SVG라 글자가 칸을 넘으면 접히지 않고 잘리거나 칸 밖으로
 * 샌다. 실제로 steps 칸(58~84px)에 "65만 명 중 20만 등"을 넣었다가 앞뒤가
 * 잘렸다. 그래서 그리는 쪽(Figure)과 검사하는 쪽(validateBook)이 같은 계산을
 * 쓴다 — 화면은 줄이고 접어서라도 넣고, 그래도 안 들어가면 빌드가 깨진다.
 *
 * 글자 폭은 어림이다. 브라우저 없이 재야 해서 글꼴을 읽지 않는다. 한글은
 * 정사각에 가깝고(1em), 숫자와 라틴 글자는 그 절반 남짓이다.
 */

function emWidth(char: string): number {
  if (char === " ") return 0.3;
  if (/[0-9]/.test(char)) return 0.6;
  if (/[A-Za-z]/.test(char)) return 0.62;
  if (/[.,·:;'"!?()~%\-–—/]/.test(char)) return 0.4;
  return 1;
}

export function textWidth(text: string, fontSize: number): number {
  return [...text].reduce((sum, char) => sum + emWidth(char), 0) * fontSize;
}

export interface Fitted {
  size: number;
  lines: string[];
  /** 가장 작은 글자로 두 줄로 접어도 넘친다. */
  overflow: boolean;
}

/** 가운데에 가장 가까운 띄어쓰기에서 두 줄로 가른다. 띄어쓰기가 없으면 글자 수 가운데. */
function split(text: string): [string, string] {
  const middle = text.length / 2;
  let best = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " " && (best === -1 || Math.abs(i - middle) < Math.abs(best - middle))) best = i;
  }
  if (best === -1) {
    const at = Math.ceil(middle);
    return [text.slice(0, at), text.slice(at)];
  }
  return [text.slice(0, best), text.slice(best + 1)];
}

/**
 * 글자를 칸에 맞춘다. 먼저 한 줄로 크기를 줄이고, 그래도 안 되면 두 줄로 접는다.
 * maxLines가 1이면 접지 않는다.
 */
export function fit(text: string, width: number, size: number, min: number, maxLines: 1 | 2 = 1): Fitted {
  for (let s = size; s >= min; s -= 0.5) {
    if (textWidth(text, s) <= width) return { size: s, lines: [text], overflow: false };
  }
  if (maxLines === 2) {
    const lines = split(text);
    for (let s = size; s >= min; s -= 0.5) {
      if (lines.every((line) => textWidth(line, s) <= width)) return { size: s, lines, overflow: false };
    }
    return { size: min, lines, overflow: true };
  }
  return { size: min, lines: [text], overflow: true };
}

interface Slot {
  width: number;
  size: number;
  min: number;
  lines: 1 | 2;
}

/** steps 칸 하나의 폭. 무대 288px을 칸 수로 나누고 사이 화살표 자리 18px을 뺀다. */
export function stepWidth(count: number): number {
  return (288 - (count - 1) * 18) / count;
}

/** 도형마다 글자가 앉는 자리. Figure가 이 값으로 그리고 checkFigure가 이 값으로 잰다. */
export const SLOT = {
  caption: { width: 300, size: 14, min: 11, lines: 1 },
  numberNote: { width: 300, size: 13, min: 10, lines: 2 },
  versusLabel: { width: 140, size: 12, min: 10, lines: 1 },
  versusValue: { width: 116, size: 22, min: 12, lines: 2 },
  versusMiddle: { width: 300, size: 13, min: 11, lines: 1 },
  stackTitle: { width: 290, size: 12, min: 10, lines: 1 },
  stackLabel: { width: 144, size: 13.5, min: 10, lines: 1 },
  stackValue: { width: 118, size: 11.5, min: 9.5, lines: 2 },
  footerLabel: { width: 100, size: 12, min: 10, lines: 1 },
  footerValue: { width: 180, size: 32, min: 13, lines: 1 },
  barLabel: { width: 284, size: 12, min: 10, lines: 1 },
  gridLabel: { width: 290, size: 13, min: 10, lines: 1 },
  stepLabel: (count: number): Slot => ({ width: stepWidth(count) - 8, size: count > 3 ? 12.5 : 14, min: 10, lines: 2 }),
  stepValue: (count: number): Slot => ({ width: stepWidth(count) - 8, size: 11, min: 9, lines: 2 }),
} satisfies Record<string, Slot | ((count: number) => Slot)>;

export function fitSlot(text: string, slot: Slot): Fitted {
  return fit(text, slot.width, slot.size, slot.min, slot.lines);
}

/**
 * 도형의 글자 가운데 칸을 넘는 것. 빌드에서 깨진다.
 *
 * 타입은 schema.ts의 BookFigure와 같은 모양이지만, schema가 이 파일을 쓰므로
 * 순환을 피하려고 구조만 받는다.
 */
export function checkFigure(figure: FigureShape): string[] {
  const texts: [string, string | undefined, Slot][] = [];
  const add = (where: string, text: string | undefined, slot: Slot) => texts.push([where, text, slot]);

  if ("caption" in figure && figure.caption) add("caption", figure.caption, SLOT.caption);
  switch (figure.kind) {
    case "number":
      add("note", figure.note, SLOT.numberNote);
      break;
    case "versus":
      for (const [side, cell] of [["left", figure.left], ["right", figure.right]] as const) {
        add(`${side}.label`, cell.label, SLOT.versusLabel);
        add(`${side}.value`, cell.value, SLOT.versusValue);
      }
      add("middle", figure.middle, SLOT.versusMiddle);
      break;
    case "stack":
      add("title", figure.title, SLOT.stackTitle);
      figure.items.forEach((item, i) => {
        add(`items[${i}].label`, item.label, SLOT.stackLabel);
        add(`items[${i}].value`, item.value, SLOT.stackValue);
      });
      add("footer.label", figure.footer?.label, SLOT.footerLabel);
      add("footer.value", figure.footer?.value, SLOT.footerValue);
      break;
    case "steps":
      figure.steps.forEach((step, i) => {
        add(`steps[${i}].label`, step.label, SLOT.stepLabel(figure.steps.length));
        add(`steps[${i}].value`, step.value, SLOT.stepValue(figure.steps.length));
      });
      break;
    case "bars":
      figure.bars.forEach((bar, i) => add(`bars[${i}].label`, bar.label, SLOT.barLabel));
      break;
    case "grid":
      add("label", figure.label, SLOT.gridLabel);
      break;
  }

  return texts
    .filter(([, text, slot]) => text && fitSlot(text, slot).overflow)
    .map(([where, text]) => `${figure.kind}.${where} "${text}" — 칸에 들어가지 않는다`);
}

interface Cell {
  label: string;
  value?: string;
}
type FigureShape =
  | { kind: "number"; caption: string; note?: string }
  | { kind: "versus"; caption: string; left: Cell; right: Cell; middle?: string }
  | { kind: "stack"; title: string; items: Cell[]; footer?: Cell }
  | { kind: "line"; caption: string }
  | { kind: "steps"; caption: string; steps: Cell[] }
  | { kind: "bars"; caption: string; bars: { label: string }[] }
  | { kind: "grid"; caption: string; label: string };

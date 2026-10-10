import type { BookFigure, FigureTone } from "@/content/books/schema";
import { SLOT, fitSlot, stepWidth, textWidth } from "@/content/books/figure-fit";

/**
 * 장면 도형.
 *
 * 일곱 가지만 그린다. 장면마다 그림을 따로 그리지 않고 데이터를 받아 같은
 * 도형에 앉힌다 — 스물두 장에 예순여섯 장면이라, 낱장으로 그리면 서로 말이
 * 다른 그림 예순여섯 개가 남는다.
 *
 * 무대는 업적·언행과 같은 320×240. 글자는 적고 수가 먼저 온다.
 */

const LABEL = { fontFamily: "inherit", fontWeight: 800 } as const;
const COLOR: Record<FigureTone, string> = {
  navy: "var(--navy)",
  burgundy: "var(--burgundy)",
  ash: "var(--stone)",
};
/** 그 톤의 면 위에 얹는 글자색. */
const ON: Record<FigureTone, string> = {
  navy: "var(--canvas)",
  burgundy: "var(--canvas)",
  ash: "var(--graphite)",
};

function Stage({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

type SlotSpec = Parameters<typeof fitSlot>[1];

/**
 * 칸에 맞춘 글자. 넘치면 줄이고, 그래도 넘치면 두 줄로 접는다(figure-fit).
 * y는 글자 덩어리의 가운데 기준선이다 — 두 줄이면 위아래로 반 줄씩 벌린다.
 */
function FitText({
  text,
  box,
  y,
  ...props
}: { text: string; box: SlotSpec; y: number } & Omit<React.SVGProps<SVGTextElement>, "y" | "fontSize" | "slot">) {
  const { size, lines } = fitSlot(text, box);
  const lead = size * 1.2;
  const top = y - ((lines.length - 1) * lead) / 2;
  return (
    <text y={top} fontSize={size} {...props}>
      {lines.map((line, i) => (
        <tspan key={i} x={props.x} dy={i === 0 ? 0 : lead}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function Caption({ children, tone = "ink" }: { children: string; tone?: string }) {
  return (
    <FitText text={children} box={SLOT.caption} x={160} y={222} textAnchor="middle" {...LABEL} fill={`var(--${tone})`} />
  );
}

export function Figure({ figure }: { figure: BookFigure }) {
  switch (figure.kind) {
    case "number":
      return (
        <Stage label={`${figure.value}${figure.unit ?? ""} — ${figure.caption}`}>
          <text
            x={160}
            y={124}
            textAnchor="middle"
            fontSize={figure.value.length > 5 ? 44 : 62}
            {...LABEL}
            fill={COLOR[figure.tone ?? "burgundy"]}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {figure.value}
            {figure.unit && (
              <tspan fontSize={24} dx={4}>
                {figure.unit}
              </tspan>
            )}
          </text>
          {figure.note && (
            <FitText text={figure.note} box={SLOT.numberNote} x={160} y={162} textAnchor="middle" fill="var(--ash)" />
          )}
          <Caption>{figure.caption}</Caption>
        </Stage>
      );

    case "versus": {
      const side = (cell: typeof figure.left, x: number) => {
        const tone = cell.tone ?? "ash";
        return (
          <g>
            <FitText text={cell.label} box={SLOT.versusLabel} x={x + 66} y={62} textAnchor="middle" fontWeight={600} fill="var(--smoke)" />
            <rect x={x} y={74} width={132} height={68} rx={12} fill={COLOR[tone]} />
            {cell.value && (
              <FitText text={cell.value} box={SLOT.versusValue} x={x + 66} y={115} textAnchor="middle" {...LABEL} fill={ON[tone]} />
            )}
          </g>
        );
      };

      return (
        <Stage label={`${figure.left.label} ${figure.left.value ?? ""}, ${figure.right.label} ${figure.right.value ?? ""}`}>
          {side(figure.left, 12)}
          {side(figure.right, 176)}
          {/*
            * 가운데 말은 두 블록 사이가 아니라 아래에 눕힌다. 사이는 32px뿐이라
            * 글자가 블록에 가린다 — 실제로 "같은 곳"이 그렇게 사라졌다.
            */}
          {figure.middle && (
            <FitText text={figure.middle} box={SLOT.versusMiddle} x={160} y={164} textAnchor="middle" {...LABEL} fill="var(--graphite)" />
          )}
          <path d="M18 176 H302" stroke="var(--stone)" strokeWidth={2} />
          <Caption>{figure.caption}</Caption>
        </Stage>
      );
    }

    case "stack":
      return (
        <Stage label={`${figure.title}: ${figure.items.map((i) => i.label).join(", ")}`}>
          <FitText text={figure.title} box={SLOT.stackTitle} x={16} y={40} fontWeight={600} fill="var(--smoke)" />
          {figure.items.map((item, i) => (
            <g key={item.label}>
              <rect
                x={16}
                y={52 + i * 40}
                width={166}
                height={32}
                rx={8}
                fill={COLOR[item.tone ?? "burgundy"]}
              />
              <FitText text={item.label} box={SLOT.stackLabel} x={30} y={73 + i * 40} {...LABEL} fill={ON[item.tone ?? "burgundy"]} />
              {item.value && (
                <FitText text={item.value} box={SLOT.stackValue} x={192} y={72 + i * 40} fill="var(--ash)" />
              )}
            </g>
          ))}
          {figure.footer && (
            <g>
              <path
                d={`M16 ${62 + figure.items.length * 40} H304`}
                stroke="var(--stone)"
                strokeWidth={2}
              />
              <FitText text={figure.footer.label} box={SLOT.footerLabel} x={16} y={90 + figure.items.length * 40} fontWeight={600} fill="var(--smoke)" />
              {figure.footer.value && (
                <FitText
                  text={figure.footer.value}
                  box={SLOT.footerValue}
                  x={122}
                  y={96 + figure.items.length * 40}
                  {...LABEL}
                  fill="var(--ink)"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                />
              )}
            </g>
          )}
        </Stage>
      );

    case "line": {
      const n = figure.points.length;
      const at = (i: number) => 30 + (i * 260) / (n - 1);
      const height = (y: number) => 176 - (y / 100) * 130;

      return (
        <Stage label={figure.points.map((p) => p.label).join(" → ")}>
          <path d="M18 186 H302" stroke="var(--stone)" strokeWidth={2} />
          <path
            d={figure.points.map((p, i) => `${i === 0 ? "M" : "L"}${at(i)} ${height(p.y)}`).join(" ")}
            fill="none"
            stroke="var(--navy)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {figure.points.map((p, i) => {
            const tone = p.tone ?? "navy";
            /* 낮은 점은 아래, 높은 점은 위에 이름을 단다. 선과 겹치지 않게. */
            const below = p.y < 40;
            return (
              <g key={p.label}>
                <circle
                  cx={at(i)}
                  cy={height(p.y)}
                  r={i === n - 1 ? 9 : 6}
                  fill={COLOR[tone === "ash" ? "navy" : tone]}
                />
                <text
                  x={at(i)}
                  y={below ? height(p.y) + 21 : height(p.y) - 15}
                  textAnchor="middle"
                  fontSize={11.5}
                  fontWeight={700}
                  fill={tone === "burgundy" ? "var(--burgundy)" : "var(--graphite)"}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
          <Caption>{figure.caption}</Caption>
        </Stage>
      );
    }

    case "steps": {
      const n = figure.steps.length;
      const width = stepWidth(n);

      return (
        <Stage label={figure.steps.map((s) => s.label).join(" → ")}>
          {figure.steps.map((step, i) => {
            const tone = step.tone ?? (i === n - 1 ? "navy" : "ash");
            const x = 16 + i * (width + 18);
            return (
              <g key={step.label}>
                <rect x={x} y={78} width={width} height={62} rx={10} fill={COLOR[tone]} />
                {/* 이름과 값이 각각 두 줄까지 접힌다. 칸(78~140) 안에서 덩어리째 가운데에 둔다. */}
                {(() => {
                  const label = fitSlot(step.label, SLOT.stepLabel(n));
                  const value = step.value ? fitSlot(step.value, SLOT.stepValue(n)) : undefined;
                  const labelHeight = label.lines.length * label.size * 1.2;
                  const valueHeight = value ? value.lines.length * value.size * 1.2 + 4 : 0;
                  const top = 109 - (labelHeight + valueHeight) / 2;
                  return (
                    <>
                      <FitText
                        text={step.label}
                        box={SLOT.stepLabel(n)}
                        x={x + width / 2}
                        y={top + labelHeight / 2 + label.size * 0.35}
                        textAnchor="middle"
                        {...LABEL}
                        fill={ON[tone]}
                      />
                      {step.value && value && (
                        <FitText
                          text={step.value}
                          box={SLOT.stepValue(n)}
                          x={x + width / 2}
                          y={top + labelHeight + 4 + (valueHeight - 4) / 2 + value.size * 0.35}
                          textAnchor="middle"
                          fill={ON[tone]}
                          opacity={0.8}
                        />
                      )}
                    </>
                  );
                })()}
                {i < n - 1 && (
                  <path
                    d={`M${x + width + 4} 109 H${x + width + 14}`}
                    stroke="var(--graphite)"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}
          <Caption>{figure.caption}</Caption>
        </Stage>
      );
    }

    case "bars":
      return (
        <Stage label={figure.bars.map((b) => `${b.label} ${b.value}`).join(", ")}>
          {figure.bars.map((bar, i) => {
            const width = Math.max((bar.ratio / 100) * 284, 74);
            const tone = bar.tone ?? (i === 0 ? "burgundy" : "navy");
            /* 막대가 길면 값이 무대 밖으로 나간다. 그럴 때는 막대 안에 넣는다. 값의 폭은 재서 본다. */
            const inside = 18 + width + 8 + textWidth(bar.value, 13) > 316;

            return (
              <g key={bar.label}>
                <FitText text={bar.label} box={SLOT.barLabel} x={18} y={54 + i * 58} fontWeight={600} fill="var(--smoke)" />
                <rect x={18} y={62 + i * 58} width={width} height={30} rx={15} fill={COLOR[tone]} />
                <text
                  x={inside ? 18 + width - 14 : 18 + width + 8}
                  y={83 + i * 58}
                  textAnchor={inside ? "end" : "start"}
                  fontSize={13}
                  {...LABEL}
                  fill={inside ? ON[tone] : "var(--graphite)"}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {bar.value}
                </text>
              </g>
            );
          })}
          <Caption>{figure.caption}</Caption>
        </Stage>
      );

    case "grid": {
      const cols = 10;
      const size = figure.total > 30 ? 13 : 18;
      const gap = figure.total > 30 ? 6 : 9;

      return (
        <Stage label={`${figure.total} 가운데 ${figure.filled} — ${figure.label}`}>
          {Array.from({ length: figure.total }).map((_, i) => (
            <circle
              key={i}
              cx={26 + (i % cols) * (size + gap)}
              cy={58 + Math.floor(i / cols) * (size + gap)}
              r={size / 2}
              fill={i < figure.filled ? "var(--navy)" : "var(--stone)"}
            />
          ))}
          <FitText text={figure.label} box={SLOT.gridLabel} x={18} y={182} {...LABEL} fill="var(--navy)" />
          <Caption>{figure.caption}</Caption>
        </Stage>
      );
    }
  }
}

import type { BookFigure, FigureTone } from "@/content/books/schema";

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

function Caption({ children, tone = "ink" }: { children: string; tone?: string }) {
  return (
    <text x={160} y={222} textAnchor="middle" fontSize={14} {...LABEL} fill={`var(--${tone})`}>
      {children}
    </text>
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
            <text x={160} y={158} textAnchor="middle" fontSize={13} fill="var(--ash)">
              {figure.note}
            </text>
          )}
          <Caption>{figure.caption}</Caption>
        </Stage>
      );

    case "versus": {
      const side = (cell: typeof figure.left, x: number) => {
        const tone = cell.tone ?? "ash";
        return (
          <g>
            <text x={x + 66} y={62} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--smoke)">
              {cell.label}
            </text>
            <rect x={x} y={74} width={132} height={68} rx={12} fill={COLOR[tone]} />
            <text
              x={x + 66}
              y={116}
              textAnchor="middle"
              fontSize={cell.value && cell.value.length > 6 ? 17 : 22}
              {...LABEL}
              fill={ON[tone]}
            >
              {cell.value ?? ""}
            </text>
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
            <text x={160} y={164} textAnchor="middle" fontSize={13} {...LABEL} fill="var(--graphite)">
              {figure.middle}
            </text>
          )}
          <path d="M18 176 H302" stroke="var(--stone)" strokeWidth={2} />
          <Caption>{figure.caption}</Caption>
        </Stage>
      );
    }

    case "stack":
      return (
        <Stage label={`${figure.title}: ${figure.items.map((i) => i.label).join(", ")}`}>
          <text x={16} y={40} fontSize={12} fontWeight={600} fill="var(--smoke)">
            {figure.title}
          </text>
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
              <text x={30} y={73 + i * 40} fontSize={13.5} {...LABEL} fill={ON[item.tone ?? "burgundy"]}>
                {item.label}
              </text>
              {item.value && (
                <text x={192} y={73 + i * 40} fontSize={11.5} fill="var(--ash)">
                  {item.value}
                </text>
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
              <text x={16} y={90 + figure.items.length * 40} fontSize={12} fontWeight={600} fill="var(--smoke)">
                {figure.footer.label}
              </text>
              <text
                x={122}
                y={96 + figure.items.length * 40}
                fontSize={32}
                {...LABEL}
                fill="var(--ink)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {figure.footer.value}
              </text>
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
      const width = (288 - (n - 1) * 18) / n;

      return (
        <Stage label={figure.steps.map((s) => s.label).join(" → ")}>
          {figure.steps.map((step, i) => {
            const tone = step.tone ?? (i === n - 1 ? "navy" : "ash");
            const x = 16 + i * (width + 18);
            return (
              <g key={step.label}>
                <rect x={x} y={78} width={width} height={62} rx={10} fill={COLOR[tone]} />
                <text
                  x={x + width / 2}
                  y={step.value ? 106 : 114}
                  textAnchor="middle"
                  fontSize={n > 3 ? 12.5 : 14}
                  {...LABEL}
                  fill={ON[tone]}
                >
                  {step.label}
                </text>
                {step.value && (
                  <text
                    x={x + width / 2}
                    y={126}
                    textAnchor="middle"
                    fontSize={11}
                    fill={ON[tone]}
                    opacity={0.8}
                  >
                    {step.value}
                  </text>
                )}
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
            /* 막대가 길면 값이 무대 밖으로 나간다. 그럴 때는 막대 안에 넣는다. */
            const inside = 18 + width + 60 > 316;

            return (
              <g key={bar.label}>
                <text x={18} y={54 + i * 58} fontSize={12} fontWeight={600} fill="var(--smoke)">
                  {bar.label}
                </text>
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
          <text x={18} y={182} fontSize={13} {...LABEL} fill="var(--navy)">
            {figure.label}
          </text>
          <Caption>{figure.caption}</Caption>
        </Stage>
      );
    }
  }
}

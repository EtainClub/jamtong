import Link from "next/link";
import type { ReactNode } from "react";

import { resolveAnchor, type ResolvedAnchor } from "./anchors";

/**
 * 위키 마크다운을 화면으로 옮긴다.
 *
 * 범용 파서를 들이지 않는다. 여기서 다루는 것은 `wiki/`가 실제로 쓰는
 * 좁은 문법뿐이고 — 제목, 문단, 목록, 표, 가로줄, 굵게·코드·취소선,
 * 위키링크, 앵커 — 그 범위는 `pnpm wiki:lint`가 고정해 준다. 라이브러리를
 * 하나 더 얹는 대신 dangerouslySetInnerHTML 없이 React 노드로 바로 만든다.
 *
 * 앵커는 각주로 모은다. 문장마다 긴 출처가 끼면 글을 읽을 수 없고, 출처를
 * 지우면 위키가 아니게 된다. 번호를 달고 아래에 모으는 편이 둘 다 지킨다.
 */

export interface RenderedWiki {
  nodes: ReactNode;
  /** 본문에 나온 순서대로, 같은 앵커는 한 번만. */
  notes: ResolvedAnchor[];
}

const INLINE =
  /(\*\*[^*]+\*\*)|(`[^`]+`)|(~~[^~]+~~)|(\[\[[^\]]+\]\])|(\^\[[^\]]+\])/g;

/**
 * 위키링크를 한글 제목으로 바꾸면 뒤따르는 조사가 어긋난다.
 * `[[concept/power-and-responsibility]]가`는 원문에서 자연스럽지만 화면에서는
 * "권한과 책임가"가 된다. 삽입한 제목의 받침을 보고 조사를 맞춘다.
 */
const JOSA: Array<[string, string]> = [
  ["은", "는"],
  ["이", "가"],
  ["을", "를"],
  ["과", "와"],
  ["으로", "로"],
];

function hasBatchim(word: string): boolean | null {
  const code = word.charCodeAt(word.length - 1);
  if (Number.isNaN(code) || code < 0xac00 || code > 0xd7a3) return null;
  return (code - 0xac00) % 28 !== 0;
}

/** ㄹ 받침은 '으로'가 아니라 '로'를 받는다. */
function isRieul(word: string): boolean {
  const code = word.charCodeAt(word.length - 1);
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 === 8;
}

function fixJosa(text: string, inserted: string): string {
  const batchim = hasBatchim(inserted);
  if (batchim === null) return text;
  for (const [withB, withoutB] of JOSA) {
    for (const form of [withB, withoutB]) {
      if (!text.startsWith(form)) continue;
      const rest = text.slice(form.length);
      /* 조사로 쓰인 것이 맞는지: 뒤가 글자로 이어지면 단어의 일부다. */
      if (/^[가-힣]/.test(rest)) return text;
      const correct =
        withB === "으로" ? (batchim && !isRieul(inserted) ? "으로" : "로") : batchim ? withB : withoutB;
      return correct + rest;
    }
  }
  return text;
}

interface Ctx {
  /** 위키 페이지 이름 → 제목. 위키링크에 한글 제목을 보여 준다. */
  titles: Map<string, string>;
  notes: ResolvedAnchor[];
  index: Map<string, number>;
}

function inline(text: string, ctx: Ctx, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  /* 바로 앞에서 위키링크가 넣은 제목. 뒤따르는 조사를 맞추는 데 쓴다. */
  let inserted: string | null = null;

  const pushText = (chunk: string) => {
    out.push(inserted ? fixJosa(chunk, inserted) : chunk);
    inserted = null;
  };

  for (const match of text.matchAll(INLINE)) {
    const at = match.index ?? 0;
    if (at > last) pushText(text.slice(last, at));
    last = at + match[0].length;
    const k = `${keyBase}-${key++}`;
    /* 위키링크가 아니면 앞의 제목은 더 이상 조사에 관여하지 않는다. */
    inserted = null;

    if (match[1]) {
      out.push(<strong key={k} className="font-bold text-ink">{match[1].slice(2, -2)}</strong>);
    } else if (match[2]) {
      out.push(
        <code key={k} className="rounded bg-taupe px-1 py-0.5 font-mono text-[0.85em] text-navy">
          {match[2].slice(1, -1)}
        </code>,
      );
    } else if (match[3]) {
      out.push(<s key={k} className="text-ash">{match[3].slice(2, -2)}</s>);
    } else if (match[4]) {
      const target = match[4].slice(2, -2).trim();
      const title = ctx.titles.get(target);
      inserted = title ?? target;
      out.push(
        <Link key={k} href={`/wiki/${target}`} className="text-navy underline decoration-stone underline-offset-2 hover:decoration-navy">
          {title ?? target}
        </Link>,
      );
    } else if (match[5]) {
      const raw = match[5].slice(2, -1).trim();
      let n = ctx.index.get(raw);
      if (n === undefined) {
        ctx.notes.push(resolveAnchor(raw));
        n = ctx.notes.length;
        ctx.index.set(raw, n);
      }
      out.push(
        <a
          key={k}
          href={`#note-${n}`}
          aria-label={`근거 ${n}`}
          className="ml-0.5 align-super text-[10px] font-semibold text-ash transition-colors hover:text-navy"
        >
          {n}
        </a>,
      );
    }
  }

  if (last < text.length) pushText(text.slice(last));
  return out;
}

/** 표 한 줄을 칸으로 가른다. 양 끝의 빈 칸은 버린다. */
function cells(line: string): string[] {
  return line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
}

export function renderWiki(body: string, titles: Map<string, string>): RenderedWiki {
  const ctx: Ctx = { titles, notes: [], index: new Map() };
  const lines = body.split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    if (line.trim() === "---") {
      nodes.push(<hr key={key++} className="my-8 border-stone" />);
      i += 1;
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const content = inline(heading[2], ctx, `h${key}`);
      const cls =
        level === 1
          ? "mt-2 text-2xl font-light tracking-[-0.02em] text-ink"
          : level === 2
            ? "mt-9 border-t border-stone pt-6 text-[15px] font-bold text-ink"
            : "mt-6 text-[13px] font-bold text-ink";
      nodes.push(
        level === 1 ? (
          <h1 key={key++} className={cls}>{content}</h1>
        ) : level === 2 ? (
          <h2 key={key++} className={cls}>{content}</h2>
        ) : (
          <h3 key={key++} className={cls}>{content}</h3>
        ),
      );
      i += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(lines[i]);
        i += 1;
      }
      const head = cells(rows[0]);
      const bodyRows = rows.slice(rows[1]?.includes("---") ? 2 : 1).map(cells);
      nodes.push(
        <div key={key++} className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-stone">
                {head.map((cell, c) => (
                  <th key={c} className="py-2 pr-3 align-top font-bold text-ink">
                    {inline(cell, ctx, `th${key}-${c}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, r) => (
                <tr key={r} className="border-b border-stone/60 align-top">
                  {row.map((cell, c) => (
                    <td key={c} className="py-2 pr-3 leading-relaxed text-smoke">
                      {inline(cell, ctx, `td${key}-${r}-${c}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const bullet = /^([-*]|\d+\.)\s+/.exec(line);
    if (bullet) {
      const ordered = /^\d+\./.test(bullet[1]);
      const items: string[] = [];
      while (i < lines.length) {
        const current = lines[i];
        const start = /^([-*]|\d+\.)\s+/.exec(current);
        if (start) {
          items.push(current.slice(start[0].length));
          i += 1;
          continue;
        }
        /* 들여쓴 줄은 앞 항목이 이어지는 것이다. */
        if (/^\s{2,}\S/.test(current) && items.length > 0) {
          items[items.length - 1] += " " + current.trim();
          i += 1;
          continue;
        }
        break;
      }
      const cls = "mt-1.5 leading-relaxed text-smoke";
      nodes.push(
        ordered ? (
          <ol key={key++} className="mt-4 list-decimal space-y-1 pl-5 text-[14px]">
            {items.map((item, n) => (
              <li key={n} className={cls}>{inline(item, ctx, `ol${key}-${n}`)}</li>
            ))}
          </ol>
        ) : (
          <ul key={key++} className="mt-4 list-disc space-y-1 pl-5 text-[14px]">
            {items.map((item, n) => (
              <li key={n} className={cls}>{inline(item, ctx, `ul${key}-${n}`)}</li>
            ))}
          </ul>
        ),
      );
      continue;
    }

    /* 나머지는 문단. 하드랩된 줄을 다시 붙인다. */
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("|") &&
      !/^(#{1,4})\s/.test(lines[i]) &&
      !/^([-*]|\d+\.)\s/.test(lines[i]) &&
      lines[i].trim() !== "---"
    ) {
      para.push(lines[i].trim());
      i += 1;
    }
    nodes.push(
      <p key={key++} className="mt-4 text-[14px] leading-relaxed text-smoke">
        {inline(para.join(" "), ctx, `p${key}`)}
      </p>,
    );
  }

  return { nodes, notes: ctx.notes };
}

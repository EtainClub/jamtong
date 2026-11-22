"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";

import type { MemorialEntry } from "./types";

/**
 * 업적 카툰 — 쉬운 설명 장면 하나가 한 칸(docs/garden-cartoon-review.md).
 *
 * ★ GIF처럼 움직인다. 한 칸씩 — 해설 상자가 내려오고, 그림이 천천히 다가오고, 잼통이의 말풍선이 튀어나온 뒤
 *   다음 칸으로 넘어가고, 끝나면 처음부터 다시 돈다. 누르면 멈춘다. "한 페이지로"를 고르면 만화 한 쪽처럼 모두 늘어놓는다.
 *   움직임 줄이기 설정이면 처음부터 한 페이지로 보인다.
 * ★ 그림은 설명용 AI 삽화다(글자 없음). 글은 모두 쉬운 설명 장면에서 오고, 칸마다 근거로 가는 길이 있다.
 * ★ 말하는 것은 잼통이뿐이다. 실존 인물의 말을 지어내지 않는다.
 * ★ 공유용 GIF·MP4(scripts/cartoon-render.tsx)도 이 칸 모양을 따른다.
 */
const PANEL_MS = 4_800;

export function CartoonView({ entry, from }: { entry: MemorialEntry; from: "memorial" | "room" | "album" }) {
  const cartoon = entry.cartoon!;
  const panels = cartoon.panels;
  const [still, setStill] = useState(false);
  const [mode, setMode] = useState<"play" | "page">("play");
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    track("cartoon_open", { slug: entry.slug, from });
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      // 설정을 읽은 뒤 한 번 맞춘다 — 서버에서는 알 수 없다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStill(true);
      setMode("page");
    }
  }, [entry.slug, from]);

  useEffect(() => {
    if (mode !== "play" || paused) return;
    const t = setTimeout(() => setAt((i) => (i + 1) % panels.length), PANEL_MS);
    return () => clearTimeout(t);
  }, [mode, paused, at, panels.length]);

  const panel = panels[at];
  return (
    <section aria-label={`${entry.title} 카툰`} className="cartoon">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] font-bold">🎞 잼통이와 보는 「{entry.title}」</p>
        <div className="flex gap-1">
          <button type="button" aria-pressed={mode === "play"} onClick={() => { setMode("play"); setPaused(false); }} className="cartoon-tab" disabled={still}>
            ▶ 움직이기
          </button>
          <button type="button" aria-pressed={mode === "page"} onClick={() => setMode("page")} className="cartoon-tab">
            ▦ 한 페이지로
          </button>
        </div>
      </div>

      {mode === "play" ? (
        <div className="mt-2">
          <button
            type="button"
            className="block w-full text-left"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "카툰 이어서 보기" : "카툰 멈추기"}
          >
            <Panel key={`${at}:${paused ? "p" : "r"}`} entry={entry} index={at} total={panels.length} animate={!paused} />
          </button>
          <div className="mt-2 flex items-center justify-between gap-2">
            <button type="button" className="cartoon-nav" onClick={() => setAt((i) => (i - 1 + panels.length) % panels.length)} aria-label="앞 칸">
              ‹
            </button>
            <div className="flex gap-1.5" role="tablist" aria-label="칸 고르기">
              {panels.map((p, i) => (
                <button key={p.id} type="button" role="tab" aria-selected={i === at} aria-label={`${i + 1}번째 칸`} onClick={() => setAt(i)} className={`cartoon-dot ${i === at ? "is-on" : ""}`}>
                  {i === at && !paused && <span style={{ animationDuration: `${PANEL_MS}ms` }} />}
                </button>
              ))}
            </div>
            <button type="button" className="cartoon-nav" onClick={() => setAt((i) => (i + 1) % panels.length)} aria-label="다음 칸">
              ›
            </button>
          </div>
          <p className="mt-1 text-center text-[11px] text-smoke">{paused ? "멈췄어요 — 그림을 누르면 이어서 봐요" : "그림을 누르면 멈춰요"}</p>
          <PanelSource entry={entry} index={at} key={`src${panel.id}`} />
        </div>
      ) : (
        <ol className="mt-2 grid gap-3">
          {panels.map((p, i) => (
            <li key={p.id}>
              <Panel entry={entry} index={i} total={panels.length} animate={false} />
              <PanelSource entry={entry} index={i} />
            </li>
          ))}
        </ol>
      )}

      {cartoon.caveat && (
        <p className="mt-3 rounded-xl bg-[var(--g-panel)] px-3 py-2 text-[12px] leading-relaxed">
          <b className="mr-1">알아 둘 것</b>
          {cartoon.caveat}
        </p>
      )}
      {entry.counter && (
        <p className="mt-2 rounded-xl bg-[var(--g-panel)] px-3 py-2 text-[12px] leading-relaxed">
          <b className="mr-1">반론</b>
          {entry.counter.text}{" "}
          <Link href={entry.counter.href} className="underline underline-offset-2">
            보기
          </Link>
        </p>
      )}
      <p className="mt-2 text-[10.5px] leading-relaxed text-smoke">
        그림은 설명용 AI 삽화예요 — 실제 장면이 아니고, 등장하는 사람은 실존 인물이 아니에요. 글과 숫자는 업적의 근거 자료에서 왔어요.
      </p>
      {(cartoon.gif || cartoon.mp4) && (
        <p className="mt-2 flex flex-wrap gap-2 text-[12px]">
          {cartoon.gif && (
            <a href={cartoon.gif} download className="garden-diary-btn is-quiet min-h-[40px]" onClick={() => track("cartoon_download", { slug: entry.slug, kind: "gif" })}>
              ⬇ GIF 받기
            </a>
          )}
          {cartoon.mp4 && (
            <a href={cartoon.mp4} download className="garden-diary-btn is-quiet min-h-[40px]" onClick={() => track("cartoon_download", { slug: entry.slug, kind: "mp4" })}>
              ⬇ 영상(MP4) 받기
            </a>
          )}
        </p>
      )}
    </section>
  );
}

/** 한 칸 — 번호, 해설 상자, 그림(숫자 딱지), 잼통이의 말풍선. */
function Panel({ entry, index, total, animate }: { entry: MemorialEntry; index: number; total: number; animate: boolean }) {
  const p = entry.cartoon!.panels[index];
  return (
    <figure className={`cartoon-panel ${animate ? "is-anim" : ""}`}>
      <figcaption className="cartoon-caption">
        <span className="cartoon-num" aria-label={`${index + 1} / ${total}`}>
          {index + 1}
        </span>
        <span>{p.title}</span>
      </figcaption>
      <div className="cartoon-frame">
        {/* 정원 안의 칸 그림이다. 이미 줄여 둔 webp라 next/image 설정을 늘리지 않는다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt="" loading="lazy" className="cartoon-img" />
        {p.fact && <span className="cartoon-fact">{p.fact}</span>}
      </div>
      <div className="cartoon-talk">
        <span className="cartoon-face" aria-hidden="true" />
        <p className="cartoon-balloon">{p.say}</p>
      </div>
    </figure>
  );
}

function PanelSource({ entry, index }: { entry: MemorialEntry; index: number }) {
  const p = entry.cartoon!.panels[index];
  if (p.anchors.length === 0) return null;
  return (
    <Link href={entry.href} className="mt-1 inline-flex min-h-[36px] items-center text-[11.5px] text-smoke underline underline-offset-2">
      이 칸의 근거 {p.anchors.length}개 — 업적 페이지에서 보기 →
    </Link>
  );
}

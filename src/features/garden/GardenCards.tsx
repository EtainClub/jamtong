"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { PlantArt } from "./GardenArt";
import { gardenFeedback } from "./feedback";
import {
  GROW_MIN,
  HOUR,
  METEOR_START,
  METEOR_WEEKDAYS,
  MINUTE,
  MUTATION,
  RAIN_SPEED,
  RAIN_STARTS,
  SEED_PRICE,
  SHOP_SLOT,
  TOOL_ORDER,
  TOOLS,
} from "./rules";
import type { Species } from "./types";

/**
 * 그림 카드 안내 — 정원을 한 장에 하나씩, 그림 위주로 넘겨 본다.
 *
 * 글 안내(GardenGuide)는 규칙과 확률을 빠짐없이 적는 곳이고, 이건 "1분 만에 감 잡기"다.
 * 카드마다 그림 하나와 한 줄. 수치는 rules.ts에서 읽는다.
 */

/** 그림에만 쓰는 가짜 품종. 콘텐츠가 아니다. */
const DEMO: Record<"sprout" | "common" | "flagship", Species> = {
  sprout: { id: "demo:s", tier: "sprout", title: "", href: "", notes: [], seed: 1, region: "words", links: [] },
  common: { id: "demo:c", tier: "common", title: "", href: "", notes: [], seed: 4, region: "words", links: [] },
  flagship: { id: "demo:f", tier: "flagship", title: "", href: "", notes: [], seed: 0, region: "words", links: [] },
};

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];
const clock = (offset: number) => `${Math.floor(offset / HOUR)}:${String(Math.round((offset % HOUR) / MINUTE)).padStart(2, "0")}`;
const grow = ([lo, hi]: [number, number]) => (hi < 60 ? `${lo}–${hi}분` : lo < 60 ? `${lo}분–${hi / 60}시간` : `${lo / 60}–${hi / 60}시간`);

interface Card {
  key: string;
  title: string;
  line: string;
  art: ReactNode;
}

const CARDS: Card[] = [
  {
    key: "seed",
    title: "씨앗 하나 = 이야기 한 건",
    line: "씨앗마다 업적·정책·언행 한 건이 들어 있어요.",
    art: (
      <div className="garden-card-row">
        {(["sprout", "common", "flagship"] as const).map((t) => (
          <figure key={t} className="garden-card-packet">
            <span className="garden-seed-packet"><PlantArt species={DEMO[t]} progress={0.5} /></span>
            <figcaption>{t === "sprout" ? "언행" : t === "common" ? "정책" : "업적"}</figcaption>
          </figure>
        ))}
      </div>
    ),
  },
  {
    key: "plant",
    title: "빈 밭을 눌러 심어요",
    line: "흙밭 ＋를 누르고 씨앗을 고르면 끝.",
    art: (
      <div className="garden-card-stage">
        <span className="garden-soil garden-card-plot">
          <span className="garden-empty-plot"><span className="block text-2xl leading-none">＋</span>씨앗 심기</span>
        </span>
        <span className="garden-card-finger" aria-hidden="true">👆</span>
      </div>
    ),
  },
  {
    key: "grow",
    title: "기다리면 자라요",
    line: "창을 닫아도 계속 자라요. 큰 이야기일수록 오래 걸리고 잼이 많아요.",
    art: (
      <div className="garden-card-row">
        {(["sprout", "common", "flagship"] as const).map((t, i) => (
          <figure key={t} className="garden-card-grow">
            <span className="garden-soil garden-card-plot is-small">
              <span className="garden-crop" style={{ width: `${70 + i * 15}%` }}><PlantArt species={DEMO[t]} progress={0.3 + i * 0.3} /></span>
            </span>
            <figcaption>{grow(GROW_MIN[t])}</figcaption>
          </figure>
        ))}
      </div>
    ),
  },
  {
    key: "harvest",
    title: "익으면 눌러 거둬요",
    line: "반짝이면 다 익은 거예요. 거둔 열매는 바구니로.",
    art: (
      <div className="garden-card-stage">
        <span className="garden-soil garden-ripe garden-card-plot">
          <span className="garden-crop garden-crop-ripe" style={{ width: "100%" }}><PlantArt species={DEMO.common} progress={1} /></span>
        </span>
        <span className="garden-card-arrow" aria-hidden="true">→</span>
        <span className="garden-card-big" aria-hidden="true">🧺</span>
      </div>
    ),
  },
  {
    key: "note",
    title: "열매 속 쪽지",
    line: `‘근거 보기’를 열면 잼 ×${MUTATION.shine.multiplier}. 안 읽어도 손해는 없어요.`,
    art: (
      <div className="garden-card-note">
        <p className="garden-card-note-kind">사실</p>
        <p className="garden-card-note-text">이야기 한 줄이 여기에 적혀 있어요.</p>
        <p className="garden-card-note-btn">근거 보기 <b>✨ ×{MUTATION.shine.multiplier}</b></p>
      </div>
    ),
  },
  {
    key: "jam",
    title: "잼으로 졸여요",
    line: "바구니의 열매를 잼으로 바꿔요. 잼이 정원의 돈이에요.",
    art: (
      <div className="garden-card-stage">
        <span className="garden-card-big" aria-hidden="true">🍓🍋🍇</span>
        <span className="garden-card-arrow" aria-hidden="true">→</span>
        <span className="garden-card-jar" aria-hidden="true">🍯</span>
      </div>
    ),
  },
  {
    key: "shop",
    title: "잼으로 새 씨앗 사기",
    line: `진열은 ${SHOP_SLOT / MINUTE}분마다 바뀌어요. 비료를 주면 빨리 자라요 ${TOOL_ORDER.map((id) => TOOLS[id].icon).join(" ")}`,
    art: (
      <div className="garden-card-row">
        {(["sprout", "common", "flagship"] as const).map((t) => (
          <figure key={t} className="garden-card-packet">
            <span className="garden-seed-packet"><PlantArt species={DEMO[t]} progress={0.6} /></span>
            <figcaption>🍯 {SEED_PRICE[t]}</figcaption>
          </figure>
        ))}
      </div>
    ),
  },
  {
    key: "weather",
    title: "날씨를 노려요",
    line: "정해진 시각에 와요. 맞춰 들어오면 이득!",
    art: (
      <div className="garden-card-tiles">
        <div className="garden-card-tile is-rain">
          <span aria-hidden="true">🌧</span>
          <b>단비</b>
          <small>매일 {RAIN_STARTS.map(clock).join(" · ")}</small>
          <em>성장 ×{RAIN_SPEED}</em>
        </div>
        <div className="garden-card-tile is-meteor">
          <span aria-hidden="true">🌠</span>
          <b>별똥별</b>
          <small>{METEOR_WEEKDAYS.map((d) => WEEKDAY[d]).join("·")} {clock(METEOR_START)}</small>
          <em>반짝 ×{MUTATION.sparkle.multiplier}</em>
        </div>
      </div>
    ),
  },
  {
    key: "mutation",
    title: "변이가 붙으면 대박",
    line: "운 좋게 붙으면 잼이 몇 배로. 확률은 ‘자세한 규칙’에 모두 공개돼 있어요.",
    art: (
      <div className="garden-card-chips">
        {(["golden", "sparkle", "moist", "blessed"] as const).map((m) => (
          <span key={m} className={`garden-chip garden-chip-${m}`}>
            {MUTATION[m].label} <b>×{MUTATION[m].multiplier}</b>
          </span>
        ))}
      </div>
    ),
  },
  {
    key: "together",
    title: "함께 가꿔요",
    line: "광장 잡초를 뽑고, 업적 꽃을 함께 피우고, 거대 잡초는 여럿이 정각·30분의 ‘빈틈’에 모여 쓰러뜨려요. 기력을 다 써도 지원으로 돕고, 뿌리 조각과 박제를 모아요.",
    art: (
      <div className="garden-card-tiles is-three">
        <div className="garden-card-tile"><span aria-hidden="true">⛲</span><b>광장</b><small>잡초 뽑기</small></div>
        <div className="garden-card-tile"><span aria-hidden="true">🌸</span><b>꽃밭</b><small>함께 만개</small></div>
        <div className="garden-card-tile"><span aria-hidden="true">🔍</span><b>온실</b><small>도는 말 확인</small></div>
      </div>
    ),
  },
];

export function GardenCards({ onClose, onDetail }: { onClose: () => void; onDetail: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(CARDS.length - 1, i));
    gardenFeedback("tap");
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const last = index === CARDS.length - 1;

  return (
    <dialog
      ref={dialog}
      aria-labelledby="garden-cards-title"
      className="garden-seed-dialog fixed inset-0 z-50 m-0 h-dvh max-h-none w-full max-w-none items-end border-0 bg-transparent p-0 text-inherit open:flex"
      onClick={onClose}
      onCancel={onClose}
    >
      <div
        className="garden-cards mx-auto w-full max-w-[560px] rounded-t-3xl bg-[var(--g-bg)] px-4 pb-8 pt-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
      >
        <div className="flex items-center justify-between">
          <h2 id="garden-cards-title" className="text-[15px] font-extrabold">
            정원 한눈에 보기 <span className="font-semibold text-smoke">{index + 1}/{CARDS.length}</span>
          </h2>
          <button type="button" onClick={onClose} className="text-[13px] text-smoke">
            닫기
          </button>
        </div>

        <div
          ref={track}
          className="garden-cards-track mt-3"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
            if (i !== index) setIndex(i);
          }}
        >
          {CARDS.map((card, i) => (
            <article
              key={card.key}
              className="garden-card"
              aria-roledescription="카드"
              aria-label={`${i + 1}/${CARDS.length} ${card.title}`}
              aria-hidden={i !== index}
            >
              <div className="garden-card-art">{card.art}</div>
              <h3>{card.title}</h3>
              <p>{card.line}</p>
            </article>
          ))}
        </div>

        <ol className="garden-cards-dots mt-3" aria-label="카드 고르기">
          {CARDS.map((card, i) => (
            <li key={card.key}>
              <button type="button" aria-label={`${i + 1}번 카드: ${card.title}`} aria-current={i === index} onClick={() => go(i)} />
            </li>
          ))}
        </ol>

        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="garden-coach-go is-quiet flex-1">
            ← 이전
          </button>
          {last ? (
            <button type="button" onClick={onClose} className="garden-coach-go flex-1">
              시작하기 🌱
            </button>
          ) : (
            <button type="button" onClick={() => go(index + 1)} className="garden-coach-go flex-1">
              다음 →
            </button>
          )}
        </div>
        <button type="button" onClick={onDetail} className="mt-3 block w-full text-center text-[12.5px] text-smoke underline underline-offset-2">
          📖 자세한 규칙과 확률 읽기
        </button>
      </div>
    </dialog>
  );
}

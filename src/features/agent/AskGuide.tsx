"use client";

import { useRef, useState } from "react";
import type { Claim } from "@/content/schema";
import type { AgentAction } from "@/lib/agent/actions";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";
import { runActions } from "./execute";

/**
 * AI 안내 (설계서 12·13·31장).
 *
 * 화면 아래 작은 떠 있는 버튼으로 둔다. 기본 탐색을 가리지 않아야 하고,
 * 질문할 마음이 생겼을 때만 열리면 된다.
 *
 * 답변은 길지 않다. 긴 글을 읽히는 순간 이 제품의 전제가 무너진다.
 * 대신 화면이 움직이고, 그 움직임 자체가 설명이 된다.
 */

interface Answer {
  grounded: boolean;
  message: string;
  actions: AgentAction[];
  claimIds: string[];
}

const ACTION_LABEL: Record<AgentAction["type"], string> = {
  GO_TO_SCENE: "화면 이동",
  SET_VIEW: "보기 전환",
  SEEK_TIMELINE: "시점 이동",
  FOCUS_ENTITY: "관계 집중",
  SET_ROUTE: "항로 전환",
  SET_MOTION: "배 위치 이동",
  SET_SCENARIO: "시나리오 전환",
  OPEN_EVIDENCE: "근거 열기",
  RESET_VIEW: "처음으로",
};

export function AskGuide({
  storySlug,
  claims,
  suggestions,
}: {
  storySlug: string;
  claims: Claim[];
  suggestions: string[];
}) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ask = async (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 2 || busy) return;

    setBusy(true);
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ storySlug, question: trimmed }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "안내를 불러오지 못했습니다.");
        return;
      }

      setAnswer(data);
      if (data.actions.length > 0) await runActions(data.actions);
    } catch {
      setError("연결에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 60);
        }}
        className="fixed bottom-5 right-4 z-30 flex items-center gap-2 rounded-full bg-ice-500 px-4 py-3 text-sm font-bold text-ink-900 shadow-lg shadow-ink-900/50 transition-transform hover:scale-[1.03]"
        style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M20 12a8 8 0 1 1-3.2-6.4" />
          <path d="M12 16v-.5c0-1 .6-1.6 1.4-2.1.8-.5 1.3-1 1.3-1.9a2.7 2.7 0 0 0-5.4-.1" />
          <circle cx="12" cy="19" r=".6" fill="currentColor" />
        </svg>
        AI에게 묻기
      </button>
    );
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink-800/97 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="region"
      aria-label="AI 안내"
    >
      <div className="mx-auto max-w-[560px] px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ice-400">
            AI 안내
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md px-2.5 py-1 text-xs text-text-muted hover:bg-white/5 hover:text-text-secondary"
          >
            닫기
          </button>
        </div>

        {answer && (
          <div className="mt-3 rounded-xl border border-line bg-ink-700 p-4">
            <p className="text-[14.5px] leading-relaxed text-text-primary">
              {answer.message}
            </p>

            {!answer.grounded && (
              <p className="mt-2.5 text-xs leading-relaxed text-warm-400">
                이 화면의 자료로 확인되지 않아 화면을 움직이지 않았습니다.
              </p>
            )}

            {answer.actions.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {answer.actions.map((action, i) => (
                  <li
                    key={`${action.type}-${i}`}
                    className="rounded-full bg-ice-500/12 px-2.5 py-1 text-[11px] font-medium text-ice-400"
                  >
                    {ACTION_LABEL[action.type]}
                  </li>
                ))}
              </ul>
            )}

            {answer.claimIds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {answer.claimIds.map((id) => {
                  const claim = claims.find((c) => c.id === id);
                  if (!claim) return null;
                  return (
                    <EvidenceButton
                      key={id}
                      claimId={id}
                      count={claim.sourceIds.length}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-xl border border-warm-400/30 bg-warm-400/[0.07] px-4 py-3 text-[13px] leading-relaxed text-text-secondary">
            {error}
          </p>
        )}

        {!answer && !error && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {suggestions.map((text) => (
              <li key={text}>
                <button
                  type="button"
                  onClick={() => {
                    setQuestion(text);
                    void ask(text);
                  }}
                  className="rounded-full border border-line px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-ice-600 hover:text-ice-400"
                >
                  {text}
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void ask(question);
          }}
          className="mt-3 flex gap-2"
        >
          <label className="sr-only" htmlFor="ask-input">
            질문
          </label>
          <input
            id="ask-input"
            ref={inputRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={busy}
            placeholder="이 화면에 대해 물어보세요"
            className="min-w-0 flex-1 rounded-full border border-line bg-ink-700 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-ice-600 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || question.trim().length < 2}
            className="shrink-0 rounded-full bg-ice-500 px-4 py-2.5 text-sm font-bold text-ink-900 disabled:opacity-40"
          >
            {busy ? "찾는 중" : "묻기"}
          </button>
        </form>

        <p className="mt-2 text-[11px] leading-relaxed text-text-muted">
          이 스토리의 자료 안에서만 답합니다. 확인되지 않는 것은 확인되지 않는다고 말합니다.
        </p>
      </div>
    </div>
  );
}

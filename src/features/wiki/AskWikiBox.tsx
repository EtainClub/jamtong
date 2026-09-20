"use client";

import { useState } from "react";
import Link from "next/link";

import { track } from "@/lib/analytics";
import { useAuth } from "@/lib/firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import type { ResolvedAnchor } from "@/lib/wiki/anchors";

/**
 * 위키에 묻기.
 *
 * 로그인한 사람만 물을 수 있다. 한 번 물을 때마다 위키 여러 장이 모델로
 * 올라가므로 화면 안내(`/api/ask`)보다 비싸고, 계정을 요구하면 남용의 비용이
 * 올라간다. 익명 계정은 문지기가 되지 못하므로 구글 로그인을 받는다.
 *
 * ★ 로그인을 먼저 들이밀지 않는다. 위키 48장은 로그인 없이 다 읽을 수 있고,
 *   로그인은 "묻는" 자리에서 처음 필요해진다. 읽기를 막는 담장이 아니다.
 *
 * 답은 저장하지 않는다. 좋은 답은 `wiki/synthesis/`에 파일링되는데 그것은
 * 저장소를 여는 쪽의 일이다(docs/llm-wiki.md §7).
 */

interface WikiAnswer {
  grounded: boolean;
  message: string;
  pages: { name: string; title: string }[];
  notes: ResolvedAnchor[];
}

export function AskWikiBox() {
  const { user, ready, configured, signInWithGoogle } = useAuth();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<WikiAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /* 익명 계정은 로그인으로 치지 않는다. 서버도 같은 기준으로 거른다. */
  const signedIn = Boolean(user && !user.isAnonymous);

  const onAsk = async () => {
    const trimmed = question.trim();
    if (trimmed.length < 2 || busy) return;

    setBusy(true);
    setError(null);
    setAnswer(null);

    try {
      const token = await firebaseAuth()?.currentUser?.getIdToken();
      if (!token) {
        setError("로그인이 풀렸습니다. 다시 로그인해 주세요.");
        return;
      }

      const res = await fetch("/api/wiki-ask", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "답을 불러오지 못했습니다.");
        return;
      }
      const parsed = data as WikiAnswer;
      /* 물음 자체는 보내지 않는다. 길이와 근거가 붙었는지만 센다. */
      track("agent_question", {
        surface: "wiki",
        grounded: parsed.grounded,
        length: trimmed.length,
        pages: parsed.pages.length,
      });
      setAnswer(parsed);
    } catch {
      setError("연결에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      aria-labelledby="ask"
      className="mt-6 rounded-card border border-stone bg-taupe/40 px-4 py-4"
    >
      <h2 id="ask" className="text-[13px] font-bold text-ink">
        위키에 묻기
      </h2>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void onAsk();
          }}
          disabled={!signedIn || busy}
          maxLength={300}
          aria-describedby="ask-note"
          placeholder="예: 이재명 대통령은 무엇을 이루려 하는가?"
          className="min-w-0 flex-1 rounded-full border border-stone bg-canvas px-4 py-2 text-[13px] text-ink placeholder:text-ash disabled:cursor-not-allowed disabled:text-smoke"
        />
        {signedIn ? (
          <button
            type="button"
            onClick={() => void onAsk()}
            disabled={busy || question.trim().length < 2}
            className="shrink-0 rounded-full border border-stone bg-canvas px-4 py-2 text-[13px] font-medium text-navy transition-colors hover:border-graphite disabled:cursor-not-allowed disabled:text-ash"
          >
            {busy ? "찾는 중" : "묻기"}
          </button>
        ) : (
          <button
            type="button"
            disabled={!ready || !configured}
            onClick={() =>
              void signInWithGoogle().catch((e: { code?: string }) =>
                setError(`로그인하지 못했습니다. (${e?.code ?? "알 수 없는 오류"})`),
              )
            }
            className="shrink-0 rounded-full border border-stone bg-canvas px-4 py-2 text-[13px] font-medium text-navy transition-colors hover:border-graphite disabled:cursor-not-allowed disabled:text-ash"
          >
            구글로 로그인
          </button>
        )}
      </div>

      <p id="ask-note" className="mt-3 text-[12px] leading-relaxed text-smoke">
        {!configured
          ? "이 환경에는 로그인이 설정되어 있지 않아 물을 수 없습니다. 아래 카탈로그는 그대로 읽을 수 있습니다."
          : signedIn
            ? "위키에 있는 내용만 답합니다. 옮긴 사실에는 원자료 앵커가 함께 붙고, 위키에 없으면 없다고 답합니다."
            : "읽는 것은 로그인 없이 됩니다. 묻는 것은 로그인이 필요합니다 — 한 번 물을 때마다 위키 여러 장을 모델에 실어 보내기 때문입니다."}
      </p>

      {error && (
        <p role="alert" className="mt-3 text-[12px] leading-relaxed text-pending">
          {error}
        </p>
      )}

      {answer && <Answer answer={answer} />}
    </section>
  );
}

/** 답 안의 `^[...]`를 번호로 바꾸고 아래에 근거를 단다. 위키 페이지와 같은 방식이다. */
function Answer({ answer }: { answer: WikiAnswer }) {
  const order = new Map(answer.notes.map((note, n) => [note.raw, n + 1]));
  const parts: React.ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of answer.message.matchAll(/\^\[([^\]]+)\]/g)) {
    const at = match.index ?? 0;
    if (at > last) parts.push(answer.message.slice(last, at));
    last = at + match[0].length;
    const n = order.get(match[1].trim());
    if (n) {
      parts.push(
        <sup key={key++} className="ml-0.5 text-[10px] font-semibold text-ash">
          {n}
        </sup>,
      );
    }
  }
  if (last < answer.message.length) parts.push(answer.message.slice(last));

  return (
    <div className="mt-4 rounded-card border border-stone bg-canvas px-4 py-3">
      <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-ink">{parts}</p>

      {!answer.grounded && (
        <p className="mt-2.5 text-[12px] leading-relaxed text-pending">
          위키에서 근거를 찾지 못한 답입니다. 아래 카탈로그에서 직접 찾아보시기 바랍니다.
        </p>
      )}

      {answer.notes.length > 0 && (
        <ol className="mt-3 space-y-1 border-t border-stone pt-3">
          {answer.notes.map((note, n) => (
            <li key={note.raw} className="flex gap-2 text-[11px] leading-relaxed">
              <span className="w-3 shrink-0 text-right font-semibold text-ash">{n + 1}</span>
              <span className="min-w-0">
                <span className="mr-1 text-ash">{note.kind}</span>
                {note.href ? (
                  note.external ? (
                    <a
                      href={note.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-navy hover:underline"
                    >
                      {note.label} ↗
                    </a>
                  ) : (
                    <Link href={note.href} className="text-navy hover:underline">
                      {note.label}
                    </Link>
                  )
                ) : (
                  <span className="text-smoke">{note.label}</span>
                )}
                {note.detail && <span className="ml-1 text-ash">· {note.detail}</span>}
              </span>
            </li>
          ))}
        </ol>
      )}

      {answer.pages.length > 0 && (
        <p className="mt-3 flex flex-wrap gap-1.5 border-t border-stone pt-3 text-[11px]">
          <span className="text-ash">읽은 페이지</span>
          {answer.pages.map((page) => (
            <Link
              key={page.name}
              href={`/wiki/${page.name}`}
              className="rounded-full border border-stone px-2 py-0.5 text-navy hover:border-graphite"
            >
              {page.title}
            </Link>
          ))}
        </p>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/lib/firebase/auth";
import {
  BODY_MAX,
  FEEDBACK_KINDS,
  FEEDBACK_STATUSES,
  KIND_LABEL,
  STATUS_LABEL,
  STATUS_STYLE,
  checkAdmin,
  deleteFeedback,
  loadMyAgrees,
  postFeedback,
  toggleAgree,
  updateFeedback,
  watchFeedback,
  type FeedbackItem,
  type FeedbackKind,
  type FeedbackStatus,
} from "@/lib/firebase/feedback";

/**
 * 피드백 게시판.
 *
 * ★ 목록이 먼저다.
 *   쓰는 칸을 맨 위에 두면 아무도 읽지 않고 쓴다. 이미 있는 이야기를 먼저
 *   보게 해야 "나도요"가 눌리고, 그래야 같은 말이 쌓이지 않는다. 쓰기는
 *   접어 두고 눌러야 열린다.
 *
 * ★ 익명이지만 무기명은 아니다.
 *   화면에 이름은 없다. 다만 제 글은 지울 수 있어야 하므로 uid는 저장한다.
 *   그 사정을 안내에 적는다 — "익명"이라고만 적어 두면 아무것도 안 남는다고
 *   읽힌다.
 */
export function FeedbackBoard() {
  const { user, ready, configured, ensureUser } = useAuth();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [agreed, setAgreed] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const uid = user?.uid ?? null;

  useEffect(() => {
    return watchFeedback(
      uid,
      (next) => {
        setItems(next);
        setLoaded(true);
        setError(null);
      },
      (message) => {
        setError(message);
        setLoaded(true);
      },
    );
  }, [uid]);

  // 내가 누른 것 표시. 목록이 바뀔 때마다 다시 맞춘다.
  useEffect(() => {
    if (!uid || items.length === 0) return;
    let alive = true;
    loadMyAgrees(
      uid,
      items.map((i) => i.id),
    ).then((set) => {
      if (alive) setAgreed(set);
    });
    return () => {
      alive = false;
    };
  }, [uid, items]);

  /*
   * 운영자인지.
   *
   * 상태에 담는 것은 "어느 uid가 운영자로 확인됐나"이고, 화면이 쓰는 값은
   * 그것을 지금 uid와 견준 결과다. uid가 없을 때 setAdmin(false)를 이펙트
   * 안에서 바로 부르면 React Compiler가 막는다 — 렌더가 연쇄로 도는 모양이다.
   * 견주는 쪽으로 바꾸면 되돌릴 일 자체가 없어진다.
   */
  const [adminUid, setAdminUid] = useState<string | null>(null);
  const admin = adminUid !== null && adminUid === uid;

  useEffect(() => {
    if (!uid) return;
    let alive = true;
    checkAdmin(uid).then((is) => {
      if (alive && is) setAdminUid(uid);
    });
    return () => {
      alive = false;
    };
  }, [uid]);

  const onAgree = useCallback(
    async (item: FeedbackItem) => {
      const account = await ensureUser();
      if (!account) return;
      try {
        await toggleAgree(account.uid, item.id, agreed.has(item.id));
        setAgreed((prev) => {
          const next = new Set(prev);
          if (next.has(item.id)) next.delete(item.id);
          else next.add(item.id);
          return next;
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "누르지 못했습니다.");
      }
    },
    [agreed, ensureUser],
  );

  if (!configured) {
    return (
      <p className="mt-8 rounded-card border border-stone bg-taupe px-5 py-4 text-[13px] leading-relaxed text-smoke">
        파이어베이스 설정이 없어 피드백을 불러올 수 없습니다.
      </p>
    );
  }

  return (
    <>
      <Composer onDone={() => setError(null)} onError={setError} />

      {error && (
        <p className="mt-4 rounded-card border border-burgundy/30 bg-burgundy-tint/40 px-4 py-3 text-[13px] leading-relaxed text-burgundy">
          {error}
        </p>
      )}

      {admin && (
        <p className="mt-4 rounded-card border border-navy/30 bg-navy-tint/50 px-4 py-3 text-[12px] leading-relaxed text-navy">
          운영자로 보고 있습니다. 상태를 바꾸고 답을 달 수 있습니다.
        </p>
      )}

      <div className="mt-7 flex items-baseline justify-between gap-3">
        <h2 className="text-[15px] font-bold text-ink">남겨진 이야기</h2>
        <span className="tabular text-[11px] text-ash">
          {loaded ? `${items.length}건` : "불러오는 중"}
        </span>
      </div>

      {loaded && items.length === 0 && !error && (
        <p className="mt-3 rounded-card border border-stone px-5 py-6 text-center text-[13px] text-ash">
          아직 아무도 남기지 않았습니다. 첫 번째가 되어 주세요.
        </p>
      )}

      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <Card
              item={item}
              agreed={agreed.has(item.id)}
              admin={admin}
              ready={ready}
              onAgree={() => onAgree(item)}
              onError={setError}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

/** 쓰는 칸. 접어 둔다 — 목록을 먼저 보라는 뜻이다. */
function Composer({
  onDone,
  onError,
}: {
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const { ensureUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<FeedbackKind>("idea");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    setSending(true);
    try {
      const account = await ensureUser();
      if (!account) throw new Error("로그인을 준비하지 못했습니다.");
      await postFeedback(account.uid, { body, kind });
      setBody("");
      setOpen(false);
      onDone();
    } catch (e) {
      onError(e instanceof Error ? e.message : "남기지 못했습니다.");
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-card border border-stone bg-taupe px-5 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-graphite"
      >
        새로 남기기
        <span aria-hidden="true">+</span>
      </button>
    );
  }

  const over = body.length > BODY_MAX;

  return (
    <div className="mt-7 rounded-card border border-stone bg-taupe px-5 py-4">
      <div className="flex flex-wrap gap-1.5">
        {FEEDBACK_KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            aria-pressed={k === kind}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
              k === kind
                ? "bg-ink text-eggshell"
                : "border border-stone text-smoke hover:border-graphite hover:text-ink"
            }`}
          >
            {KIND_LABEL[k]}
          </button>
        ))}
      </div>

      <label htmlFor="fb-body" className="sr-only">
        피드백 내용
      </label>
      <textarea
        id="fb-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        placeholder="무엇이 불편했는지, 무엇이 있으면 좋겠는지 적어 주세요."
        className="mt-3 w-full resize-y rounded-card border border-stone bg-canvas px-3.5 py-3 text-[14px] leading-relaxed text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
      />

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className={`tabular text-[11px] ${over ? "text-burgundy" : "text-ash"}`}>
          {body.length} / {BODY_MAX}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-stone px-4 py-2 text-[12px] font-semibold text-smoke transition-colors hover:border-graphite hover:text-ink"
          >
            취소
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={sending || over || body.trim().length === 0}
            className="rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-eggshell transition-opacity disabled:opacity-40"
          >
            {sending ? "남기는 중" : "남기기"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({
  item,
  agreed,
  admin,
  ready,
  onAgree,
  onError,
}: {
  item: FeedbackItem;
  agreed: boolean;
  admin: boolean;
  ready: boolean;
  onAgree: () => void;
  onError: (message: string) => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState(item.reply ?? "");

  return (
    <article className="rounded-card border border-stone bg-taupe px-5 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-canvas px-2 py-0.5 text-[10px] font-bold text-navy">
          {KIND_LABEL[item.kind]}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[item.status]}`}
        >
          {STATUS_LABEL[item.status]}
        </span>
        {item.createdAt && (
          <span className="text-[11px] text-ash">
            {item.createdAt.toLocaleDateString("ko-KR")}
          </span>
        )}
        {item.mine && <span className="text-[11px] font-semibold text-navy">내 글</span>}
      </div>

      {/* 줄바꿈을 살린다. 사람이 문단을 나눠 쓴 것을 한 덩어리로 뭉개지 않는다. */}
      <p className="mt-2.5 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink">
        {item.body}
      </p>

      {item.reply && (
        <div className="mt-3 rounded-card border-l-2 border-navy bg-canvas px-4 py-3">
          <p className="text-[11px] font-bold text-navy">운영자</p>
          <p className="mt-1 whitespace-pre-wrap text-[13.5px] leading-relaxed text-smoke">
            {item.reply}
          </p>
        </div>
      )}

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onAgree}
          disabled={!ready}
          aria-pressed={agreed}
          className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors disabled:opacity-40 ${
            agreed
              ? "bg-navy text-eggshell"
              : "border border-stone text-smoke hover:border-graphite hover:text-ink"
          }`}
        >
          나도요 {item.agreeCount > 0 && <span className="tabular">{item.agreeCount}</span>}
        </button>

        {item.mine && (
          <button
            type="button"
            onClick={async () => {
              try {
                await deleteFeedback(item.id);
              } catch (e) {
                onError(e instanceof Error ? e.message : "지우지 못했습니다.");
              }
            }}
            className="rounded-full border border-stone px-3 py-1.5 text-[12px] font-semibold text-ash transition-colors hover:border-burgundy hover:text-burgundy"
          >
            지우기
          </button>
        )}
      </div>

      {admin && (
        <div className="mt-3 border-t border-stone pt-3">
          <div className="flex flex-wrap gap-1.5">
            {FEEDBACK_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={async () => {
                  try {
                    await updateFeedback(item.id, { status: s as FeedbackStatus });
                  } catch (e) {
                    onError(e instanceof Error ? e.message : "바꾸지 못했습니다.");
                  }
                }}
                aria-pressed={s === item.status}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  s === item.status
                    ? "bg-ink text-eggshell"
                    : "border border-stone text-smoke hover:border-graphite"
                }`}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setReplyOpen((v) => !v)}
              className="rounded-full border border-stone px-2.5 py-1 text-[11px] font-semibold text-navy transition-colors hover:border-graphite"
            >
              답 달기
            </button>
            {!item.mine && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deleteFeedback(item.id);
                  } catch (e) {
                    onError(e instanceof Error ? e.message : "지우지 못했습니다.");
                  }
                }}
                className="rounded-full border border-stone px-2.5 py-1 text-[11px] font-semibold text-ash transition-colors hover:border-burgundy hover:text-burgundy"
              >
                지우기
              </button>
            )}
          </div>

          {replyOpen && (
            <div className="mt-2.5">
              <label htmlFor={`reply-${item.id}`} className="sr-only">
                운영자 답
              </label>
              <textarea
                id={`reply-${item.id}`}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                className="w-full resize-y rounded-card border border-stone bg-canvas px-3 py-2 text-[13px] leading-relaxed text-ink focus:border-graphite focus:outline-none"
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await updateFeedback(item.id, { reply });
                    setReplyOpen(false);
                  } catch (e) {
                    onError(e instanceof Error ? e.message : "달지 못했습니다.");
                  }
                }}
                className="mt-2 rounded-full bg-ink px-4 py-1.5 text-[12px] font-semibold text-eggshell"
              >
                저장
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

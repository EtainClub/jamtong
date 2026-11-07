"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DocumentSnapshot } from "firebase/firestore";

import { track } from "@/lib/analytics";
import { useAuth } from "@/lib/firebase/auth";
import {
  NOTE_LIVE,
  NOTE_MAX,
  deleteCheerNote,
  listMyCheers,
  loadMyNoteAgrees,
  loadNotePage,
  loadTopicNotes,
  loadWeekNotes,
  postCheerNote,
  toggleNoteAgree,
  watchCheerNotes,
  type CheerNote,
} from "@/lib/firebase/cheers";
import { echoGains, markEchoSeen } from "./cheerEcho";
import type { CheerTopic } from "./cheerTopics";

/**
 * 한 줄 응원.
 *
 * ★ 쓸 거리를 먼저 준다 — "오늘의 한 줄".
 *   빈 칸 앞에서 사람을 멈추게 하는 것은 "무슨 말을 써야 하나"다. 예전의 첫 문장 단추는
 *   그 물음을 풀어 줬지만, 단추 문장 그대로 붙인 글이 벽의 3분의 1이 되어 읽을 것이 줄었다.
 *   이제 맨 위에 최근 들어온 언행 하나를 걸고, 단추는 "그 말에서 무엇이 남았나"를 묻는다.
 *   언행은 이름표로만 붙는다(cheers.ts의 topic) — 응원은 여전히 소스가 아니다.
 *
 * ★ 돌아올 이유를 준다 — 내 응원에 돌아온 나도요.
 *   들렀을 때 "지난번 이후 나도요 +N"을 보인다. 서버가 부르지 않는다(cheerEcho.ts).
 *
 * ★ 보상은 없다.
 *   응원을 남겨도 잼·씨앗·칭호를 주지 않는다. 지지 표현에 게임 보상을 붙이면 정원이
 *   막아 둔 "특정 정치인 홍보량에 보상"이 된다(docs/garden-game.md §1). 응원을 남긴 뒤
 *   보이는 "씨앗 받기"는 응원의 대가가 아니라 그 언행 원문에 붙은 씨앗이다 — 업적 페이지의
 *   "씨앗 받기"와 같은 길이고, 품종마다 한 번뿐이다.
 */

const WEEK = 7 * 86_400_000;
/** "새로 들어온 언행" 표시를 다는 기간. 신품종(30일)보다 짧게 — 오늘의 한 줄은 이번 주 일이다. */
const FRESH_DAYS = 7;

export type CheerFrom = "tab" | "home" | "garden" | "neighbors" | "my" | "link";

type Order = "new" | "agree" | "topic";

export function NotesView({
  topics,
  topic,
  onTopic,
  from,
  admin,
  counts,
  onPosted,
  onError,
  onDone,
  hasError,
}: {
  topics: CheerTopic[];
  topic: string | null;
  onTopic: (slug: string | null) => void;
  from: CheerFrom;
  admin: boolean;
  counts: { total: number; week: number } | null;
  onPosted: () => void;
  onError: (message: string) => void;
  onDone: () => void;
  hasError: boolean;
}) {
  const { user, ready, ensureUser } = useAuth();
  const uid = user?.uid ?? null;
  const topicBy = useMemo(() => new Map(topics.map((t) => [t.slug, t])), [topics]);

  /*
   * 지금까지 본 한 줄 — 첫 쪽(실시간)과 "더 보기"로 받은 쪽을 한 통에 모은다.
   *
   * 첫 쪽에서 밀려난 글을 버리면, 더 보기로 받은 쪽과 사이에 빈틈이 생긴다(새 글이 하나
   * 오면 첫 쪽 끝의 글이 밀려나는데 그 글은 다음 쪽에도 없다). 그래서 밀려난 글은 남기고,
   * 첫 쪽 안에서 사라진 글(지워진 글)만 뺀다.
   */
  const [pool, setPool] = useState<Map<string, CheerNote>>(new Map());
  const liveIds = useRef<Set<string>>(new Set());
  const [liveLast, setLiveLast] = useState<DocumentSnapshot | null>(null);
  const [olderLast, setOlderLast] = useState<DocumentSnapshot | null>(null);
  const [olderDone, setOlderDone] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [order, setOrder] = useState<Order>("new");
  const [agreeList, setAgreeList] = useState<CheerNote[]>([]);
  const [agreeLast, setAgreeLast] = useState<DocumentSnapshot | null>(null);
  const [agreeDone, setAgreeDone] = useState(false);
  const [topicNotes, setTopicNotes] = useState<{ topic: string; notes: CheerNote[] } | null>(null);
  const [weekNotes, setWeekNotes] = useState<CheerNote[]>([]);
  const [busy, setBusy] = useState(false);

  const [agreed, setAgreed] = useState<Set<string>>(new Set());
  const checked = useRef<{ uid: string | null; ids: Set<string> }>({ uid: null, ids: new Set() });

  const [since] = useState(() => Date.now() - WEEK);

  useEffect(() => {
    return watchCheerNotes(
      uid,
      (notes, last) => {
        const ids = new Set(notes.map((n) => n.id));
        const oldest = notes.at(-1)?.createdAt?.getTime() ?? 0;
        setPool((prev) => {
          const next = new Map(prev);
          for (const id of liveIds.current) {
            const gone = !ids.has(id);
            const note = prev.get(id);
            /* 첫 쪽 끝보다 새것인데 사라졌으면 밀려난 것이 아니라 지워진 것이다. */
            if (gone && note && (note.createdAt?.getTime() ?? Infinity) >= oldest) next.delete(id);
          }
          for (const note of notes) next.set(note.id, note);
          return next;
        });
        liveIds.current = ids;
        setLiveLast(last);
        setLoaded(true);
        onDone();
      },
      (message) => {
        onError(message);
        setLoaded(true);
      },
    );
    // onDone·onError는 부르는 쪽이 매번 새로 만든다. 구독을 그 때문에 다시 걸지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  useEffect(() => {
    let alive = true;
    loadWeekNotes(uid, since)
      .then((notes) => alive && setWeekNotes(notes))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [uid, since]);

  /* 이 언행에 붙은 한 줄. 언행을 바꾸거나 "이 언행" 정렬을 고를 때 받는다. */
  useEffect(() => {
    if (order !== "topic" || !topic) return;
    let alive = true;
    loadTopicNotes(uid, topic)
      .then((notes) => alive && setTopicNotes({ topic, notes }))
      .catch((e) => onError(e instanceof Error ? e.message : "불러오지 못했습니다."));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, topic, order]);

  const byNew = useMemo(
    () =>
      [...pool.values()].sort(
        (a, b) => (b.createdAt?.getTime() ?? Infinity) - (a.createdAt?.getTime() ?? Infinity),
      ),
    [pool],
  );

  const byTopic = useMemo(() => {
    if (!topic) return [];
    const merged = new Map<string, CheerNote>();
    for (const n of topicNotes?.topic === topic ? topicNotes.notes : []) merged.set(n.id, n);
    for (const n of pool.values()) if (n.topic === topic) merged.set(n.id, n);
    return [...merged.values()].sort(
      (a, b) => (b.createdAt?.getTime() ?? Infinity) - (a.createdAt?.getTime() ?? Infinity),
    );
  }, [pool, topic, topicNotes]);

  /* 이번 주 공감을 많이 받은 한 줄. 순위표가 아니라 주마다 바뀌는 묶음이다. */
  const weekBest = useMemo(() => {
    const merged = new Map<string, CheerNote>();
    for (const n of weekNotes) merged.set(n.id, n);
    for (const n of pool.values()) {
      /* 시각이 아직 없는 글은 방금 쓴 글이다(서버 시각을 기다리는 중). */
      if ((n.createdAt?.getTime() ?? Infinity) >= since) merged.set(n.id, n);
    }
    return [...merged.values()]
      .filter((n) => n.agreeCount > 0)
      .sort((a, b) => b.agreeCount - a.agreeCount)
      .slice(0, 3);
  }, [weekNotes, pool, since]);

  const shown = order === "new" ? byNew : order === "agree" ? agreeList : byTopic;

  /* 내가 누른 나도요. 이미 물어본 글은 다시 묻지 않는다 — 실시간 쪽이 바뀔 때마다 다 묻던 것을 고쳤다. */
  const visibleIds = useMemo(
    () => [...new Set([...shown, ...weekBest].map((n) => n.id))].join(","),
    [shown, weekBest],
  );
  useEffect(() => {
    if (!uid || visibleIds.length === 0) return;
    if (checked.current.uid !== uid) checked.current = { uid, ids: new Set() };
    const ask = visibleIds.split(",").filter((id) => !checked.current.ids.has(id));
    if (ask.length === 0) return;
    for (const id of ask) checked.current.ids.add(id);
    let alive = true;
    loadMyNoteAgrees(uid, ask).then((set) => {
      if (!alive || set.size === 0) return;
      setAgreed((prev) => new Set([...prev, ...set]));
    });
    return () => {
      alive = false;
    };
  }, [uid, visibleIds]);

  /* 지난 글은 실시간이 아니라서, 내가 누른 나도요는 여기서 바로 고친다. */
  const patch = useCallback((id: string, delta: number) => {
    const bump = (n: CheerNote) => (n.id === id ? { ...n, agreeCount: Math.max(0, n.agreeCount + delta) } : n);
    setPool((prev) => {
      const note = prev.get(id);
      if (!note) return prev;
      return new Map(prev).set(id, bump(note));
    });
    setAgreeList((list) => list.map(bump));
    setWeekNotes((list) => list.map(bump));
    setTopicNotes((t) => (t ? { ...t, notes: t.notes.map(bump) } : t));
  }, []);

  const onAgree = useCallback(
    async (note: CheerNote) => {
      const account = await ensureUser();
      if (!account) return;
      const was = agreed.has(note.id);
      try {
        await toggleNoteAgree(account.uid, note.id, was);
        track("cheer_agree", { on: !was });
        setAgreed((prev) => {
          const next = new Set(prev);
          if (was) next.delete(note.id);
          else next.add(note.id);
          return next;
        });
        patch(note.id, was ? -1 : 1);
      } catch (e) {
        onError(e instanceof Error ? e.message : "누르지 못했습니다.");
      }
    },
    [agreed, ensureUser, onError, patch],
  );

  const onRemoved = useCallback((id: string) => {
    setPool((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    setAgreeList((list) => list.filter((n) => n.id !== id));
    setWeekNotes((list) => list.filter((n) => n.id !== id));
    setTopicNotes((t) => (t ? { ...t, notes: t.notes.filter((n) => n.id !== id) } : t));
  }, []);

  const pickOrder = async (next: Order) => {
    setOrder(next);
    if (next === "agree" && agreeList.length === 0 && !agreeDone) await more("agree");
  };

  const more = async (which: "new" | "agree") => {
    if (busy) return;
    setBusy(true);
    try {
      if (which === "new") {
        const page = await loadNotePage(uid, "new", olderLast ?? liveLast);
        setPool((prev) => {
          const next = new Map(prev);
          for (const n of page.notes) if (!next.has(n.id)) next.set(n.id, n);
          return next;
        });
        if (page.last) setOlderLast(page.last);
        if (page.notes.length < NOTE_LIVE) setOlderDone(true);
      } else {
        const page = await loadNotePage(uid, "agree", agreeLast);
        setAgreeList((list) => {
          const have = new Set(list.map((n) => n.id));
          return [...list, ...page.notes.filter((n) => !have.has(n.id))];
        });
        if (page.last) setAgreeLast(page.last);
        if (page.notes.length < NOTE_LIVE) setAgreeDone(true);
      }
    } catch (e) {
      onError(e instanceof Error ? e.message : "불러오지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const total = counts?.total ?? null;
  const canMore =
    order === "new"
      ? !olderDone && (total === null ? byNew.length >= NOTE_LIVE : byNew.length < total)
      : order === "agree"
        ? !agreeDone && agreeList.length > 0
        : false;
  const current = topic ? topicBy.get(topic) ?? null : null;

  return (
    <>
      <div className="mt-8">
        <p className="text-[12px] font-semibold text-navy">대통령께 마음을 전하는 자리</p>
        <h2 className="mt-2 text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink">
          한 줄이면 충분합니다.
          <br />
          <span className="text-navy">응원은 오래 남습니다.</span>
        </h2>
        <p className="mt-3 text-[13px] leading-relaxed text-smoke">
          {counts
            ? counts.week > 0
              ? `이번 주 ${counts.week.toLocaleString()}개, 모두 ${counts.total.toLocaleString()}개의 응원이 모였습니다. 당신의 한 줄을 더해 주세요.`
              : `모두 ${counts.total.toLocaleString()}개의 응원이 모였습니다. 이번 주 첫 한 줄을 남겨 주세요.`
            : "전하고 싶은 응원과 감사를 짧게 남겨 주세요."}
        </p>
      </div>

      <Echo uid={uid} />

      <NoteComposer
        topics={topics}
        topic={current}
        onTopic={onTopic}
        from={from}
        onPosted={onPosted}
        onError={onError}
        onDone={onDone}
      />

      {weekBest.length > 0 && (
        <section aria-labelledby="cheer-week-best" className="mt-10">
          <h3 id="cheer-week-best" className="text-[15px] font-bold text-ink">
            이번 주 공감을 많이 받은 한 줄
          </h3>
          <p className="mt-1 text-[12px] text-ash">지난 7일 동안 남은 응원 가운데 나도요가 많은 것입니다.</p>
          <ul className="mt-4 space-y-3">
            {weekBest.map((note) => (
              <li key={note.id}>
                <NoteCard
                  note={note}
                  tilt={1}
                  topic={note.topic ? topicBy.get(note.topic) ?? null : null}
                  agreed={agreed.has(note.id)}
                  admin={admin}
                  ready={ready}
                  onAgree={() => onAgree(note)}
                  onRemoved={() => onRemoved(note.id)}
                  onError={onError}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[15px] font-bold text-ink">
          마음이 모이는 응원 벽
          {total !== null && (
            <span className="tabular ml-2 text-[12px] font-semibold text-ash">{total.toLocaleString()}개</span>
          )}
        </h3>
        <div role="group" aria-label="정렬" className="flex shrink-0 gap-1">
          {(
            [
              ["new", "최신순"],
              ["agree", "공감순"],
              ...(current ? ([["topic", "이 언행"]] as const) : []),
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={order === id}
              onClick={() => void pickOrder(id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                order === id
                  ? "bg-ink text-eggshell"
                  : "border border-stone text-smoke hover:border-graphite hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {order === "topic" && current && (
        <p className="mt-2 text-[12px] leading-relaxed text-ash">
          「{current.title}」에 남은 한 줄만 모았습니다.
        </p>
      )}

      {!loaded && (
        <p className="mt-4 rounded-card border border-stone px-5 py-6 text-center text-[13px] text-ash">
          응원을 불러오는 중입니다.
        </p>
      )}

      {loaded && shown.length === 0 && !hasError && (
        <p className="mt-4 rounded-card border border-dashed border-stone px-5 py-8 text-center text-[13px] leading-relaxed text-ash">
          {order === "topic" ? "이 언행에는 아직 한 줄이 없습니다." : "아직 벽이 비어 있습니다."}
          <br />
          첫 번째 응원을 붙여 주세요.
        </p>
      )}

      {/*
        * 길이가 제각각인 쪽지를 줄 맞춰 세우면 짧은 것 옆에 빈자리가 난다.
        * 열(columns)로 흘려 붙여 벽처럼 보이게 한다.
        */}
      <ul className="mt-5 columns-1 gap-3 sm:columns-2">
        {shown.map((note, i) => (
          <li key={note.id} className="mb-4 break-inside-avoid pt-2">
            <NoteCard
              note={note}
              tilt={i % 3}
              topic={note.topic && order !== "topic" ? topicBy.get(note.topic) ?? null : null}
              agreed={agreed.has(note.id)}
              admin={admin}
              ready={ready}
              onAgree={() => onAgree(note)}
              onRemoved={() => onRemoved(note.id)}
              onError={onError}
            />
          </li>
        ))}
      </ul>

      {canMore && (
        <button
          type="button"
          onClick={() => void more(order === "agree" ? "agree" : "new")}
          disabled={busy}
          className="mt-2 w-full rounded-full border border-stone px-4 py-2.5 text-[12px] font-semibold text-smoke transition-colors hover:border-graphite hover:text-ink disabled:opacity-40"
        >
          {busy ? "불러오는 중" : "응원 더 보기"}
          {order === "new" && total !== null && total > byNew.length && (
            <span className="tabular"> ({(total - byNew.length).toLocaleString()})</span>
          )}
        </button>
      )}
    </>
  );
}

/* ── 내 응원에 돌아온 반응 ─────────────────────────────────────── */

function Echo({ uid }: { uid: string | null }) {
  const [echo, setEcho] = useState<{ uid: string; gain: number; notes: Array<{ note: CheerNote; gain: number }> } | null>(null);

  useEffect(() => {
    if (!uid) return;
    let alive = true;
    listMyCheers(uid)
      .then(({ notes }) => {
        if (!alive) return;
        const gains = echoGains(uid, notes);
        markEchoSeen(uid, notes);
        const list = notes
          .filter((n) => gains.has(n.id))
          .map((note) => ({ note, gain: gains.get(note.id) ?? 0 }))
          .sort((a, b) => b.gain - a.gain);
        const gain = list.reduce((sum, x) => sum + x.gain, 0);
        if (gain > 0) {
          setEcho({ uid, gain, notes: list.slice(0, 3) });
          track("cheer_echo", { gain });
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [uid]);

  if (!echo || echo.uid !== uid) return null;

  return (
    <section
      aria-live="polite"
      className="mt-6 rounded-card border border-navy/30 bg-navy-tint/50 px-5 py-4"
    >
      <p className="text-[14px] font-bold text-navy">
        지난번 이후 내 응원에 나도요 +{echo.gain}
      </p>
      <ul className="mt-2 space-y-1.5">
        {echo.notes.map(({ note, gain }) => (
          <li key={note.id} className="flex items-baseline gap-2 text-[13px] leading-relaxed text-ink">
            <span className="tabular shrink-0 text-[12px] font-semibold text-navy">+{gain}</span>
            <span className="min-w-0 truncate">“{note.body}”</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── 한 줄 칸 ─────────────────────────────────────────────────── */

/**
 * 마음 고르기.
 *
 * 누르면 첫 문장을 채워 준다. 빈 칸에서 시작하는 것보다 고쳐 쓰는 것이 훨씬 쉽다.
 * 다만 첫 문장만으로 끝나지 않게, 문장을 열어 둔 채로 넘긴다("특히 ", "— ").
 * 언행을 골랐으면 그 말에서 무엇이 남았는지를 묻는 단추로 바뀐다.
 */
const MOODS_TOPIC = [
  { label: "마음에 남은 말", starter: "이 말이 마음에 남았습니다 — " },
  { label: "고마운 점", starter: "이 일, 정말 고맙습니다. " },
  { label: "바라는 점", starter: "앞으로 꼭 바라는 것은 " },
  { label: "함께하겠습니다", starter: "끝까지 함께하겠습니다. " },
] as const;

const MOODS_FREE = [
  { label: "늘 응원합니다", starter: "대통령님, 늘 응원합니다. " },
  { label: "고맙습니다", starter: "대통령님, 고맙습니다. 특히 " },
  { label: "바라는 점", starter: "앞으로 꼭 바라는 것은 " },
  { label: "함께하겠습니다", starter: "끝까지 함께하겠습니다. " },
] as const;

const STARTERS = [...MOODS_TOPIC, ...MOODS_FREE].map((m) => m.starter.trim());

/** 첫 문장을 썼는가 — 계측용. 글은 보내지 않고 이 셋 중 하나만 보낸다. */
function starterKind(body: string): "none" | "edited" | "verbatim" {
  const text = body.trim();
  const hit = STARTERS.find((s) => text.startsWith(s));
  if (!hit) return "none";
  return text === hit ? "verbatim" : "edited";
}

function isFresh(topic: CheerTopic): boolean {
  if (!topic.arrivedOn) return false;
  const days = (Date.now() - Date.parse(`${topic.arrivedOn}T00:00:00+09:00`)) / 86_400_000;
  return days < FRESH_DAYS;
}

/** 고르기 칸에 바로 보이는 언행 수. 나머지는 "다른 언행"에서 고른다. */
const TOPIC_CHIPS = 3;

function NoteComposer({
  topics,
  topic,
  onTopic,
  from,
  onPosted,
  onDone,
  onError,
}: {
  topics: CheerTopic[];
  topic: CheerTopic | null;
  onTopic: (slug: string | null) => void;
  from: CheerFrom;
  onPosted: () => void;
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const { ensureUser } = useAuth();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<CheerTopic | null | false>(false);
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  const moods = topic ? MOODS_TOPIC : MOODS_FREE;
  const chips = topics.slice(0, TOPIC_CHIPS);
  /* 링크로 들어와 앞의 셋에 없는 언행을 골랐으면 그것도 칩으로 보인다. */
  const chipList = topic && !chips.some((t) => t.slug === topic.slug) ? [topic, ...chips.slice(0, TOPIC_CHIPS - 1)] : chips;
  const rest = topics.filter((t) => !chipList.some((c) => c.slug === t.slug));

  const pick = (starter: string) => {
    /*
     * 비었거나 다른 첫 문장만 있으면 갈아 끼운다. 이미 제 말을 적어 두었으면
     * 지우지 않고 앞에 붙인다 — 누른 한 번에 쓴 것이 사라지면 다시 안 쓴다.
     */
    const current = body.trim();
    const next =
      current.length === 0 || STARTERS.includes(current)
        ? starter
        : `${starter}${current}`.slice(0, NOTE_MAX);
    setBody(next);
    setSent(false);
    const field = fieldRef.current;
    if (field) {
      field.focus();
      requestAnimationFrame(() => field.setSelectionRange(next.length, next.length));
    }
  };

  const submit = async () => {
    if (body.trim().length === 0 || sending) return;
    setSending(true);
    try {
      const account = await ensureUser();
      if (!account) throw new Error("로그인을 준비하지 못했습니다.");
      await postCheerNote(account.uid, body, topic?.slug ?? null);
      track("cheer_post", { starter: starterKind(body), topic: Boolean(topic), from });
      setBody("");
      setSent(topic);
      onPosted();
      onDone();
    } catch (e) {
      onError(e instanceof Error ? e.message : "남기지 못했습니다.");
    } finally {
      setSending(false);
    }
  };

  const trimmed = body.trim();
  const verbatim = STARTERS.includes(trimmed);

  return (
    <div className="mt-6 rounded-card-lg border border-stone bg-eggshell px-5 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]">
      <p className="rounded-card bg-taupe px-4 py-3 text-[12px] leading-relaxed text-smoke">
        <span className="font-semibold text-graphite">품격 있는 말로 함께해 주세요.</span>{" "}
        비난이나 조롱 대신 따뜻한 응원을 남겨 주세요. 남에 대한 이야기와
        개인정보는 운영자가 지웁니다.
      </p>

      {/* 오늘의 한 줄 — 어떤 말에 남길지 */}
      <div className="mt-5">
        <p className="text-[13px] font-semibold text-ink">어떤 말에 남길까요?</p>
        <div role="group" aria-label="언행 고르기" className="mt-2.5 flex flex-wrap gap-1.5">
          {chipList.map((t, i) => {
            const on = topic?.slug === t.slug;
            return (
              <button
                key={t.slug}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  onTopic(t.slug);
                  setSent(false);
                }}
                className={`max-w-full rounded-full px-3 py-1.5 text-left text-[12px] font-semibold transition-colors ${
                  on
                    ? "bg-ink text-eggshell"
                    : "border border-stone bg-taupe text-graphite hover:border-graphite hover:text-ink"
                }`}
              >
                <span className="line-clamp-1">
                  {i === 0 && !topic && isFresh(t) ? "오늘의 한 줄 · " : ""}
                  {t.title}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={topic === null}
            onClick={() => {
              onTopic(null);
              setSent(false);
            }}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
              topic === null
                ? "bg-ink text-eggshell"
                : "border border-stone text-smoke hover:border-graphite hover:text-ink"
            }`}
          >
            언행 없이
          </button>
        </div>
        {rest.length > 0 && (
          <label className="mt-2 block">
            <span className="sr-only">다른 언행 고르기</span>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) onTopic(e.target.value);
                setSent(false);
              }}
              className="w-full rounded-card border border-stone bg-canvas px-3 py-2 text-[12px] text-smoke focus:border-graphite focus:outline-none"
            >
              <option value="">다른 언행 고르기 ({rest.length})</option>
              {rest.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.kind} · {t.title}
                </option>
              ))}
            </select>
          </label>
        )}

        {topic && (
          <div className="mt-3 rounded-card border border-stone bg-canvas px-4 py-3">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-ash">
              {isFresh(topic) && (
                <span className="rounded-full bg-navy px-2 py-0.5 text-eggshell">새로 들어온 언행</span>
              )}
              <span className="rounded-full bg-taupe px-2 py-0.5 text-navy">{topic.kind}</span>
              <span>{topic.displayDate}</span>
            </div>
            <p className="mt-1.5 text-[14px] font-bold leading-snug text-ink">{topic.title}</p>
            <Link
              href={`/words/${topic.slug}`}
              className="mt-1.5 inline-block text-[12px] font-semibold text-navy hover:underline"
            >
              원문 먼저 읽기 →
            </Link>
          </div>
        )}
      </div>

      <p className="mt-5 text-[13px] font-semibold text-ink">
        {topic ? "이 말에서 무엇이 남았나요?" : "어떤 마음을 전할까요?"}
      </p>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {moods.map((mood) => {
          const on = trimmed.startsWith(mood.starter.trim());
          return (
            <button
              key={mood.label}
              type="button"
              aria-pressed={on}
              onClick={() => pick(mood.starter)}
              className={`rounded-card px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                on
                  ? "border border-ink bg-ink text-eggshell"
                  : "border border-stone bg-taupe text-graphite hover:border-graphite hover:text-ink"
              }`}
            >
              {mood.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-baseline justify-between">
        <label htmlFor="cheer-note" className="text-[13px] font-semibold text-ink">
          메시지
        </label>
        <span
          className={`tabular text-[11px] ${body.length >= NOTE_MAX ? "text-burgundy" : "text-ash"}`}
        >
          {body.length} / {NOTE_MAX}
        </span>
      </div>
      <textarea
        id="cheer-note"
        ref={fieldRef}
        value={body}
        rows={3}
        maxLength={NOTE_MAX}
        onChange={(e) => {
          setBody(e.target.value);
          setSent(false);
        }}
        onKeyDown={(e) => {
          /* 한 줄이므로 Enter는 줄바꿈이 아니라 남기기다. 한글 조합 중에는 넘긴다. */
          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault();
            void submit();
          }
        }}
        placeholder={topic ? "이 말에서 마음에 남은 것을 한 줄로 적어 주세요." : "대통령님, 늘 응원하고 있습니다. 힘내세요!"}
        className="mt-2 block w-full resize-none rounded-card border border-stone bg-canvas px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
      />
      {/* 막지는 않는다. 첫 문장 그대로도 응원이다 — 한 마디 더 붙이도록 권할 뿐이다. */}
      {verbatim && (
        <p className="mt-2 text-[12px] leading-relaxed text-smoke">
          내 말로 한 마디만 더 붙이면 읽는 사람에게 더 오래 남아요.
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={sending || trimmed.length === 0}
        className="mt-3 w-full rounded-full bg-ink px-4 py-3 text-[14px] font-bold text-eggshell transition-opacity disabled:opacity-40"
      >
        {sending ? "붙이는 중" : "응원 벽에 붙이기"}
      </button>
      <p aria-live="polite" className="mt-2 min-h-[1.25rem] text-center text-[12px] text-navy">
        {sent !== false && "응원이 벽에 붙었습니다. 고맙습니다!"}
      </p>

      {/*
        * 응원을 남긴 뒤 정원으로 가는 길. 응원의 대가가 아니라 그 언행 원문에 붙은 씨앗이다 —
        * 업적 페이지의 "씨앗 받기"와 같은 선물 링크이고 품종마다 한 번뿐이다.
        */}
      {sent && (
        <Link
          href={`/garden?gift=w:${sent.slug}`}
          onClick={() => track("cheer_seed")}
          className="garden mt-2 flex items-center justify-between gap-3 rounded-card border border-stone px-4 py-3 transition-colors hover:border-graphite"
        >
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-ink">🌱 이 언행은 정원에서 씨앗으로도 키워요</span>
            <span className="mt-0.5 block truncate text-[12px] text-smoke">「{sent.title}」 씨앗 받기</span>
          </span>
          <span aria-hidden="true" className="shrink-0 text-[13px] text-ash">
            →
          </span>
        </Link>
      )}
    </div>
  );
}

/* ── 쪽지 ─────────────────────────────────────────────────────── */

/** 몇 분 전. 벽이 살아 있다는 것은 날짜보다 "방금"이 더 잘 말한다. */
function ago(date: Date | null): string | null {
  if (!date) return null;
  const min = Math.floor((Date.now() - date.getTime()) / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  if (day < 30) return `${day}일 전`;
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

/* 쪽지를 살짝 비뚤게 붙인다. 셋 중 하나는 반듯하게 — 다 기울면 어지럽다. */
const TILTS = ["-rotate-[0.6deg]", "rotate-0", "rotate-[0.5deg]"] as const;

function NoteCard({
  note,
  tilt,
  topic,
  agreed,
  admin,
  ready,
  onAgree,
  onRemoved,
  onError,
}: {
  note: CheerNote;
  tilt: number;
  /** 이 한 줄이 붙은 언행. 모르는 이름표면 null이라 그리지 않는다. */
  topic: CheerTopic | null;
  agreed: boolean;
  admin: boolean;
  ready: boolean;
  onAgree: () => void;
  onRemoved: () => void;
  onError: (message: string) => void;
}) {
  const remove = async () => {
    try {
      await deleteCheerNote(note.id);
      onRemoved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "지우지 못했습니다.");
    }
  };

  const when = ago(note.createdAt);

  return (
    <article
      className={`relative rounded-card border px-4 pb-3 pt-5 ${TILTS[tilt]} ${
        note.mine ? "border-graphite bg-eggshell" : "border-stone bg-taupe"
      }`}
    >
      {/* 테이프 한 조각. 쪽지를 벽에 붙였다는 것 말고는 뜻이 없다. */}
      <span
        aria-hidden="true"
        className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-[-2deg] rounded-[2px] bg-stone/90"
      />
      <span aria-hidden="true" className="block text-[22px] font-bold leading-none text-ash">
        &ldquo;
      </span>
      <p className="mt-1 text-[14.5px] leading-relaxed text-ink">{note.body}</p>
      {topic && (
        <Link
          href={`/words/${topic.slug}`}
          className="mt-2 block truncate text-[11px] font-semibold text-navy hover:underline"
        >
          「{topic.title}」에 남긴 한 줄
        </Link>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={onAgree}
          disabled={!ready}
          aria-pressed={agreed}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors disabled:opacity-40 ${
            agreed
              ? "bg-navy text-eggshell"
              : "border border-stone bg-eggshell text-smoke hover:border-graphite hover:text-ink"
          }`}
        >
          나도요 {note.agreeCount > 0 && <span className="tabular">{note.agreeCount}</span>}
        </button>
        {note.mine && <span className="text-[11px] font-semibold text-navy">내 글</span>}
        {(note.mine || admin) && (
          <button
            type="button"
            onClick={remove}
            className="rounded-full border border-stone px-2.5 py-1 text-[11px] font-semibold text-ash transition-colors hover:border-burgundy hover:text-burgundy"
          >
            지우기
          </button>
        )}

        {when && <span className="ml-auto text-[11px] text-ash">{when}</span>}
      </div>
    </article>
  );
}

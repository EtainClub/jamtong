"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { CheerVideo } from "@/content/cheers/schema";
import { useAuth } from "@/lib/firebase/auth";
import {
  NOTE_MAX,
  deleteCheerNote,
  deleteCheerVideo,
  loadMyNoteAgrees,
  parseYoutubeId,
  postCheerNote,
  postCheerVideo,
  toggleNoteAgree,
  watchCheerNotes,
  watchCheerVideos,
  type CheerNote,
  type SubmittedVideo,
} from "@/lib/firebase/cheers";
import { checkAdmin } from "@/lib/firebase/feedback";
import { CheerWall, type CheerCard } from "./CheerWall";

/**
 * 지지자 응원 — 한 줄과 영상.
 *
 * ★ 둘을 위아래로 쌓지 않고 같은 크기의 두 칸으로 가른다.
 *   예전에는 영상이 위, 한 줄이 아래였다. 세로 영상 한 편이 화면 하나를
 *   차지해서, 한 줄 칸에 닿으려면 영상 수만큼 스크롤해야 했고 실제로
 *   거기까지 내려가는 사람이 드물었다. 두 칸을 나란히 두고 개수를 같이
 *   적으면 둘 다 첫 화면에서 보인다.
 *
 * ★ 처음 열리는 쪽은 한 줄이다.
 *   영상은 올리려면 유튜브에 제 영상이 있어야 하지만, 한 줄은 지금 이
 *   자리에서 누구나 쓸 수 있다. 문턱이 낮은 쪽을 먼저 보여 줘야 이 탭이
 *   "보는 곳"이 아니라 "남기는 곳"으로 읽힌다. 영상 칸은 처음 누를 때
 *   붙인다 — 한 줄만 쓰고 나가는 사람이 iframe 값을 치를 이유가 없다.
 *
 * ★ 영상은 씨앗과 올라온 것을 한 벽에 섞는다.
 *   코드에 박아 둔 것(seed)과 사람들이 올린 것을 따로 늘어놓으면 "공식"과
 *   "그 밖"이 생긴다. 이 탭에 공식은 없다. 전부 남이 만든 영상이다.
 *
 * ★ 로그인 화면을 먼저 들이밀지 않는다.
 *   나머지 화면과 같게 익명으로 시작한다(ensureUser). 올리기를 누른 순간
 *   계정이 생기고, 그래서 제 것을 도로 내릴 수 있다.
 */

type View = "notes" | "videos";

export function CheerBoard({ seed }: { seed: CheerVideo[] }) {
  const { user, ready, configured, ensureUser } = useAuth();
  const uid = user?.uid ?? null;

  const [videos, setVideos] = useState<SubmittedVideo[]>([]);
  const [notes, setNotes] = useState<CheerNote[]>([]);
  const [agreed, setAgreed] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [view, setView] = useState<View>("notes");
  const [videosOpened, setVideosOpened] = useState(false);

  /*
   * 운영자인지. 피드백 게시판과 같은 이유로 "어느 uid가 확인됐나"를 담고
   * 지금 uid와 견준다 — 이펙트 안에서 false로 되돌리면 React Compiler가 막는다.
   */
  const [adminUid, setAdminUid] = useState<string | null>(null);
  const admin = adminUid !== null && adminUid === uid;

  useEffect(() => {
    if (!configured) return;
    return watchCheerVideos(uid, setVideos, setError);
  }, [uid, configured]);

  useEffect(() => {
    if (!configured) return;
    return watchCheerNotes(
      uid,
      (next) => {
        setNotes(next);
        setLoaded(true);
        setError(null);
      },
      (message) => {
        setError(message);
        setLoaded(true);
      },
    );
  }, [uid, configured]);

  useEffect(() => {
    if (!uid || notes.length === 0) return;
    let alive = true;
    loadMyNoteAgrees(
      uid,
      notes.map((n) => n.id),
    ).then((set) => {
      if (alive) setAgreed(set);
    });
    return () => {
      alive = false;
    };
  }, [uid, notes]);

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

  const seedIds = useMemo(() => new Set(seed.map((v) => v.youtubeId)), [seed]);

  /*
   * 한 벽에 붙일 카드.
   *
   * 씨앗이 먼저고 올라온 것이 뒤다 — 올라온 쪽은 최신순이라 자리가 계속
   * 바뀌는데, 위에 두면 탭을 열 때마다 다른 영상이 첫 칸에 온다.
   *
   * 씨앗과 같은 영상이 올라와 있으면 올라온 쪽을 버린다. 저장소는 제
   * 컬렉션 안의 겹침만 막을 수 있고 코드에 박힌 것까지는 모른다.
   */
  const cards = useMemo<CheerCard[]>(() => {
    const fromSeed: CheerCard[] = seed.map((video) => ({
      key: `seed:${video.id}`,
      youtubeId: video.youtubeId,
      title: video.title,
      channel: video.channel,
      channelUrl: video.channelUrl,
    }));

    const fromUsers: CheerCard[] = videos
      .filter((video) => !seedIds.has(video.youtubeId))
      .map((video) => ({
        key: `up:${video.youtubeId}`,
        youtubeId: video.youtubeId,
        title: video.title,
        channel: video.channel,
        channelUrl: video.channelUrl,
        onRemove:
          video.mine || admin
            ? () => {
                deleteCheerVideo(video.youtubeId).catch((e) =>
                  setError(e instanceof Error ? e.message : "내리지 못했습니다."),
                );
              }
            : undefined,
      }));

    return [...fromSeed, ...fromUsers];
  }, [seed, seedIds, videos, admin]);

  const onAgree = useCallback(
    async (note: CheerNote) => {
      const account = await ensureUser();
      if (!account) return;
      try {
        await toggleNoteAgree(account.uid, note.id, agreed.has(note.id));
        setAgreed((prev) => {
          const next = new Set(prev);
          if (next.has(note.id)) next.delete(note.id);
          else next.add(note.id);
          return next;
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "누르지 못했습니다.");
      }
    },
    [agreed, ensureUser],
  );

  const show = (next: View) => {
    setView(next);
    if (next === "videos") setVideosOpened(true);
  };

  return (
    <>
      {error && (
        <p className="mt-4 rounded-card border border-burgundy/30 bg-burgundy-tint/40 px-4 py-3 text-[13px] leading-relaxed text-burgundy">
          {error}
        </p>
      )}

      {admin && (
        <p className="mt-4 rounded-card border border-navy/30 bg-navy-tint/50 px-4 py-3 text-[12px] leading-relaxed text-navy">
          운영자로 보고 있습니다. 영상과 응원을 내릴 수 있습니다.
        </p>
      )}

      <ViewSwitch
        view={view}
        onChange={show}
        noteCount={configured && loaded ? notes.length : null}
        videoCount={cards.length}
      />

      <div id="cheer-panel-notes" hidden={view !== "notes"}>
        {configured ? (
          <NotesView
            notes={notes}
            loaded={loaded}
            agreed={agreed}
            admin={admin}
            ready={ready}
            hasError={error !== null}
            onAgree={onAgree}
            onError={setError}
            onDone={() => setError(null)}
          />
        ) : (
          <p className="mt-6 rounded-card border border-stone bg-taupe px-5 py-4 text-[13px] leading-relaxed text-smoke">
            파이어베이스 설정이 없어 한 줄 응원은 쓸 수 없습니다.
          </p>
        )}
      </div>

      <div id="cheer-panel-videos" hidden={view !== "videos"}>
        {videosOpened && (
          <>
            <VideoNotice />
            {/*
              * 파이어베이스가 없는 환경에서도 씨앗 영상은 보인다. 화면이 통째로
              * 사라지면 설정 문제가 콘텐츠 문제로 보인다.
              */}
            {configured ? (
              <VideoComposer
                known={new Set([...seedIds, ...videos.map((v) => v.youtubeId)])}
                onError={setError}
                onDone={() => setError(null)}
              />
            ) : (
              <p className="mt-4 rounded-card border border-stone bg-taupe px-5 py-4 text-[13px] leading-relaxed text-smoke">
                파이어베이스 설정이 없어 영상 올리기는 쓸 수 없습니다.
              </p>
            )}
            <CheerWall cards={cards} />
          </>
        )}
      </div>
    </>
  );
}

/**
 * 한 줄과 영상 사이를 오가는 두 칸.
 *
 * 크기와 무게를 똑같이 둔다. 한쪽을 크게 그리면 다른 쪽은 "덤"으로 읽힌다.
 * 개수를 칸 안에 적는 것은 비어 있지 않다는 것을 누르기 전에 알리기 위해서다.
 */
function ViewSwitch({
  view,
  onChange,
  noteCount,
  videoCount,
}: {
  view: View;
  onChange: (next: View) => void;
  noteCount: number | null;
  videoCount: number;
}) {
  const items: { id: View; label: string; hint: string; count: string }[] = [
    {
      id: "notes",
      label: "한 줄 응원",
      hint: "지금 바로 한 줄 남기기",
      count: noteCount === null ? "…" : `${noteCount}개`,
    },
    {
      id: "videos",
      label: "응원 영상",
      hint: "지지자가 만든 영상 보기",
      count: `${videoCount}편`,
    },
  ];

  return (
    <div role="group" aria-label="응원 종류" className="mt-6 grid grid-cols-2 gap-2">
      {items.map((item) => {
        const on = item.id === view;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={on}
            aria-controls={`cheer-panel-${item.id}`}
            onClick={() => onChange(item.id)}
            className={`rounded-card px-4 py-3.5 text-left transition-colors ${
              on
                ? "bg-ink text-eggshell"
                : "border border-stone bg-taupe text-ink hover:border-graphite"
            }`}
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-[15px] font-bold">{item.label}</span>
              <span
                className={`tabular text-[12px] font-semibold ${on ? "text-eggshell/70" : "text-ash"}`}
              >
                {item.count}
              </span>
            </span>
            <span className={`mt-1 block text-[11.5px] ${on ? "text-eggshell/70" : "text-smoke"}`}>
              {item.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * 영상 칸의 안내.
 *
 * 영상 위에 둔다. 아래에 두면 영상을 다 본 뒤에야 "우리가 확인한 것이
 * 아니다"를 읽게 되는데, 그때는 이미 읽은 사람 머릿속에서 이 위키가 보증한
 * 내용이 되어 있다.
 */
function VideoNotice() {
  return (
    <>
      <p className="mt-6 text-[13px] leading-relaxed text-smoke">
        지지자들이 직접 만들어 올린 영상입니다. 만든 사람과 원본 채널을 함께
        적고, 영상은 유튜브에 있는 것을 그대로 틉니다.
      </p>
      <p className="mt-3 rounded-card border border-stone bg-taupe px-4 py-3 text-[12px] leading-relaxed text-ash">
        우리가 만든 것도, 우리가 사실 확인을 한 것도 아닙니다. 영상 속 주장은
        업적에 붙는 근거와 같은 검증을 거치지 않았습니다. 확인된 사실은 업적에,
        본인이 한 말은 왼쪽 탭에 있습니다.
      </p>
    </>
  );
}

/* ── 한 줄 응원 ────────────────────────────────────────────────── */

/** 처음에 이만큼 붙이고, 나머지는 "더 보기"로 편다. 300장을 한 번에 그리지 않는다. */
const NOTE_PAGE = 24;

type Sort = "new" | "agree";

function NotesView({
  notes,
  loaded,
  agreed,
  admin,
  ready,
  hasError,
  onAgree,
  onError,
  onDone,
}: {
  notes: CheerNote[];
  loaded: boolean;
  agreed: Set<string>;
  admin: boolean;
  ready: boolean;
  hasError: boolean;
  onAgree: (note: CheerNote) => void;
  onError: (message: string) => void;
  onDone: () => void;
}) {
  const [sort, setSort] = useState<Sort>("new");
  const [shown, setShown] = useState(NOTE_PAGE);

  const sorted = useMemo(
    () => (sort === "new" ? notes : [...notes].sort((a, b) => b.agreeCount - a.agreeCount)),
    [notes, sort],
  );

  return (
    <>
      {/*
        * 빈 칸 앞에서 사람을 멈추게 하는 것은 "무슨 말을 써야 하나"다.
        * 그래서 첫 줄은 설명이 아니라 허락이다 — 짧아도 된다고 먼저 말한다.
        */}
      <div className="mt-8">
        <p className="text-[12px] font-semibold text-navy">대통령께 마음을 전하는 자리</p>
        <h2 className="mt-2 text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink">
          한 줄이면 충분합니다.
          <br />
          <span className="text-navy">응원은 오래 남습니다.</span>
        </h2>
        <p className="mt-3 text-[13px] leading-relaxed text-smoke">
          {loaded && notes.length > 0
            ? `이미 ${notes.length}개의 응원이 모였습니다. 당신의 한 줄을 더해 주세요.`
            : "전하고 싶은 응원과 감사를 짧게 남겨 주세요."}
        </p>
      </div>

      <NoteComposer onError={onError} onDone={onDone} />

      <div className="mt-10 flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-bold text-ink">
          마음이 모이는 응원 벽
          {loaded && (
            <span className="tabular ml-2 text-[12px] font-semibold text-ash">
              {notes.length}개
            </span>
          )}
        </h3>
        <div role="group" aria-label="정렬" className="flex shrink-0 gap-1">
          {(
            [
              ["new", "최신순"],
              ["agree", "공감순"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={sort === id}
              onClick={() => setSort(id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                sort === id
                  ? "bg-ink text-eggshell"
                  : "border border-stone text-smoke hover:border-graphite hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!loaded && (
        <p className="mt-4 rounded-card border border-stone px-5 py-6 text-center text-[13px] text-ash">
          응원을 불러오는 중입니다.
        </p>
      )}

      {loaded && notes.length === 0 && !hasError && (
        <p className="mt-4 rounded-card border border-dashed border-stone px-5 py-8 text-center text-[13px] leading-relaxed text-ash">
          아직 벽이 비어 있습니다.
          <br />
          첫 번째 응원을 붙여 주세요.
        </p>
      )}

      {/*
        * 길이가 제각각인 쪽지를 줄 맞춰 세우면 짧은 것 옆에 빈자리가 난다.
        * 열(columns)로 흘려 붙여 벽처럼 보이게 한다.
        */}
      <ul className="mt-5 columns-1 gap-3 sm:columns-2">
        {sorted.slice(0, shown).map((note, i) => (
          <li key={note.id} className="mb-4 break-inside-avoid pt-2">
            <NoteCard
              note={note}
              tilt={i % 3}
              agreed={agreed.has(note.id)}
              admin={admin}
              ready={ready}
              onAgree={() => onAgree(note)}
              onError={onError}
            />
          </li>
        ))}
      </ul>

      {sorted.length > shown && (
        <button
          type="button"
          onClick={() => setShown((n) => n + NOTE_PAGE)}
          className="mt-2 w-full rounded-full border border-stone px-4 py-2.5 text-[12px] font-semibold text-smoke transition-colors hover:border-graphite hover:text-ink"
        >
          응원 더 보기 <span className="tabular">({sorted.length - shown})</span>
        </button>
      )}
    </>
  );
}

/**
 * 마음 고르기.
 *
 * 누르면 첫 문장을 채워 준다. 빈 칸에서 시작하는 것보다 고쳐 쓰는 것이
 * 훨씬 쉽다. 저장되는 것은 결국 글 한 줄뿐이라 저장소 모양은 그대로다.
 */
const MOODS = [
  { label: "늘 응원합니다", starter: "대통령님, 늘 응원하고 있습니다." },
  { label: "고맙습니다", starter: "대통령님, 정말 고맙습니다." },
  { label: "힘내세요", starter: "대통령님, 힘내세요!" },
  { label: "함께하겠습니다", starter: "끝까지 함께하겠습니다." },
] as const;

const STARTERS = new Set<string>(MOODS.map((m) => m.starter));

/** 한 줄 칸. 접어 두지 않는다 — 한 줄짜리를 여는 데 한 번 더 누르게 할 이유가 없다. */
function NoteComposer({
  onDone,
  onError,
}: {
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const { ensureUser } = useAuth();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  const pick = (starter: string) => {
    /*
     * 비었거나 다른 첫 문장만 있으면 갈아 끼운다. 이미 제 말을 적어 두었으면
     * 지우지 않고 앞에 붙인다 — 누른 한 번에 쓴 것이 사라지면 다시 안 쓴다.
     */
    const current = body.trim();
    const next =
      current.length === 0 || STARTERS.has(current)
        ? `${starter} `
        : `${starter} ${current}`.slice(0, NOTE_MAX);
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
      await postCheerNote(account.uid, body);
      setBody("");
      setSent(true);
      onDone();
    } catch (e) {
      onError(e instanceof Error ? e.message : "남기지 못했습니다.");
    } finally {
      setSending(false);
    }
  };

  const trimmed = body.trim();

  return (
    <div className="mt-6 rounded-card-lg border border-stone bg-eggshell px-5 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]">
      <p className="rounded-card bg-taupe px-4 py-3 text-[12px] leading-relaxed text-smoke">
        <span className="font-semibold text-graphite">품격 있는 말로 함께해 주세요.</span>{" "}
        비난이나 조롱 대신 따뜻한 응원을 남겨 주세요. 남에 대한 이야기와
        개인정보는 운영자가 지웁니다.
      </p>

      <p className="mt-5 text-[13px] font-semibold text-ink">어떤 마음을 전할까요?</p>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {MOODS.map((mood) => {
          const on = trimmed.startsWith(mood.starter);
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
        placeholder="대통령님, 늘 응원하고 있습니다. 힘내세요!"
        className="mt-2 block w-full resize-none rounded-card border border-stone bg-canvas px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
      />

      <button
        type="button"
        onClick={submit}
        disabled={sending || trimmed.length === 0}
        className="mt-3 w-full rounded-full bg-ink px-4 py-3 text-[14px] font-bold text-eggshell transition-opacity disabled:opacity-40"
      >
        {sending ? "붙이는 중" : "응원 벽에 붙이기"}
      </button>

      <p aria-live="polite" className="mt-2 min-h-[1.25rem] text-center text-[12px] text-navy">
        {sent && "응원이 벽에 붙었습니다. 고맙습니다!"}
      </p>
    </div>
  );
}

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
  agreed,
  admin,
  ready,
  onAgree,
  onError,
}: {
  note: CheerNote;
  tilt: number;
  agreed: boolean;
  admin: boolean;
  ready: boolean;
  onAgree: () => void;
  onError: (message: string) => void;
}) {
  const remove = async () => {
    try {
      await deleteCheerNote(note.id);
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

/* ── 영상 ─────────────────────────────────────────────────────── */

/**
 * 영상 올리기.
 *
 * 주소를 받고 **먼저 틀어 보여 준 뒤에** 올린다. 붙여넣기 한 번으로 바로
 * 올라가면 잘못 복사한 영상이 남의 응원판에 걸리고, 올린 사람은 그걸 목록에서
 * 보고서야 안다. 제목과 채널도 이때 유튜브에서 받아 채운다 — 우리가 짓지도,
 * 올린 사람에게 받지도 않는다.
 *
 * 벽 위에 둔다. 아래에 두면 영상을 끝까지 내려 본 사람만 올리기 단추를 만난다.
 */
function VideoComposer({
  known,
  onDone,
  onError,
}: {
  known: Set<string>;
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const { ensureUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [found, setFound] = useState<{
    youtubeId: string;
    title: string;
    channel: string;
    channelUrl: string | null;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setInput("");
    setFound(null);
    setOpen(false);
  };

  const look = async () => {
    const id = parseYoutubeId(input);
    if (!id) {
      onError("유튜브 주소가 아닙니다. 영상 주소를 그대로 붙여넣어 주세요.");
      return;
    }
    if (known.has(id)) {
      onError("이미 올라와 있는 영상입니다.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`/api/youtube?id=${id}`);
      const data = (await res.json()) as {
        error?: string;
        title?: string;
        channel?: string;
        channelUrl?: string | null;
      };
      if (!res.ok || !data.title || !data.channel) {
        throw new Error(data.error ?? "영상을 찾지 못했습니다.");
      }
      setFound({
        youtubeId: id,
        title: data.title,
        channel: data.channel,
        channelUrl: data.channelUrl ?? null,
      });
      onDone();
    } catch (e) {
      onError(e instanceof Error ? e.message : "영상을 찾지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!found) return;
    setBusy(true);
    try {
      const account = await ensureUser();
      if (!account) throw new Error("로그인을 준비하지 못했습니다.");
      await postCheerVideo(account.uid, found);
      reset();
      onDone();
    } catch (e) {
      onError(e instanceof Error ? e.message : "올리지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-card border border-stone bg-taupe px-5 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-graphite"
      >
        응원 영상 올리기
        <span aria-hidden="true">+</span>
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-card border border-stone bg-taupe px-5 py-4">
      <label htmlFor="cheer-url" className="text-[12px] font-semibold text-smoke">
        유튜브 주소
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="cheer-url"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setFound(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void look();
            }
          }}
          placeholder="https://youtube.com/shorts/..."
          className="min-w-0 flex-1 rounded-card border border-stone bg-canvas px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
        />
        <button
          type="button"
          onClick={look}
          disabled={busy || input.trim().length === 0}
          className="shrink-0 rounded-full border border-stone px-4 py-2 text-[12px] font-semibold text-navy transition-opacity disabled:opacity-40"
        >
          {busy ? "찾는 중" : "찾기"}
        </button>
      </div>

      {found && (
        <div className="mt-4">
          <p className="text-[12px] font-semibold text-smoke">이 영상이 맞나요?</p>
          <div className="mt-2">
            <CheerWall
              cards={[
                {
                  key: "preview",
                  youtubeId: found.youtubeId,
                  title: found.title,
                  channel: found.channel,
                  channelUrl: found.channelUrl,
                },
              ]}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-stone px-4 py-2 text-[12px] font-semibold text-smoke transition-colors hover:border-graphite hover:text-ink"
        >
          취소
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={busy || !found}
          className="rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-eggshell transition-opacity disabled:opacity-40"
        >
          {busy ? "올리는 중" : "올리기"}
        </button>
      </div>
    </div>
  );
}

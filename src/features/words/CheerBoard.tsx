"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { CheerVideo } from "@/content/cheers/schema";
import { track } from "@/lib/analytics";
import { useAuth } from "@/lib/firebase/auth";
import {
  countCheerNotes,
  deleteCheerVideo,
  parseYoutubeId,
  postCheerVideo,
  watchCheerVideos,
  type SubmittedVideo,
} from "@/lib/firebase/cheers";
import { checkAdmin } from "@/lib/firebase/feedback";
import { CheerWall, type CheerCard } from "./CheerWall";
import { NotesView, type CheerFrom } from "./CheerNotes";
import type { CheerTopic } from "./cheerTopics";

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
 *
 * ★ 언행 하나를 고르면 한 줄과 영상이 같이 그 말을 따른다.
 *   주소의 `?tab=cheers&topic=<언행 slug>&from=<어디서>`로 들어올 수 있다 — 정원의 쪽지,
 *   홈, 정원 이웃 탭, MY가 이 길로 보낸다. 읽은 뒤 주소에서 지운다.
 */

type View = "notes" | "videos";

const WEEK = 7 * 86_400_000;
const FROMS: CheerFrom[] = ["home", "garden", "neighbors", "my", "link"];

export function CheerBoard({ seed, topics }: { seed: CheerVideo[]; topics: CheerTopic[] }) {
  const { user, configured } = useAuth();
  const uid = user?.uid ?? null;

  const [videos, setVideos] = useState<SubmittedVideo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<{ total: number; week: number } | null>(null);

  const [view, setView] = useState<View>("notes");
  const [videosOpened, setVideosOpened] = useState(false);

  /*
   * 고른 언행. 처음에는 맨 앞(가장 최근에 들어온 언행)이 "오늘의 한 줄"이다.
   * 링크로 들어왔으면 그 언행. 첫 렌더는 서버와 같아야 하므로 주소는 효과에서 읽는다.
   */
  const known = useMemo(() => new Set(topics.map((t) => t.slug)), [topics]);
  const [topic, setTopic] = useState<string | null>(topics[0]?.slug ?? null);
  const [from, setFrom] = useState<CheerFrom>("tab");

  useEffect(() => {
    const url = new URL(window.location.href);
    const asked = url.searchParams.get("topic");
    const came = url.searchParams.get("from");
    const via = FROMS.find((f) => f === came) ?? (asked ? "link" : "tab");
    track("cheer_open", { from: via });
    if (!url.searchParams.has("topic") && !url.searchParams.has("from")) return;
    url.searchParams.delete("topic");
    url.searchParams.delete("from");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    // 주소에서 한 번 읽는 값이다. 다음 렌더에서 다시 읽지 않는다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFrom(via);
    if (asked && known.has(asked)) setTopic(asked);
  }, [known]);

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

  /* 개수는 서버가 센다. 벽에 불러온 글의 수가 아니다. */
  useEffect(() => {
    if (!configured) return;
    let alive = true;
    countCheerNotes(Date.now() - WEEK)
      .then((c) => alive && setCounts(c))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [configured]);

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
  const topicBy = useMemo(() => new Map(topics.map((t) => [t.slug, t])), [topics]);

  /*
   * 한 벽에 붙일 카드.
   *
   * 씨앗이 먼저고 올라온 것이 뒤다 — 올라온 쪽은 최신순이라 자리가 계속
   * 바뀌는데, 위에 두면 탭을 열 때마다 다른 영상이 첫 칸에 온다.
   *
   * 씨앗과 같은 영상이 올라와 있으면 올라온 쪽을 버린다. 저장소는 제
   * 컬렉션 안의 겹침만 막을 수 있고 코드에 박힌 것까지는 모른다.
   */
  const cards = useMemo<Array<CheerCard & { topic: string | null }>>(() => {
    const fromSeed = seed.map((video) => ({
      key: `seed:${video.id}`,
      youtubeId: video.youtubeId,
      title: video.title,
      channel: video.channel,
      channelUrl: video.channelUrl,
      topic: null,
    }));

    const fromUsers = videos
      .filter((video) => !seedIds.has(video.youtubeId))
      .map((video) => ({
        key: `up:${video.youtubeId}`,
        youtubeId: video.youtubeId,
        title: video.title,
        channel: video.channel,
        channelUrl: video.channelUrl,
        topic: video.topic && topicBy.has(video.topic) ? video.topic : null,
        topicTitle: video.topic ? topicBy.get(video.topic)?.title : undefined,
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
  }, [seed, seedIds, videos, admin, topicBy]);

  /* 고른 언행에 걸린 영상만 보기. 걸린 영상이 없으면 단추가 나오지 않는다. */
  const [onlyTopic, setOnlyTopic] = useState(false);
  const topicCards = topic ? cards.filter((c) => c.topic === topic) : [];
  const wall = onlyTopic && topicCards.length > 0 ? topicCards : cards;

  const show = (next: View) => {
    setView(next);
    if (next === "videos") setVideosOpened(true);
  };

  const clearError = useCallback(() => setError(null), []);
  const onPosted = useCallback(
    () => setCounts((c) => (c ? { total: c.total + 1, week: c.week + 1 } : c)),
    [],
  );
  const current = topic ? topicBy.get(topic) ?? null : null;

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
        noteCount={configured ? (counts?.total ?? null) : null}
        videoCount={cards.length}
      />

      <div id="cheer-panel-notes" hidden={view !== "notes"}>
        {configured ? (
          <NotesView
            topics={topics}
            topic={topic}
            onTopic={setTopic}
            from={from}
            admin={admin}
            counts={counts}
            onPosted={onPosted}
            onError={setError}
            onDone={clearError}
            hasError={error !== null}
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
                topic={current}
                onError={setError}
                onDone={clearError}
              />
            ) : (
              <p className="mt-4 rounded-card border border-stone bg-taupe px-5 py-4 text-[13px] leading-relaxed text-smoke">
                파이어베이스 설정이 없어 영상 올리기는 쓸 수 없습니다.
              </p>
            )}
            {current && topicCards.length > 0 && (
              <button
                type="button"
                aria-pressed={onlyTopic}
                onClick={() => setOnlyTopic((v) => !v)}
                className={`mt-4 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  onlyTopic
                    ? "bg-ink text-eggshell"
                    : "border border-stone text-smoke hover:border-graphite hover:text-ink"
                }`}
              >
                「{current.title}」 영상만 · {topicCards.length}편
              </button>
            )}
            <CheerWall cards={wall} />
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
  topic,
  onDone,
  onError,
}: {
  known: Set<string>;
  /** 응원 탭에서 고른 언행. 있으면 "이 언행 영상으로 걸기"를 고를 수 있다. */
  topic: CheerTopic | null;
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
  /* 기본은 끈다. 영상이 그 언행을 다루는지는 올리는 사람이 직접 고른다. */
  const [tagged, setTagged] = useState(false);

  const reset = () => {
    setInput("");
    setFound(null);
    setOpen(false);
    setTagged(false);
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
      const withTopic = tagged && topic ? topic.slug : null;
      await postCheerVideo(account.uid, found, withTopic);
      track("cheer_video_post", { topic: Boolean(withTopic) });
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

      {found && topic && (
        <label className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-smoke">
          <input
            type="checkbox"
            checked={tagged}
            onChange={(e) => setTagged(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            「{topic.title}」을 다룬 영상으로 걸기
          </span>
        </label>
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

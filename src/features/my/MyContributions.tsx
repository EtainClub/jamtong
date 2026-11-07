"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteCheerNote, deleteCheerVideo, listMyCheers, type CheerNote, type SubmittedVideo } from "@/lib/firebase/cheers";
import {
  CORRECTION_KIND_LABEL,
  CORRECTION_STATUS_LABEL,
  listMyCorrections,
  withdrawCorrection,
  type MyCorrection,
} from "@/lib/firebase/corrections";
import {
  deleteFeedback,
  KIND_LABEL,
  listMyFeedback,
  STATUS_LABEL,
  STATUS_STYLE,
  type FeedbackItem,
} from "@/lib/firebase/feedback";

import { echoGains } from "@/features/words/cheerEcho";
import { MySection } from "./MySection";

/**
 * MY의 "내가 남긴 것" — 피드백, 정정·반론 접수, 응원.
 *
 * 남긴 곳에 가지 않아도 운영자의 답과 처리 상태를 본다. 지우기도 여기서 한다.
 * 운영자 답은 처음 본 뒤로 "새로"를 떼려고 본 답의 id를 이 브라우저에 적는다.
 */
const SEEN_KEY = "my:seen-replies";

interface Mine {
  feedback: FeedbackItem[];
  corrections: MyCorrection[];
  notes: CheerNote[];
  videos: SubmittedVideo[];
}

function readSeen(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

/** 답이 달렸거나 상태가 바뀐 것을 한 덩어리로 센다. 바뀐 내용까지 키에 넣어, 답이 고쳐져도 다시 "새로"가 된다. */
function replyKeys(mine: Mine): string[] {
  return [
    ...mine.feedback.filter((f) => f.reply || f.status !== "open").map((f) => `f:${f.id}:${f.status}:${f.reply ?? ""}`),
    ...mine.corrections.filter((c) => c.status !== "received").map((c) => `c:${c.id}:${c.status}:${c.note ?? ""}`),
  ];
}

export function MyContributions({
  uid,
  open,
  onToggle,
}: {
  uid: string | null;
  open: boolean;
  onToggle: (id: string, open: boolean) => void;
}) {
  const [mine, setMine] = useState<{ uid: string; data: Mine | "error" } | null>(null);
  const [seen, setSeen] = useState<Set<string>>(() => (typeof window === "undefined" ? new Set() : readSeen()));

  useEffect(() => {
    if (!uid) return;
    let alive = true;
    void Promise.all([listMyFeedback(uid), listMyCorrections(uid), listMyCheers(uid)])
      .then(([feedback, corrections, cheers]) => {
        if (alive) setMine({ uid, data: { feedback, corrections, ...cheers } });
      })
      .catch((error) => {
        console.error("[my] 내가 남긴 것을 읽지 못했다", error);
        if (alive) setMine({ uid, data: "error" });
      });
    return () => {
      alive = false;
    };
  }, [uid]);

  const data = mine?.uid === uid ? mine.data : undefined;
  const keys = data && data !== "error" ? replyKeys(data) : [];
  const fresh = keys.filter((k) => !seen.has(k)).length;
  /*
   * 지난번 응원 탭을 연 뒤로 내 응원에 붙은 나도요. 여기서는 보기만 하고 "봤다"고 적지 않는다 —
   * 적는 것은 응원 탭이다. 그래야 MY에서 보고도 응원 탭에서 한 번 더 반긴다.
   */
  const gains = uid && data && data !== "error" ? echoGains(uid, data.notes) : new Map<string, number>();

  // 열어서 본 답은 새것이 아니다. 열 때 한 번 적는다.
  const toggle = (id: string, next: boolean) => {
    onToggle(id, next);
    if (next && fresh > 0) {
      const all = new Set([...seen, ...keys]);
      setSeen(all);
      try {
        localStorage.setItem(SEEN_KEY, JSON.stringify([...all]));
      } catch {
        // 기억하지 못하면 다음에도 "새로"가 붙을 뿐이다.
      }
    }
  };

  const remove = async (label: string, run: () => Promise<void>, drop: (m: Mine) => Mine) => {
    if (!window.confirm(`${label}을(를) 지울까요? 되돌릴 수 없어요.`)) return;
    try {
      await run();
      setMine((m) => (m && m.data !== "error" ? { ...m, data: drop(m.data) } : m));
    } catch (error) {
      console.error("[my] 지우지 못했다", error);
      window.alert("지우지 못했어요. 잠시 뒤 다시 해 보세요.");
    }
  };

  const summary =
    data === undefined
      ? "불러오는 중…"
      : data === "error"
        ? "불러오지 못했어요"
        : [
            `피드백 ${data.feedback.length}`,
            `정정·반론 ${data.corrections.length}`,
            `응원 ${data.notes.length + data.videos.length}`,
          ].join(" · ");

  return (
    <MySection
      id="mine"
      icon="📮"
      title="내가 남긴 것"
      summary={summary}
      badge={fresh > 0 ? `새 답 ${fresh}` : null}
      open={open}
      onToggle={toggle}
    >
      {data === undefined && <p className="text-[12px] text-ash">불러오는 중…</p>}
      {data === "error" && <p className="text-[12px] text-pending">불러오지 못했어요. 잠시 뒤 다시 열어 보세요.</p>}

      {data && data !== "error" && (
        <div className="space-y-5">
          <Group title="피드백" empty="남긴 피드백이 없어요." count={data.feedback.length}>
            {data.feedback.map((f) => (
              <Item
                key={f.id}
                tag={
                  <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${STATUS_STYLE[f.status]}`}>
                    {STATUS_LABEL[f.status]}
                  </span>
                }
                meta={`${KIND_LABEL[f.kind]} · 나도요 ${f.agreeCount} · ${when(f.createdAt)}`}
                body={f.body}
                reply={f.reply ? `운영자 답 · ${f.reply}` : null}
                onRemove={() =>
                  void remove("이 피드백", () => deleteFeedback(f.id), (m) => ({ ...m, feedback: m.feedback.filter((x) => x.id !== f.id) }))
                }
              />
            ))}
          </Group>

          <Group title="정정·반론 접수" empty="접수한 정정·반론이 없어요." count={data.corrections.length}>
            <p className="mb-2 text-[11.5px] leading-relaxed text-ash">접수한 글은 나와 운영자만 봅니다.</p>
            {data.corrections.map((c) => (
              <Item
                key={c.id}
                tag={<span className="rounded-full bg-taupe px-2 py-0.5 text-[10.5px] font-semibold text-graphite">{CORRECTION_STATUS_LABEL[c.status]}</span>}
                meta={`${CORRECTION_KIND_LABEL[c.kind]} · ${when(c.createdAt)}`}
                href={c.page.startsWith("/") ? c.page : undefined}
                body={c.body}
                reply={c.note ? `운영자 메모 · ${c.note}` : null}
                removeLabel="거두기"
                onRemove={() =>
                  void remove("이 접수", () => withdrawCorrection(c.id), (m) => ({
                    ...m,
                    corrections: m.corrections.filter((x) => x.id !== c.id),
                  }))
                }
              />
            ))}
          </Group>

          <Group title="응원" empty="남긴 응원이 없어요." count={data.notes.length + data.videos.length}>
            {data.notes.map((n) => (
              <Item
                key={n.id}
                meta={`한 줄 · 나도요 ${n.agreeCount}${gains.get(n.id) ? ` (새로 +${gains.get(n.id)})` : ""} · ${when(n.createdAt)}`}
                body={n.body}
                href={`/words?tab=cheers${n.topic ? `&topic=${n.topic}` : ""}&from=my`}
                onRemove={() =>
                  void remove("이 응원 한 줄", () => deleteCheerNote(n.id), (m) => ({ ...m, notes: m.notes.filter((x) => x.id !== n.id) }))
                }
              />
            ))}
            {data.videos.map((v) => (
              <Item
                key={v.youtubeId}
                meta={`영상 · ${v.channel} · ${when(v.createdAt)}`}
                body={v.title}
                href="/words?tab=cheers&from=my"
                onRemove={() =>
                  void remove("이 응원 영상", () => deleteCheerVideo(v.youtubeId), (m) => ({
                    ...m,
                    videos: m.videos.filter((x) => x.youtubeId !== v.youtubeId),
                  }))
                }
              />
            ))}
          </Group>

          <Link
            href="/feedback"
            className="flex w-full items-center justify-center gap-2 rounded-card border border-stone bg-taupe px-5 py-3 text-sm font-semibold text-navy transition-colors hover:border-graphite"
          >
            바라는 것 남기기 · 피드백 보기
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </MySection>
  );
}

function Group({ title, empty, count, children }: { title: string; empty: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[13px] font-bold text-navy">
        {title} <span className="tabular font-normal text-ash">{count}</span>
      </h3>
      <div className="mt-2 space-y-2">{count === 0 ? <p className="text-[12px] text-ash">{empty}</p> : children}</div>
    </section>
  );
}

function Item({
  tag,
  meta,
  body,
  reply,
  href,
  removeLabel = "지우기",
  onRemove,
}: {
  tag?: React.ReactNode;
  meta: string;
  body: string;
  reply?: string | null;
  href?: string;
  removeLabel?: string;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-card border border-stone bg-taupe px-3.5 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-2 text-[11px] text-ash">
          {tag}
          <span className="truncate">{meta}</span>
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded-full px-1.5 py-0.5 text-[11px] text-ash transition-colors hover:bg-stone hover:text-smoke"
        >
          {removeLabel}
        </button>
      </div>
      <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-ink">{body}</p>
      {reply && <p className="mt-2 border-l-2 border-navy pl-2.5 text-[12px] leading-relaxed text-graphite">{reply}</p>}
      {href && (
        <Link href={href} className="mt-1.5 inline-block text-[11px] font-medium text-ash hover:text-navy">
          그 화면 열기 ↗
        </Link>
      )}
    </div>
  );
}

function when(date: Date | null): string {
  if (!date) return "방금";
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric", timeZone: "Asia/Seoul" });
}

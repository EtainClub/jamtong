"use client";

import { deleteGuestbook, deleteNote, hideLine, reportLine, type LineDoc } from "@/lib/firebase/ilchon";

import { gardenFeedback } from "../feedback";
import { useGarden } from "../store";
import { blockPerson, useIlchonLive } from "./live";
import { LineRow } from "./parts";

/**
 * 한 방의 1촌평·방명록 목록. 내 방(정원 홈)과 남의 방(VisitView)이 같이 쓴다.
 *
 * ★ 가린 글(운영자)은 손님에게 보이지 않는다. 주인과 운영자에게는 "가린 글"로만.
 * ★ 차단한 사람의 글은 주인 화면에 그리지 않는다(§5.1).
 * ★ 신고는 글을 싣지 않고 자리만 운영자 큐로 보낸다(lib/firebase/ilchon.ts의 reportLine).
 */
export function RoomLineList({
  kind,
  gid,
  lines,
  uid,
  owner,
  max,
  empty,
  onVisit,
  onChanged,
  say,
}: {
  kind: "guestbook" | "notes";
  /** 이 방의 공개 id. */
  gid: string;
  lines: LineDoc[] | null;
  uid: string | null;
  /** 방 주인이 보는 화면인가. */
  owner: boolean;
  max?: number;
  empty: string;
  onVisit?: (gid: string) => void;
  onChanged: () => void;
  say: (text: string) => void;
}) {
  const admin = useIlchonLive((s) => s.admin);
  const blocked = useGarden((s) => s.data?.ilchon.blocked);
  const myGid = useGarden((s) => s.data?.share.id ?? null);

  if (lines === null) return <p className="mt-1 text-[13px] text-smoke">불러오는 중…</p>;
  const shown = lines.filter((l) => (!l.hidden || owner || admin) && !(owner && blocked?.some((b) => b.uid === l.uid))).slice(0, max);
  if (shown.length === 0) return <p className="mt-1 text-[13px] text-smoke">{empty}</p>;

  const fail = (what: string) => (error: unknown) => {
    console.error(`[ilchon] ${what}`, error);
    say(`${what} 잠시 뒤 다시 해 보세요`);
  };

  return (
    <ul className="mt-1.5">
      {shown.map((line) => (
        <LineRow
          key={line.id}
          line={line}
          owner={owner}
          canRemove={owner || line.uid === uid}
          admin={admin}
          onVisit={onVisit}
          onRemove={() => {
            gardenFeedback("tap");
            (kind === "guestbook" ? deleteGuestbook(gid, line.id) : deleteNote(gid, line.id))
              .then(() => {
                say("지웠어요");
                onChanged();
              })
              .catch(fail("지우지 못했어요."));
          }}
          onReport={() => {
            if (!uid) return say("잠시 뒤 다시 해 보세요");
            gardenFeedback("tap");
            reportLine(uid, gid, kind, line.id)
              .then(() => say("신고했어요 · 운영자가 살펴봐요"))
              .catch(fail("신고하지 못했어요."));
          }}
          onBlock={
            owner && uid && myGid && line.uid !== uid
              ? () => {
                  gardenFeedback("tap");
                  blockPerson({ uid, gid: myGid }, { uid: line.uid, n: line.n })
                    .then(() => {
                      say(`${line.n}님을 차단했어요 · 신청과 방명록이 오지 않아요`);
                      onChanged();
                    })
                    .catch(fail("차단하지 못했어요."));
                }
              : undefined
          }
          onHide={() => {
            hideLine(gid, kind, line.id, !line.hidden)
              .then(() => {
                say(line.hidden ? "가리기를 풀었어요" : "가렸어요");
                onChanged();
              })
              .catch(fail("가리지 못했어요."));
          }}
        />
      ))}
    </ul>
  );
}

import { MINUTE } from "./rules";

/**
 * 익음 알림 — 다 익는 때를 내 캘린더에 넣는다(docs/garden-game.md §3.6).
 * 서버가 보내는 알림이 아니다. 캘린더 일정 하나와 그 시각의 알림 하나뿐이다.
 *
 * ★ 담는 것은 시각과 정해 둔 글뿐이다. 정원 이름도, 품종도 싣지 않는다.
 * ★ 같은 시각이면 같은 UID다 — 두 번 넣어도 캘린더에 한 번만 남는다.
 * 시각은 rules.ts의 alarmTime으로 미리 고른다(22시~8시는 8시로).
 */

export const ALARM_TITLE = "잼통 정원 · 열매가 익었어요";
export const ALARM_TEXT = "텃밭에 가서 거두세요. 익은 열매는 시들지 않고 기다려요.";

/**
 * 알림 종류(docs/garden-miniroom.md §8의 6). ripe=익음, rain=단비, gap=거대 잡초의 빈틈.
 * 글은 정해 둔 것뿐이다. UID에 종류를 붙여 같은 시각의 다른 알림과 겹치지 않게 한다(익음은 예전 UID 그대로).
 */
export type AlarmKind = "ripe" | "rain" | "gap";
export const ALARM_KINDS: AlarmKind[] = ["ripe", "rain", "gap"];
const COPY: Record<AlarmKind, { title: string; text: string }> = {
  ripe: { title: ALARM_TITLE, text: ALARM_TEXT },
  rain: { title: "잼통 정원 · 단비가 와요", text: "단비 동안 자라는 작물이 두 배로 자라요. 10분 동안 와요." },
  gap: { title: "잼통 정원 · 거대 잡초 빈틈", text: "빈틈에 치면 한 번이 두 배로 들어가요. 광장에서 같이 쳐요." },
};

export function alarmKindOf(raw: string | null): AlarmKind {
  return ALARM_KINDS.find((k) => k === raw) ?? "ripe";
}
/** 일정의 길이. 알림은 시작할 때 울린다. */
const LENGTH = 10 * MINUTE;
/** 받아 주는 시각의 범위. 지난 것과 너무 먼 것은 받지 않는다. */
export const ALARM_RANGE = { past: 60 * MINUTE, future: 14 * 24 * 60 * MINUTE };

export function alarmAtOk(at: number, now: number): boolean {
  return Number.isSafeInteger(at) && at >= now - ALARM_RANGE.past && at <= now + ALARM_RANGE.future;
}

/** 20261106T063000Z */
function stamp(t: number): string {
  return new Date(Math.floor(t / 1000) * 1000).toISOString().replace(/[-:]/g, "").replace(".000", "");
}

function escape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** 한 줄은 75바이트까지(RFC 5545). 글자를 자르지 않고 접는다. */
function fold(line: string): string {
  const encoder = new TextEncoder();
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    // 이어지는 줄은 맨 앞 공백 한 칸을 먹는다.
    const limit = out.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      out.push(current);
      current = "";
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join("\r\n ");
}

export function calendarFile(at: number, url: string, now: number, kind: AlarmKind = "ripe"): string {
  const copy = COPY[kind];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//jamtong//garden//KO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:garden-${kind === "ripe" ? "" : `${kind}-`}${Math.floor(at / 1000)}@jamtong.kr`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(at)}`,
    `DTEND:${stamp(at + LENGTH)}`,
    `SUMMARY:${escape(copy.title)}`,
    `DESCRIPTION:${escape(`${copy.text}\n${url}`)}`,
    `URL:${url}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escape(copy.title)}`,
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** 구글 캘린더의 일정 만들기 화면. 휴대폰 캘린더가 .ics를 받지 못할 때. */
export function googleCalendarLink(at: number, url: string, kind: AlarmKind = "ripe"): string {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: COPY[kind].title,
    dates: `${stamp(at)}/${stamp(at + LENGTH)}`,
    details: `${COPY[kind].text}\n${url}`,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

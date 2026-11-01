/**
 * 출처 보존 — 출처 링크가 살아 있는지 보고, 인터넷 아카이브에 남은 보존본을 찾는다.
 *
 *   pnpm sources:archive            새로 생긴 링크와 보존본이 없는 링크만 본다
 *   pnpm sources:archive --recheck  모든 링크를 다시 본다 (30일 지난 것만)
 *   pnpm sources:archive --save     보존본이 없는 링크를 아카이브에 저장 요청한다
 *
 *   계정 키가 있으면 한도가 넓은 로그인 저장을 쓴다 (https://archive.org/account/s3.php)
 *   IA_S3_ACCESS=… IA_S3_SECRET=… pnpm sources:archive --save
 *
 * ★ 왜 하는가.
 *   기사는 지워지고 주소는 바뀐다. 출처 링크가 끊기면 "모든 문장에 출처"가
 *   그날로 거짓이 된다. 보존본이 있으면 원문이 사라져도 근거를 다시 열 수 있다.
 *
 * ★ 콘텐츠 파일은 고치지 않는다.
 *   결과는 `src/content/source-archive.generated.json` 하나에 쓴다. 출처는
 *   raw source이고(AGENTS.md), 수백 곳에 archivedUrl을 박아 넣으면 사람이 쓴
 *   줄과 기계가 쓴 줄이 섞인다. 화면과 factbase는 URL로 이 파일을 찾는다.
 *
 * ★ 저장 요청(--save)은 바깥에 무언가를 남긴다.
 *   이미 공개된 기사 주소를 아카이브에 넘길 뿐이지만, 사람이 켜야 돈다.
 *   아카이브의 익명 요청 한도(분당 몇 건)에 맞춰 천천히 보낸다.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const CONTENT = join(ROOT, "src/content");
const OUT = join(CONTENT, "source-archive.generated.json");

const args = new Set(process.argv.slice(2));
const RECHECK = args.has("--recheck");
const SAVE = args.has("--save");
const RECHECK_DAYS = 30;
const CONCURRENCY = 4;
const TIMEOUT_MS = 20_000;
const SAVE_GAP_MS = 7_000;
const UA = "Mozilla/5.0 (compatible; jamtong-source-check/1.0; +https://jamtong.kr)";

/** 우리 사이트를 가리키는 링크는 출처가 아니다. */
const SKIP_HOSTS = new Set(["jamtong.kr", "www.jamtong.kr", "tt.jamtong.kr"]);

export type LinkStatus = "ok" | "gone" | "blocked" | "error";

export interface ArchiveEntry {
  /** 마지막으로 링크를 본 날 (YYYY-MM-DD). */
  checkedAt: string;
  status: LinkStatus;
  /** 받은 HTTP 상태. 네트워크 오류면 없다. */
  http?: number;
  /** 아카이브 보존본 시각 (YYYYMMDDhhmmss). 주소는 이것과 원래 URL로 만든다. */
  archivedAt?: string;
}

type Archive = Record<string, ArchiveEntry>;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.(ts|json)$/.test(name) && !name.startsWith("source-archive") ? [path] : [];
  });
}

/** 콘텐츠의 `url:`·`"url":` 값을 모은다. archivedUrl처럼 다른 키는 보지 않는다. */
function collectUrls(): string[] {
  const urls = new Set<string>();
  const re = /(?:^|[\s{,])"?url"?\s*:\s*"(https?:\/\/[^"\s]+)"/gm;
  for (const file of walk(CONTENT)) {
    for (const m of readFileSync(file, "utf8").matchAll(re)) {
      const url = m[1];
      if (!SKIP_HOSTS.has(new URL(url).host)) urls.add(url);
    }
  }
  return [...urls].sort();
}

const today = () => new Date().toISOString().slice(0, 10);

async function timed(url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...init,
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "user-agent": UA, ...(init.headers ?? {}) },
  });
}

/** 404·410만 "사라졌다"로 본다. 403·429 같은 것은 봇을 막은 것이지 지워진 것이 아니다. */
async function checkLink(url: string): Promise<Pick<ArchiveEntry, "status" | "http">> {
  try {
    const res = await timed(url);
    await res.body?.cancel();
    const http = res.status;
    if (http < 400) return { status: "ok", http };
    if (http === 404 || http === 410) return { status: "gone", http };
    return { status: "blocked", http };
  } catch {
    return { status: "error" };
  }
}

async function findSnapshot(url: string): Promise<string | undefined> {
  try {
    const res = await timed(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`);
    if (!res.ok) return undefined;
    const data = (await res.json()) as {
      archived_snapshots?: { closest?: { available?: boolean; status?: string; timestamp?: string } };
    };
    const closest = data.archived_snapshots?.closest;
    if (closest?.available && closest.status?.startsWith("2") && closest.timestamp) {
      return closest.timestamp;
    }
  } catch {
    /* 아카이브가 늦거나 막혀도 링크 점검 결과는 남긴다. */
  }
  return undefined;
}

/**
 * 저장 요청 결과.
 *   saved     — 보존본 시각을 받았다
 *   throttled — 아카이브가 한도로 막았다(429·503). 기다렸다 같은 링크를 다시 보낸다
 *   failed    — 이 링크만 실패했다. 다음 링크로 넘어간다
 */
type SaveResult =
  | { kind: "saved"; timestamp: string }
  | { kind: "throttled"; why: string }
  | { kind: "failed"; why: string };

/*
 * 계정 키가 있으면 로그인한 저장(SPN2)을 쓴다. 익명 저장은 수십~백여 건에서
 * 한도에 걸린다. 키는 https://archive.org/account/s3.php 에서 받는다.
 *   IA_S3_ACCESS=… IA_S3_SECRET=… pnpm sources:archive --save
 */
const IA_ACCESS = process.env.IA_S3_ACCESS;
const IA_SECRET = process.env.IA_S3_SECRET;
const AUTHED = Boolean(IA_ACCESS && IA_SECRET);

const throttledStatus = (s: number) => s === 429 || s === 503 || s === 520;

async function saveAnonymous(url: string): Promise<SaveResult> {
  try {
    const res = await fetch(`https://web.archive.org/save/${url}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(120_000),
      headers: { "user-agent": UA },
    });
    await res.body?.cancel();
    const where = res.headers.get("content-location") ?? res.headers.get("location") ?? "";
    const timestamp = where.match(/\/web\/(\d{14})/)?.[1];
    if (timestamp) return { kind: "saved", timestamp };
    if (throttledStatus(res.status)) return { kind: "throttled", why: `HTTP ${res.status}` };
    return { kind: "failed", why: `HTTP ${res.status}` };
  } catch (e) {
    return { kind: "failed", why: e instanceof Error ? e.name : "오류" };
  }
}

/** SPN2 — 작업을 맡기고, 끝날 때까지 상태를 묻는다. */
async function saveAuthed(url: string): Promise<SaveResult> {
  const auth = { authorization: `LOW ${IA_ACCESS}:${IA_SECRET}`, accept: "application/json" };
  try {
    const res = await fetch("https://web.archive.org/save", {
      method: "POST",
      signal: AbortSignal.timeout(60_000),
      headers: { ...auth, "user-agent": UA, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url, skip_first_archive: "1" }),
    });
    if (throttledStatus(res.status)) return { kind: "throttled", why: `HTTP ${res.status}` };
    const job = (await res.json().catch(() => ({}))) as { job_id?: string; message?: string; status_ext?: string };
    if (!job.job_id) {
      const why = job.status_ext ?? job.message ?? `HTTP ${res.status}`;
      return /limit|too many|busy/i.test(why) ? { kind: "throttled", why } : { kind: "failed", why };
    }
    for (let i = 0; i < 30; i++) {
      await sleep(5_000);
      const st = await fetch(`https://web.archive.org/save/status/${job.job_id}`, {
        signal: AbortSignal.timeout(30_000),
        headers: { ...auth, "user-agent": UA },
      });
      const body = (await st.json().catch(() => ({}))) as {
        status?: string;
        timestamp?: string;
        status_ext?: string;
        message?: string;
      };
      if (body.status === "success" && body.timestamp) return { kind: "saved", timestamp: body.timestamp };
      if (body.status === "error") {
        const why = body.status_ext ?? body.message ?? "error";
        return /limit|too many|busy/i.test(why) ? { kind: "throttled", why } : { kind: "failed", why };
      }
    }
    return { kind: "failed", why: "작업이 끝나지 않음" };
  } catch (e) {
    return { kind: "failed", why: e instanceof Error ? e.name : "오류" };
  }
}

const saveSnapshot = (url: string) => (AUTHED ? saveAuthed(url) : saveAnonymous(url));

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function needsCheck(entry: ArchiveEntry | undefined): boolean {
  if (!entry) return true;
  if (!entry.archivedAt) return true;
  if (!RECHECK) return false;
  const age = (Date.now() - Date.parse(entry.checkedAt)) / 86_400_000;
  return age >= RECHECK_DAYS;
}

function write(archive: Archive) {
  const sorted = Object.fromEntries(Object.entries(archive).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(OUT, `${JSON.stringify(sorted, null, 2)}\n`);
}

async function pool<T>(items: T[], run: (item: T, i: number) => Promise<void>) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        await run(items[i], i);
      }
    }),
  );
}

async function main() {
  const urls = collectUrls();
  const old: Archive = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};

  // 콘텐츠에서 빠진 링크는 버린다 — 남겨 두면 파일이 끝없이 자란다.
  const archive: Archive = Object.fromEntries(urls.filter((u) => old[u]).map((u) => [u, old[u]]));

  const todo = urls.filter((u) => needsCheck(archive[u]));
  console.log(`출처 링크 ${urls.length}개 · 이번에 볼 것 ${todo.length}개`);

  await pool(todo, async (url, i) => {
    const [link, snapshot] = await Promise.all([checkLink(url), findSnapshot(url)]);
    archive[url] = {
      checkedAt: today(),
      ...link,
      archivedAt: snapshot ?? archive[url]?.archivedAt,
    };
    if ((i + 1) % 50 === 0) {
      console.log(`  ${i + 1}/${todo.length}`);
      write(archive);
    }
  });
  write(archive);

  if (SAVE) {
    const missing = urls.filter((u) => !archive[u]?.archivedAt && archive[u]?.status !== "gone");
    console.log(
      `저장 요청 ${missing.length}개 · ${AUTHED ? "계정 키 사용(SPN2)" : "익명 — 수십~백여 건에서 한도에 걸린다"}`,
    );
    /*
     * 한도에 걸리면 기다렸다 같은 링크를 다시 보낸다(2·4·8·16분). 그래도 막히면
     * 멈춘다 — 막힌 채 계속 두드리면 한도가 더 늦게 풀린다. 다시 돌리면 저장된
     * 것은 건너뛰고 남은 것부터 한다.
     */
    const BACKOFF_MIN = [2, 4, 8, 16];
    const MAX_FAILED_IN_ROW = 15;
    let saved = 0;
    let failedInRow = 0;
    let stopped: string | null = null;

    outer: for (const [i, url] of missing.entries()) {
      let result = await saveSnapshot(url);
      for (const wait of BACKOFF_MIN) {
        if (result.kind !== "throttled") break;
        console.log(`  한도에 걸림 (${result.why}) — ${wait}분 기다렸다 다시 보냅니다`);
        write(archive);
        await sleep(wait * 60_000);
        result = await saveSnapshot(url);
      }

      if (result.kind === "saved") {
        archive[url] = { ...archive[url], archivedAt: result.timestamp };
        saved += 1;
        failedInRow = 0;
        console.log(`  ${i + 1}/${missing.length} 저장 ${url}`);
      } else if (result.kind === "throttled") {
        stopped = `아카이브 한도가 풀리지 않습니다 (${result.why})`;
        break outer;
      } else {
        failedInRow += 1;
        console.log(`  ${i + 1}/${missing.length} 실패 (${result.why}) ${url}`);
        if (failedInRow >= MAX_FAILED_IN_ROW) {
          stopped = `${MAX_FAILED_IN_ROW}건 연속 실패 — 한도에 걸렸을 가능성이 큽니다`;
          break outer;
        }
      }
      if ((i + 1) % 10 === 0) write(archive);
      await sleep(SAVE_GAP_MS);
    }
    write(archive);
    console.log(`이번에 저장 ${saved}건`);
    if (stopped) {
      console.log(`\n멈춤: ${stopped}.`);
      console.log("  몇 시간 뒤 같은 명령을 다시 돌리면 남은 것부터 합니다.");
      if (!AUTHED) {
        console.log("  계정 키를 쓰면 한도가 훨씬 넓습니다: https://archive.org/account/s3.php");
        console.log("  IA_S3_ACCESS=… IA_S3_SECRET=… pnpm sources:archive --save");
      }
    }
  }

  const entries = urls.map((u) => archive[u]);
  const count = (s: LinkStatus) => entries.filter((e) => e?.status === s).length;
  const archived = entries.filter((e) => e?.archivedAt).length;
  console.log(
    `살아 있음 ${count("ok")} · 사라짐 ${count("gone")} · 막힘 ${count("blocked")} · 오류 ${count("error")}`,
  );
  console.log(`보존본 있음 ${archived}/${urls.length}`);
  const gone = urls.filter((u) => archive[u]?.status === "gone");
  if (gone.length) {
    console.log("\n사라진 링크 (콘텐츠에서 대체 출처를 찾아야 한다):");
    for (const u of gone) console.log(`  ${archive[u].archivedAt ? "보존본 있음" : "보존본 없음"}  ${u}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

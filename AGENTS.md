<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# LLM Wiki

`wiki/`는 **에이전트가 쓰고 유지하는 지식층**이다. 사람은 읽는다.
설계 전체는 `docs/llm-wiki.md`에 있고, 여기에는 작업할 때 지킬 것만 적는다.

## 세 층

- **raw source** — `src/content/achievements/**`, `src/content/words/**`,
  `src/content/milestones/**`, `src/content/sources.ts`.
  **읽기만 한다. 위키 작업 중에 절대 고치지 않는다.**
- **wiki** — `wiki/**`. 에이전트가 소유한다.
- **schema** — 이 절.

`docs/`는 사람이 쓰는 곳이다. 위키와 섞지 않는다.

## raw source가 아닌 것

`src/content/cheers`(지지자 응원 영상), Firestore의 `cheerVideos`·`cheerNotes`·
`feedback`·`users`는 **소스가 아니다.** 운영자가 코드로 커밋했더라도 마찬가지다 —
우리는 그 영상의 제목과 채널만 알고 내용은 확인하지 않았다.

위키는 컴파일되어 영구히 쌓인다. 미검증 주장이 한 번 들어가면 다음 ingest에서
다른 페이지로 상호참조되고, 결국 "위키에 그렇게 적혀 있다"로 세탁된다.

## 앵커 — 모든 단정문에 붙인다

```markdown
법왜곡죄는 2026년 3월 12일 시행됐다. ^[judicial-reform#claim-distort]
```

인정되는 형식은 다섯뿐이고, `pnpm wiki:lint`가 실재를 검사한다.

| 형식 | 가리키는 것 |
|---|---|
| `<업적slug>` | 업적 전체 |
| `<업적slug>#<claimId>` | 그 업적의 claim |
| `words:<slug>` | 언행 한 편 |
| `words:<slug>#<pointId>` | 그 언행의 쉽게 보기 토막 |
| `source:<sourceId>` | 1차 자료 |

**앵커를 달 수 없는 문장은 쓰지 않는다.** 이것이 오염을 막는 방식이다 —
규율이 아니라 문법이다.

claim의 `assertionType`을 물려받는다. 원본이 CLAIM·INTERPRETATION인데 위키가
평서문으로 적으면 안 되고, `verified: false`는 그 사실을 문장에 적는다.

## 페이지

```markdown
---
title: 사법개혁 3법
kind: source          # source | concept | entity | event | synthesis
source: judicial-reform   # kind가 source일 때 필수
updated: 2026-09-20
---
```

- 파일 이름은 **ascii 슬러그**만. macOS가 한글 파일 이름을 NFD로 저장해
  링크 검사가 기계마다 다른 결과를 낸다. 제목은 frontmatter에 한글로 적는다.
- 위키링크는 `wiki/` 기준 경로에서 확장자를 뗀 것 — `[[concept/reform]]`.
- 언행 소스 페이지는 `source/words-<slug>.md`, 업적은 `source/<slug>.md`.

## Ingest

```
pnpm wiki:ingest --list                  아직 안 한 것
pnpm wiki:ingest words/reform-is-hard
pnpm wiki:ingest achievement/judicial-reform
```

스크립트는 덤프만 낸다. 그 덤프를 읽고 다음을 한다.

1. `wiki/source/…`에 소스 페이지를 쓴다.
2. 이 소스가 건드리는 `concept/`·`entity/` 페이지를 만들거나 고친다.
   덤프가 알려 주는 "이미 언급한 페이지"를 먼저 읽는다.
3. `wiki/index.md`에 등록한다.
4. `wiki/log.md`에 append한다.
5. `pnpm wiki:lint`로 오류 0을 확인한다.

## Query

물으면 `index.md`를 먼저 읽고 관련 페이지로 들어간다.
**좋은 답은 `wiki/synthesis/`에 파일링하고 log에 적는다.** 채팅에 묻히면
탐색이 누적되지 않는다.

## Lint

`pnpm wiki:lint`가 기계로 볼 수 있는 아홉 가지를 본다(오류 5·경고 4).
읽어야 아는 것은 요청받았을 때 따로 훑는다 — 페이지 간 모순, 새 소스가 뒤집은
옛 서술, 없는 개념 페이지, CLAIM을 FACT처럼 쓴 곳, 자료 공백.

## 모델 API를 부르지 않는다

`scripts/wiki-*.ts`는 Anthropic SDK를 import하지 않는다. lint 검사 ⑤가 막는다.
ingest·query·lint의 판단은 **이 저장소를 연 구독제 에이전트가 직접** 한다.
`/api/ask`(사용자용 화면 안내)와는 별개의 것이다.

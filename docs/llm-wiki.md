# LLM Wiki — 설계

> 이 문서는 잼통의 **지식층**을 어떻게 만들 것인가를 정한다.
> 화면(Visual Story)이 아니라 그 아래에서 지식이 어떻게 쌓이는가의 이야기다.

---

## 1. 이것은 RAG가 아니다

먼저 흔한 오해부터 지운다. 이 설계는 "자료를 벡터로 넣고 질문할 때 꺼내 쓰는"
것이 **아니다.**

| | RAG | LLM Wiki |
|---|---|---|
| 지식의 형태 | 질의할 때마다 재발견 | **누적되는 산출물** |
| 산출물 | 프롬프트 맥락 (휘발) | 마크다운 파일 (영속) |
| 상호참조 | 매번 다시 찾음 | 이미 거기 있음 |
| 모순 | 발견되지 않음 | 이미 표시돼 있음 |
| 비용 | 질문마다 | 소스마다 한 번 |

RAG는 다섯 문서를 종합해야 하는 미묘한 질문을 받을 때마다 그 다섯을 처음부터
다시 찾아 이어 붙인다. 아무것도 쌓이지 않는다.

여기서 만드는 것은 **원자료와 사람 사이에 놓이는, 서로 링크된 마크다운 위키**다.
새 소스가 들어오면 색인만 하는 것이 아니라 **읽고, 기존 페이지에 통합하고,
모순을 표시하고, 종합을 고쳐 쓴다.** 지식은 한 번 컴파일되고 그 뒤로는 최신
상태로 유지된다.

위키는 사람이 쓰지 않는다. LLM이 쓴다. 사람이 하는 일은 소스를 고르고, 방향을
잡고, 좋은 질문을 던지는 것이다.

---

## 2. 왜 이 프로젝트에 필요한가

지금 이 저장소에는 업적 22건, 세부 성과 18건, 언행 15건이 있다. 그런데
**교차 주제가 어디에도 없다.**

"검찰개혁"은 `prosecution-reform`과 `judicial-reform` 업적, 그리고
`reform-is-hard`·`noh-acquittal` 언행에 흩어져 있다. 같은 이야기인데 사이트
어디에서도 한 화면에 모이지 않고, 모을 자리도 없다. 업적 페이지는 업적 하나의
단위이고 언행 페이지는 글 하나의 단위이기 때문이다.

위키가 주는 것이 그것이다. `concept/judicial-reform.md` 한 장이 넷을 잇는다.

이 패턴은 소스 100건쯤에서 진가가 나지만, 교차 주제는 첫날부터 값어치가 있다.

---

## 3. 세 층

### Raw sources — 불변, 사람이 쓴다

저장소에 커밋된, 스키마 검증을 통과한 콘텐츠.

```
src/content/achievements/**   업적
src/content/words/**          대통령 언행
src/content/milestones/**     세부 성과
src/content/sources.ts        1차 자료 레지스트리
```

**LLM은 여기서 읽기만 하고 절대 고치지 않는다.**

이 층이 특이하게 강하다. 보통 이 패턴의 raw는 클리핑해 둔 마크다운 더미인데,
여기는 이미 다음을 갖고 있다.

- claim마다 `id`, `verified`, `assertionType`(FACT/CLAIM/INTERPRETATION/OPINION), `sourceIds[]`
- 1차 자료 원문 인용이 `sources.ts`에 레지스트리로
- 언행은 원문 무수정이고, `easy.points[].quote`가 원문에 실재해야 빌드가 통과한다
- `pnpm validate`가 이 불변식들을 CI에서 강제한다

즉 **위키가 인용할 앵커가 id 수준으로 이미 존재한다.** 보통 이 패턴을 시작할 때
없는 것이고, 그래서 여기서는 provenance를 문법으로 강제할 수 있다(§5).

### The wiki — LLM이 소유한다

`wiki/` 아래 마크다운. LLM이 만들고, 고치고, 상호참조를 유지한다.
사람은 읽는다.

`docs/`와 섞지 않는다. `docs/`는 **사람이 쓰는 곳**이다 —
`docs/achievements/president.md`는 조사 지시서이지 지식 페이지가 아니다.

### The schema — 규약

`AGENTS.md`의 「LLM Wiki」 절. 페이지 형식, 앵커 문법, ingest/query/lint 절차.

이 패턴에서 schema는 the key configuration file이다. 이것이 LLM을 일반
챗봇이 아니라 **규율 있는 위키 관리자**로 만든다.

---

## 4. raw source의 경계 — 오염 방지

**포함**: 업적, 언행, 세부 성과, 1차 자료
**제외**: `src/content/cheers`(지지자 응원 영상), Firestore 전부
(`cheerVideos`, `cheerNotes`, `feedback`, `users`)

`cheers`는 운영자가 코드로 커밋했는데도 제외한다. **raw source의 자격은
"누가 등록했나"가 아니라 "검증된 주장을 담고 있나"이기 때문이다.** 우리는 그
영상의 제목과 채널만 알고 내용은 확인하지 않았다.

### 왜 이 경계가 RAG 때보다 훨씬 중요한가

RAG에서 잘못된 맥락은 그 한 번의 답만 망치고 사라진다.

위키는 컴파일되어 **영구히 쌓인다.** 미검증 주장이 한 번 들어가면 다음
ingest에서 다른 페이지로 상호참조되고, 3주 뒤엔 출처가 "위키에 그렇게 적혀
있다"로 세탁된다. 되돌리려면 그 주장을 인용한 페이지를 전부 찾아야 하는데,
그게 정확히 사람이 못 하는 일 — 이 패턴이 LLM에게 맡긴 바로 그 일이다.

그래서 규율이 아니라 **문법**으로 막는다.

---

## 5. 앵커 — provenance를 문법으로

위키의 모든 단정문에는 앵커가 붙는다.

```markdown
법왜곡죄는 2026년 3월 시행됐다. ^[judicial-reform#claim-law-distortion]
"개혁은 혁명보다 어렵습니다" ^[words:reform-is-hard]
```

인정되는 형식은 넷뿐이다.

| 형식 | 가리키는 것 |
|---|---|
| `<업적slug>` | 업적 전체 |
| `<업적slug>#<claimId>` | 그 업적의 claim 하나 |
| `words:<slug>` | 언행 한 편 |
| `words:<slug>#<pointId>` | 그 언행의 쉽게 보기 토막 |
| `source:<sourceId>` | 1차 자료 |

**`pnpm wiki:lint`가 실재를 검사하고, 없으면 실패한다.**

이것이 오염에 대한 구조적 방어다. 응원에서 온 문장은 **달 앵커가 없으므로
위키에 들어갈 수 없다.** 사람의 주의력에 기대지 않는다.

### assertionType 상속

claim의 `assertionType`을 위키가 물려받는다. 원본이 CLAIM인데 위키가 평서문
FACT로 적으면 안 된다. `verified: false`인 claim을 인용할 때는 그 사실을 문장에
적는다. README의 원칙 2(「단정의 종류를 구분한다」)를 위키 층까지 끌고 가는
방법이다.

---

## 6. 디렉터리와 페이지 형식

```
wiki/
  index.md            카탈로그. ingest마다 갱신한다.
  log.md              append-only. "## [2026-09-20] ingest | 제목"
  source/             소스 1건 = 페이지 1장 (업적 1건, 언행 1건)
  concept/            정책·제도 — 교차 주제가 사는 곳
  entity/             인물·기관·지역
  event/              사건
  synthesis/          질문의 답을 되돌려 적는 곳
```

### 파일 이름은 ascii 슬러그

`wiki/concept/judicial-reform.md`이지 `wiki/concept/사법개혁.md`가 아니다.

macOS는 파일 이름의 한글을 NFD로 분해해 저장하는데 git과 리눅스는 NFC로
다룬다. 한글 파일 이름을 쓰면 `[[사법개혁]]`과 실제 파일 이름이 바이트 수준에서
달라져 링크 검사가 기계에 따라 다른 결과를 낸다. 제목은 frontmatter에 한글로
적는다.

### 페이지 형식

```markdown
---
title: 사법개혁
kind: concept
updated: 2026-09-20
---

# 사법개혁

## 요약

...

## 관련
- [[source/judicial-reform]]
- [[source/words-reform-is-hard]]
```

`kind`는 `source | concept | entity | event | synthesis` 중 하나.
위키링크는 `wiki/` 기준 상대 경로에서 확장자를 뗀 것 — `[[concept/judicial-reform]]`.

---

## 7. 세 연산

### Ingest

```
pnpm wiki:ingest words/reform-is-hard
pnpm wiki:ingest achievement/judicial-reform
pnpm wiki:ingest --list          아직 ingest하지 않은 소스
```

**스크립트는 준비만 한다.** 그 소스의 정규화된 덤프를 stdout으로 낸다 —
원문, claim 목록, 1차 자료 인용, **쓸 수 있는 앵커 전부**, 그리고 기존 위키에서
이 소스를 이미 언급한 페이지 목록.

실제 통합은 LLM이 한다. 덤프를 읽고 페이지를 쓰고 `index.md`와 `log.md`를
갱신한다.

이렇게 나누는 이유: ingest는 자동화할 수 없다. 사람이 무엇을 강조할지 정해야
한다. 스크립트가 할 수 있는 것은 "무엇을 봐야 하는지 모으기"뿐이고, 그게
정확히 LLM이 매번 재발견하느라 낭비하는 부분이다.

한 소스를 ingest하면 페이지 여러 장이 움직인다. 소스 페이지 한 장, 그 소스가
건드리는 개념·인물 페이지 몇 장, 그리고 index와 log.

### Query

그냥 대화한다. 규약은 하나다.

> **좋은 답은 `wiki/synthesis/`에 파일링하고 log에 적는다.**

비교표, 분석, 발견한 연결 — 이런 것이 채팅 기록에 묻히면 안 된다. 그래야
탐색도 ingest와 똑같이 누적된다.

### Lint

```
pnpm wiki:lint
```

기계가 볼 것과 LLM이 봐야 할 것을 가른다.

**기계 — `scripts/wiki-lint.ts`**

| # | 검사 | 등급 |
|---|---|---|
| 1 | 깨진 앵커 (실재하지 않는 claim·slug) | 오류 |
| 2 | 깨진 위키링크 | 오류 |
| 3 | frontmatter 누락·이상 | 오류 |
| 4 | index.md와 실제 파일 불일치 | 오류 |
| 5 | wiki 스크립트가 모델 API를 부르려 함 | 오류 |
| 6 | 고아 페이지 (inbound 0) | 경고 |
| 7 | 아직 ingest하지 않은 소스 | 경고 |
| 8 | 낡은 페이지 (소스가 더 최근에 커밋됨) | 경고 |
| 9 | 앵커 없는 단정 문단 | 경고 |

오류가 하나라도 있으면 `pnpm check`가 실패한다. 경고는 실패시키지 않는다 —
ingest는 점진적이고, 아직 안 한 것이 잘못은 아니다.

**LLM — 사람이 지시한다**

10. 페이지 간 모순
11. 새 소스가 뒤집은 옛 서술
12. 있어야 하는데 없는 개념 페이지
13. CLAIM을 FACT처럼 쓴 곳
14. 채워 넣을 만한 자료 공백

---

## 8. 모델 API를 부르지 않는다

**이 파이프라인의 어떤 스크립트도 Anthropic API를 호출하지 않는다.**

ingest·query·lint의 지능이 필요한 부분은 전부 **에이전트가 직접** 한다 —
Claude Code, Codex 같은 구독제 도구가 이 저장소를 열고 덤프를 읽고 마크다운을
쓴다. 스크립트는 데이터를 모으고 검사할 뿐이다.

이유는 셋이다.

1. **비용.** ingest는 소스 하나에 긴 맥락을 여러 번 오간다. API로 하면
   `/api/ask`의 일일 한도 같은 것을 또 만들어야 한다. 구독제로 하면 0원이다.
2. **사람이 개입해야 한다.** 이 패턴의 전제가 "소스를 하나씩 넣으면서 요약을
   읽고 방향을 잡는다"이다. 자동 파이프라인으로 만들면 그 개입 지점이 사라진다.
3. **운영 표면이 줄어든다.** 서버에 키를 두지 않고, 비용 한도를 감시하지 않고,
   배포에 얽히지 않는다.

`/api/ask`(화면 안내)는 이것과 **별개**다. 저쪽은 사용자가 쓰는 런타임 기능이고
API 키가 필요하다. 이 위키 파이프라인은 운영자의 작업 도구다.

lint 검사 #5가 이 경계를 지킨다 — `scripts/wiki-*.ts`가 anthropic sdk를
import하면 빌드를 세운다.

---

## 9. 단계

### Phase 1 — 뼈대

- `wiki/` 디렉터리, `index.md`, `log.md`
- `AGENTS.md`에 LLM Wiki 규약
- `scripts/wiki-ingest.ts` — 덤프
- `scripts/wiki-lint.ts` — 기계 검사 9종
- `pnpm check`에 `wiki:lint` 연결
- **소스 1건 시범 ingest** — 규약이 실제로 쓸 만한지 확인

### Phase 2 — 채우기

나머지 소스 ingest. concept 페이지 생성. 이때 교차 주제가 드러난다.

### Phase 3 — 규모

소스가 100건을 넘고 index.md로 못 찾게 되면 검색을 붙인다
([qmd](https://github.com/tobi/qmd) 또는 자체). 그 전에는 index.md로 충분하다.

### Phase 4 — 되먹임 (선택)

위키에서 발견한 것을 raw로 되돌린다. 위키가 "이 주장에 근거가 약하다"고
표시한 것이 `verified: false`로, 위키가 만든 교차 주제 페이지가 새 업적
후보로. **위키가 raw를 고치지는 않는다 — 사람이 고칠 목록을 준다.**

---

## 10. 지키는 것

1. **LLM은 raw를 고치지 않는다.** 읽기만 한다.
2. **사람은 wiki를 (거의) 쓰지 않는다.** 읽고 방향을 준다.
3. **앵커 없는 단정은 위키에 없다.**
4. **community 콘텐츠는 소스가 아니다.**
5. **스크립트는 모델을 부르지 않는다.**

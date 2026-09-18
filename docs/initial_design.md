# 이재명 업적 위키 — 전체 구현 설계

> **제품 정의**  
> 텍스트를 읽어야 이해되는 기존 위키가 아니라, **카드·타임라인·모션·관계도·근거 자료를 직접 탐색하면서 이해하는 Visual Wiki**를 만든다.  
> 그 아래에는 **LLM Wiki가 지식층을 지속적으로 정리**하고, AI는 단순 챗봇이 아니라 **현재 화면을 움직이며 정보를 설명하는 Visual Guide** 역할을 한다.

---

# 1. 제품의 핵심 방향

이 서비스에서 가장 중요한 원칙은 다음이다.

### Card First, Text Later

기존 위키는 다음과 같다.

```text
제목
↓
수천 자의 본문
↓
각주
↓
출처
```

우리가 만들 서비스는 반대다.

```text
한눈에 이해하는 비주얼
        ↓
직접 움직여보는 인터랙션
        ↓
맥락 탐색
        ↓
궁금한 부분만 상세 설명
        ↓
근거 / 원문
```

따라서 사용자가 처음 보는 것은 **글이 아니라 하나의 Visual Story**다.

---

# 2. 서비스 전체 구조

```text
┌───────────────────────────────────────┐
│               USER                    │
│                                       │
│   보고 → 움직이고 → 탐색하고 → 질문 │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│       VISUAL STORY EXPERIENCE         │
│                                       │
│  ① Infographic Card                  │
│  ② Context Timeline                  │
│  ③ Motion Graphic                    │
│  ④ Relationship Board                │
│  ⑤ Evidence / Source                 │
│  ⑥ AI Visual Guide                   │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│          VISUAL STORY ENGINE          │
│                                       │
│   Scene / State / Interaction / URL   │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│              LLM WIKI                 │
│                                       │
│ Entity │ Event │ Claim │ Relation    │
│ Source │ Principle │ Wiki Page       │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│            ORIGINAL SOURCES           │
│                                       │
│ 문서 / 통계 / 판결·수사자료 / 발표    │
│ 영상 / 인터뷰 / 기사 / 연구자료       │
└───────────────────────────────────────┘
```

핵심은 **지식과 표현을 분리하는 것**이다.

LLM Wiki가 무엇을 알고 있는지를 관리하고, Visual Story Engine은 그것을 **어떻게 보여줄지** 담당한다.

---

# 3. 핵심 UX ① Infographic Card

모든 정보의 기본 단위다.

사용자가 앱에 들어와 처음 만나는 것은 위키 문서 제목 목록이 아니라 카드다.

예:

```text
┌─────────────────────────────┐
│          북극항로            │
│                             │
│      [비주얼 / 지도]         │
│                             │
│ 부산 ─── 북극 ─── 유럽      │
│                             │
│ 핵심 변화                   │
│ ● 거리                      │
│ ● 시간                      │
│ ● 비용                      │
│                             │
│        ▶ 직접 보기          │
└─────────────────────────────┘
```

카드 내부에는 최대한 적은 텍스트만 사용한다.

### 카드 기본 구조

```ts
VisualCard {
  title
  subtitle

  heroVisual

  keyFacts[]
  keyNumbers[]

  summary

  evidenceCount

  visualStoryId
}
```

그리고 각각의 카드는 독립적인 URL을 가진다.

```text
/story/arctic-route
/story/basic-income
/story/dae-jang-dong
```

---

# 4. 핵심 UX ② Context Timeline

단순 연대표가 아니다.

**시간을 움직이면 전체 화면의 의미가 바뀌는 Timeline Engine**이어야 한다.

예를 들어 사건형 콘텐츠에서 사용자가

```text
2009 ── 2010 ── 2011 ── 2015 ── 2021 ── 2026
                    ▲
```

2011년으로 이동하면

- 당시 존재했던 인물
- 당시 알려진 정보
- 당시 기관 관계
- 당시 발생한 사건
- 당시 자료

만 화면에 나타난다.

사용자가 2015년으로 움직이면 관계도와 설명 역시 변경된다.

즉,

> **Timeline = 화면 전체의 시간 좌표**

가 된다.

### Timeline State

```ts
TimelineState {
  cursor: "2011-03-15"

  activeEvents: []
  activeEntities: []
  activeRelations: []
  activeSources: []

  sceneState
}
```

---

# 5. 핵심 UX ③ Motion Graphics

모션의 목적은 예쁘게 보이는 것이 아니다.

> **움직여야 이해되는 정보를 움직여 보여준다.**

예를 들어 항로라면 사용자가 직접 배를 움직인다.

```text
한국 ──────●───────── 북극 ───────── 유럽
           ↑
        사용자가 Drag
```

배를 움직이면 동시에 표시한다.

```text
운항 일수
12일 → 13일 → 14일

이동 거리
4,230km

현재 위치
북극해
```

다른 유형에서는 모션의 의미가 달라진다.

```text
경제 → 돈의 흐름

정책 → 적용 대상 변화

사건 → 시간 흐름

조직 → 권한 전달

선거 → 지역별 변화

외교 → 국가 간 이동 / 관계
```

### 추천 구현

기본 UI 애니메이션:

**Motion for React**

고급 Storytelling:

**GSAP**

지도:

**MapLibre GL**

특수 데이터 시각화:

**SVG + D3**

복잡한 대규모 데이터일 때만 Canvas/WebGL을 사용한다.

---

# 6. 핵심 UX ④ Relationship Board

영화에서 수사관들이 벽에 사진을 붙이고 실로 연결하는 것과 같은 경험이다.

하지만 훨씬 정제된 데이터 인터페이스로 만든다.

```text
          ┌─────────┐
          │ 인물 A  │
          └────┬────┘
               │
     투자      │
               ▼
┌─────────┐   회사 X   ┌─────────┐
│ 기관 B  │───────────│ 인물 C  │
└─────────┘   계약     └─────────┘
               │
               ▼
             사건 D
```

노드는 다음과 같은 종류를 가진다.

```text
Person
Organization
Government
Company
Project
Event
Document
Location
```

그리고 가장 중요한 것은 **Edge에 반드시 의미가 존재해야 한다는 것**이다.

잘못된 방식:

```text
A ───── B
```

좋은 방식:

```text
A
│
│ 2011년 조사
│ 근거: 문서 3개
▼
B
```

Edge를 클릭하면 바로 근거가 나타난다.

---

# 7. 관계도와 Timeline의 결합

이 두 기능은 별개 기능으로 만들어서는 안 된다.

예:

```text
2010
```

에서는

```text
A ─ B
```

였지만,

Timeline을 움직이면

```text
2015
```

```text
A ─ B
 \
  └── C ── 기관 D
```

가 될 수 있다.

즉 관계도는 **시간에 따라 변화하는 Dynamic Knowledge Graph**다.

이 기능은 이 서비스의 상당히 강력한 차별점이 될 수 있다.

---

# 8. 핵심 UX ⑤ Evidence Layer

정치적·사회적으로 논쟁 가능한 정보를 다루기 때문에 Visual 자체보다 더 중요한 것이 있다.

**모든 중요한 표현 뒤에 근거가 존재해야 한다.**

화면에서는 복잡하게 보여주지 않는다.

```text
매우 간단한 카드
─────────────
[근거 7개]
```

누르면 Drawer가 열린다.

```text
관련 자료

● 정부 공식 문서
● 통계 자료
● 국회 자료
● 판결·수사 자료
● 인터뷰
● 언론 보도
● 연구 자료

[원문 보기]
```

데이터에서는 다음을 명확하게 분리한다.

```text
FACT
공식적으로 확인 가능한 사실

CLAIM
특정 인물이나 기관의 주장

INTERPRETATION
사실에 대한 해석

OPINION
평가 또는 의견
```

이 네 종류를 섞지 않는 것이 서비스 신뢰성의 핵심이다.

---

# 9. Visual Story

모든 업적이나 사건은 하나의 `VisualStory`가 된다.

예:

```json
{
  "id": "arctic-route",
  "title": "북극항로",
  "type": "achievement",
  "scenes": [
    "intro",
    "route",
    "timeline",
    "impact",
    "evidence"
  ]
}
```

사건형 Story라면 다르게 구성할 수 있다.

```text
Intro
 ↓
What happened?
 ↓
Timeline
 ↓
Relationship Board
 ↓
Key turning points
 ↓
Evidence
 ↓
Sources
```

Story마다 구조는 다를 수 있지만 사용하는 **Visual Component는 공통**이다.

---

# 10. Visual Story Engine

서비스에서 가장 중요한 개발 자산이다.

콘텐츠마다 React 코드를 새로 만드는 방식으로 가면 안 된다.

다음처럼 Scene 기반으로 만든다.

```ts
Scene {
  id

  type:
    | "hero"
    | "infographic"
    | "timeline"
    | "map"
    | "motion"
    | "relationship"
    | "comparison"
    | "evidence"

  data

  interactions

  transitions
}
```

그러면 나중에는 콘텐츠 제작자가 코드를 건드리지 않고

```text
Scene 추가
↓
데이터 입력
↓
인터랙션 선택
↓
Publish
```

하는 방식으로 새로운 Story를 만들 수 있다.

---

# 11. Global Visual State

AI 기능까지 고려한다면 반드시 초기부터 만들어야 한다.

현재 화면의 상태를 한곳에서 관리한다.

추천:

**Zustand**

예:

```ts
VisualState {
  storyId

  sceneId

  timelineCursor

  focusedEntities[]

  highlightedRelations[]

  selectedEvidence[]

  motionProgress

  mapViewport

  openPanel

  agentFocus
}
```

모든 Visual Component는 이 상태를 공유한다.

이 구조가 있기 때문에 나중에 AI가 화면을 조작할 수 있다.

---

# 12. AI는 Chatbot이 아니다

AI 기능의 가장 중요한 설계 원칙이다.

일반적인 서비스:

```text
사용자
 ↓
질문
 ↓
LLM
 ↓
긴 텍스트 답변
```

이 서비스:

```text
사용자
 ↓
질문
 ↓
AI
 ↓
화면을 움직인다
 ↓
필요한 시각 자료를 보여준다
 ↓
근거를 열어준다
 ↓
짧게 설명한다
```

예를 들어 사용자가 묻는다.

> "이 사건에서 2011년이 왜 중요한데?"

AI는 긴 설명부터 하지 않는다.

```text
SEEK_TIMELINE(2011)

FOCUS_ENTITY(person_x)

HIGHLIGHT_RELATION(
  person_x,
  organization_y
)

OPEN_EVIDENCE(source_123)
```

그리고 짧게 말한다.

> "2011년에는 이 관계가 처음 등장합니다.  
> 이 연결의 근거가 되는 자료를 같이 표시했습니다."

---

# 13. Agent UI Action API

초기부터 다음 인터페이스를 구현한다.

```text
GO_TO_SCENE

SEEK_TIMELINE

PLAY_MOTION

PAUSE_MOTION

FOCUS_ENTITY

FOCUS_EVENT

HIGHLIGHT_RELATION

OPEN_CARD

OPEN_EVIDENCE

COMPARE_EVENTS

SHOW_SOURCE

RESET_VIEW
```

AI 모델은 React 코드를 작성하지 않는다.

오직 이 명령 중 하나를 반환한다.

예:

```json
{
  "actions": [
    {
      "type": "SEEK_TIMELINE",
      "date": "2011-03"
    },
    {
      "type": "FOCUS_ENTITY",
      "entityId": "person-123"
    }
  ],
  "message": "이 시점의 관계를 보시면 핵심 변화가 보입니다."
}
```

이 방식이면 Luna급 경량 모델도 충분히 활용할 수 있다.

---

# 14. AI 비용 절감 구조

LLM을 페이지를 열 때마다 호출하면 안 된다.

기본 기능은 **100% AI 없이 동작해야 한다.**

AI는 사용자가 질문할 때만 사용한다.

```text
일반 탐색
→ AI 비용 0

타임라인 사용
→ AI 비용 0

관계도 탐색
→ AI 비용 0

모션 그래픽
→ AI 비용 0

근거 확인
→ AI 비용 0

AI 질문
→ LLM 호출
```

추가로 모델 Router를 둔다.

```text
단순 화면 이동
→ 저비용 모델

Wiki 검색 + 설명
→ 일반 모델

복잡한 비교 / 다수 자료 분석
→ 고성능 모델
```

---

# 15. LLM Wiki — 서비스의 Knowledge Brain

Visual Story 밑에는 별도의 지식 시스템이 존재한다.

```text
                Visual Wiki
                    ▲
                    │
                LLM Wiki
                    ▲
                    │
         ┌──────────┼──────────┐
         │          │          │
      자료        영상       문서
```

사용자가 자료를 추가하거나 새로운 자료가 발견되면 LLM Wiki Pipeline으로 들어간다.

---

# 16. LLM Wiki Ingestion Pipeline

```text
SOURCE
 ↓
문서 추출
 ↓
Entity Extraction
 ↓
Event Extraction
 ↓
Claim Extraction
 ↓
Relation Extraction
 ↓
기존 Wiki 탐색
 ↓
관련 Wiki Page 업데이트 제안
 ↓
Human Review
 ↓
Publish
```

예를 들어 새로운 인터뷰가 추가됐다면,

LLM은 다음을 찾는다.

```text
누가 말했는가?
언제 말했는가?
어떤 정책인가?
어떤 사건과 관련되는가?
기존 발언과 연결되는가?
기존 입장과 다른가?
관련 문서는 무엇인가?
```

그 결과 기존 Wiki가 업데이트된다.

---

# 17. LLM Wiki 문서 구조

예:

```markdown
---
entity: policy-basic-income
updated: 2026-09-18
---

# 기본사회

## 핵심 개념

...

## 주요 발언

...

## 주요 정책

...

## 주요 사건

...

## 관련 인물

...

## 관련 문서

...

## 변화 과정

...

## 근거

...
```

중요한 것은 Markdown 자체보다 **Wiki 간 연결**이다.

```text
정책
 ↕
인물
 ↕
사건
 ↕
발언
 ↕
문서
```

이것이 사실상 Knowledge Graph가 된다.

---

# 18. 초기에는 Vector DB가 없어도 된다

이 구조에서는 반드시 모든 자료를 embedding 할 필요는 없다.

우선 다음 구조로 시작한다.

```text
Entity Index
+
Wiki Links
+
Keyword Index
+
Timeline
+
Relations
+
Source Metadata
```

예:

```text
이재명
 ├─ 기본사회
 ├─ 지역화폐
 ├─ 성남시
 ├─ 경기도
 └─ 관련 발언
```

LLM은 이 구조를 따라 필요한 Wiki 페이지를 읽는다.

자료량이 훨씬 커지는 시점에 Semantic Search를 추가하면 된다.

---

# 19. 대통령 업무 참고용 Knowledge Mode

여기서는 일반 사용자의 Visual Guide와 별도의 모드를 생각할 수 있다.

목적은 정치적 결정을 대신 내려주는 것이 아니라,

**과거 공개 기록에서 유사한 선례와 기존 원칙을 빠르게 찾는 것**이다.

예를 들어 질문:

> "과거에 비슷한 상황에서는 어떤 선택을 했지?"

LLM Wiki는 다음을 반환한다.

```text
유사 사례 A

당시 상황
↓

선택했던 정책
↓

공개적으로 밝힌 이유
↓

결과

─────────────────

유사 사례 B

...

─────────────────

현재 상황과 다른 점
...
```

또는

> "내가 과거 이 문제에 대해 어떤 원칙을 이야기했지?"

라고 하면 관련 발언과 문서를 시간순으로 보여준다.

이를 **Precedent Explorer**로 설계하는 것이 좋다.

---

# 20. 사용자 참여형 Wiki

사용자가 직접 production DB를 수정하게 해서는 안 된다.

```text
사용자 제안
     ↓
Draft
     ↓
Source Check
     ↓
Review
     ↓
Approve
     ↓
Publish
```

Contributor 역할:

```text
Visitor
Contributor
Reviewer
Editor
Admin
```

기여할 수 있는 것은 다양하다.

```text
새 업적 제안

새 사건 추가

자료 추가

기존 내용 수정

인물 관계 추가

타임라인 Event 추가

오류 신고

더 좋은 Visual 제안
```

---

# 21. Source First Contribution

사용자가 내용을 수정하려면 기본적으로 근거를 요구한다.

예:

```text
무엇을 수정하시겠습니까?

[내용]

근거 URL
[________________]

자료 종류

○ 공식자료
○ 통계
○ 연구
○ 법원/수사 자료
○ 인터뷰
○ 언론 보도
○ 기타
```

이렇게 해야 커뮤니티가 커져도 신뢰도가 유지된다.

---

# 22. Data Model

Firestore 주요 컬렉션은 다음과 같이 구성한다.

```text
stories

scenes

entities

events

relations

claims

sources

evidence

wikiPages

contributions

reviews

users

agentSessions

shareSnapshots
```

---

# 23. 핵심 Entity

```ts
Entity {
  id

  type
  name

  aliases[]

  description

  image

  activeFrom
  activeTo

  sourceIds[]

  wikiPageId
}
```

---

# 24. Event

```ts
Event {
  id

  title

  dateStart
  dateEnd

  entityIds[]

  relationIds[]

  claimIds[]

  sourceIds[]

  summary

  storyIds[]
}
```

이 데이터가 Timeline을 만든다.

---

# 25. Relation

```ts
Relation {
  fromEntityId

  toEntityId

  type

  label

  startDate
  endDate

  evidenceIds[]

  confidence

  status
}
```

Relationship Board는 거의 이 컬렉션에서 만들어진다.

---

# 26. Source / Evidence

```ts
Source {
  id

  title

  url

  publisher

  publishedAt

  type

  originalFile

  archivedUrl

  extractedText

  checksum
}
```

그리고 Claim과 Source를 연결한다.

```text
Claim
 ↓
Evidence
 ↓
Source
```

---

# 27. 기술 스택

## Frontend

**Next.js App Router**를 추천한다.

React SPA보다 이 서비스에는 Next.js가 명확하게 유리하다.

이유:

```text
검색 노출
공유 URL
OG 이미지
SSR
Server Component
API Route
Deep Link
콘텐츠 페이지
```

가 핵심이기 때문이다.

### 기본

```text
Next.js
TypeScript
React
Tailwind CSS
```

### UI

```text
Radix UI
shadcn/ui
```

단, 완성 UI를 그대로 쓰기보다 Design System 기반으로 커스터마이징한다.

### Motion

```text
Motion
GSAP
```

### Relationship

```text
@xyflow/react
```

### Visualization

```text
D3
SVG
Canvas
```

### Map

```text
MapLibre GL
```

### State

```text
Zustand
```

---

# 28. Firebase Backend

```text
Firebase App Hosting
Firebase Authentication
Cloud Firestore
Cloud Storage
Cloud Functions Gen 2
Firebase App Check
Firebase Analytics
Firebase Remote Config
```

Firebase를 주요 Backend Platform으로 유지한다.

---

# 29. Firebase 역할

### Firestore

구조화된 Knowledge 데이터.

```text
Story
Entity
Event
Relation
Claim
Evidence
Wiki
```

### Storage

```text
이미지
PDF
동영상
원문 자료
Visual asset
```

### Functions

```text
LLM 호출

자료 ingestion

Wiki 생성

Wiki update

OG 생성

Moderation

Agent API

Source metadata extraction
```

---

# 30. 페이지 구조

```text
/
```

Visual Feed.

---

```text
/story/[slug]
```

Visual Story.

---

```text
/wiki/[slug]
```

상세 Wiki.

---

```text
/entity/[slug]
```

인물·기관·정책.

---

```text
/source/[id]
```

근거 자료.

---

```text
/contribute
```

사용자 기여.

---

```text
/review
```

검토자 UI.

---

```text
/admin
```

관리.

---

# 31. `/story/[slug]` 화면

가장 중요한 페이지다.

```text
┌─────────────────────────┐
│        HERO CARD        │
└─────────────────────────┘

            ↓

┌─────────────────────────┐
│     VISUAL STORY        │
│                         │
│ Timeline / Motion       │
│ Map / Relationship      │
└─────────────────────────┘

            ↓

┌─────────────────────────┐
│ 핵심 사실 / 숫자        │
└─────────────────────────┘

            ↓

┌─────────────────────────┐
│ 관련 근거               │
└─────────────────────────┘
```

AI Guide는 화면 밑에 작은 floating control로 둔다.

---

# 32. 모바일 UX

모바일은 Desktop의 축소판으로 만들면 안 된다.

**Vertical Visual Story**로 별도 설계한다.

예:

```text
Hero

↓ Swipe

Card

↓ Scroll

Motion Scene

↓ Scroll

Timeline

↓ Tap

Relationship Full Screen

↓ Swipe

Evidence

↓
Related Story
```

관계도 같이 작은 화면에서 복잡한 UI는 Full Screen Mode로 전환한다.

---

# 33. Professional Design System

이 부분은 별도 프로젝트로 취급하는 것이 좋다.

우선 Figma 또는 디자인 전문 에이전트에 다음을 정의하도록 한다.

```text
Brand Identity

Typography

Color

Spacing

Grid

Card

Navigation

Chart

Map

Timeline

Relationship

Motion

Icon

Illustration

Photography

Dark / Light

Accessibility
```

---

# 34. Design Tone

피해야 하는 모습:

```text
AI로 급하게 만든 Landing Page

과도한 Gradient

카드 수십 개

Shadcn 기본 UI 그대로

과도한 Glow

모든 것이 둥근 박스
```

지향점:

```text
Editorial

Documentary

Data Journalism

Premium Civic Product

Museum Exhibition

Interactive Documentary
```

즉,

> **Apple + New York Times Interactive + Data Journalism**

에 가까운 방향이 잘 맞는다.

---

# 35. Motion Design System

모션 역시 규칙이 필요하다.

예:

```text
Micro interaction
150~250ms

Panel transition
250~400ms

Scene transition
400~800ms

Story animation
사용자 제어
```

그리고 원칙:

> **의미 없는 애니메이션은 만들지 않는다.**

움직임은 반드시

```text
시간
거리
변화
관계
흐름
원인
```

중 하나를 설명해야 한다.

---

# 36. 공유 기능

이 서비스에서 매우 중요하다.

모든 Visual State를 공유할 수 있게 한다.

예:

```text
/story/dae-jang-dong
?time=2011
&focus=person-x
&relation=relation-y
```

이 링크를 열면 똑같은 상태가 나타난다.

그리고 자동으로 공유 Card를 만든다.

```text
┌─────────────────────────┐
│        제목             │
│                         │
│      Visual 상태        │
│                         │
│ 핵심 설명               │
│                         │
│ source 7                │
└─────────────────────────┘
```

SNS에서는 이 이미지가 OG Image로 표시된다.

---

# 37. Visual Snapshot

사용자가 보고 있는 화면에서

**공유하기**

를 누르면,

```text
현재 Story
현재 Timeline
현재 Focus Entity
현재 Highlight
```

를 저장한다.

이를

```text
shareSnapshot
```

으로 관리한다.

따라서 사용자는 단순 URL이 아니라 **자신이 보고 있던 설명 상태 자체를 공유**한다.

---

# 38. Search

홈 검색은 단순 문자열 검색이 아니다.

예:

> "대장동 초기"

결과:

```text
Story

Timeline Event

Wiki

Person

Document
```

형태로 보여준다.

MVP에서는 Entity + Keyword 검색으로 시작하고 데이터가 증가한 이후 전문 검색엔진을 추가한다.

---

# 39. AI Grounding

AI가 임의로 정치적 사실을 만들어내면 서비스 신뢰가 무너진다.

따라서 AI가 답변할 때 사용 가능한 Context를 제한한다.

```text
Published Wiki

Approved Source

Verified Entity

Verified Event

Verified Relation
```

AI 응답은 항상 내부적으로

```text
answer

sourceIds[]

entityIds[]

eventIds[]

actions[]
```

를 반환해야 한다.

---

# 40. Agent Failure Rule

근거가 없으면 AI가 추론해서 채우지 않는다.

다음과 같이 응답한다.

```text
현재 위키 자료만으로는
이 관계를 확인하기 어렵습니다.
```

그리고 관련 Source 탐색을 제안한다.

이 규칙이 상당히 중요하다.

---

# 41. Analytics

어떤 콘텐츠가 실제로 이해에 도움을 주는지 측정한다.

예:

```text
story_open

card_open

timeline_seek

timeline_complete

motion_play

motion_drag

entity_focus

relation_click

evidence_open

source_open

share_create

agent_question

agent_action
```

특히 중요한 지표는 조회수가 아니다.

```text
Evidence Open Rate

Story Completion

Timeline Interaction

Share Rate

Return Rate
```

이다.

---

# 42. 성능 설계

Visual이 많기 때문에 성능이 중요하다.

초기 화면에는 무거운 라이브러리를 모두 로드하지 않는다.

```text
Story Page
 ↓
Hero

필요하면
 ↓
Timeline bundle

필요하면
 ↓
Relationship bundle

필요하면
 ↓
Map bundle
```

Next.js dynamic import를 적극 사용한다.

---

# 43. Security

특히 사용자 참여 기능에는 필수다.

```text
Firebase Auth

Firestore Rules

App Check

Rate Limit

Content Sanitization

Upload Validation

Admin Audit Log
```

수정 기록은 모두 남긴다.

```text
누가
언제
무엇을
어떤 근거로
변경했는가
```

를 확인할 수 있어야 한다.

---

# 44. Repository 구조

```text
src/
│
├─ app/
│
├─ components/
│
├─ design-system/
│
├─ features/
│   ├─ story/
│   ├─ timeline/
│   ├─ motion/
│   ├─ relationship/
│   ├─ evidence/
│   ├─ wiki/
│   ├─ agent/
│   └─ share/
│
├─ stores/
│
├─ schemas/
│
├─ lib/
│   ├─ firebase/
│   ├─ visual/
│   ├─ wiki/
│   └─ agent/
│
└─ types/

functions/
│
├─ ingestion/
├─ wiki/
├─ agent/
├─ moderation/
└─ sharing/
```

---

# 45. MVP를 너무 크게 만들지 않는 방법

플랫폼 전체를 먼저 완성하면 실패하기 쉽다.

**두 종류의 Story만 먼저 만든다.**

### A. 성과·정책형

예:

```text
북극항로
```

이 Story에서 테스트하는 것:

```text
Infographic
Map
Motion
Timeline
Evidence
Share
```

### B. 사건·쟁점형

복잡한 사건 하나.

여기서 테스트한다.

```text
Timeline
Relationship
Evidence
Agent navigation
```

이 두 개가 제대로 돌아가면 Visual Story Engine의 대부분이 검증된다.

---

# 46. 구현 단계

## Phase 0 — Product Design

먼저 만든다.

```text
Design Language

Design System

Visual Story UX

Motion principles

Mobile prototype
```

코딩보다 먼저 하는 것이 좋다.

---

## Phase 1 — Visual Story Engine

구현:

```text
VisualState

Scene

Card

Timeline

Evidence

Share
```

AI 없음.

---

## Phase 2 — Motion / Relationship

추가:

```text
Motion Scene

Map Scene

Relationship Board

Timeline + Relationship Sync
```

---

## Phase 3 — Community Wiki

```text
Authentication

Contribution

Source Upload

Review

Versioning
```

---

## Phase 4 — LLM Wiki

```text
Source ingestion

Entity extraction

Event extraction

Relation extraction

Wiki update

Human review
```

---

## Phase 5 — AI Visual Guide

```text
Natural language

→ Intent

→ Visual Action

→ UI 변경

→ Source-grounded explanation
```

---

## Phase 6 — Precedent Explorer

LLM Wiki 전체를 이용해

```text
과거 발언

과거 정책

과거 결정

유사 사건

원칙 변화

관련 근거
```

를 탐색할 수 있도록 한다.

---

# 47. 가장 중요한 설계 결정

이 프로젝트에서 가장 중요한 것은 Next.js도 Firebase도 LLM도 아니다.

핵심은 이 구조다.

```text
                   INFORMATION
                        │
                        ▼
                    LLM WIKI
                        │
                        ▼
                VISUAL STORY ENGINE
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
      CARD           TIMELINE        RELATION
        │               │               │
        └───────────────┼───────────────┘
                        ▼
                    VISUAL STATE
                        ▲
                        │
                    AI GUIDE
```

**LLM Wiki는 무엇을 알고 있는가를 관리하고,**  
**Visual Story Engine은 어떻게 이해하게 만들 것인가를 관리하며,**  
**AI Guide는 사용자가 어디를 봐야 하는지를 안내한다.**

이 세 레이어를 분리하는 것이 전체 아키텍처의 핵심이다.

---

# 48. 이 서비스의 최종 사용자 경험

처음 방문한 사람은 글부터 읽지 않는다.

```text
발견한다
 ↓
본다
 ↓
움직여본다
 ↓
관계를 발견한다
 ↓
시간을 이동한다
 ↓
왜 그런지 궁금해진다
 ↓
AI에게 질문한다
 ↓
AI가 화면을 이동시킨다
 ↓
근거를 확인한다
 ↓
필요한 상태 그대로 공유한다
```

그래서 최종적으로 이 서비스는 **Wikipedia의 디자인을 개선한 서비스**라기보다,

> **Interactive Documentary + Visual Wiki + Knowledge Graph + LLM Wiki**

가 결합된 새로운 형태의 지식 서비스로 보는 것이 더 정확하다.

그리고 초기 개발에서 가장 중요한 것은 **많은 콘텐츠를 넣는 것보다** `Visual Story Engine` **하나를 아주 높은 완성도로 만드는 것**이다. 첫 두 개의 Story만 보고도 사용자가 “이건 기존 위키와 완전히 다르다”고 느낄 정도를 목표로 잡는 게 좋다.
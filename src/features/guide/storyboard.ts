/**
 * 둘러보기 해설의 대본.
 *
 * ★ 읽는 사람이 보는 낱말은 전부 여기 있다.
 *   그림 안에 찍히는 이름표까지 여기서 간다. 그림 컴포넌트가 제 낱말을
 *   갖기 시작하면 그 낱말은 아무도 고치지 않는 말이 되고, 화면의 다른
 *   자리와 말이 갈라진다.
 *
 * ★ 좌표는 여기 없다.
 *   무엇을 몇 개 그릴지는 여기서 정하고, 어디에 그릴지는 `GuideVisuals`가
 *   정한다. 업적 해설(`content/schema`의 explainerVisual)과 같은 규칙이다.
 *
 * ★ `src/content`에 두지 않는다.
 *   저기는 대조 대상이 되는 자료가 사는 곳이다. 이 대본은 이 앱이 제
 *   화면을 설명하는 말이라 성격이 다르고, 섞어 두면 위키 ingest가 보는
 *   경계가 흐려진다.
 */

export interface GuideStep {
  id: string;
  /** 단계 레일에 적히는 짧은 이름. */
  label: string;
  /** 지금 무슨 일이 일어났는지. 그림을 끄고 이 글만 읽어도 말이 되어야 한다. */
  caption: string;
  readout?: { value: string; unit?: string; note?: string };
}

/**
 * 한 장에 붙는 그림의 자료.
 *
 * 세 장이 서로 다른 모양이라서 세 종류다. 점 몇 개와 점선 하나로 세 장을
 * 다 그리면 그건 그림이 아니라 목차다.
 */
export type GuideVisual =
  /** 숫자 하나가 근거 문장을 거쳐 자료에 닿는다. 닿지 못한 문장은 사라진다. */
  | {
      kind: "anchor";
      number: string;
      unit?: string;
      numberLabel: string;
      claimText: string;
      verified: boolean;
      sourcePublisher: string;
      sourceTitle: string;
      /** 가리킬 자료가 없어서 화면에 오르지 못하는 문장. */
      orphanText: string;
    }
  /** 같은 조각들이 질문마다 다른 모양으로 다시 앉는다. */
  | {
      kind: "doors";
      pieces: number;
      doors: { id: string; label: string; shape: "묶음" | "기둥" | "줄" | "고리" | "그물" }[];
    }
  /** 한 편이 가진 일곱 칸이 하나씩 찬다. 보기 방식은 읽는 사람이 고른다. */
  | {
      kind: "slots";
      slots: { label: string; filled: number; total: number }[];
      views: { id: "easy" | "full"; label: string }[];
    };

export interface GuideChapter {
  id: string;
  /** 장 고르기 칩에 적히는 이름. */
  heading: string;
  /** 이 장이 답하는 질문. */
  question: string;
  visual: GuideVisual;
  steps: GuideStep[];
  takeaway: string;
  /**
   * 이 장이 줄여 말한 본문 절.
   *
   * 해설은 본문을 대신하지 않는다. 장마다 제가 줄인 자리로 돌아가는 문을
   * 둔다 — 그림에서 감을 잡은 사람이 글로 내려갈 자리가 있어야 한다.
   */
  sectionId: string;
  sectionLabel: string;
}

/** 첫 장이 쓰는 실제 숫자 하나와 그 숫자가 가리키는 것. */
export interface AnchorSample {
  number: string;
  unit?: string;
  label: string;
  claimText: string;
  verified: boolean;
  sourcePublisher: string;
  sourceTitle: string;
}

export interface GuideFacts {
  /** 실물 하나. 없으면 첫 장을 세우지 않는다 — 예시를 지어내지 않는다. */
  anchor?: AnchorSample;
  /** 다섯 갈래의 이름과 질문. 본문의 목록과 같은 것을 쓴다. */
  doors: { id: string; label: string }[];
  /** 일곱 칸의 이름과 채움. */
  parts: { label: string; filled: number; total: number }[];
}

/** 조각이 다시 앉는 다섯 모양. 순서는 본문의 다섯 갈래와 같다. */
const SHAPES = ["묶음", "기둥", "줄", "고리", "그물"] as const;

const DOOR_CAPTIONS: string[] = [
  "‘무엇을 했나’로 묶으면 흩어진 조각이 한 편이 됩니다. 업적 하나가 그렇게 만들어집니다.",
  "‘본인이 뭐라고 했나’로 세우면 묶지 않습니다. 인용 기둥을 따라 원문 하나가 한 칸씩 그대로 쌓입니다.",
  "‘같은 때에 무엇과 무엇이 있었나’로 보면 전부 날짜 위로 올라갑니다. 한 줄에서 앞뒤가 보입니다.",
  "‘무엇을 겨냥한 일인가’로 보면 표적 하나를 둘러싸고 다시 모입니다. 분야와는 다른 묶음입니다.",
  "‘한 편으로는 보이지 않는 이야기’는 조각을 서로 이어야 보입니다. 그 선이 위키입니다.",
];

const PART_CAPTIONS: string[] = [
  "긴 설명을 짧은 말과 그림으로 옮긴 칸입니다. 처음 여는 사람이 여기서 시작합니다.",
  "언제 무슨 일이 있었는지. 눌러서 그 시점으로 갑니다.",
  "직접 움직여 보는 칸입니다. 지도를 끌고 흐름을 따라가고 추이를 넘깁니다.",
  "누가 누구와 어떻게 얽혀 있는지. 한 사람을 고르면 그 사람 쪽만 남습니다.",
  "화면의 모든 단정이 가리키는 원자료. 앞 장에서 본 그 사슬이 여기 모여 있습니다.",
  "물으면 긴 글로 답하는 대신 화면이 그 장면으로 움직입니다.",
  "1분 안에 훑는 세로 영상. 읽을 시간이 없을 때 이 칸만 봐도 됩니다.",
];

export function buildGuideChapters(facts: GuideFacts): GuideChapter[] {
  const chapters: GuideChapter[] = [];

  if (facts.anchor) {
    const a = facts.anchor;
    chapters.push({
      id: "anchor",
      heading: "근거",
      question: "화면에 뜬 이 숫자는 어디서 왔나",
      sectionId: "guide-limits",
      sectionLabel: "믿어도 되는지",
      visual: {
        kind: "anchor",
        number: a.number,
        unit: a.unit,
        numberLabel: a.label,
        claimText: a.claimText,
        verified: a.verified,
        sourcePublisher: a.sourcePublisher,
        sourceTitle: a.sourceTitle,
        orphanText: "여기까지 내려갈 곳이 없는 문장",
      },
      steps: [
        {
          id: "number",
          label: "숫자 하나",
          caption:
            "화면에 숫자가 하나 떴습니다. 이것만 보고는 누가 무엇을 세어서 나온 수인지 알 수 없습니다.",
          readout: { value: a.number, unit: a.unit, note: a.label },
        },
        {
          id: "claim",
          label: "근거 문장",
          caption:
            "숫자마다 근거 문장이 하나씩 붙어 있습니다. 무엇을 근거로 이 수를 적었는지, 그리고 그 문장을 원자료와 맞춰 봤는지가 함께 남습니다.",
          readout: {
            value: a.verified ? "대조함" : "대조 전",
            /*
             * 그림은 이 문장을 칸에 맞춰 잘라 보인다. 그림은 aria-hidden이므로
             * 뜻을 나르는 것은 여기 적히는 원문 쪽이다.
             */
            note: a.claimText,
          },
        },
        {
          id: "source",
          label: "원자료",
          caption:
            "그 문장은 다시 원자료를 가리킵니다. 숫자 옆 버튼을 누른 사람은 여기까지 한 번에 내려옵니다.",
          readout: { value: a.sourcePublisher, note: a.sourceTitle },
        },
        {
          id: "orphan",
          label: "닿지 못하면",
          caption:
            "가리킬 자료가 없는 문장은 이 화면에 오르지 못합니다. 지워지는 것이 아니라 애초에 그려지지 않습니다. 빌드가 막습니다.",
        },
      ],
      takeaway:
        "그래서 화면에 보이는 것은 전부 어딘가를 가리키고 있습니다. 가리키지 못하는 것은 보이지 않습니다.",
    });
  }

  chapters.push({
    id: "doors",
    heading: "다섯 갈래",
    question: "같은 자료를 왜 다섯 갈래로 나눠 두었나",
    sectionId: "guide-layers",
    sectionLabel: "다섯 갈래로 들어갑니다",
    visual: {
      kind: "doors",
      pieces: 12,
      doors: facts.doors.slice(0, 5).map((door, i) => ({
        id: door.id,
        label: door.label,
        shape: SHAPES[i],
      })),
    },
    steps: facts.doors.slice(0, 5).map((door, i) => ({
      id: door.id,
      label: door.label,
      caption: DOOR_CAPTIONS[i],
    })),
    takeaway:
      "자료는 하나입니다. 다섯 갈래는 그 하나를 보는 다섯 개의 질문이고, 조각은 여러 갈래에 동시에 앉습니다.",
  });

  chapters.push({
    id: "parts",
    heading: "일곱 칸",
    question: "업적 한 편은 무엇으로 되어 있나",
    sectionId: "guide-anatomy",
    sectionLabel: "업적 한 편은 이렇게 생겼습니다",
    visual: {
      kind: "slots",
      slots: facts.parts,
      views: [
        { id: "easy", label: "쉽게 보기" },
        { id: "full", label: "원문 보기" },
      ],
    },
    steps: facts.parts.map((part, i) => ({
      id: `part-${i}`,
      label: part.label,
      caption:
        i === facts.parts.length - 1
          ? `${PART_CAPTIONS[i]} 일곱 칸이 다 찼습니다. 채우지 못한 칸은 빈 채로 둡니다 — 감추면 무엇이 남았는지 아무도 모릅니다.`
          : PART_CAPTIONS[i],
      readout: {
        value: `${part.filled}/${part.total}`,
        note: `공개된 업적 ${part.total}편 중 이 칸을 갖춘 편수`,
      },
    })),
    takeaway:
      "어느 업적을 열어도 같은 일곱 칸입니다. 어디에 무엇이 있는지 한 번만 익히면 됩니다.",
  });

  return chapters;
}

import { blankFace, paint } from "./keyboard";

export interface FaceHistory {
  face: string;
  history: string[];
  strokeStart: string | null;
}

type Action =
  | { type: "begin" }
  | { type: "end" }
  | { type: "paint"; cell: number; color: number; mirror: boolean }
  | { type: "clear" }
  | { type: "undo" };

export function initialFaceHistory(face: string): FaceHistory {
  return { face, history: [], strokeStart: null };
}

/** 한 획에서 실제로 달라진 첫 픽셀에만 이전 그림을 기록한다. */
export function faceHistoryReducer(state: FaceHistory, action: Action): FaceHistory {
  switch (action.type) {
    case "begin":
      return { ...state, strokeStart: state.face };
    case "end":
      return { ...state, strokeStart: null };
    case "paint": {
      const face = paint(state.face, action.cell, action.color, action.mirror);
      if (face === state.face) return state;
      return {
        face,
        history: state.strokeStart === null ? state.history : [...state.history, state.strokeStart],
        strokeStart: null,
      };
    }
    case "clear": {
      const face = blankFace();
      return face === state.face ? state : { face, history: [...state.history, state.face], strokeStart: null };
    }
    case "undo": {
      const face = state.history.at(-1);
      return face === undefined ? state : { face, history: state.history.slice(0, -1), strokeStart: null };
    }
  }
}

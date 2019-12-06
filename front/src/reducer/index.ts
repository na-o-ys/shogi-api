import { Action } from "../actions";
import { createPositionFromSfen } from "../shogi/position";
import { generateUsiCommand } from "../shogi/usi";
import { State } from "../state";
import { aiOutputReducer } from "./aiOutputReducer";

export function reducer(state: State, action: Action): State {
  return {
    ...generalReducer(state, action),
    aiOutput: aiOutputReducer(state, action)
  };
}

function generalReducer(state: State, action: Action): State {
  switch (action.type) {
    case "handleUsiFormChange": {
      const usiForm = Object.assign({}, state.usiForm, {
        [action.formName]: action.formValue
      });
      const usiCommand = generateUsiCommand(usiForm);
      let position = state.position;
      if (state.usiForm.sfen !== usiForm.sfen) {
        position = createPositionFromSfen(usiForm.sfen);
      }
      return {
        ...state,
        usiForm,
        usiCommand,
        position
      };
    }
    case "handleSfenSampleSelected": {
      const usiForm = { ...state.usiForm, sfen: action.value };
      return {
        ...state,
        usiForm,
        usiCommand: generateUsiCommand(usiForm),
        position: createPositionFromSfen(action.value),
        boardImageSfen: action.value
      };
    }
    case "handleUsiCommandChange": {
      return {
        ...state,
        usiCommand: action.value
      };
    }
    case "updateBoardImage": {
      return {
        ...state,
        boardImageSfen: state.usiForm.sfen
      };
    }
    case "startAi": {
      return {
        ...state,
        aiRawOutput: []
      };
    }
    case "receiveAiOutput": {
      const aiRawOutput = state.aiRawOutput
        .concat(action.data)
        .sort((a, b) => a.seqId - b.seqId);
      return {
        ...state,
        aiRawOutput
      };
    }
    default:
      return state;
  }
}

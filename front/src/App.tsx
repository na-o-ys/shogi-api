import React, { Dispatch, useReducer } from "react";
import "./App.css";
import { UsiForm } from "./components/UsiForm";
import { UsiCommand } from "./components/UsiCommand";
import { BoardImage } from "./components/BoardImage";
import { AiRawOutput } from "./components/AiRawOutput";
import { Move, Position } from "./shogi";
import { parseCommand, UsiEngineCommand } from "./shogi/usi";

type State = {
  usiForm: {
    sfen: string;
    byoyomi: number;
    multiPv: number;
    hash: number;
  };
  usiCommand: string;
  boardImageSfen: string;
  aiRawOutput: { seqId: number; data: string }[];
  usiEngineCommands: { seqId: number; command: UsiEngineCommand }[];
  aiOutput: {
    pv?: {
      scoreCp?: number;
      scoreMate?: number;
      depth?: number;
      seldepth?: number;
      moves: Move[];
      multipv?: number;
    }[];
    nps?: number;
    hashfull?: number;
    nodes?: number;
  };
};

const initialStateUsiForm = {
  sfen:
    "lr5nl/2g1kg1s1/p1npppbpp/2ps5/8P/2P3R2/PP1PPPP1N/1SGB1S3/LN1KG3L w 2Pp 1",
  byoyomi: 1000,
  multiPv: 10,
  hash: 512
};

const initialStateUsiCommand = generateUsiCommand(initialStateUsiForm);

const initialStateBoardImageSfen = initialStateUsiForm.sfen;

const initialState: State = {
  usiForm: initialStateUsiForm,
  usiCommand: initialStateUsiCommand,
  boardImageSfen: initialStateBoardImageSfen,
  aiRawOutput: [],
  usiEngineCommands: [],
  aiOutput: {}
};

type Action =
  | HandleUsiFormChangeAction
  | HandleUsiCommandChangeAction
  | UpdateBoardImageAction
  | StartAiAction
  | ReceiveAiOutputAction;

type HandleUsiFormChangeAction = {
  type: "handleUsiFormChange";
  formName: keyof State["usiForm"];
  formValue: State["usiForm"][keyof State["usiForm"]];
};

type HandleUsiCommandChangeAction = {
  type: "handleUsiCommandChange";
  value: string;
};

type UpdateBoardImageAction = {
  type: "updateBoardImage";
};

type StartAiAction = {
  type: "startAi";
};

type ReceiveAiOutputAction = {
  type: "receiveAiOutput";
  data: { seqId: number; data: string };
};

function generateUsiCommand(usiForm: State["usiForm"]) {
  return `usi
setoption name USI_Ponder value false
setoption name Hash value ${usiForm.hash}
setoption name MultiPV value ${usiForm.multiPv}
setoption name ConsiderationMode value true
setoption name EvalDir value /tmp/eval/illqha4
isready
usinewgame
position sfen ${usiForm.sfen}
go btime 0 wtime 0 byoyomi ${usiForm.byoyomi}\n`;
}

function initializeWebSocketConnection(url: string): Promise<WebSocket> {
  const ws = new WebSocket(url);
  return new Promise(resolve => {
    ws.onopen = () => resolve(ws);
  });
}

let webSocket = initializeWebSocketConnection(
  "wss://63q0l7kkd3.execute-api.ap-northeast-1.amazonaws.com/dev"
);

async function startAi(command: string, onMessage: (ev: MessageEvent) => void) {
  if ((await webSocket).readyState != 1)
    webSocket = initializeWebSocketConnection(
      "wss://63q0l7kkd3.execute-api.ap-northeast-1.amazonaws.com/dev"
    );
  (await webSocket).onmessage = onMessage;
  (await webSocket).send(
    JSON.stringify({ action: "runUsi", data: command + "\n" })
  );
}

function startAiActionCreator(command: string, dispatch: Dispatch<Action>) {
  dispatch({ type: "startAi" });
  startAi(command, ev => {
    dispatch({ type: "receiveAiOutput", data: JSON.parse(ev.data) });
  });
}

function reducer(state: State, action: Action) {
  console.log(action);
  switch (action.type) {
    case "handleUsiFormChange": {
      const usiForm = Object.assign({}, state.usiForm, {
        [action.formName]: action.formValue
      });
      const usiCommand = generateUsiCommand(usiForm);
      return {
        ...state,
        usiForm,
        usiCommand
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
      console.log(
        parseCommand(action.data.data, Position.fromSfen(state.usiForm.sfen))
      );
      return {
        ...state,
        aiRawOutput
      };
    }
    default:
      return state;
  }
}

export const StateContext = React.createContext<State>(null as any);
export const DispatchContext = React.createContext<Dispatch<Action>>(
  null as any
);

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <button
          onClick={() => startAiActionCreator(state.usiCommand, dispatch)}
        >
          Start
        </button>
        <UsiForm />
        <UsiCommand />
        <BoardImage />
        <AiRawOutput />
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default App;

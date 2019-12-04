import React, { Dispatch, useReducer } from "react";
import "./App.css";
import { UsiForm } from "./components/UsiForm";
import { Console } from "./components/Console";
import { BoardImage } from "./components/BoardImage";
import { parseCommand, UsiEngineCommand } from "./shogi/usi";
import { createPositionFromSfen, Position } from "./shogi/position";
import { Move, convertMoveJp } from "./shogi/move";
import { AiOutput } from "./components/AiOutput";
import { Grid, Box, CSSReset, ThemeProvider, Button } from "@chakra-ui/core";

type State = {
  usiForm: {
    sfen: string;
    byoyomiSec: number;
    multiPv: number;
    hash: number;
  };
  usiCommand: string;
  boardImageSfen: string;
  aiRawOutput: { seqId: number; data: string }[];
  usiEngineCommands: { seqId: number; command: UsiEngineCommand }[];
  position: Position | null;
  aiOutput: {
    pv?: {
      scoreCp?: number;
      scoreMate?: number;
      depth?: number;
      seldepth?: number;
      movesJp: string[];
      multipv: number;
      seqId: number;
    }[];
    bestMove?: string;
    nps?: number;
    hashfull?: number;
    nodes?: number;
    seqId: number;
  };
};

const initialStateUsiForm = {
  sfen:
    "lr5nl/2g1kg1s1/p1npppbpp/2ps5/8P/2P3R2/PP1PPPP1N/1SGB1S3/LN1KG3L w 2Pp 1",
  byoyomiSec: 30,
  multiPv: 3,
  hash: 512
};

const initialStateUsiCommand = generateUsiCommand(initialStateUsiForm);

const initialStateBoardImageSfen = initialStateUsiForm.sfen;

const initialState: State = {
  usiForm: initialStateUsiForm,
  usiCommand: initialStateUsiCommand,
  boardImageSfen: initialStateBoardImageSfen,
  position: createPositionFromSfen(initialStateUsiForm.sfen),
  aiRawOutput: [],
  usiEngineCommands: [],
  aiOutput: { seqId: -1 }
  // aiOutput: {
  //   seqId: -1,
  //   pv: [
  //     {
  //       multipv: 1,
  //       movesJp: [
  //         "△94歩(93)",
  //         "▲77銀(88)",
  //         "△24歩(23)",
  //         "▲56歩(57)",
  //         "△23銀(22)",
  //         "▲25歩打",
  //         "△95歩(94)",
  //         "▲55歩(56)",
  //         "△55銀(64)",
  //         "▲75歩(76)",
  //         "△75歩(74)",
  //         "▲74歩打",
  //         "△65桂(73)",
  //         "▲86銀(77)",
  //         "△25歩(24)",
  //         "▲25桂(17)",
  //         "△24角(33)",
  //         "▲22歩打"
  //       ],
  //       seqId: -1,
  //       depth: 20
  //     }
  //   ]
  // }
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
go btime 0 wtime 0 byoyomi ${usiForm.byoyomiSec * 1000}\n`;
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

function reducer(state: State, action: Action): State {
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
      if (state.usiForm.sfen != usiForm.sfen) {
        position = createPositionFromSfen(usiForm.sfen);
      }
      return {
        ...state,
        usiForm,
        usiCommand,
        position
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

function aiOutputReducer(
  { position, aiOutput }: State,
  action: Action
): State["aiOutput"] {
  if (action.type == "startAi") return initialState.aiOutput;
  if (action.type != "receiveAiOutput") return aiOutput;
  if (!action.data.data || !position) return aiOutput;
  const cmd = parseCommand(action.data.data, position);
  if (!cmd) return aiOutput;

  const currentSeqId = action.data.seqId;
  let newAiOutput = JSON.parse(JSON.stringify(aiOutput)) as State["aiOutput"];

  if (cmd.commandType == "info" && aiOutput.seqId < currentSeqId) {
    const { nps, hashfull, nodes } = cmd;
    newAiOutput = Object.assign({}, newAiOutput, {
      nps,
      hashfull,
      nodes,
      seqId: currentSeqId
    });
  }

  if (cmd.commandType == "info" && cmd.pv) {
    const multipv = cmd.multipv || 1;
    const prevPv = (aiOutput.pv || []).find(pv => pv.multipv == multipv);
    const prevSeqId = prevPv ? prevPv.seqId : -1;
    if (prevSeqId < currentSeqId) {
      const newPv =
        (newAiOutput.pv || []).filter(pv => pv.multipv != multipv) || [];
      const { scoreCp, scoreMate, depth, seldepth } = cmd;
      newPv.push({
        scoreCp,
        scoreMate,
        depth,
        seldepth,
        movesJp: cmd.pv.map(convertMoveJp),
        multipv,
        seqId: currentSeqId
      });
      newPv.sort((a, b) => a.multipv - b.multipv);
      newAiOutput.pv = newPv;
    }
  }

  if (cmd.commandType == "bestMove" && cmd.type == "move") {
    newAiOutput.bestMove = convertMoveJp(cmd.move);
  }

  return newAiOutput;
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
        <ThemeProvider>
          <CSSReset />
          <Grid
            templateColumns="1fr"
            gap={2}
            my={8}
            mx="auto"
            px="2rem"
            maxWidth="1024px"
          >
            <Grid templateColumns="1fr 300px" gap={1} my={8} height="308px">
              <Box my="auto">
                <UsiForm />
                <Button
                  variantColor="teal"
                  size="lg"
                  my={4}
                  onClick={() =>
                    startAiActionCreator(state.usiCommand, dispatch)
                  }
                >
                  Start
                </Button>
              </Box>
              <BoardImage />
            </Grid>
            <AiOutput />
            <Console />
          </Grid>
        </ThemeProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default App;

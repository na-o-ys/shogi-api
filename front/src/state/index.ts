import { UsiEngineCommand, generateUsiCommand } from "../shogi/usi";
import { createPositionFromSfen, Position } from "../shogi/position";

export type State = {
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
    isThinking: boolean;
  };
};

const initialStateUsiForm = {
  sfen:
    "ln1g5/1r4k2/p2pppn2/2ps2p2/1p7/2P6/PPSPPPPLP/2G2K1pr/LN4G1b b BG2SLPnp 1",
  byoyomiSec: 30,
  multiPv: 10,
  hash: 512
};

const initialStateUsiCommand = generateUsiCommand(initialStateUsiForm);

const initialStateBoardImageSfen = initialStateUsiForm.sfen;

export const initialState: State = {
  usiForm: initialStateUsiForm,
  usiCommand: initialStateUsiCommand,
  boardImageSfen: initialStateBoardImageSfen,
  position: createPositionFromSfen(initialStateUsiForm.sfen),
  aiRawOutput: [],
  usiEngineCommands: [],
  aiOutput: { seqId: -1, isThinking: false }
};

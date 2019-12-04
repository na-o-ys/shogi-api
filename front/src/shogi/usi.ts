import { Move, createMoveFromSfen } from "./move";
import { Position, doMove } from "./position";

export type UsiEngineCommand = UsiInfoCommand | UsiBestMoveCommand;

export type UsiInfoCommand = {
  commandType: "info";
  depth?: number;
  seldepth?: number;
  time?: number;
  nodes?: number;
  pvSfen?: string[];
  pv?: Move[];
  multipv?: number;
  scoreCp?: number;
  scoreMate?: number;
  hashfull?: number;
  nps?: number;
};

export type UsiBestMoveCommand =
  | {
      commandType: "bestMove";
      type: "resign" | "win";
    }
  | {
      commandType: "bestMove";
      type: "move";
      move: Move;
    };

export function parseCommand(
  command: string,
  position: Position
): UsiEngineCommand | null {
  const [mainCmd, ...words] = command.split(" ");
  switch (mainCmd) {
    case "info":
      return parseInfoCommand(words, position);
    case "bestmove":
      return parseBestMoveCommand(words, position);
    default:
      return null;
  }
}

export function convertPvToMove(
  pv: string[],
  position: Position
): Move[] | null {
  const result: Move[] = [];
  let lastMove: Move | null;
  for (const moveStr of pv) {
    lastMove = createMoveFromSfen(moveStr, position);
    if (lastMove === null) return null;
    result.push(lastMove);
    position = doMove(position, lastMove);
  }
  return result;
}

export function generateUsiCommand({
  hash,
  multiPv,
  sfen,
  byoyomiSec
}: {
  hash: number;
  multiPv: number;
  sfen: string;
  byoyomiSec: number;
}) {
  return `usi
setoption name USI_Ponder value false
setoption name Hash value ${hash}
setoption name MultiPV value ${multiPv}
setoption name ConsiderationMode value true
setoption name EvalDir value /tmp/eval/illqha4
isready
usinewgame
position sfen ${sfen}
go btime 0 wtime 0 byoyomi ${byoyomiSec * 1000}\n`;
}

function parseInfoCommand(
  words: string[],
  position: Position
): UsiInfoCommand | null {
  let result: UsiInfoCommand = { commandType: "info" };
  let i = 0;
  const stopCommands = [
    "depth",
    "seldepth",
    "time",
    "nodes",
    "pv",
    "multipv",
    "score",
    "currmove",
    "hashfull",
    "nps",
    "string"
  ];
  while (i < words.length) {
    switch (words[i]) {
      case "depth":
        result["depth"] = Number.parseInt(words[i + 1], 10);
        i += 2;
        break;
      case "seldepth":
        result["seldepth"] = Number.parseInt(words[i + 1], 10);
        i += 2;
        break;
      case "time":
        result["time"] = Number.parseInt(words[i + 1], 10);
        i += 2;
        break;
      case "nodes":
        result["nodes"] = Number.parseInt(words[i + 1], 10);
        i += 2;
        break;
      case "pv":
        const pv: string[] = [];
        i += 1;
        while (i < words.length && !stopCommands.includes(words[i])) {
          pv.push(words[i]);
          i += 1;
        }
        result["pvSfen"] = pv;
        const converted = convertPvToMove(pv, position);
        if (converted) result["pv"] = converted;
        break;
      case "multipv":
        result["multipv"] = Number.parseInt(words[i + 1], 10);
        i += 2;
        break;
      case "cp":
        result["scoreCp"] = Number.parseInt(words[i + 1], 10);
        i += 2;
        break;
      case "mate":
        result["scoreMate"] = Number.parseInt(words[i + 1], 10);
        i += 2;
        break;
      case "hashfull":
        result["hashfull"] = Number.parseInt(words[i + 1], 10);
        i += 2;
        break;
      case "nps":
        result["nps"] = Number.parseInt(words[i + 1], 10);
        i += 2;
        break;
      default:
        i += 1;
        break;
    }
  }
  return result;
}

function parseBestMoveCommand(
  words: string[],
  position: Position
): UsiBestMoveCommand | null {
  if (words[0] === "resign") {
    return { commandType: "bestMove", type: "resign" };
  }
  if (words[0] === "win") {
    return { commandType: "bestMove", type: "win" };
  }
  const move = createMoveFromSfen(words[0], position);
  if (move === null) return null;
  return {
    commandType: "bestMove",
    type: "move",
    move
  };
}

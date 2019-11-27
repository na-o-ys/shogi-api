import { Position, Move } from "./index";

export type UsiEngineCommand = UsiInfoCommand | UsiBestMoveCommand;

export type UsiInfoCommand = {
  depth?: number;
  seldepth?: number;
  time?: number;
  nodes?: number;
  pv?: string[];
  pvMoves?: Move[];
  multipv?: number;
  scoreCp?: number;
  scoreMate?: number;
  hashfull?: number;
  nps?: number;
};

export type UsiBestMoveCommand =
  | {
      type: "resign" | "win";
    }
  | {
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

export function convertPvToMove(pv: string[], position: Position): Move[] {
  const result: Move[] = [];
  let lastMove: Move | undefined;
  for (const moveStr in pv) {
    lastMove = Move.fromSfen(moveStr, position, lastMove);
    result.push(lastMove);
    position = position.doMove(lastMove);
  }
  return result;
}

function parseInfoCommand(
  words: string[],
  position: Position
): UsiInfoCommand | null {
  let result: UsiInfoCommand = {};
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
        result["pv"] = pv;
        result["pvMoves"] = convertPvToMove(pv, position);
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
  if (words[0] == "resign") {
    return { type: "resign" };
  }
  if (words[0] == "win") {
    return { type: "win" };
  }
  return {
    type: "move",
    move: Move.fromSfen(words[0], position)
  };
}

import { PieceOnBoard, Piece } from "./piece";
import { Move, Cell } from "./move";
import { parse } from "./sfen-parser";

export type Position = {
  cells: Array<Array<PieceOnBoard | null>>;
  side: "b" | "w";
  hand: { b: Hand; w: Hand };
};

export type Hand = {
  [key in Piece]: number;
};

export function createPositionFromSfen(sfen: string): Position | null {
  try {
    const parsed = parse(sfen);
    return parsed;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function doMove(currentPosition: Position, move: Move): Position {
  const position: Position = JSON.parse(JSON.stringify(currentPosition));
  if (move.type === "move_from_hand") {
    position.hand[move.piece.side][move.piece.piece] -= 1;
    setPiece(position, move.to, move.piece);
  } else {
    setPiece(position, move.from, null);
    let piece: PieceOnBoard = JSON.parse(JSON.stringify(move.piece));
    if (move.promote) {
      piece.piece = `+${piece.piece}` as Piece;
    }
    setPiece(position, move.to, piece);
  }
  return position;
}

export function getPiece(position: Position, cell: Cell): PieceOnBoard | null {
  return position.cells[cell.rank - 1][9 - cell.file];
}

export function setPiece(
  position: Position,
  cell: Cell,
  piece: PieceOnBoard | null
) {
  position.cells[cell.rank - 1][9 - cell.file] = piece;
}

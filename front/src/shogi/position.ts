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
  // const cells: Array<Array<PieceOnBoard | null>> = new Array(9);
  // for (let i = 0; i < 9; i++) {
  //   for (let j = 0; j < 9; j++) {
  //     const parsedCell = parsed.board[j * 9 + i];
  //     if (parsedCell == "") {
  //       cells[i][j] = null;
  //       continue;
  //     }
  //     const piece = parsedCell.toLowerCase() as Piece;
  //     let side: "b" | "w" = "b";
  //     if (parsedCell == parsedCell.toLowerCase()) side = "w";
  //     cells[i][j] = { piece, side };
  //   }
  // }
  // const hand = { b: {} as Hand, w: {} as Hand };
  // for (const parsedPiece in parsed.piecesInHand) {
  //   const piece = parsedPiece.toLowerCase() as Piece;
  //   let side: "b" | "w" = "b";
  //   if (piece == parsedPiece) side = "w";
  //   if (!(hand[side] as Object).hasOwnProperty(piece)) {
  //     hand[side][piece] = 0;
  //   } else {
  //     hand[side][piece] += 1;
  //   }
  // }

  // return { cells, side: parsed.side, hand };
  // const cells: Array<Array<PieceOnBoard | null>> = new Array(9);
  // for (let i = 0; i < 9; i++) {
  //   for (let j = 0; j < 9; j++) {
  //     cells[i][j] = null;
  //   }
  // }

  // let y = 0;
  // let i = 0;
  // for (; i < sfen.length; i++) {
  //   let x = 0;
  //   const c = sfen[i];
  //   if (c == "+") {
  //     continue;
  //   }
  //   if (c == "/") {
  //     y += 1;
  //     continue;
  //   }
  //   if (
  //     "0".charCodeAt(0) <= c.charCodeAt(0) &&
  //     c.charCodeAt(0) <= "9".charCodeAt(0)
  //   ) {
  //     x += c.charCodeAt(0) - "0".charCodeAt(0);
  //     continue;
  //   }
  //   if (c == " ") {
  //     i += 1;
  //     break;
  //   }

  //   let side: "b" | "w" = "b";
  //   if (c == c.toLowerCase()) side = "w";
  //   let piece: Piece = c as Piece;
  //   if (i > 0 && sfen[i - 1] == "+") {
  //     piece = ("+" + piece) as Piece;
  //   }
  //   cells[y][x] = { piece, side };
  // }

  return null as any;
}

export function doMove(currentPosition: Position, move: Move): Position {
  const position: Position = JSON.parse(JSON.stringify(currentPosition));
  if (move.type == "move_from_hand") {
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

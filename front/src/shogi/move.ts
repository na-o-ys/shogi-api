import { Position, getPiece } from "./position";
import { Piece, jpPieceMap, PieceOnBoard } from "./piece";
import { canPromote } from "./rule";

export type Move = MoveFromCell | MoveFromHand;

export type MoveFromCell = {
  type: "move_from_cell";
  from: Cell;
  to: Cell;
  piece: PieceOnBoard;
  promote: boolean;
};

export type MoveFromHand = {
  type: "move_from_hand";
  to: Cell;
  piece: PieceOnBoard;
};

export type Cell = {
  file: number;
  rank: number;
};

export function createMoveFromSfen(
  sfen: string,
  position: Position
): Move | null {
  // TODO: rep_inf 等への対応
  // http://yaneuraou.yaneu.com/2017/06/16/%E6%8B%A1%E5%BC%B5usi%E3%83%97%E3%83%AD%E3%83%88%E3%82%B3%E3%83%AB-%E8%AA%AD%E3%81%BF%E7%AD%8B%E5%87%BA%E5%8A%9B%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/
  const to = {
    file: sfen.charCodeAt(2) - "0".charCodeAt(0),
    rank: sfen.charCodeAt(3) - "a".charCodeAt(0) + 1
  };
  const fromHand = sfen[1] === "*";
  if (fromHand) {
    return {
      type: "move_from_hand",
      to,
      piece: { piece: sfen[0].toLowerCase() as Piece, side: position.side }
    };
  } else {
    const from = {
      file: sfen.charCodeAt(0) - "0".charCodeAt(0),
      rank: sfen.charCodeAt(1) - "a".charCodeAt(0) + 1
    };
    const piece = getPiece(position, from);
    if (piece === null) {
      return null;
    }
    const promote = sfen[4] === "+";
    return {
      type: "move_from_cell",
      from,
      to,
      piece,
      promote
    };
  }
}

export function convertMoveJp(move: Move): string {
  const side = move.piece.side === "b" ? "▲" : "△";
  const moveTo = `${move.to.file}${move.to.rank}`;
  const piece = jpPieceMap[move.piece.piece];
  let promote = "";
  if (
    move.type === "move_from_cell" &&
    canPromote(move.from, move.to, move.piece)
  ) {
    promote = move.promote ? "成" : "不成";
  }
  const moveFrom =
    move.type === "move_from_cell"
      ? `(${move.from.file}${move.from.rank})`
      : "打";

  return side + moveTo + piece + promote + moveFrom;
}

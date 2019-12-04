import { Cell } from "./move";
import { PieceOnBoard } from "./piece";

export function canPromote(from: Cell, to: Cell, piece: PieceOnBoard): boolean {
  if (!piece) return false;
  const canPromotePiece = ["l", "n", "s", "b", "r", "p"].includes(piece.piece);
  if (!canPromotePiece) return false;

  const isPromoteArea = (rank: number) =>
    (piece.side === "b" && rank <= 3) || (piece.side === "w" && rank >= 7);
  return isPromoteArea(from.rank) || isPromoteArea(to.rank);
}

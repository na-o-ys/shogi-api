export type Piece = keyof typeof jpPieceMap;

export type PieceOnBoard = {
  piece: Piece;
  side: "b" | "w";
};

export const jpPieceMap = {
  p: "歩",
  l: "香",
  n: "桂",
  s: "銀",
  g: "金",
  b: "角",
  r: "飛",
  k: "玉",
  "+p": "と",
  "+l": "成香",
  "+n": "成桂",
  "+s": "成銀",
  "+b": "馬",
  "+r": "龍"
};

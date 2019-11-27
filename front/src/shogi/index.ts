export interface IPosition {}

export class Position implements IPosition {
  static fromSfen(sfen: string): Position {
    return null as any;
  }

  doMove(move: IMove): Position {
    return null as any;
  }
}

export interface IMove {
  // same: boolean;
}

export class Move implements IMove {
  static fromSfen(sfen: string, position: IPosition, lastMove?: IMove): Move {
    return null as any;
  }

  getMoveJp(): string {
    return null as any;
  }
}

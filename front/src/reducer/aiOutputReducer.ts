import { Action } from "../actions";
import { convertMoveJp } from "../shogi/move";
import { parseCommand } from "../shogi/usi";
import { initialState, State } from "../state";

export function aiOutputReducer(
  { position, aiOutput }: State,
  action: Action
): State["aiOutput"] {
  if (action.type === "startAi")
    return { ...initialState.aiOutput, isThinking: true };
  if (action.type !== "receiveAiOutput") return aiOutput;
  if (!action.data.data || !position) return aiOutput;
  const cmd = parseCommand(action.data.data, position);
  if (!cmd) return aiOutput;

  const currentSeqId = action.data.seqId;
  let newAiOutput = JSON.parse(JSON.stringify(aiOutput)) as State["aiOutput"];

  if (cmd.commandType === "info" && aiOutput.seqId < currentSeqId) {
    const { nps, hashfull, nodes } = cmd;
    newAiOutput = Object.assign({}, newAiOutput, {
      nps,
      hashfull,
      nodes,
      seqId: currentSeqId
    });
  }

  if (cmd.commandType === "info" && cmd.pv) {
    const multipv = cmd.multipv || 1;
    const prevPv = (aiOutput.pv || []).find(pv => pv.multipv === multipv);
    const prevSeqId = prevPv ? prevPv.seqId : -1;
    if (prevSeqId < currentSeqId) {
      const newPv =
        (newAiOutput.pv || []).filter(pv => pv.multipv !== multipv) || [];
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

  if (cmd.commandType === "bestMove") {
    newAiOutput.isThinking = false;
  }

  if (cmd.commandType === "bestMove" && cmd.type === "move") {
    newAiOutput.bestMove = convertMoveJp(cmd.move);
  }

  return newAiOutput;
}

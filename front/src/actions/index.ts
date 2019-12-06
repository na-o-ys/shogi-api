import { Dispatch } from "react";
import { startAi } from "../App";
import { State } from "../state";

export type Action =
  | HandleUsiFormChangeAction
  | HandleUsiCommandChangeAction
  | HandleSfenSampleSelectedAction
  | UpdateBoardImageAction
  | StartAiAction
  | ReceiveAiOutputAction;

export function startAiActionCreator(
  command: string,
  dispatch: Dispatch<Action>
) {
  dispatch({ type: "startAi" });
  startAi(command, ev => {
    dispatch({ type: "receiveAiOutput", data: JSON.parse(ev.data) });
  });
}

type HandleUsiFormChangeAction = {
  type: "handleUsiFormChange";
  formName: keyof State["usiForm"];
  formValue: State["usiForm"][keyof State["usiForm"]];
};

type HandleUsiCommandChangeAction = {
  type: "handleUsiCommandChange";
  value: string;
};

type HandleSfenSampleSelectedAction = {
  type: "handleSfenSampleSelected";
  value: string;
};

type UpdateBoardImageAction = {
  type: "updateBoardImage";
};

type StartAiAction = {
  type: "startAi";
};

type ReceiveAiOutputAction = {
  type: "receiveAiOutput";
  data: { seqId: number; data: string };
};

import React, { useContext } from "react";
import { StateContext, DispatchContext } from "../App";

export const AiRawOutput: React.FC = () => {
  const state = useContext(StateContext).aiRawOutput;
  const dispatch = useContext(DispatchContext);

  return (
    <form>
      <textarea
        value={state.map(v => v.data).join("\n")}
        readOnly
        cols={120}
        rows={14}
      />
    </form>
  );
};

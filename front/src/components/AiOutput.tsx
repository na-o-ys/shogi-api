import React, { useContext } from "react";
import { StateContext, DispatchContext } from "../App";

export const AiOutput: React.FC = () => {
  const state = useContext(StateContext).aiOutput;
  const dispatch = useContext(DispatchContext);

  return (
    <form>
      <textarea
        value={JSON.stringify(state, null, 4)}
        readOnly
        cols={120}
        rows={14}
      />
    </form>
  );
};

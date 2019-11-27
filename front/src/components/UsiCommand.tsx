import React, { useContext } from "react";
import { StateContext, DispatchContext } from "../App";

export const UsiCommand: React.FC = () => {
  const state = useContext(StateContext).usiCommand;
  const dispatch = useContext(DispatchContext);

  return (
    <form>
      <textarea
        value={state}
        onChange={e =>
          dispatch({ type: "handleUsiCommandChange", value: e.target.value })
        }
        cols={120}
        rows={14}
      />
    </form>
  );
};

import React, { useContext } from "react";
import { StateContext, DispatchContext } from "../App";

export const UsiForm: React.FC = () => {
  const state = useContext(StateContext).usiForm;
  const dispatch = useContext(DispatchContext);

  const handleFormChange = (formName: keyof typeof state) => (
    e: React.ChangeEvent<any>
  ) =>
    dispatch({
      type: "handleUsiFormChange",
      formName,
      formValue: e.target.value
    });

  return (
    <div>
      <form>
        <label>
          sfen
          <input
            type="text"
            value={state.sfen}
            onChange={handleFormChange("sfen")}
          />
        </label>
        {/* <img src={`http://sfenreader.appspot.com/sfen?sfen=${state.sfen}`} /> */}
        <label>
          byoyomi
          <input
            type="number"
            value={state.byoyomi}
            onChange={handleFormChange("byoyomi")}
          />{" "}
        </label>
        <label>
          multiPv
          <input
            type="number"
            value={state.multiPv}
            onChange={handleFormChange("multiPv")}
          />
        </label>
        <label>
          hash
          <input
            type="number"
            value={state.hash}
            onChange={handleFormChange("hash")}
          />
        </label>
      </form>
    </div>
  );
};

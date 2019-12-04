import React, { useContext } from "react";
import { StateContext, DispatchContext } from "../App";
import { FormControl, FormLabel, Input } from "@chakra-ui/core";

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
      <FormControl>
        <FormLabel htmlFor="sfen">sfen</FormLabel>
        <Input
          id="sfen"
          value={state.sfen}
          onChange={handleFormChange("sfen")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="byoyomi">byoyomi (ms)</FormLabel>
        <Input
          type="number"
          id="byoyomi"
          value={state.byoyomi}
          onChange={handleFormChange("byoyomi")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="multipv">multi pv</FormLabel>
        <Input
          type="number"
          id="multipv"
          value={state.multiPv}
          onChange={handleFormChange("multiPv")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="hash">hash (MB)</FormLabel>
        <Input
          type="number"
          id="hash"
          value={state.hash}
          onChange={handleFormChange("hash")}
        />
      </FormControl>
    </div>
  );
};

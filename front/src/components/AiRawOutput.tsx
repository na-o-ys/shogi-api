import React, { useContext, useEffect } from "react";
import { StateContext, DispatchContext } from "../App";
import { Box } from "@chakra-ui/core";

export const AiRawOutput: React.FC = () => {
  const state = useContext(StateContext).aiRawOutput;
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    const el = document.getElementById("aiRawOutputEnd");
    if (el) el.scrollIntoView({ behavior: "auto" });
  });

  return (
    <Box bg="gray.800" rounded="lg" overflow="scroll" h="400px">
      <Box m="5" color="gray.200" fontSize="xs">
        <pre>{state.map(v => v.data).join("\n")}</pre>
      </Box>
      <div id="aiRawOutputEnd" style={{ float: "left", clear: "both" }}></div>
    </Box>
  );
};

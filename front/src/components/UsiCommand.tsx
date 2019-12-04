import React, { useContext } from "react";
import { StateContext, DispatchContext } from "../App";
import { Box } from "@chakra-ui/core";

export const UsiCommand: React.FC = () => {
  const state = useContext(StateContext).usiCommand;
  const dispatch = useContext(DispatchContext);

  return (
    <Box bg="gray.800" rounded="lg" overflow="scroll" h="400px">
      <Box m="5" color="gray.200" fontSize="xs">
        <pre>{state}</pre>
      </Box>
    </Box>
    // <form>
    //   <textarea
    //     value={state}
    //     onChange={e =>
    //       dispatch({ type: "handleUsiCommandChange", value: e.target.value })
    //     }
    //     cols={120}
    //     rows={14}
    //   />
    // </form>
  );
};

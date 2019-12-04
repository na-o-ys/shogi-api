import React, { useContext } from "react";
import { StateContext, DispatchContext } from "../App";
import { Box } from "@chakra-ui/core";

export const UsiCommand: React.FC = () => {
  const state = useContext(StateContext).usiCommand;

  return (
    <Box bg="gray.800" rounded="lg" overflow="scroll" h="400px">
      <Box m="5" color="gray.200" fontSize="xs">
        <pre>{state}</pre>
      </Box>
    </Box>
  );
};

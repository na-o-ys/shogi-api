import { Box } from "@chakra-ui/core";
import React, { useContext } from "react";
import { StateContext } from "../App";

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

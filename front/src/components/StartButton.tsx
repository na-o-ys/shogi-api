import React, { useContext } from "react";
import { Button } from "@chakra-ui/core";
import { StateContext, DispatchContext } from "../App";
import { startAiActionCreator } from "../actions";

export const StartButton: React.FC = () => {
  const {
    usiCommand,
    aiOutput: { isThinking }
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  if (isThinking)
    return (
      <Button variantColor="teal" size="lg" my={4} isLoading>
        Start
      </Button>
    );
  return (
    <Button
      variantColor="teal"
      size="lg"
      my={4}
      onClick={() => startAiActionCreator(usiCommand, dispatch)}
    >
      Start
    </Button>
  );
};

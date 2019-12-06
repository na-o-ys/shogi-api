import React, { useContext } from "react";
import { Button, ButtonProps } from "@chakra-ui/core";
import { StateContext, DispatchContext } from "../App";
import { startAiActionCreator } from "../actions";

type StartButtonProps = Omit<ButtonProps, "children">;

export const StartButton: React.FC<StartButtonProps> = (
  props: StartButtonProps
) => {
  const {
    usiCommand,
    aiOutput: { isThinking }
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  if (isThinking)
    return (
      <Button variantColor="teal" my={4} size="lg" isLoading {...props}>
        Start
      </Button>
    );
  return (
    <Button
      variantColor="teal"
      my={4}
      size="lg"
      onClick={() => startAiActionCreator(usiCommand, dispatch)}
      {...props}
    >
      Start
    </Button>
  );
};

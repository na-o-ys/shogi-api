import React, { useContext } from "react";
import { StateContext, DispatchContext } from "../App";
import { Box, BoxProps } from "@chakra-ui/core";

export const BoardImage: React.FC<BoxProps> = (props: BoxProps) => {
  const state = useContext(StateContext).boardImageSfen;
  const dispatch = useContext(DispatchContext);

  return (
    <Box {...props}>
      <img
        src={`http://sfenreader.appspot.com/sfen?sfen=${encodeURIComponent(
          state
        )}`}
        onClick={e => dispatch({ type: "updateBoardImage" })}
      />
    </Box>
  );
};

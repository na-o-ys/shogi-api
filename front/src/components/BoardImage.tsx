import React, { useContext } from "react";
import { StateContext, DispatchContext } from "../App";
import { Box } from "@chakra-ui/core";

export const BoardImage: React.FC = () => {
  const state = useContext(StateContext).boardImageSfen;
  const dispatch = useContext(DispatchContext);

  return (
    <Box>
      <img
        src={`http://sfenreader.appspot.com/sfen?sfen=${state}`}
        width="300px"
        height="308px"
        onClick={e => dispatch({ type: "updateBoardImage" })}
      />
    </Box>
  );
};

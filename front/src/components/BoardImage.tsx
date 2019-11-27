import React, { useContext } from "react";
import { StateContext, DispatchContext } from "../App";

export const BoardImage: React.FC = () => {
  const state = useContext(StateContext).boardImageSfen;
  const dispatch = useContext(DispatchContext);

  return (
    <img
      src={`http://sfenreader.appspot.com/sfen?sfen=${state}`}
      onClick={e => dispatch({ type: "updateBoardImage" })}
    />
  );
};

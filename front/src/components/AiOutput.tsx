import React, { useContext } from "react";
import { StateContext, DispatchContext } from "../App";
import { Box } from "@chakra-ui/core";

export const AiOutput: React.FC = () => {
  const state = useContext(StateContext).aiOutput;

  return (
    <Box w="100%">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>score (cp)</th>
            <th>depth</th>
            <th>pv</th>
          </tr>
        </thead>
        <tbody>
          {(state.pv || []).map(pv => (
            <tr key={pv.multipv} style={{ height: "24px" }}>
              <td>{pv.multipv}</td>
              <td>{pv.scoreCp}</td>
              <td>{pv.depth}</td>
              <td>
                <Box w="500px" overflow="scroll" whiteSpace="nowrap">
                  <Box wordBreak="keep-all">{pv.movesJp}</Box>
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

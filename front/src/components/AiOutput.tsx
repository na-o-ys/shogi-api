import { Box, BoxProps } from "@chakra-ui/core";
import React, { useContext } from "react";
import { StateContext } from "../App";
import { Table, TData, THead } from "./Table";

export const AiOutput: React.FC<BoxProps> = (props: BoxProps) => {
  const state = useContext(StateContext).aiOutput;

  return (
    <Box w="100%" {...props}>
      <Table style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <THead w="2rem">#</THead>
            <THead w="6rem">指し手</THead>
            <THead w={{ base: "3rem", md: "6rem" }}>スコア</THead>
            <THead w={{ base: "3rem", md: "6rem" }}>探索深さ</THead>
            <THead>読み筋</THead>
          </tr>
        </thead>
        <tbody>
          {(state.pv || [dummyPv as any]).map(pv => (
            <tr
              key={pv.multipv}
              style={{ height: "24px", textAlign: "center" }}
            >
              <TData>{pv.multipv}</TData>
              <TData>{pv.movesJp[0]}</TData>
              <TData>{scoreToText(pv)}</TData>
              <TData>{pv.depth}</TData>
              <TData whiteSpace="nowrap" overflow="scroll">
                {pv.movesJp.join("")}
              </TData>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

const dummyPv = {
  multipv: "-",
  movesJp: ["-"],
  depth: "-"
};

function scoreToText({
  scoreCp,
  scoreMate
}: {
  scoreCp?: number;
  scoreMate?: number;
}): string {
  if (scoreCp !== undefined) {
    return scoreCp > 0 ? `+${scoreCp}` : `${scoreCp}`;
  }
  if (scoreMate !== undefined) {
    return `${Math.abs(scoreMate)}手で${scoreMate > 0 ? "先手" : "後手"}勝ち`;
  }
  return "-";
}

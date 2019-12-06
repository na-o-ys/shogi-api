import { Box, useTheme, BoxProps } from "@chakra-ui/core";
import React, { useContext, useEffect } from "react";
import { StateContext } from "../App";

type Line = {
  direction: "in" | "out";
  text: string;
};

const Line: React.FC<{ line: Line }> = ({ line }) => {
  return (
    <>
      <pre className={`line-${line.direction}`}>{line.text}</pre>
    </>
  );
};

export const Console: React.FC<BoxProps> = (props: BoxProps) => {
  const { usiCommand, aiRawOutput } = useContext(StateContext);

  const input: Line[] = usiCommand
    .split("\n")
    .filter(v => v)
    .map(text => ({
      direction: "in",
      text
    }));
  const output: Line[] = aiRawOutput.map(({ data }) => ({
    direction: "out",
    text: data
  }));
  const lines = input.concat(output);

  useEffect(() => {
    const body = document.getElementById("consoleTextArea");
    const container = document.getElementById("consoleTextAreaContainer");
    if (body && container) container.scrollTop = body.clientHeight;
  });

  return (
    <Box
      position="relative"
      overflow="scroll"
      bg="gray.800"
      rounded="lg"
      {...props}
    >
      <Box
        overflow="scroll"
        h={{ base: 200, md: 260 }}
        id="consoleTextAreaContainer"
      >
        <style>{`
        .line-in:before {
          content: "> ";
          color: ${useTheme().colors.cyan[500]};
        }
        .line-out:before {
          content: "< ";
          color: ${useTheme().colors.gray[500]};
        }
        `}</style>
        <Box m="5" color="gray.200" fontSize="xs" id="consoleTextArea">
          {lines.map((line, idx) => (
            <Line line={line} key={idx} />
          ))}
        </Box>
      </Box>
      <Box
        position="absolute"
        width="full"
        top="0"
        bg="gray.800"
        py="2"
        color="gray.200"
        fontSize="xs"
        fontWeight="semibold"
        textAlign="center"
        pointerEvents="none"
        textTransform="uppercase"
      >
        Live USI
      </Box>
    </Box>
  );
};

import { Box, CSSReset, Heading, ThemeProvider } from "@chakra-ui/core";
import React, { Dispatch, useReducer } from "react";
import { Action } from "./actions";
import "./App.css";
import { AiOutput } from "./components/AiOutput";
import { BoardImage } from "./components/BoardImage";
import { Console } from "./components/Console";
import { StartButton } from "./components/StartButton";
import { preloadImages, UsiForm } from "./components/UsiForm";
import { reducer } from "./reducer";
import { initialState, State } from "./state";

export const StateContext = React.createContext<State>(null as any);
export const DispatchContext = React.createContext<Dispatch<Action>>(
  null as any
);

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  preloadImages();
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <ThemeProvider>
          <CSSReset />
          <Box
            my={8}
            mx="auto"
            px={{ base: 4, md: 8 }}
            maxWidth="1024px"
            color="gray.700"
          >
            <Heading>Serverless Shogi DEMO</Heading>
            <Box
              display={{ md: "flex " }}
              flexDirection="row-reverse"
              mt={{ base: 2, md: 8 }}
            >
              <BoardImage w={{ base: "240px", md: "300px" }} mx="auto" />
              <Box
                my="auto"
                ml="0"
                mr={4}
                w={{ md: "calc(100% - 300px)" }}
                display={{ base: "flex", md: "block" }}
              >
                <UsiForm />
                <StartButton
                  ml={{ base: "auto", md: 0 }}
                  mr={{ base: 0, md: "auto" }}
                />
              </Box>
            </Box>
            <Console my={4} />
            <AiOutput my={4} />
          </Box>
        </ThemeProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export async function startAi(
  command: string,
  onMessage: (ev: MessageEvent) => void
) {
  if ((await webSocket).readyState !== 1)
    webSocket = initializeWebSocketConnection(
      "wss://63q0l7kkd3.execute-api.ap-northeast-1.amazonaws.com/dev"
    );
  (await webSocket).onmessage = onMessage;
  (await webSocket).send(
    JSON.stringify({ action: "runUsi", data: command + "\n" })
  );
}

function initializeWebSocketConnection(url: string): Promise<WebSocket> {
  const ws = new WebSocket(url);
  return new Promise(resolve => {
    ws.onopen = () => resolve(ws);
  });
}

let webSocket = initializeWebSocketConnection(
  "wss://63q0l7kkd3.execute-api.ap-northeast-1.amazonaws.com/dev"
);

export default App;

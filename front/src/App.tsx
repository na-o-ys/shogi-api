import { Box, CSSReset, Grid, ThemeProvider, Heading } from "@chakra-ui/core";
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
          <Grid
            templateColumns="1fr"
            gap={2}
            my={8}
            mx="auto"
            px="2rem"
            maxWidth="1024px"
            color="gray.700"
          >
            <Heading>Serverless Shogi DEMO</Heading>
            <Grid templateColumns="1fr 300px" gap={1} my={8} height="308px">
              <Box my="auto">
                <UsiForm />
                <StartButton />
              </Box>
              <BoardImage />
            </Grid>
            <AiOutput />
            <Console />
          </Grid>
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

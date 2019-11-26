import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { parse as parseInfo, selectBestPv } from "./info";
import { spawn } from "child_process";
import split from "split";
import { copySync, chmodSync } from "fs-extra";
import * as path from "path";

const ENGINE_SRC_DIR = "engine";
const ENGINE_DIR = "/tmp/engine";
const EVAL_SRC_DIR = "eval";
const EVAL_DIR = "/tmp/eval";

const ENGINE = "dolphin101-sse42";
const EVAL = "illqha4";

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const {
    byoyomi,
    position,
    multipv = "1",
    engine = ENGINE,
    evalFn = EVAL
  } = event.queryStringParameters;
  setup(engine);

  const process = spawn(`./${engine}`, [], {
    cwd: ENGINE_DIR
  });
  process.stdin.write(generateCommand(byoyomi, position, multipv, evalFn));
  const result = await getResult(process.stdout);
  process.kill();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        request: event,
        ...result
      },
      null,
      2
    )
  };
};

function setup(engine: string) {
  copySync(ENGINE_SRC_DIR, ENGINE_DIR);
  copySync(EVAL_SRC_DIR, EVAL_DIR);
  chmodSync(path.resolve(ENGINE_DIR, engine), 0o755);
}

function getResult(stdout: NodeJS.ReadableStream) {
  let infoList = [];
  const generateResult = bestmove => ({
    bestmove,
    bestpv: selectBestPv(infoList),
    info_list: infoList
  });
  return new Promise(resolve => {
    stdout.pipe(split()).on("data", data => {
      const line: string = data.toString();
      const [cmd, ...words] = line.split(" ");
      console.log(line);

      if (cmd == "info") infoList.push(parseInfo(words));
      if (cmd == "bestmove") resolve(generateResult(words[0]));
    });
  });
}

function generateCommand(
  byoyomi: string,
  position: string,
  multipv: string,
  evalFn: string
) {
  return `usi
setoption name USI_Ponder value false
setoption name Hash value 2500
setoption name MultiPV value ${multipv}
setoption name EvalDir value ${path.resolve(EVAL_DIR, evalFn)}
isready
usinewgame
position ${position}
go btime 0 wtime 0 byoyomi ${byoyomi}
`;
}

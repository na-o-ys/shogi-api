import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { parse as parseInfo, selectBestPv } from "./info";
import split from "split";
import * as path from "path";
import * as engineProcess from "./engine";

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

  engineProcess.setup(engine);
  const process = engineProcess.spawn(engine);

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
setoption name EvalDir value ${path.resolve(engineProcess.EVAL_DIR, evalFn)}
isready
usinewgame
position ${position}
go btime 0 wtime 0 byoyomi ${byoyomi}
`;
}

import {
  APIGatewayEventRequestContext,
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda";
import { ApiGatewayManagementApi, AWSError, Response } from "aws-sdk";
import * as engineProcess from "./engine";
import split from "split";

const ENGINE = "dolphin101-sse42";
const TIMEOUT_MS = 30_000;

export const connect: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.debug("Starting Lambda handler: event=%s", JSON.stringify(event));
  return { body: "Connected", statusCode: 200 };
};

export const disconnect: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.debug("Starting Lambda handler: event=%s", JSON.stringify(event));
  return { body: "Disconnected", statusCode: 200 };
};

export const defaultMessage: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.debug("Starting Lambda handler: event=%s", JSON.stringify(event));
  await sendMessageToClient(
    event.requestContext,
    event.requestContext.connectionId,
    "Error: Invalid action type"
  );
  return { body: "Error: Invalid action type", statusCode: 500 };
};

export const runUsi: APIGatewayProxyHandler = async (
  event,
  _context
): Promise<APIGatewayProxyResult> => {
  console.debug("Starting Lambda handler: event=%s", JSON.stringify(event));

  const { data, engine = ENGINE } = JSON.parse(event.body);
  engineProcess.setup(engine);
  const process = engineProcess.spawn(engine);

  let dataReceivedAt = Date.now();
  let seqId = 0;
  process.stdout.pipe(split()).on("data", data => {
    seqId += 1;
    dataReceivedAt = Date.now();
    console.debug(data);
    sendMessageToClient(
      event.requestContext,
      event.requestContext.connectionId,
      JSON.stringify({ seqId, data })
    ).catch(console.error);
  });

  process.stdin.write(data);

  await new Promise(resolve => {
    setInterval(() => {
      if (Date.now() - dataReceivedAt > TIMEOUT_MS) {
        resolve();
      }
    }, 1000);
  });

  return { body: "OK", statusCode: 200 };
};

function sendMessageToClient(
  { domainName, stage }: APIGatewayEventRequestContext,
  connectionId: string,
  payload: string
): Promise<{
  $response: Response<{}, AWSError>;
}> {
  const apigatewaymanagementapi = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: `${domainName}/${stage}`
  });
  return apigatewaymanagementapi
    .postToConnection({
      ConnectionId: connectionId, // connectionId of the receiving ws-client
      Data: payload
    })
    .promise();
}

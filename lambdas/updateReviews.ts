import {
  DynamoDB,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
  APIGatewayEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyHandlerV2,
} from "aws-lambda";
import { AddReviewType, MovieReview } from "../shared/types";
import { getFormattedDate, JWTVerifier } from "../shared/utils";

const dynamoClient = new DynamoDBClient();
let reviewId = 1000;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.headers.Authorization)
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Invalid JSON" }),
    };

  const token = event.headers.Authorization;
  const path = event.pathParameters!!;
  const movieId = path["movieId"];
  const reviewId = path["reviewId"];

  try {
    const isValidToken = await JWTVerifier.verify(token);
    if (!isValidToken.sub)
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid Token" }),
      };
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid Token" }),
    };
  }

  const tokenPayload = await JWTVerifier.verify(token);
  const reviewerId = tokenPayload["cognito:username"];
  



  return {
    statusCode: 401,
    body: JSON.stringify({ message: "Invalid Token" }),
  };
};

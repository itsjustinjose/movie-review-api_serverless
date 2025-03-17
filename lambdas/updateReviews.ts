import {
  DynamoDB,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
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
  const reviewItems = await dynamoClient.send(
    new GetItemCommand({
      TableName: "ReviewTable",
      Key: {
        movieId: { N: movieId!! },
        reviewId: { N: reviewId!! },
      },
    })
  );

  if (!reviewItems.Item)
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "No Items found Token" }),
    };
  const unmarshalled: MovieReview = unmarshall(
    reviewItems.Item!!
  ) as MovieReview;

  if (unmarshalled.reviewerId != reviewerId) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "You are not authorized to update" }),
    };
  }

  const reviewDate = getFormattedDate();
  const body = event.body ? JSON.parse(event.body) : null;
  const content = body.content;

  const updateResp = await dynamoClient.send(
    new UpdateItemCommand({
      TableName: "ReviewTable",
      Key: {
        movieId: { N: movieId!! },
        reviewId: { N: reviewId!! },
      },
      UpdateExpression: "SET reviewDate = :rd, content = :ct ",
      ExpressionAttributeValues: {
        ":rd": { S: reviewDate },
        ":ct": { S: content },
      },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Updated Review" }),
  };
};

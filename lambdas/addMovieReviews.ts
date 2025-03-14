

import { DynamoDB, DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda";
import { AddReviewType, MovieReview } from "../shared/types";
import { getFormattedDate } from "../shared/utils";



const dynamoClient = new DynamoDBClient()
let reviewId = 1000

export const handler  = async (event : APIGatewayEvent, context : APIGatewayEventRequestContext) =>{

    if(!event.body) return { statusCode: 404 , body : JSON.stringify("Invalid body")}

   const requestBody : AddReviewType = JSON.parse(event.body) as AddReviewType
   const bodyToAdd : MovieReview= {
    movieId :requestBody.movieId,
    reviewId : reviewId,
    reviewerId: requestBody.content,
    reviewDate : getFormattedDate(),
    content :requestBody.content
   }

   const response = await dynamoClient.send(new PutItemCommand({
    TableName: "ReviewTable",
    Item : marshall(bodyToAdd)
   }))
   
   reviewId++

   return {statusCode : 201, body : JSON.stringify({message :"Review Added"})}

}
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda";



const dynamoClient = new DynamoDBClient()

export const handler  = async (event : APIGatewayEvent, context : APIGatewayEventRequestContext) =>{

}
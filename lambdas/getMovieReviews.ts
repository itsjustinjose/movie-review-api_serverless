import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda";



const dynamoClient = new DynamoDBClient()

export const handler  = async (event : APIGatewayEvent, context : APIGatewayEventRequestContext) =>{


    if(!event.pathParameters){
        return {
            statusCode: 400,
            body : JSON.stringify({message : "Movie ID not present"})
        }
    }
    const movieId = await event.pathParameters["movieId"]

    const queryCommandInput : QueryCommandInput ={
        TableName : "reviewTable",
        KeyConditionExpression : "movieId = :mid",
        ExpressionAttributeValues: {
            ":mid" : {N : movieId}
        }
    }

    const response = await dynamoClient.send(new QueryCommand(queryCommandInput))
    if(!response.Items) return {ststusCode: 404, body : JSON.stringify({message:"No movies with this id"})}
    const movies  =  response.Items.map(item => {
        return unmarshall(item)
    })
    return {
        statusCode: 200,
        body : JSON.stringify( {
            movies : movies
        })
    }
}
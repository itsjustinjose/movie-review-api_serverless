import { DynamoDBClient, GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda";
import { MovieReview } from "../shared/types";



const dynamoClient = new DynamoDBClient()
const translateClient =  new TranslateClient()

export const handler  = async (event : APIGatewayEvent, context : APIGatewayEventRequestContext) =>{
 
    if(!event.pathParameters) return { statusCode: 400, body : JSON.stringify({message : "Invalid request"})}
    if(!event.queryStringParameters) return { statusCode: 400, body : JSON.stringify({message : "Invalid request, no language specified"})}
    const targetLanguage = event.queryStringParameters["language"]

    const {movieId , reviewId} = event.pathParameters 
    const getResponse = await dynamoClient.send(new GetItemCommand({
        TableName: "ReviewTable",
        Key: {
            "movieId" : {N: movieId!!},
            "reviewId" : {N: reviewId!!}
        }
    }))

    if(!getResponse.Item) return { statusCode: 404, body : JSON.stringify({message : "Invalid request"})}
    const review = unmarshall(getResponse.Item) as MovieReview
    const translatedResp = await translateClient.send(new TranslateTextCommand({
        SourceLanguageCode: "en",
        TargetLanguageCode: targetLanguage,
        Text : review.content

    }))

    const translatedReview = translatedResp.TranslatedText
    return { statusCode: 200, body : JSON.stringify({translated_review : translatedReview})}



}
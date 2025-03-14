import { Lambda } from "aws-cdk-lib/aws-ses-actions";
import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda";

export const handler = async (event: APIGatewayEvent , context :APIGatewayEventRequestContext) => {


    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ message: "Hello, world" })
    };

}
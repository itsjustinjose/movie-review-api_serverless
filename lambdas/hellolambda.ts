import { Lambda } from "aws-cdk-lib/aws-ses-actions";
import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda";

export const handler = async (event: APIGatewayEvent , context :APIGatewayEventRequestContext) => {


    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },  // ✅ Ensure Content-Type is set
        body: JSON.stringify({ message: "Hello, world" }) // ✅ body must be a stringified JSON object
    };

}
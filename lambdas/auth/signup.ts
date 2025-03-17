import {
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
  SignUpCommand,
  SignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  APIGatewayEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyHandlerV2,
} from "aws-lambda";
import { SignInBody, SignUpBody } from "../../shared/types";

const client = new CognitoIdentityProviderClient();
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No body found" }),
    };
  const signUpBody = body as SignUpBody;

  const params: SignUpCommandInput = {
    ClientId: "4iqe2s2a613upgg70oqa68d6c5",
    Username: signUpBody.username,
    Password: signUpBody.password,
    UserAttributes: [{ Name: "email", Value: signUpBody.email }],
  };

  try {
    const command = new SignUpCommand(params);
    const res = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: res,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Server error",
      }),
    };
  }
};

import {
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  SignUpCommand,
  SignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  APIGatewayEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyHandlerV2,
} from "aws-lambda";
import { ConfirmSignUpBody, SignInBody, SignUpBody } from "../../shared/types";

const client = new CognitoIdentityProviderClient();
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No body found" }),
    };
  const confirmSignUpBody = body as ConfirmSignUpBody;

  const params: ConfirmSignUpCommandInput = {
    ClientId: "4iqe2s2a613upgg70oqa68d6c5",
    Username: confirmSignUpBody.username,
    ConfirmationCode: confirmSignUpBody.code,
  };

  try {
    const command = new ConfirmSignUpCommand(params);
    const res = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User confirmeds",
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

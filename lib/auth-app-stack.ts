import * as cdk from "aws-cdk-lib";
import { Aws } from "aws-cdk-lib";
import { Construct } from "constructs";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import * as apig from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as node from "aws-cdk-lib/aws-lambda-nodejs";
export class AuthAppStack extends cdk.Stack {
  public readonly userpool: UserPool;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.userpool = new UserPool(this, "mypool", {
      signInAliases: {
        username: true,
      },
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 6,
        requireDigits: true,
      },
      userPoolName: "appUserPool",
      selfSignUpEnabled: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const appClient = this.userpool.addClient("myClient", {
      authFlows: {
        userPassword: true,
      },
    });
  }
}

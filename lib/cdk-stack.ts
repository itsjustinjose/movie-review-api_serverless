import * as cdk from "aws-cdk-lib";
// import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import { generateBatch } from "../shared/utils";
import { movieReviews } from "../seed/movieReviews";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { sign } from "crypto";
import { AuthAppStack } from "./auth-app-stack";

interface Props {
  authStack: AuthAppStack;
}
export class LambdaCDKStack extends cdk.Stack {
  // public helloFn: NodejsFunction;

  constructor(scope: Construct, id: string, props: Props) {
    const userpool = props.authStack.userpool;
    super(scope, id);

    const getReviews = new NodejsFunction(this, "getReviews", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      entry: `${__dirname}/../lambdas/getMovieReviews.ts`,
    });

    const addReviews = new NodejsFunction(this, "addReviews", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      entry: `${__dirname}/../lambdas/addMovieReviews.ts`,
    });

    const updateRevies = new NodejsFunction(this, "updateReviews", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      entry: `${__dirname}/../lambdas/updateReviews.ts`,
    });

    const getTranslation = new NodejsFunction(this, "getTranslation", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      entry: `${__dirname}/../lambdas/translationReviews.ts`,
    });

    /// AUTH LAMBDAS

    const signup = new NodejsFunction(this, "signup", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      entry: `${__dirname}/../lambdas/auth/signup.ts`,
    });
    const confirm = new NodejsFunction(this, "confirm", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      entry: `${__dirname}/../lambdas/auth/confirm.ts`,
    });
    const login = new NodejsFunction(this, "login", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      entry: `${__dirname}/../lambdas/auth/login.ts`,
    });
    const logout = new NodejsFunction(this, "logout", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      entry: `${__dirname}/../lambdas/auth/logout.ts`,
    });


    //Dynamo DB Review Table
    const movieReviewTable = new Table(this, "reviewTable", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "movieId", type: AttributeType.NUMBER },
      sortKey: { name: "reviewId", type: AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "ReviewTable",
    });

    new AwsCustomResource(this, "MovieReviewDDBInitData", {
      onCreate: {
        service: "DynamoDB",
        action: "batchWriteItem",
        parameters: {
          RequestItems: {
            [movieReviewTable.tableName]: generateBatch(movieReviews),
          },
        },
        physicalResourceId: PhysicalResourceId.of("MovieReviewDDBInitData"),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [movieReviewTable.tableArn],
      }),
    });

    // API

    //Authorizer
    const cognito_auth = new CognitoUserPoolsAuthorizer(this, "authorizer", {
      authorizerName: "cognito_auth",
      cognitoUserPools: [userpool],
      identitySource: "method.request.header.Authorization",
    });

    const restAPI = new RestApi(this, "myrest", {
      deployOptions: {
        stageName: "dev",
      },
      description: "Reviews ednpoint",
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type", "X-Amz-Date"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
    });

    cognito_auth._attachToApi(restAPI);
    //API

    const movieResource = restAPI.root.addResource("movies");

    const movieIdmovieResource = movieResource.addResource("{movieId}");
    const reviewsmovieIdmovieResource =
      movieIdmovieResource.addResource("reviews");
    const reviewIdreviewsmovieIdmovieResource =
      reviewsmovieIdmovieResource.addResource("{reviewId}");
    const moviereviewResource = movieResource.addResource("reviews");
    const reviewidmoviereviewResource =
      moviereviewResource.addResource("{movieId}");

    reviewidmoviereviewResource.addMethod(
      "GET",
      new LambdaIntegration(getReviews)
    );
    moviereviewResource.addMethod("POST", new LambdaIntegration(addReviews), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: cognito_auth.authorizerId,
      },
    });

    reviewIdreviewsmovieIdmovieResource.addMethod(
      "PUT",
      new LambdaIntegration(updateRevies)
    );

    movieReviewTable.grantReadData(getReviews);
    movieReviewTable.grantReadWriteData(addReviews);
    movieReviewTable.grantReadWriteData(updateRevies);

    //Translation
    const reviewResource = restAPI.root.addResource("reviews");
    const reviewIdreviewsResource = reviewResource.addResource("{reviewId}");
    const movieIdreviewIdreviewsResource =
      reviewIdreviewsResource.addResource("{movieId}");
    const translationEndpoint =
      movieIdreviewIdreviewsResource.addResource("translation");

    translationEndpoint.addMethod("GET", new LambdaIntegration(getTranslation));

    getTranslation.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ["*"],
        actions: ["translate:TranslateText", "dynamodb:GetItem"],
      })
    );

    // AUTH API

    const authResource = restAPI.root.addResource("auth");
    const signupResource = authResource.addResource("signup");
    const confirmResource = authResource.addResource("confirm");
    const loginResource = authResource.addResource("login");
    const logoutResource = authResource.addResource("logout");
    signupResource.addMethod("POST", new LambdaIntegration(signup));
    confirmResource.addMethod("POST", new LambdaIntegration(confirm));
    loginResource.addMethod("POST", new LambdaIntegration(login));
    logoutResource.addMethod("POST", new LambdaIntegration(logout));
  }
}

//lambdastack

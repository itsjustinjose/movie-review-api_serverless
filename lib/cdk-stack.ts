import * as cdk from "aws-cdk-lib"
// import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "aws-cdk-lib/custom-resources";
import { generateBatch } from "../shared/utils";
import { movieReviews } from "../seed/movieReviews";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";


export class LambdaCDKStack extends cdk.Stack{
    public helloFn : NodejsFunction

    constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id)

        
        const getReviews = new NodejsFunction(this,"getReviews",{
          architecture : lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_22_X,
          timeout : cdk.Duration.seconds(10),
          memorySize: 128,
          entry : `${__dirname}/../lambdas/getMovieReviews.ts`
         })

         const addReviews = new NodejsFunction(this,"addReviews",{
          architecture : lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_22_X,
          timeout : cdk.Duration.seconds(10),
          memorySize: 128,
          entry : `${__dirname}/../lambdas/addMovieReviews.ts`
         })

         const getTranslation = new NodejsFunction(this,"getTranslation",{
          architecture : lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_22_X,
          timeout : cdk.Duration.seconds(10),
          memorySize: 128,
          entry : `${__dirname}/../lambdas/translationReviews.ts`
         })


      

    const movieReviewTable = new Table(this,"reviewTable",{
            billingMode: BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: "movieId", type: AttributeType.NUMBER },
            sortKey : {name : "reviewId" , type : AttributeType.NUMBER},
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            tableName: 'ReviewTable'
        });

        new AwsCustomResource(this, "MovieReviewDDBInitData", {
            onCreate: {
              service: "DynamoDB",
              action: "batchWriteItem",
              parameters: {
                RequestItems: {
                  [ movieReviewTable.tableName]: generateBatch(movieReviews),
                },
              },
              physicalResourceId: PhysicalResourceId.of("MovieReviewDDBInitData"),
            },
            policy: AwsCustomResourcePolicy.fromSdkCalls({
              resources: [movieReviewTable.tableArn],
            }),
          });


        // API 



        const restAPI = new RestApi(this, "myrest" ,{
          deployOptions : {
            stageName : "dev"
          },
          description : "Reviews ednpoint",
          defaultCorsPreflightOptions: {
            allowHeaders: ["Content-Type", "X-Amz-Date"],
            allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
            allowCredentials: true,
            allowOrigins: ["*"],
          },
        })
        
//API 

      const movieResource = restAPI.root.addResource("movies")
      const moviereviewResource = movieResource.addResource("reviews")
      const reviewidmoviereviewResource = moviereviewResource.addResource("{movieId}")

      reviewidmoviereviewResource.addMethod("GET", new LambdaIntegration(getReviews))
      moviereviewResource.addMethod("POST" , new LambdaIntegration(addReviews))

      movieReviewTable.grantReadData(getReviews)
      movieReviewTable.grantReadWriteData(addReviews)



      //Translation
      const reviewResource =  restAPI.root.addResource("reviews")
      const reviewIdreviewsResource = reviewResource.addResource("{reviewId}")
      const movieIdreviewIdreviewsResource = reviewIdreviewsResource.addResource("{movieId}")
      const translationEndpoint = movieIdreviewIdreviewsResource.addResource("translation")

    translationEndpoint.addMethod("GET", new LambdaIntegration(getTranslation))

      getTranslation.addToRolePolicy(new PolicyStatement({
        effect : Effect.ALLOW,
        resources: ["*"],
        actions:["translate:TranslateText", "dynamodb:GetItem"]
      }))
    
      


    }
}

//lambdastack
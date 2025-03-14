import * as cdk from "aws-cdk-lib"
// import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as lambda from 'aws-cdk-lib/aws-lambda';


export class LambdaCDKStack extends cdk.Stack{
    public helloFn : NodejsFunction

    constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id)

          const helloFn = new NodejsFunction(this, "hello",{
            architecture : lambda.Architecture.ARM_64,
            runtime : lambda.Runtime.NODEJS_LATEST,
            entry: `${__dirname}/../lambdas/hellolambda.ts`,
            memorySize: 128,
            timeout: cdk.Duration.seconds(10),
         });

         const helloFnURL = helloFn.addFunctionUrl({
          authType: lambda.FunctionUrlAuthType.NONE,
          cors: {
            allowedOrigins: ["*"],
          },
        });
    
        new cdk.CfnOutput(this, "Hello Function Url", { value: helloFnURL.url });

    }
}

//lambdastack
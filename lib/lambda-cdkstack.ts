import * as cdk from "aws-cdk-lib"
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";



export class LambdaCDKStack extends cdk.Stack{
    public helloFn : NodejsFunction

    constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id)

          const helloFn = new NodejsFunction(this, "hello",{
            architecture : Architecture.ARM_64,
            runtime : Runtime.NODEJS_LATEST,
            entry: `${__dirname}/../lambdas/hellolambda.ts`,
            memorySize: 128,
            timeout: cdk.Duration.seconds(10),
         })
    }

}

//lambdastack
#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaCDKStack } from '../lib/lambda-cdkstack';
import { DynamoDbStack } from '../lib/dynamodbstack';
// import { ApiStack } from '../lib/api-stack';
// import { AuthCDKStack } from '../lib/authcdkStack';


const app = new cdk.App();


  const lstack = new LambdaCDKStack(app, "lstack")
  const dynamoDbStack = new DynamoDbStack(app, "dyanmoDbStack")
  // const apistack = new ApiStack(app, "apistack", { lambdaStack : lstack})
    // const authstack = new AuthCDKStack(app, "authstack")
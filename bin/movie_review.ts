#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaCDKStack } from '../lib/lambda-cdkstack';
import { ApiStack } from '../lib/api-stack';
import { AuthCDKStack } from '../lib/authcdkStack';


const app = new cdk.App();

  const authstack = new AuthCDKStack(app, "authstack")
  const lstack = new LambdaCDKStack(app, "lstack")
  const apistack = new ApiStack(app, "apistack", { lambdaStack : lstack})
  
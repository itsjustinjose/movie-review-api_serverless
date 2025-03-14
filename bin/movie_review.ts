#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaCDKStack } from '../lib/cdk-stack';
// import { ApiStack } from '../lib/api-stack';
// import { AuthCDKStack } from '../lib/authcdkStack';


const app = new cdk.App();


const lstack = new LambdaCDKStack(app, "lstack")

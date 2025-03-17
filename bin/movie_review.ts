#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaCDKStack } from '../lib/cdk-stack';
import { AuthAppStack } from '../lib/auth-app-stack';


const app = new cdk.App();


const lstack = new LambdaCDKStack(app, "lstack")
new AuthAppStack(app, 'AuthAPIStack');

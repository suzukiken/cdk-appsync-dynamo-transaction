#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkappsyncDynamoTransactionStack } from '../lib/cdkappsync-dynamo-transaction-stack';

const app = new cdk.App();
new CdkappsyncDynamoTransactionStack(app, 'CdkappsyncDynamoTransactionStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

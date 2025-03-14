import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as custom from "aws-cdk-lib/custom-resources";
import { generateBatch } from '../shared/utils';
import { movieReviews } from '../seed/movieReviews';


export class DynamoDbStack extends cdk.Stack {

    public movieReviewTable : dynamodb.Table

    constructor( scope: Construct, id: string){
        super(scope, id)

        this.movieReviewTable = new dynamodb.Table(this,"reviewTable",{
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: "MovieId", type: dynamodb.AttributeType.NUMBER },
            sortKey : {name : "ReviewId" , type : dynamodb.AttributeType.NUMBER},
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            tableName: 'ReviewTable'
        });

        new custom.AwsCustomResource(this, "MovieReviewDDBInitData", {
            onCreate: {
              service: "DynamoDB",
              action: "batchWriteItem",
              parameters: {
                RequestItems: {
                  [this.movieReviewTable.tableName]: generateBatch(movieReviews),
                },
              },
              physicalResourceId: custom.PhysicalResourceId.of("MovieReviewDDBInitData"),
            },
            policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
              resources: [this.movieReviewTable.tableArn],
            }),
          });
    

    }
}
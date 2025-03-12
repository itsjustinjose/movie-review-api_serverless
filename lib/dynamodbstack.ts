import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';


export class DynamoDbStack extends cdk.Stack {

    public ReviewTable : dynamodb.Table

    constructor( scope: Construct, id: string){
        super(scope, id)

        this.ReviewTable = new dynamodb.Table(this,"reviewTable",{
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: "movieId", type: dynamodb.AttributeType.NUMBER },
            sortKey : {name : "reviewId" , type : dynamodb.AttributeType.NUMBER},
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        })
    

    }

}
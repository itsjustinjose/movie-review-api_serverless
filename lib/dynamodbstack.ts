import * as cdk from 'aws-cdk-lib'
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { LambdaCDKStack } from './lambda-cdkstack';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';


export class DynamoDbStack extends cdk.Stack {

    public ReviewTable : Table
    constructor( scope: Construct, id: string){
        super(scope, id)

        this.ReviewTable = new Table(this,"reviewTable",{
            billingMode: BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: "movieId", type: AttributeType.NUMBER },
            sortKey : {name : "reviewId" , type : AttributeType.NUMBER},
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        })
    

    }

}
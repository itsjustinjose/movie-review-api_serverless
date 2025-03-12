import * as cdk from "aws-cdk-lib"
import { AccountRecovery, UserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class AuthCDKStack extends cdk.Stack {
  public userpool: UserPool
    constructor( scope: Construct, id: string){
        super(scope,id)

        this.userpool = new UserPool(this, 'myuserpool', {
            autoVerify: {
                email : true
            },
            accountRecovery: AccountRecovery.EMAIL_ONLY,
            passwordPolicy:{
                minLength: 6,
                requireDigits: true,
                requireLowercase:true,
                requireUppercase: true
            },
            userPoolName: "mypool",
            removalPolicy: cdk.RemovalPolicy.RETAIN
        })

        const userClient = this.userpool.addClient("client",{
            authFlows:{
                userPassword: true,
                userSrp: true
            }
        })

        
    }
}
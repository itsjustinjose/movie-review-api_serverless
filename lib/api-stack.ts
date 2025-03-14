// import * as cdk from 'aws-cdk-lib'
// import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
// import { Construct } from 'constructs';
// import { LambdaCDKStack } from './lambda-cdkstack';

// interface apiStackProps {
//     lambdaStack : LambdaCDKStack,
    
// }

// export class ApiStack extends cdk.Stack {

//     constructor( scope: Construct, id: string, props: apiStackProps){
//         super(scope, id)

//         //Refer the lambdaFns 
//         const lambda = props.lambdaStack
//         const helloFn = lambda.helloFn
// //COnstruct an API GateWay Obect

//             const rest =  new RestApi(this, "rest", {
//                 deployOptions : {
//                     stageName : "dev"
//                 },
//                 description : "api",
//                 defaultCorsPreflightOptions: {
//                     allowHeaders: ["Content-Type", "X-Amz-Date"],
//                     allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
//                     allowCredentials: true,
//                     allowOrigins: ["*"],
//                   },
//             })

//             const helloEndpoint = rest.root.addResource("hello")
//             helloEndpoint.addMethod("GET", new LambdaIntegration(helloFn))

//             //movie/reviews/{movieID}
//             const movieEndpoint = rest.root.addResource("movie")
//             const reviews = movieEndpoint.addResource("reviews")
//              const movieIdendpoint =   reviews.addResource("{movieId}")
//              movieEndpoint.addMethod("GET")

         
    

//     }

// }
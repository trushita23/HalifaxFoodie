import {CognitoUserPool} from 'amazon-cognito-identity-js'

const halifaxFoodiePoolData = {
    UserPoolId:  "us-east-1_hRzR4gWLf",
    ClientId: "t4dfngkelfuqvr9vefclp1lee"
}

export default new CognitoUserPool(halifaxFoodiePoolData);
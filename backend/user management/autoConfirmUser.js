//code taken from official website
// https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html
// made the changes to always confirm the user irrespective of any domain

exports.handler = (event, context, callback) => {
    // Set the user pool autoConfirmUser flag to true always
    event.response.autoConfirmUser = true;

    // Return to Amazon Cognito
    callback(null, event);
};
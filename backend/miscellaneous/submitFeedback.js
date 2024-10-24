const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const crypto = require('crypto');

// reference: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
function getUUID() {
    return crypto.randomUUID();
}

exports.handler = async (event) => {

    const body = JSON.parse(event.body);

    const customerEmail = body.customerEmail;
    const restaurantEmail = body.restaurantEmail;
    const feedback = body.feedback;

    // reference: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-document-client.html
    const params = {
        TableName: 'userFeedback',
        Item: {
            id: getUUID(),
            customerEmail: customerEmail,
            restaurantEmail: restaurantEmail,
            feedback: feedback
        }
    };

    const results = await docClient.put(params).promise();
    if (results.error) {
        return {
            statusCode: 500,
            body: {
                result: false,
                message: "Error occurred: " + results.error
            }
        }
    }
    else {
        return {
            statusCode: 200,
            body: {
                result: true,
                message: "Feedback submitted successfully"
            }
        }
    }
};

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

    const label = event.queryStringParameters.label;

    var response;
    var restaurants = [];

    let parameters = {
        TableName: 'foodInfo',
    };


    const results = await docClient.scan(parameters).promise();
    if (results.error) {
        console.log("Error occurred: " + results.error);
    }
    else {
        results.Items.forEach(function (item) {
            if (item.label == label) {
                restaurants.push(item);
            }
        });
    }

    response = {
        statusCode: 200,
        body: {
            result: true,
            items: restaurants
        }
    };

    return response;
};

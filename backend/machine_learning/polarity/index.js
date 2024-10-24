const { GoogleSpreadsheet } = require('google-spreadsheet');
const clientSecret = require('./client_secret2.json');

const AWS = require('aws-sdk');
const comprehend = new AWS.Comprehend();

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

    // reference: https://stackoverflow.com/questions/33847477/querying-a-global-secondary-index-in-dynamodb-local
    const params = {
        TableName: 'userFeedback',
        IndexName: 'restaurantEmail-index',
        KeyConditionExpression: 'restaurantEmail = :restaurantEmail',
        ExpressionAttributeValues: {
            ':restaurantEmail': event.queryStringParameters.restaurantEmail
        }
    };

    const data = await dynamodb.query(params).promise();

    const feedback = data.Items;
    const result = []
    for (const f of feedback) {

        // reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Comprehend.html 
        // https://www.tabnine.com/code/javascript/classes/aws-sdk/Comprehend
        const params = {
            LanguageCode: 'en',
            Text: f.feedback
        };
        const sentiment = await comprehend.detectSentiment(params).promise();
        result.push({
            id: f.id,
            feedback: f.feedback,
            polarity: sentiment.Sentiment,
            customerEmail: f.customerEmail
        });

    }

    // reference: https://www.npmjs.com/package/google-spreadsheet
    //https://chrisboakes.com/building-a-rest-api-with-google-sheets-and-aws-lambda/

    const spreadSheetID = '12_mYMkUB3ZIpqejdNLOYc-BfYqpOqP3XYZ24zut9Rkw'
    const sheet = new GoogleSpreadsheet(spreadSheetID);

    await sheet.useServiceAccountAuth(clientSecret);
    await sheet.loadInfo();

    const currentSheet = sheet.sheetsByIndex[0];
    const rows = await currentSheet.getRows();

    const removeRows = async () => {
        for (const row of rows) {
            await row.delete();
        }
    }

    const addRows = async () => {
        for (const r of result) {
            await currentSheet.addRow(r);
        }
    }

    await removeRows();
    await addRows();

    const response = {
        statusCode: 200,
        body: result,
    };
    return response;
};

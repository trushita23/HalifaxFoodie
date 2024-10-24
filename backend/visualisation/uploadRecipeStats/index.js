const { GoogleSpreadsheet } = require('google-spreadsheet');
const clientSecret = require('./clientsecret.json');

const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

     // reference: https://stackoverflow.com/questions/33847477/querying-a-global-secondary-index-in-dynamodb-local
     const params = {
        TableName: 'recipeStats'
    };

    const data = await documentClient.scan(params).promise();
    const result = [];

    const sheetId = '1MK1LtLn3IsaxHxd0gW8YlJ18Q9IFg5T7B-elftN_MKI'
    const sheet = new GoogleSpreadsheet(sheetId);

    await sheet.useServiceAccountAuth(clientSecret);
    await sheet.loadInfo();

    // reference: https://www.npmjs.com/package/google-spreadsheet
    //https://chrisboakes.com/building-a-rest-api-with-google-sheets-and-aws-lambda/
    const currentSheet = sheet.sheetsByIndex[0];
    const rows = await currentSheet.getRows();
    let res;

    const removeRows = async (rowsList) => {
        for (const row of rowsList) {
            await row.delete();
        }
    }
    
    for(const i of data.Items)
    {
        result.push({
            Recipe:i.name,
            Orders:i.orderCount
        });
    }


    const addRows = async () => {
      await currentSheet.addRows(result);
    }

    await removeRows(rows);
    const updatedRows = await currentSheet.getRows();
    await removeRows(updatedRows);
    await addRows();

    const response = {
        statusCode: 200,
        body: result,
    };
    return response;
}

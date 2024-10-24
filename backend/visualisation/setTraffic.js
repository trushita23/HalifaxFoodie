const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event, context, callback) => {
  
  console.log(event); 
  
  let request = JSON.parse(event.body);
  let restEmail = request.email;
  let tableName = "restaurantInfo";
  
  
  const params = {
    TableName: tableName,
    Key: {
      email: restEmail
    },
    UpdateExpression: "set hits = hits + :one",
    ExpressionAttributeValues: {
        ":one": 1
    }
  };
      
  const result = await docClient.update(params).promise();
  console.log(result);
      
  const response = {
        statusCode: 200,
        body: true,
    };
  return response;
};

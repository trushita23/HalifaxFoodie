const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event, context, callback) => {
  
  console.log(event); 
  
  let request = JSON.parse(event.body);
  let recipeName = request.recipeName.toLowerCase();
  let tableName = "recipeStats";
  
  
  let params = { //preparing the parameter to be sent to doc client for retrieval of recipe doc
        TableName : tableName,
        Key: {
          name: recipeName
        }
  } 
      
  const data = await docClient.get(params).promise()
  console.log("Data---"+data);
      
  if(data.Item)// that means recipe is ordered before
  {
    console.log("RECIPE ALREDY PRESENT");
    params = {
      TableName: tableName,
      Key: {
        name: recipeName
      },
      UpdateExpression: "set orderCount = orderCount + :one",
      ExpressionAttributeValues: {
          ":one": 1
      }
    };
    const result = await docClient.update(params).promise();
  }
  else
  {
    console.log("RECIPE NOT PRESENT");
    params = { //preparing the parameter to be sent to doc client
        TableName : tableName,
        Item: {
          name: recipeName,
          orderCount: 1
        }
      };
      
    const result = await docClient.put(params).promise();
  }

      
  const response = {
        statusCode: 200,
        body: true,
    };
  return response;
};

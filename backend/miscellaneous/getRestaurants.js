const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  
    var response;
    var restaurants = [];

      let parameters = {
          TableName : 'restaurantInfo',
        };
        
        
      const results = await docClient.scan(parameters).promise();
      if(results.error)
      {
          console.log("Error occurred: "+results.error);
      }
      else
      {
          restaurants = results.Items;
      }
        
       response = {
            statusCode: 200,
            body: {
              result:true,
              items: restaurants
            }
        };
    
    return response;
};

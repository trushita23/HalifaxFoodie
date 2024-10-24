const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  
    var response;
    let request = JSON.parse(event.body);
    let email = request.email; 
  
      let parameters = { //preparing the parameter to be sent to 
        TableName : 'restaurantinfo',
        Key: {
          email: email
        }
      }
      
      const data = await docClient.get(parameters).promise()
      
      if(data.Item)
      {
        let dataItem = data.Item;
        response = {
            statusCode: 200,
            body: {
              result:true,    
              email:dataItem.email,
              name:dataItem.name,
              userType:dataItem.userType
            }
        };
      }
      else
      {
           response = {
            statusCode: 200,
            body: {
              result:false
            }
        };
      }
    
    return response;
};

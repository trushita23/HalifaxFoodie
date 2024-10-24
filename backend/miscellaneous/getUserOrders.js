const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  
    var response;
    let request = JSON.parse(event.body);
    let email = request.email; 
  
      let parameters = { //preparing the parameter to be sent to 
        TableName : 'users',
        Key: {
          email: email
        }
      }
      
      const data = await docClient.get(parameters).promise();
      const orders=[];
      
      if(data.Item)
      {
        let dataItem = data.Item;
        if(dataItem.orders)
        {
            for(var i = dataItem.orders.length-1; i >= 0; i--) {
                orders.push(dataItem.orders[i]);
            }
        }
        response = {
            statusCode: 200,
            body: {
              result:true,    
              orders:orders
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

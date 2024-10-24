const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event, context, callback) => {
  
  console.log(event);
  
  let request = JSON.parse(event.body);
  let userType = request.userType;
  let email = request.email;
  let phoneNumber = request.phoneNumber;
  let name = request.name;
  let tableName = "users";
  let response;
  
  
  let parameters = { //preparing the parameter to be sent to 
        TableName : tableName,
        Item: {
          email: email,
          phoneNumber: phoneNumber,
          name: name,
          userType: userType,
          orders:[]
        }
      };
      
  await docClient.put(parameters).promise()
    .then( async(data) => {
          if(userType === 'Restaurant'){
            const dClient = new AWS.DynamoDB.DocumentClient();
          let params = { //preparing the parameter to be sent to 
            TableName : "restaurantInfo",
            Item: {
              email: email,
              phoneNumber: phoneNumber,
              restName: name,
              hits:0
            }
          };
          await dClient.put(params).promise().then((d)=>{
              response = {
              statusCode: 200,
              body: {
                result:true
              }
              };
          })
          .catch((err) => {
              response = {
              statusCode: 400,
              body: {
                result:false
              }
            };
          })} 
    })
    .catch((err) => {
        response = {
        statusCode: 400,
        body: {
          result:false
        }
      };
    });
      
    return response;
};

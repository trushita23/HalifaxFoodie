const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event, context, callback) => {
  
  
  let request = JSON.parse(event.body);
  let email = request.email;
  let key = request.key;
  let plainText = request.plainText;
  let tableName = "columnarcipher";
  let response;
  
  
  let parameters = { //preparing the parameter to be sent to 
        TableName : tableName,
        Item: {
          email: email,
          key: key,
          plainText: plainText
        }
      };
      
  let cipherText = getCipherText(plainText, key);          
  await docClient.put(parameters).promise()
    .then((data) => {
      response = {
        statusCode: 200,
        body: {
          result:true,
          cipherText: cipherText
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
    });
      
    return response;
};


// below all functions and code for colunar cipher is taken from https://jsfiddle.net/MrPolywhirl/f5q85uzy/
//since columnar cipher algorithm will remain same
function normalize(value) {
    return value.toLowerCase().replace(/[^a-z]/g, "");
}

function getCipherText(plainText, key) {
    var plainText = normalize(plainText);
    var key = normalize(key);
    return Encrypt(plainText, key);
}

function Encrypt(plaintext, key) {
    var chars = "abcdefghijklmnopqrstuvwxyz";
    var klen = key.length;
    var pc = "x";
    while (plaintext.length % klen != 0) {
        plaintext += pc.charAt(0);
    }
    var colLength = plaintext.length / klen;
    var ciphertext = "";
    let k = 0;
    var t =0;
    for (let i = 0; i < klen; i++) {
        while (k < 26) {
            t = key.indexOf(chars.charAt(k));
            let arrkw = key.split("");
            arrkw[t] = "_";
            key = arrkw.join("");
            if (t >= 0) break;
            else k++;
        }
        for (let j = 0; j < colLength; j++) {
            ciphertext += plaintext.charAt(j * klen + t);
        }
    }
    return ciphertext;
}



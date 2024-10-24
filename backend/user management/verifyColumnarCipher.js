const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  
    var response;
    let request = JSON.parse(event.body);
    let email = request.email; 
    let cipherKey = request.cipherKey;
  
      let parameters = { //preparing the parameter to be sent to 
        TableName : 'columnarcipher',
        Key: {
          email: email
        }
      }
      
      const data = await docClient.get(parameters).promise()
      
      if(data.Item)
      {
        let dataItem = data.Item;
        console.log(getCipherText(dataItem.plainText,dataItem.key).toLowerCase() + " "+cipherKey.toLowerCase());
        if(getCipherText(dataItem.plainText,dataItem.key).toLowerCase() === cipherKey.toLowerCase())
        {
            response = 
            {
                statusCode: 200,
                body: 
                {
                    result:true
                }
            };
        }
        else
        {
            response = 
            {
                statusCode: 200,
                body: 
                {
                    result:false
                }
            };
        }
      }
      else
      {
           response = {
            statusCode: 404,
            body: {
              result:false
            }
        };
      }
    
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

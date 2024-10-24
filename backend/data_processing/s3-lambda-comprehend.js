// Reference: https://stackoverflow.com/a/63105373/8348987

const AWS = require("aws-sdk");
const S3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const Comprehend = new AWS.Comprehend();
const fetch = require("node-fetch");

exports.handler = async (event) => {
  const fileName = event.queryStringParameters.fileName;
  const params1 = {
    Bucket: "halifaxrecipe",
    Key: fileName.toString(),
  };
  const result = {};
  const response = await S3.getObject(params1).promise();
  let ingredients = [];
  let recipeTitle = [];

  // Read file content
  const fileContent = response.Body.toString('utf-8');
  let params = {
    LanguageCode: 'en',
    Text: fileContent.toString()
  }
  const entities = await detect_entities(params);
  const phrases = await detect_keyPhrases(params);
  ingredients = fetchIngredients(phrases.KeyPhrases);
  recipeTitle = fetchEntityTitle(entities?.Entities);
  let mlResult = await executeGCPML(ingredients); // calling machine learning module
  return insertInDynamoDB(ingredients, recipeTitle,mlResult?.label).then(res => {
    return {
      'statusCode': 200,
      'body': "success"
    }
  }).catch(err => {
    console.log("Error:", err);
    return {
      'statusCode': 200,
      'body': "Unable to insert in the database"
    }
  });

};
async function executeGCPML(ingred) {
  let result = {};
  const ing = ingred.join(" ");
  const payload = { text: ing }
  try {
    await fetch(
      "https://us-central1-serverless-fall.cloudfunctions.net/predictRecipe",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(res => res.json()).then(resLabel => result = resLabel);
    return result;
  } catch (error) {
    console.error(`Received error: ${error.message}`);
  }
}

function insertInDynamoDB(ingredients, recipeTitle, label) {
  const tableParams = {
    TableName: "foodInfo",
    Item: {
      id: Math.floor(Math.random() * 1000),
      title: recipeTitle,
      label: label,
      ingredients: ingredients,
    },
  };
  return dynamodb.put(tableParams).promise()
}

function fetchIngredients(keyPhrases) {
  let result = [];
  let flag = 1;
  let ingIndex = keyPhrases.findIndex(phrase => phrase.Text == "Ingredients") + 1;
  keyPhrases.forEach((phrase, index) => {
    if (phrase.Text.indexOf("Process") != -1) {
      flag = 0
    }
    if (flag && index > ingIndex)
      result.push(phrase.Text.replace('\\r\\n', ''))

  });
  return result;
}

function fetchEntityTitle(entities) {
  let title = "Recipe";
  entities.forEach(phrase => {
    if (phrase.Type === "TITLE") {
      title = phrase.Text.replace('\\r\\n', '')
    }
  });
  return title;
}

// detect entities from the text
function detect_entities(params) {
  return Comprehend.detectEntities(params).promise();
}

function detect_keyPhrases(params) {
  return Comprehend.detectKeyPhrases(params).promise();
}
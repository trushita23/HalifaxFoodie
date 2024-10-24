
const fetch = require('node-fetch');
exports.handler = async (event) => {

    const body = JSON.parse(event.body);
    const ingredients = body.ingredients;

    const response = await fetch('https://us-central1-serverless-fall.cloudfunctions.net/predictRecipe', {
        method: 'POST',
        body: JSON.stringify({ text: ingredients }),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const result = await response.json();
    console.log(result);

    return {
        statusCode: 200,
        body: result,
    };

}
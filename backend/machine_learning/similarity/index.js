const aiplatform = require('@google-cloud/aiplatform');

// reference: https://github.com/googleapis/nodejs-ai-platform/blob/main/samples/predict-text-classification.js
const predict = async (text) => {
    const { instance, prediction } = aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;

    const { PredictionServiceClient } = aiplatform.v1

    const clientOptions = {
        apiEndpoint: 'us-central1-aiplatform.googleapis.com'
    }

    const predictionClient = new PredictionServiceClient(clientOptions);

    const endpoint = 'projects/788599215361/locations/us-central1/endpoints/5125276695854579712';

    const predictionInstance = new instance.TextClassificationPredictionInstance({ content: text });

    const instanceValue = predictionInstance.toValue();

    const instances = [instanceValue];

    const request = {
        endpoint,
        instances,
    };

    const [response] = await predictionClient.predict(request);
    let predLabel = ''

    for (const predictionResultValue of response.predictions) {
        const predictionResult =
            prediction.ClassificationPredictionResult.fromValue(
                predictionResultValue
            );

        for (const [i, label] of predictionResult.displayNames.entries()) {
            if (predictionResult.confidences[i] > 0.6) {
                predLabel = label;
            }
        }
    }

    return predLabel;
}

module.exports.predict = async (req, res) => {

    // reference: https://stackoverflow.com/questions/35693758/google-cloud-functions-enable-cors
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST', 'GET', 'PUT');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');

    let text = req.body.text;
    let label = await predict(text);

    if (label || label != '') {
        res.status(200).json({
            label: label,
            text: text
        });
    } else {
        res.status(400).json({
            label: 'No label found',
            text: text
        });
    }
}
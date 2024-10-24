// Reference:- https://medium.com/@shashithd/upload-a-file-to-s3-using-lambda-from-reactjs-application-cba327c9b923

const AWS = require("aws-sdk");
const s3 = new AWS.S3({ signatureVersion: "v4" });
const bucketName = "halifaxrecipe";
const expirationInSeconds = 120;
exports.handler = async (event, context) => {
    const key = event.queryStringParameters.fileName;
    const params = {
        Bucket: bucketName,
        Key: key,
        ContentType: "multipart/form-data",
        Expires: expirationInSeconds
    };
    try {
        const preSignedURL = await s3.getSignedUrl("putObject", params);
        let returnObject = {
            statusCode: 200,
            body: JSON.stringify({
                fileUploadURL: preSignedURL
            })
        };
        return returnObject;
    } catch (e) {
        const response = {
            err: e.message,
            body: "error occured"
        };
        return response;
    }
};
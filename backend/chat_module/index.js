'use strict';

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
const { Logging } = require('@google-cloud/logging');

const logging = new Logging()

// reference: https://levelup.gitconnected.com/how-to-access-firebase-from-aws-lambda-f7f494dd435a
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports.createChatSession = async (event, context) => {
  // reference: https://medium.com/@granttimmerman/test-pub-sub-with-the-functions-framework-and-pub-sub-emulator-a2dc39196603
  console.log('createChatSession start');
  console.log(event);
  console.log(event.data);

  // base64 decode data
  const data = Buffer.from(event.data, 'base64').toString();
  const details = JSON.parse(data);

  const customerEmail = details.attributes.customerEmail;
  const customerName = details.attributes.customerName;
  const restaurantEmail = details.attributes.restaurantEmail;
  const restaurantName = details.attributes.restaurantName;
  const chatSessionID = details.attributes.chatSessionID;

  const docRef = db.collection('chat_sessions');

  const newChatSession = await docRef.doc(chatSessionID).set({
    customerEmail: customerEmail,
    restaurantEmail: restaurantEmail,
    restaurantName: restaurantName,
    customerName: customerName,
    timestamp: new Date().getTime(),
    isActive: true
  });
};

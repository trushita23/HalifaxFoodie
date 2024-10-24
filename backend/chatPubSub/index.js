'use strict';

const { PubSub } = require('@google-cloud/pubsub');

// reference: https://cloud.google.com/functions/docs/samples/functions-pubsub-publish#functions_pubsub_publish-nodejs
exports.endChatSession = async (req, res) => {
  // reference: https://stackoverflow.com/questions/35693758/google-cloud-functions-enable-cors
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST', 'GET', 'PUT');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Max-Age', '3600');


  const pubsub = new PubSub();

  const chatSessionId = req.query.chatSessionId;
  const customerEmail = req.query.customerEmail;

  const message = {
    chatSessionId: chatSessionId,
    customerEmail: customerEmail,
  }

  const topic = pubsub.topic('projects/serverless-fall/topics/communication_history');
  const data = await topic.publish(Buffer.from(JSON.stringify(message), 'utf8'));

  res.status(200).json({ ...message, status: 'success' });
};

const subId = 'projects/serverless-fall/subscriptions/communication_history-sub';

// reference: https://cloud.google.com/pubsub/docs/publish-receive-messages-client-library
exports.pullMessages = async (req, res) => {
  console.log('endChatSession start2');

  // reference: https://stackoverflow.com/questions/35693758/google-cloud-functions-enable-cors
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST', 'GET', 'PUT');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Max-Age', '3600');

  const customerEmail = req.body.customerEmail;

  const pubsub = new PubSub();
  const topic = pubsub.topic('projects/serverless-fall/topics/communication_history')
  const subscription = topic.subscription(subId);

  let data = [];

  const messageHandler = message => {
    if (message.attributes.customerEmail === customerEmail) {
      const messageAttrs = {
        chatSessionId: message.attributes.chatSessionId,
        customerEmail: message.attributes.customerEmail,
      }
      console.log("Message Attributes: ", messageAttrs);
      console.log("Message Data: ", message.data.toString());
      console.log("Message ID: ", message.id);
      console.log("Publish Time: ", message.publishTime);
      console.log("Ordering Key: ", message.orderingKey);
      console.log("Attrs: ", message.attributes);
      data.push(message.data.toString());
      message.ack();
    }
  };

  subscription.on('message', messageHandler);

  new Promise((resolve, reject) => {
    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${subId} listener removed.`);
      resolve(data);
    }, 5000);
  }).then((data) => {
    res.status(200).json(data);
  })
};


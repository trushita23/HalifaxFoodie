/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */


'use strict';

const Firestore = require('@google-cloud/firestore');

const PROJECTID = 'a2-csci5410-sdp';
const COLLECTION_NAME = 'questionAnswer';

const firestore = new Firestore({
  projectId: PROJECTID,
  timestampsInSnapshots: true
});

exports.main = (req, res) => {

  // Referred the tutorial: https://cloud.google.com/community/tutorials/cloud-functions-firestore

  //setting the access contol origin to be anywhere for any kind of call
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST','GET','PUT');
  res.set('Access-Control-Allow-Headers', 'Content-Type'); // UI calls it with this headwer
  res.set('Access-Control-Max-Age', '3600'); // setting for how the results of pre flight call can be cached

  console.log(res);
  if(req.method === 'POST')
  {
    
    let dataReceived = req.body;
    return firestore.collection(COLLECTION_NAME).doc(dataReceived.email).get().then(doc => {
      return res.status(200).send({result:true, email:doc.data().email, question: doc.data().question, answer: doc.data().answer});
    }).catch(err => {
      console.error(err);
      return res.status(404).send({
        result:false
      });
    });
  }
  
  let message = req.query.message || req.body.message || 'Hello Worlds!';
  res.status(200).send(message);
  
};

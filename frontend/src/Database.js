import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// this config code comes from Firebase after we add an app

const firebaseConfig = {
    apiKey: "AIzaSyAl-SzxymofFbsyoJfb0Dit_qmgSEEnS9o",
    authDomain: "serverless-fall.firebaseapp.com",
    projectId: "serverless-fall",
    storageBucket: "serverless-fall.appspot.com",
    messagingSenderId: "788599215361",
    appId: "1:788599215361:web:5c908e520e0730e7743700"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;

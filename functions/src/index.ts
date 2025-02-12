const functions = require("firebase-functions");
// const {logger} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/v2/https");
// const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");
// const {getFirestore} = require("firebase-admin/firestore");

const firebase_key = process.env.FIREBASE_API_KEY;

initializeApp();

export const uploadImage = functions.https.onCall((request: any, response: any) => {
    
    return;
});

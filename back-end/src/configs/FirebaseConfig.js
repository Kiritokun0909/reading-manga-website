// firebaseConfig.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://storage-manga-cloud.appspot.com", // Update with your bucket name
});

const bucket = admin.storage().bucket();
module.exports = { bucket }; // Export the bucket;

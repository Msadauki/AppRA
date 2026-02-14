// firebase/firebaseConfig.js
const admin = require('firebase-admin');
require('dotenv').config();

let firebaseEnabled = false;

try {
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined
    });

    firebaseEnabled = true;
    console.log("🔥 Firebase enabled");
  } else {
    console.log("⚠ Firebase keys missing — Premium disabled");
  }
} catch (error) {
  console.log("❌ Firebase failed to initialize — Premium disabled");
}

module.exports = {
  admin,
  firebaseEnabled
};

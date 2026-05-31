const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FB_SERVICE_ACCOUNT_BASE64) {
  const decryptedJson = Buffer.from(process.env.FB_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8");
  serviceAccount = JSON.parse(decryptedJson);
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.info("[INFO] Firebase Admin sukses diinisialisasi via Full JSON Base64");
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FB_PROJECT_ID,
        clientEmail: process.env.FB_CLIENT_EMAIL,
        privateKey: process.env.FB_PRIVATE_KEY ? process.env.FB_PRIVATE_KEY.replace(/\\n/g, "\n") : undefined,
      }),
    });
  }
}

const auth = admin.auth();
const db = admin.firestore();

module.exports = { auth, db, admin };
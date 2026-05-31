const admin = require("firebase-admin");

const privateKey = process.env.FB_PRIVATE_KEY
  ? process.env.FB_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
  console.info("[INFO] Firebase Admin sukses diinisialisasi");
}

const auth = admin.auth();
const db = admin.firestore();

module.exports = { auth, db, admin };

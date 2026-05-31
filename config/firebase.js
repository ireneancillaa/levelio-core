const admin = require("firebase-admin");

const privateKey = process.env.FB_PRIVATE_KEY
  ? Buffer.from(process.env.FB_PRIVATE_KEY, "base64").toString("utf8")
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
  console.info("[INFO] Firebase Admin sukses diinisialisasi via Base64");
}

const auth = admin.auth();
const db = admin.firestore();

module.exports = { auth, db, admin };
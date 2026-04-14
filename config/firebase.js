// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDu7RGCk-k4LOgPARrlQB2SnQ8xLqtEsJk",
  authDomain: "levelio-5d169.firebaseapp.com",
  projectId: "levelio-5d169",
  storageBucket: "levelio-5d169.firebasestorage.app",
  messagingSenderId: "542161805570",
  appId: "1:542161805570:web:c25493cd04e58a1128a21b",
  measurementId: "G-3RSGXPTCSX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
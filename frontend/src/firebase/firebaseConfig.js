import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace these placeholders with your actual Firebase Web config!
// Your teammate didn't commit this file (which is standard practice to hide secrets),
// so you need to add the keys from your Firebase Console.
// Go to Firebase Console -> nirmana-46 -> Project Settings -> Web App

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "nirmana-46",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

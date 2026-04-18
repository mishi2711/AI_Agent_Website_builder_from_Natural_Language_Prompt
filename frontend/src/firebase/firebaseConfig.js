import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace these placeholders with your actual Firebase Web config!
// Your teammate didn't commit this file (which is standard practice to hide secrets),
// so you need to add the keys from your Firebase Console.
// Go to Firebase Console -> nirmana-46 -> Project Settings -> Web App

const firebaseConfig = {
  apiKey: "AIzaSyBKDP_aW0PgX4UmAwvEnrqdYse8wTN0G8s",
  authDomain: "nirmana-46.firebaseapp.com",
  projectId: "nirmana-46",
  storageBucket: "nirmana-46.firebasestorage.app",
  messagingSenderId: "36642397309",
  appId: "1:36642397309:web:e5a862538035e4862f6514"
};

// Initialize Firebase only if keys are present
let app;
let authInstance = null;

try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        app = initializeApp(firebaseConfig);
        authInstance = getAuth(app);
    } else {
        console.warn("⚠️ Firebase config is missing. The frontend will load, but Authentication will not run until you add your keys.");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}

export const auth = authInstance;


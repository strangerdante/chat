// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1lCcX2FXJd1sUh7_VSPj3nkgA8fu52Fw",
  authDomain: "chat-cb133.firebaseapp.com",
  projectId: "chat-cb133",
  storageBucket: "chat-cb133.firebasestorage.app",
  messagingSenderId: "847615441891",
  appId: "1:847615441891:web:1f6771a21f5a07a0d9bed6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
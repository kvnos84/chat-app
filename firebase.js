// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTkVZ28lVRQM3T3e-7-bEpzSG77TlHUdc",
  authDomain: "chatapp-83b67.firebaseapp.com",
  projectId: "chatapp-83b67",
  storageBucket: "chatapp-83b67.appspot.com",
  messagingSenderId: "5479632334",
  appId: "1:5479632334:web:6be2bef6764919a92f1a9f",
  measurementId: "G-3ZER65DRLP" // optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth instances
export const db = getFirestore(app);
export const auth = getAuth(app);

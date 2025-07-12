// firebase.js

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // ✅ Correct for firebase@10.3.1

const firebaseConfig = {
  apiKey: "AIzaSyDTkVZ281VRQM3T3e-7-bEpzSG77iTHUdc",
  authDomain: "chatapp-83b67.firebaseapp.com",
  projectId: "chatapp-83b67",
  storageBucket: "chatapp-83b67.appspot.com", // ✅ fixed from ".app"
  messagingSenderId: "5479632334",
  appId: "1:5479632334:web:6be2bef6764919a92faf9f",
  measurementId: "G-3ZERC5DRLP"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
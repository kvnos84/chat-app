import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDTkVZ28lVRQM3T3e-7-bEpzSG77TlHUdc",
  authDomain: "chatapp-83b67.firebaseapp.com",
  projectId: "chatapp-83b67",
  storageBucket: "chatapp-83b67.appspot.com",
  messagingSenderId: "5479632334",
  appId: "1:5479632334:web:6be2bef6764919a92f1a9f",
  measurementId: "G-3ZER65DRLP"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Persistent Auth using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Firestore
const db = getFirestore(app);

// ✅ Export instances
export { db, auth };
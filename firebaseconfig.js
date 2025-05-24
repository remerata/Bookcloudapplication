// firebaseConfig.js

import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth"; // only this, no getAuth
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB1qPTGmpomNMDnOFF-YlgKReKcHbvdYQw",
  authDomain: "bookcloud-708e6.firebaseapp.com",
  projectId: "bookcloud-708e6",
  storageBucket: "bookcloud-708e6.appspot.com",
  messagingSenderId: "36926763330",
  appId: "1:36926763330:web:2d3521da2375ccaa2b18db",
  measurementId: "G-DN4C8MJ4EK"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

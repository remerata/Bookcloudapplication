// firebaseConfig.js

// 1️⃣ Core Firebase SDK
import { initializeApp } from "firebase/app";

// 2️⃣ Firebase services you need
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage }          from "firebase/storage";

// 3️⃣ Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1qPTGmpomNMDnOFF-YlgKReKcHbvdYQw",
  authDomain: "bookcloud-708e6.firebaseapp.com",
  projectId: "bookcloud-708e6",
  storageBucket: "bookcloud-708e6.appspot.com",   // ← fixed to .appspot.com
  messagingSenderId: "36926763330",
  appId: "1:36926763330:web:2d3521da2375ccaa2b18db",
  measurementId: "G-DN4C8MJ4EK"
};

// 4️⃣ Initialize Firebase
const app     = initializeApp(firebaseConfig);
const db      = getFirestore(app);
const storage = getStorage(app);
const auth    = getAuth(app);

export { app, db, storage, auth };

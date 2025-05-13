// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1qPTGmpomNMDnOFF-YlgKReKcHbvdYQw",
  authDomain: "bookcloud-708e6.firebaseapp.com",
  projectId: "bookcloud-708e6",
  storageBucket: "bookcloud-708e6.firebasestorage.app",
  messagingSenderId: "36926763330",
  appId: "1:36926763330:web:2d3521da2375ccaa2b18db",
  measurementId: "G-DN4C8MJ4EK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeqjfUYZ6znUOf_qHxS0pbnUWI8_pse4A",
  authDomain: "votacionesceu.firebaseapp.com",
  projectId: "votacionesceu",
  storageBucket: "votacionesceu.firebasestorage.app",
  messagingSenderId: "366626138406",
  appId: "1:366626138406:web:a55a5d1bf17d2a1da5b9e7",
  measurementId: "G-F9Y18EVCXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
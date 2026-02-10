import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeqjfUYZ6znUOf_qHxS0pbnUWI8_pse4A",
  authDomain: "votacionesceu.firebaseapp.com",
  projectId: "votacionesceu",
  storageBucket: "votacionesceu.firebasestorage.app",
  messagingSenderId: "366626138406",
  appId: "1:366626138406:web:a55a5d1bf17d2a1da5b9e7",
  measurementId: "G-F9Y18EVCXL"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);

// Inicializa Firestore
export const db = getFirestore(app);
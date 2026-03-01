import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your config here
const firebaseConfig = {
  apiKey: "AIzaSyDLDEkpZj3J6f_RSynprngSFuZZEii0HHo",
  authDomain: "carbomine-31d46.firebaseapp.com",
  projectId: "carbomine-31d46",
  storageBucket: "carbomine-31d46.firebasestorage.app",
  messagingSenderId: "944970145694",
  appId: "1:944970145694:web:0e6a3a9f60882ddc02c08f",
  measurementId: "G-XKHH90DXJ6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

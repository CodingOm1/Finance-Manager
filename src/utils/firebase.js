import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCQDoiDpyT40meWuIN9QuajuHMmeoGJobo",
  authDomain: "personal-finance-tracker-bea23.firebaseapp.com",
  projectId: "personal-finance-tracker-bea23",
  storageBucket: "personal-finance-tracker-bea23.appspot.com",
  messagingSenderId: "1082756707442",
  appId: "1:1082756707442:web:cc0083ff3789a7c4b33eeb",
  measurementId: "G-B1L4MC36CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Web app's Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyAWsj2R5NRuz4ptrtKlCbTlJXBVo-qdgus",
  authDomain: "smart-assignment-1b6b6.firebaseapp.com",
  projectId: "smart-assignment-1b6b6",
  storageBucket: "smart-assignment-1b6b6.firebasestorage.app",
  messagingSenderId: "14225352019",
  appId: "1:14225352019:web:4a15d906cb882d9a08eda6",
  measurementId: "G-80P4JTH0CQ"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

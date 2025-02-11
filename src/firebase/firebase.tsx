import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";



const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: "portfolio-8f239.firebaseapp.com",
  projectId: "portfolio-8f239",
  storageBucket: "portfolio-8f239.firebasestorage.app",
  messagingSenderId: "131312560188",
  appId: "1:131312560188:web:488e81cd2649951d163b39",
  measurementId: "G-21DDRLJ91Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
  
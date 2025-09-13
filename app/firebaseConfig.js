// app/firebaseConfig.js
import { getApps, getApp, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDnKK_wIT0z1kIpNsJQsNyarxyLXHRN5qs",
  authDomain: "healthbe-85a56.firebaseapp.com",
  projectId: "healthbe-85a56",
  storageBucket: "healthbe-85a56.appspot.com",
  messagingSenderId: "977288697284",
  appId: "1:977288697284:web:0388a2030b561eac4e8091",
};

// Always reuse the existing app if present
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage ONCE, otherwise fall back to the existing instance
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // If it's already initialized elsewhere, just get the existing instance
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };

// src/config/firebase.ts
// Loads Firebase config from environment variables and initializes Firebase app
// For Vite, use VITE_ prefix for env vars in frontend

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

function checkConfig(config: Record<string, any>) {
  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      console.warn(`[firebase] Missing config for: ${key}`);
    }
  }
}

checkConfig(firebaseConfig);

let app, analytics;
try {
  app = initializeApp(firebaseConfig);
  // Analytics only works in browser and if supported
  if (typeof window !== "undefined" && analyticsSupported) {
    analytics = getAnalytics(app);
  }
} catch (err) {
  console.error("[firebase] Failed to initialize Firebase:", err);
}

const auth = app ? getAuth(app) : undefined;
const db = app ? getFirestore(app) : undefined;

export { app, analytics, auth, db };

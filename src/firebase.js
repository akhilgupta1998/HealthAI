// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getPerformance, trace } from "firebase/performance";

// Your web app's Firebase configuration directly from your info
const firebaseConfig = {
  apiKey: "AIzaSyD2eNJqaaDDybw715c78MwhoAryB9dY-uo",
  authDomain: "healthappfirebase-ea195.firebaseapp.com",
  databaseURL: "https://healthappfirebase-ea195-default-rtdb.firebaseio.com",
  projectId: "healthappfirebase-ea195",
  storageBucket: "healthappfirebase-ea195.firebasestorage.app",
  messagingSenderId: "117036060494",
  appId: "1:117036060494:web:9eee2d68fb1ddabcc2581f",
  measurementId: "G-B9ZM7XVLH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Google Auth Provider with additional scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with offline persistence
const db = getFirestore(app);
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
}

// Initialize Storage with custom settings
const storage = getStorage(app);
storage.maxUploadRetryTime = 60000; // 1 minute
storage.maxOperationRetryTime = 60000; // 1 minute

// Initialize Realtime Database with custom settings
const rtdb = getDatabase(app);
rtdb.goOnline(); // Ensure database is online

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes ? getAnalytics(app) : null).then(analyticsInstance => {
    analytics = analyticsInstance;
  });
}

// Initialize Performance Monitoring
let performance = null;
if (typeof window !== 'undefined') {
  try {
    performance = getPerformance(app);
  } catch (err) {
    console.warn('Performance monitoring not supported:', err);
  }
}

// Export initialized services
export { 
  app, 
  auth, 
  db, 
  storage, 
  rtdb, 
  googleProvider, 
  analytics,
  performance,
  trace
}; 
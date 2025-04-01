
// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD6ndXxaHYR3JQblrDr-Y4MgZfBWXvAnDw",
  authDomain: "healthscan-4eca9.firebaseapp.com",
  projectId: "healthscan-4eca9",
  storageBucket: "healthscan-4eca9.appspot.com",
  messagingSenderId: "408763015248",
  appId: "1:408763015248:web:d6a8ef2d45fb4a99ac7155",
  measurementId: "G-1578NTEDD7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app; // This correctly exports app as default

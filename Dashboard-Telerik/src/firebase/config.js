import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Recommendation: Move config to Vite env vars (VITE_FIREBASE_*) for easier env switching.
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBdgNgD7xGolYib9KJBnyTyUaQR2ox2rqg",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "telerik-final-a51ee.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "telerik-final-a51ee",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "telerik-final-a51ee.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "713151190832",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

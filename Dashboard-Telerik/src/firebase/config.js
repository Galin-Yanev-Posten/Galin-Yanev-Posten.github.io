import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdgNgD7xGolYib9KJBnyTyUaQR2ox2rqg",
  authDomain: "telerik-final-a51ee.firebaseapp.com",
  projectId: "telerik-final-a51ee",
  storageBucket: "telerik-final-a51ee.appspot.com",
  messagingSenderId: "713151190832",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6eWeWAkC0VsdwvI_O02Mx66bYp-303NQ",
  authDomain: "food-app-react-firebase-6847f.firebaseapp.com",
  projectId: "food-app-react-firebase-6847f",
  storageBucket: "food-app-react-firebase-6847f.appspot.com",
  messagingSenderId: "703478588331",
  appId: "1:703478588331:web:f4f57e4901b9c0699368ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
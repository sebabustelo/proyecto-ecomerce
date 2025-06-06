import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7b8_4JIR_ormXgBCniwP6FlURCDKNTdg",
  authDomain: "petplace-dv69c.firebaseapp.com", // <-- sin https://
  projectId: "petplace-dv69c",
  storageBucket: "petplace-dv69c.appspot.com", // <-- usa el nombre de tu proyecto
  messagingSenderId: "1234567890",
  appId: "1:285580531726:web:370768542fe02481de045f",
  // measurementId: "G-XXXXXXXXXX" // opcional
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
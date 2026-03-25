import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY_FACEBOOK,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN_FACEBOOK,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID_FACEBOOK,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET_FACEBOOK,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID_FACEBOOK,
  appId: process.env.NEXT_PUBLIC_APP_ID_FACEBOOK,
  measurementId:process.env.NEXT_PUBLIC_MEASUREMENT_ID_FACEBOOK
};
// Initialize Firebase
const app = initializeApp(firebaseConfig, 'SECONDARY_APP');
const authfb = getAuth(app);
const providerfb = new GoogleAuthProvider();
providerfb.setCustomParameters({
    prompt: "select_account",
  });
export {authfb,providerfb};


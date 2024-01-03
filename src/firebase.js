// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDYsOMsSLjtHazJeCXgCRxMUDZhXT1Mg4",
  authDomain: "link-sharing-app-6c7a5.firebaseapp.com",
  projectId: "link-sharing-app-6c7a5",
  storageBucket: "link-sharing-app-6c7a5.appspot.com",
  messagingSenderId: "316832540462",
  appId: "1:316832540462:web:66ac6736c4c0378722bcbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const database = getFirestore(app)

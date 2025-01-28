// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjOx7Ad5LahwDxYtD40cQP2xrWwOcW0XU",
  authDomain: "aca-group-project.firebaseapp.com",
  projectId: "aca-group-project",
  storageBucket: "aca-group-project.firebasestorage.app",
  messagingSenderId: "604679262435",
  appId: "1:604679262435:web:1c3869ed3c6294b22ef5d6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

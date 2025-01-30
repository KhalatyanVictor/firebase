import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjOx7Ad5LahwDxYtD40cQP2xrWwOcW0XU",
  authDomain: "aca-group-project.firebaseapp.com",
  projectId: "aca-group-project",
  storageBucket: "aca-group-project.firebasestorage.app",
  messagingSenderId: "604679262435",
  appId: "1:604679262435:web:1c3869ed3c6294b22ef5d6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export const db = getFirestore(app);



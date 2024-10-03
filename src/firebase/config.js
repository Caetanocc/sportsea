import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

    apiKey: "AIzaSyCaB0vLOOvCjMim9Z-UfK4W2ryvD-15tH4",
    authDomain: "etec24-3dc8c.firebaseapp.com",
    databaseURL: "https://etec24-3dc8c-default-rtdb.firebaseio.com",
    projectId: "etec24-3dc8c",
    storageBucket: "etec24-3dc8c.appspot.com",
    messagingSenderId: "452717358267",
    appId: "1:452717358267:web:76df1c741b160aec118d9e"

    
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNMEWhg48LuuHqyQZ7MOqLKkXO--wBN-A",
    authDomain: "samhita-fusion.firebaseapp.com",
    databaseURL: "https://samhita-fusion-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "samhita-fusion",
    storageBucket: "samhita-fusion.firebasestorage.app",
    messagingSenderId: "281719027712",
    appId: "1:281719027712:web:d5cf9e10f5295c9b4240e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnRkJRh3YDCMGAQgxBWJ7cvFuMmVfGKQM",
  authDomain: "flowing-maxim-390514.firebaseapp.com",
  databaseURL:
    "https://flowing-maxim-390514-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "flowing-maxim-390514",
  storageBucket: "flowing-maxim-390514.appspot.com",
  messagingSenderId: "297432633173",
  appId: "1:297432633173:web:313a5c72495f840d54a9dc",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage();
const provider = new GoogleAuthProvider();

export { auth, provider, db, storage, firebaseConfig };

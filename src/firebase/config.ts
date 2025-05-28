import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuNk0Er13WVpmZS_3vZ57gXNSOgfABbb0",
  authDomain: "spisochki.firebaseapp.com",
  databaseURL: "https://spisochki-default-rtdb.firebaseio.com",
  projectId: "spisochki",
  storageBucket: "spisochki.firebasestorage.app",
  messagingSenderId: "6374737507",
  appId: "1:6374737507:web:f8b242a68279303328da56",
  measurementId: "G-HMMC4D8QGL"
};

console.log('Initializing Firebase with config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized');

const db = getFirestore(app, "spisochki");
console.log('Firestore initialized', "default");

const auth = getAuth(app);
console.log('Auth initialized');

// Initialize anonymous auth
signInAnonymously(auth)
  .then((userCredential) => {
    console.log('Anonymous auth successful:', userCredential.user.uid);
    return db;
  })
  .catch((error) => {
    console.error('Error signing in anonymously:', error);
    throw error;
  });

export { app, db, auth }; 
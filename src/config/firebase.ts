import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAsqpmUjs2gaEybRZa5vhTJ4xNXrGMtwUY",
  authDomain: "tree-6b50f.firebaseapp.com",
  projectId: "tree-6b50f",
  storageBucket: "tree-6b50f.firebasestorage.app",
  messagingSenderId: "671068458518",
  appId: "1:671068458518:web:88ee56b2c7d6a250c12f37",
  measurementId: "G-M35D7X347T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app); 
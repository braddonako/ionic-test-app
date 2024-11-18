import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAm_ksOAyYW6-3rDa31lz83VuT8KVgdkv4",
  authDomain: "ionic-test-app-79b76.firebaseapp.com",
  projectId: "ionic-test-app-79b76",
  storageBucket: "ionic-test-app-79b76.firebasestorage.app",
  messagingSenderId: "304721940403",
  appId: "1:304721940403:web:cfcb05e2b8e61042b805c6",
  measurementId: "G-7JMKXGQBV6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
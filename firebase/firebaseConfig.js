// firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-rUMTaN50fBptKd1bn-qMCWSvD6mAu-4",
  authDomain: "vipcuts-9e78e.firebaseapp.com",
  projectId: "vipcuts-9e78e",
  storageBucket: "vipcuts-9e78e.appspot.com",
  messagingSenderId: "34380556848",
  appId: "1:34380556848:web:d8c112e495303eb9699bf5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

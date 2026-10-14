import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCkSuwYtCXH8oqsGSlqfIWbEygFQBbTWp8',
  authDomain: 'parcial2-af653.firebaseapp.com',
  projectId: 'parcial2-af653',
  storageBucket: 'parcial2-af653.firebasestorage.app',
  messagingSenderId: '791401778247',
  appId: '1:791401778247:web:4bcfe634299095df673562'
};

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
export const firestoreDb = getFirestore(firebaseApp);
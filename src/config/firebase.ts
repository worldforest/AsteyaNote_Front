import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 키가 설정되지 않았을 때를 위한 안전장치
const isConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key_here';

const app = isConfigured ? initializeApp(firebaseConfig) : null;
export const db = isConfigured && app ? getFirestore(app) : null;

if (!isConfigured) {
    console.warn('Firebase config is missing. Check your .env file.');
}

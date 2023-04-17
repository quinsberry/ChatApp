import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: process.env.DB_API_KEY,
    authDomain: process.env.DB_AUTH_DOMAIN,
    projectId: process.env.DB_PROJECT_ID,
    storageBucket: process.env.DB_STORAGE_BUCKET,
    messagingSenderId: process.env.DB_MESSAGING_SENDER_ID,
    appId: process.env.DB_APP_ID,
    measurementId: process.env.DB_MEASUREMENT_ID,
    databaseURL: process.env.DB_DATABASE_ID,
};

const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const db = getDatabase(app);

export const firebaseConfig = { apiKey: import.meta.env.VITE_FIREBASE_API_KEY, projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, appId: import.meta.env.VITE_FIREBASE_APP_ID, messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID };
export const pushConfigured = Object.values(firebaseConfig).every(Boolean) && Boolean(import.meta.env.VITE_FIREBASE_VAPID_KEY);

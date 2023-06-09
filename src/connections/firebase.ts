import CONFIG from '../config/env'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: CONFIG.FIREBASE_API_KEY,
  authDomain: CONFIG.FIREBASE_AUTH_DOMAIN,
  projectId: CONFIG.FIREBASE_PROJECT_ID,
  storageBucket: CONFIG.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: CONFIG.FIREBASE_MESSAGING_SENDER_ID,
  appId: CONFIG.FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth()
export const firestore = getFirestore(app)

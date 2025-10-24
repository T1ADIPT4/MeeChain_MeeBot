import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBhprcnCRZVHE3df9wvK9VkQdSUwiGw11E",
  authDomain: "meechainmeebot-v1-218162-261fc.firebaseapp.com",
  databaseURL: "https://meechainmeebot-v1-218162-261fc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "meechainmeebot-v1-218162-261fc",
  storageBucket: "meechainmeebot-v1-218162-261fc.firebasestorage.app",
  messagingSenderId: "412472571465",
  appId: "1:412472571465:web:bbdc5c179e131b111ff198",
  measurementId: "G-CZEY486FED"
}

const app = initializeApp(firebaseConfig)

export const db = getDatabase(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

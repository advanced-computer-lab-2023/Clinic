// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

import { getStorage } from 'firebase/storage' // <-- Import the required storage method

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBwlUiRYQuJq-PmhpeEJcqxXTERgOJl_Zk',
  authDomain: 'copilot-clinic.firebaseapp.com',
  projectId: 'copilot-clinic',
  storageBucket: 'copilot-clinic.appspot.com',
  messagingSenderId: '189542708109',
  appId: '1:189542708109:web:38d1da3fe2c163ca55c3c4',
  measurementId: 'G-3BN3438ES4',
}

// Initialize Firebase
const FireBase = initializeApp(firebaseConfig)

const analytics = getAnalytics(FireBase)
export default FireBase

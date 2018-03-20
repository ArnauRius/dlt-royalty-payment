/* Handles the configuration and manages everything related to Firebase */

import firebase from 'firebase'
import 'firebase/firestore'

// Firebase Configuration
const config = {
  apiKey: "AIzaSyDf19kF5Mmuip0ffS0HzUpK6QzdFpYUel0",
  authDomain: "dlt-royalty-payment.firebaseapp.com",
  databaseURL: "https://dlt-royalty-payment.firebaseio.com",
  projectId: "dlt-royalty-payment",
  storageBucket: "dlt-royalty-payment.appspot.com",
  messagingSenderId: "624288298174"
}

// Initializes a new Firebase app instance
firebase.initializeApp(config)

// Initializes Firestore
const firestore = firebase.firestore()

export {
  firestore
}

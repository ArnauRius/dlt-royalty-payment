/* In this module are defined the necessary functions to be able to connect with the Firebase Firestore database */

// Firebase import
import {firestore} from '../managers/firebase-manager'

const db = firestore

const getDocRef = (collection, docId) => firestore.collection(collection).doc(docId)

const addDoc = (collection, docId, docData) => getDocRef(collection, docId).set(docData)

const updateDoc = (collection, docId, docData) => getDocRef(collection, docId).update(docData)

const getDoc = (collection, docId) => getDocRef(collection, docId).get()

export default {
  db,
  getDocRef,
  addDoc,
  updateDoc,
  getDoc
}

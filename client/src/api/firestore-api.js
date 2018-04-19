/* In this module are defined the necessary functions to be able to connect with the Firebase Firestore database */

// Firebase import
import {firestore} from '../managers/firebase-manager'

const db = firestore

//TODO: Comment all this below
const getDocRef = (collection, docId) => firestore.collection(collection).doc(docId)

const addDoc = (collection, docData) => firestore.collection(collection).add(docData)

const updateDoc = (collection, docId, docData) => getDocRef(collection, docId).update(docData)

const getDoc = (collection, docId) => getDocRef(collection, docId).get()

export default {
  db,
  getDocRef,
  addDoc,
  updateDoc,
  getDoc
}

/* In this module are defined the necessary functions to be able to connect with the Firebase Firestore database */

// Firebase import
import {firestore} from './firebase-manager'

/**
 * Firebase Firestore instance used as off-chain database
 */
const db = firestore

/**
 * Given an specific collection a document id, it returns the reference instance used by Firestore for this document
 * @param collection - The collection that the document belongs to
 * @param docId - The document id
 * @returns {firebase.firestore.DocumentReference} - The Reference instance used by Firestore
 */
const getDocRef = (collection, docId) => firestore.collection(collection).doc(docId)

/**
 * Adds a new document to the Firestore database
 * @param collection - The collection in which the document will belong to
 * @param docData - The data that the document will contain
 * @returns {Promise<firebase.firestore.DocumentReference>} - Callbacks to manage the success or failure of adding it
 */
const addDoc = (collection, docData) => firestore.collection(collection).add(docData)

/**
 * Updates an already existing document in the Firestore database
 * @param collection - The collection in which the document belongs to
 * @param docId - The document id corresponding to the document to modify
 * @param docData - The new data to overwrite the existing one in the database
 * @returns {Promise<void>} - Callbacks to manage the success or failure of updating it
 */
const updateDoc = (collection, docId, docData) => getDocRef(collection, docId).update(docData)

/**
 * Given an specific collection and a document id, it returns the document data stored in the Firestore database
 * @param collection - The collection in which the document belongs to
 * @param docId - The document id corresponding to the document to get the data from
 * @returns {Promise<firebase.firestore.DocumentSnapshot>} - Callbacks to manage the success or failure of getting it
 */
const getDoc = (collection, docId) => getDocRef(collection, docId).get()

export default {
  db,
  getDocRef,
  addDoc,
  updateDoc,
  getDoc
}

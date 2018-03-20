// Firebase imports
import {firestore} from './firebase-manager'

// Store import
import store from '../store/store'

const getDocRef = (collection, docId) => firestore.collection(collection).doc(docId)

const addDoc = (collection, docId, docData) => getDocRef(collection, docId).set(docData)

const getDoc = (collection, docId) => getDocRef(collection, docId).get()

/**
 * Signs in the provided user. This is done by checking if the introduced email and password
 * matches with any of the ones stored in the Firestore db. If it is, updates the application current
 * user. Throws the corresponding error otherwise
 *
 * @param email
 * @param password
 * @returns {Promise} - Callbacks to manage sign's success or failure
 */
const signIn = (email, password) => {
  return new Promise(function (resolve, reject) {
    return getDoc('users', email)
      .then(function (userDoc) {
        //TODO: Check password hashed
        if (!userDoc || !userDoc.exists || password !== userDoc.data().password) {
          reject("Incorrect email or password.")
        } else {
          resolve(userDoc.data())
          store.dispatch('user/SIGN_IN_USER', userDoc.data())
        }
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

/**
 * Signs up a new user. This is done by checking if the introduced email does not correspond
 * to any of the ones stored in Firestore db. If no mail matches, adds the new user to Firestore.
 * Otherwise throws the corresponding error.
 *
 * @param user
 * @returns {Promise<any>} - Callbacks to manage sign up's success or failure
 */
const signUp = (user) => {

  return firestore.runTransaction(function (transaction) {
    const userRef = getDocRef('users', user.email)
    return transaction.get(userRef)
      .then(function (userDoc) {
        if (userDoc.exists) {
          return Promise.reject('Email already registered')
        } else {
          transaction.set(userRef, user)
          return Promise.resolve(user)
        }
      })
  })

}


export default {
  signIn,
  signUp
}

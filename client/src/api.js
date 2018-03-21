// Firebase imports
import {firestore} from './managers/firebase-manager'

import {generateSignerFromKey, generatePrivateKeyFromHex} from './managers/signers-manager'

// Store import
import store from './store/store'

// Utils import
import utils from './utils'

const getDocRef = (collection, docId) => firestore.collection(collection).doc(docId)

const addDoc = (collection, docId, docData) => getDocRef(collection, docId).set(docData)

const updateDoc = (collection, docId, docData) => getDocRef(collection, docId).update(docData)

const getDoc = (collection, docId) => getDocRef(collection, docId).get()

/**
 * Signs in the provided user. This is done by checking if the introduced email and password
 * matches with any of the ones stored in the Firestore db.
 * @param credentials - {email, password}
 * @returns {Promise} - Callbacks to manage sign in's success or failure
 */
const signIn = (credentials) => {
  return new Promise( (resolve, reject) => {
    return getDoc('users', credentials.email)
      .then( (userDoc) => {

        if (!userDoc || !userDoc.exists || utils.hash(credentials.password) !== userDoc.data().password) {
          reject("Incorrect email or password.")
        } else {
          const user = userDoc.data()
          delete user.password
          resolve(user)
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
        if (userDoc && userDoc.exists) {
          return Promise.reject('Email already registered')
        } else {
          user.password = utils.hash(user.password) // Hashes the password before saving to Firestore db
          transaction.set(userRef, user)
          return Promise.resolve()
        }
      })
      .catch(function (error) {
        return Promise.reject(error)
      })
  })

}

/**
 * This will convert the current user to a validated artist following the next steps:
 * 1.- Checks the validity of the provided private key
 * 2.- Checks that the user is not already an artist
 * 3.- Uses a batch to create an artist instance to Firestore db (using the same id as the user's one)
 *     and then updates the user's 'artistRef' field in Firestore db to make it reference the created
 *     artist instance
 * @param key - Artist's private key
 * @returns {Promise<any>}
 */
const createArtist = (key) => {
  return new Promise(function (resolve, reject) {
    if (utils.checkValidKey(key)) {
      if (!store.getters['user/isArtist']) {
        const email = store.getters['user/user'].email
        const signer = generateSignerFromKey(generatePrivateKeyFromHex(key))

        // Artist's info to be stored on Firestore db
        const artist = {
          key: signer.getPublicKey().asHex(), // Artist private key's public key pair
          songs: [] // A fresh new artist does not have any song yet
        }
        const batch = firestore.batch()

        // Creates a new artist instance in Firestore db
        const artistRef = getDocRef('artists', email)
        batch.set(artistRef, artist)

        // Sets the reference of the previously created user as the 'artistRef' field
        const userRef = getDocRef('users', email)
        batch.update(userRef, {artistRef: artistRef})

        batch.commit()
          .then(() => {
            resolve(artistRef)
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        reject('Artist already registered')
      }
    } else {
      reject('Please, introduce a valid key (32 bytes in hex format)')
    }
  })
}

export default {
  signIn,
  signUp,
  createArtist
}

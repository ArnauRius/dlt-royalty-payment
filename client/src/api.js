// Firebase imports
import {firestore} from './managers/firebase-manager'

import {generateSignerFromKey, generatePrivateKeyFromHex} from './managers/signers-manager'

// Store import
import store from './store/store'

// Utils import
import utils from './utils'

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
        if (!userDoc || !userDoc.exists || utils.hash(password) !== userDoc.data().password) {
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
        if (userDoc && userDoc.exists) {
          return Promise.reject('Email already registered')
        } else {
          const hashUser = Object.assign({}, user)
          hashUser.password = utils.hash(user.password)
          transaction.set(userRef, hashUser)
          return Promise.resolve(user)
        }
      })
      .catch(function (error) {
        return Promise.reject(error)
      })
  })

}

/**
 * This will convert the current user to a validated artist.
 * First it checks if the desired user has been converted already to an artist.
 * If not, creates a new Artist instance to Firestore, referenced by the same id as the user's one (the email),
 * then updates the artist status ('isArtist' field) to both Firestore db and local storage (Vuex store)
 * @param key - Artist's private key
 * @returns {Promise<any>}
 */
const createArtist = (key) => {
  return firestore.runTransaction(function (transaction) {
    const user = store.getters['user/user']
    const artistRef = getDocRef('artists', user.email)
    return transaction.get(artistRef)
      .then(function (artistDoc) {
        console.log('checking artist existance')
        if(artistDoc && artistDoc.exists){
          console.log('artist does exist')
          return Promise.reject('Artist already activated')
        }else{
          console.log('artist does not exist, create it')
          const userRef = getDocRef('users', user.email)
          return transaction.get(userRef)
            .then(function (userDoc) {
              if(!userDoc || !userDoc.exists){
                return Promise.reject('User not found')
              }else if(userDoc.data().isArtist){
                return Promise.reject('Artist already activated')
              }else{
                const signer = generateSignerFromKey(generatePrivateKeyFromHex(key))
                const artist = {
                  email: user.email,
                  key: signer.getPublicKey().asHex()
                }
                transaction.set(artistRef, artist)
                transaction.update(userRef, {isArtist: true})
                store.dispatch('user/CONVERT_TO_ARTIST')
                return Promise.resolve()
              }
            })
            .catch(function (error) {
              return Promise.reject(error)
            })
        }
      })
      .catch(function (error){
        return Promise.reject(error)
      })
  })
}


export default {
  signIn,
  signUp,
  createArtist
}

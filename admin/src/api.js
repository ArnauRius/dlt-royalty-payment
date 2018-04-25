// APIs imports
import firestore from '../../api-offchain'

/**
 * Gets a list of all the artist instances stored in the Firebase Firestore database
 * @returns {Promise<firebase.firestore.QuerySnapshot>}
 */
const getAllArtistsFromFirestore = () => {
  return firestore.db.collection('artists').get()
}

const getUserFromFirestore = (email) => {
  return firestore.getDoc('users', email)
}

export default {
  getAllArtistsFromFirestore,
  getUserFromFirestore,
}
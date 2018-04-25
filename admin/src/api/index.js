// APIs imports
import firestore from './firestore-api'

// Store import
import store from '../store/store'

/**
 * Gets a list of all the song instances stored in the Firebase Firestore database
 * @returns {Promise<firebase.firestore.QuerySnapshot>}
 */
const getAllSongsFromFirestore = () => {
  return firestore.db.collection('songs').get()
}

export default {
  getAllSongsFromFirestore
}

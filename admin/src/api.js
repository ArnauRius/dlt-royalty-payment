// APIs imports
import firestore from '../../api-offchain'
import sawtooth from '../../api-onchain'

/**
 * Gets a list of all the artist instances stored in the Firebase Firestore database
 * @returns {Promise<firebase.firestore.QuerySnapshot>}
 */
const getAllArtistsFromFirestore = () => {
  return firestore.db.collection('artists').get()
}

//TODO: Comment all this
const getUserFromFirestore = (email) => {
  return firestore.getDoc('users', email)
}

/**
 * Gets a list of all the song instances stored in the Firebase Firestore database
 * @returns {Promise<firebase.firestore.QuerySnapshot>}
 */
const getAllSongsFromFirestore = () => {
  return firestore.db.collection('songs').get()
}

const getSongFromBlockchain = (songId) => {
  return sawtooth.getSong(songId)
}

const resetArtistAmount = (artistPubKey, songIds) => {
  return sawtooth.resetArtistAmount(artistPubKey, songIds)
}

export default {
  getAllArtistsFromFirestore,
  getUserFromFirestore,
  getAllSongsFromFirestore,
  getSongFromBlockchain,
  resetArtistAmount
}

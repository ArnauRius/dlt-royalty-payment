/* Stores the current artist information */

import api from '../api/'

export default {

  namespaced: true,

  state: {
    artist: null,
  },

  getters: {
    /**
     * Returns the current artist object
     * @param state
     * @param getters
     * @returns {{signer: Signer, songs: []}}
     */
    artist: state => state.artist,

    /**
     * Returns a boolean expressing if there is currently a signed in artist (True) or not (False)
     * @param state
     * @return bool
     */
    isArtistSigned: state => state.artist !== null,

    /**
     * Returns the list containing the current artist song's Firestore references
     * @param state
     * @returns {Array}
     */
    songs: state => state.artist !== null ? state.artist.songs : []
  },

  mutations: {
    /**
     * Mutation to assign the current artist
     * @param state
     * @param artist
     */
    SIGN_IN_ARTIST: (state, artist) => {
      state.artist = artist
    },

    /**
     * Mutation to reset the current artist to null
     * @param state
     */
    SIGN_OUT_ARTIST: state => {
      state.artist = null
    },

    /**
     * Action to add a new song reference to the artist's list of songs
     * @param state
     * @param songRef - The song reference to assign to the artist
     */
    ADD_SONG: (state, songRef) => {
      state.artist.songs.push(songRef)
    }
  },

  actions: {

    /**
     * Action to assign the current artist.
     * It calls the API call to sign the artist.
     * If succeeds, updates the current artist.
     * Returns an error otherwise.
     * @param context
     * @param key - Artist's private key
     */
    SIGN_IN_ARTIST: (context, key) => {
      return new Promise((resolve, reject) => {
        const credentials = {
          email: context.rootGetters['user/user'].email,
          key: key
        }
        api.signArtist(credentials)
          .then((artist) => {
            context.commit('SIGN_IN_ARTIST', artist)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    /**
     * Action to reset the current artist to null
     * @param context
     */
    SIGN_OUT_ARTIST: context => {
      context.commit('SIGN_OUT_ARTIST')
    },

    /**
     * Action to create a new song and assign it to the current artist
     * @param context
     * @param songName - The song's name
     * @returns {Promise}
     */
    CREATE_SONG: (context, songName) => {
      return new Promise((resolve, reject) => {
        api.createSong(context.getters['artist'], context.rootGetters['user/user'].email, songName)
          .then((songRef) => {
            context.commit('ADD_SONG', songRef)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
}

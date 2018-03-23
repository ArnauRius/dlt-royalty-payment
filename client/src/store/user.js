/* Stores the current user information */

import api from '../api/'

export default {

  namespaced: true,

  state: {
    user: null,
  },

  getters: {
    /**
     * Returns the current user object
     * @param state
     * @param getters
     * @returns {{name: string, email: string, signer: Signer}}
     */
    user: (state, getters) => state.user,

    /**
     * Returns a boolean expressing if there is currently a signed in user (True) or not (False)
     * @param state
     * @return bool
     */
    isUserSigned: state => state.user !== null,

    /**
     * Returns a boolean expressing if the current artist is also an artist (True) or not (False)
     * @param state
     */
    isArtist: state => !(state.user === null || state.user.artistRef === null),

  },

  mutations: {
    /**
     * Mutation to assign the current user
     * @param state
     * @param user
     */
    SIGN_IN_USER: (state, user) => {
      state.user = user
    },

    /**
     * Mutation to reset the current user to null
     * @param state
     */
    SIGN_OUT_USER: state => {
      state.user = null
    },

    /**
     * Mutation to update the user's 'artistRef' field
     * @param state
     */
    UPDATE_ARTIST_REF: (state, artistRef) => {
      state.user.artistRef = artistRef
    }
  },

  actions: {
    /**
     * Action to assign the current user.
     * Makes a call to the API to sign in the user.
     * If it succeeds, creates a signer's instance for the new user and updates the current user in the store.
     * Returns error otherwise.
     * @param context
     * @param credentials - {email, password}
     * @returns {Promise} - Callbacks to manage sign in's success or failure
     */
    SIGN_IN_USER: (context, credentials) => {
      return new Promise((resolve, reject) => {
        api.signIn(credentials)
          .then((user) => {
            return context.dispatch('signers/CREATE_SIGNER', user.email, {root: true})
              .then((signer) => {
                user.signer = signer
                context.commit('SIGN_IN_USER', user)
                resolve()
              })
              .catch((error) => {
                reject('Could not create a signer for the user')
              })
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    /**
     * Action to sign up a new user and setting its 'artistRef' field to default value (null).
     * Makes a call to the API to sign up the user.
     * If it succeeds, returns the new registered user.
     * Returns error otherwise
     * @param context
     * @param user - {name, email, password}
     * @returns {Promise} - Callbacks to manage sign up's success or failure
     */
    SIGN_UP_USER: (context, user) => {
      return new Promise((resolve, reject) => {
        user.artistRef = null // Sets the default 'artistRef' value for new users
        api.signUp(user)
          .then(() => {
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    /**
     * Action to reset the current user to null
     * @param context
     */
    SIGN_OUT_USER: context => {
      context.commit('SIGN_OUT_USER')
    },

    /**
     * Action to create a new artist instance and assign it to the current user
     * Makes a call to the API to create a new artist instance.
     * If it succeeds, assigns the artist's reference to the user.
     * Returns error otherwise
     * @param context
     * @param prvKey - Artist's private key
     * @returns {Promise}
     */
    CONVERT_TO_ARTIST: (context, prvKey) => {
      return new Promise((resolve, reject) => {
        api.createArtist(prvKey)
          .then((artistRef) => {
            context.commit('UPDATE_ARTIST_REF', artistRef)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  }
}

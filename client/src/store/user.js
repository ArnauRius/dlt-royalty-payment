/* Stores the current user information */

import api from '../api'

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
     * If it succeeds, update the current user in the store.
     * @param context
     * @param credentials - {email, password}
     * @returns {Promise} - Callbacks to manage sign in's success or failure
     */
    SIGN_IN_USER: (context, credentials) => {
      return new Promise((resolve, reject) => {
        api.signIn(credentials)
          .then((user) => {
            user.signer = context.dispatch('signers/CREATE_SIGNER', user.email, {root: true})
            context.commit('SIGN_IN_USER', user)
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
     * Action to update the user's 'artistRef' field
     * @param context
     */
    UPDATE_ARTIST_REF: (context, artistRef) => {
      context.commit('UPDATE_ARTIST_REF', artistRef)
    }
  }
}

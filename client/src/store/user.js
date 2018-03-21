/* Stores the current user information */

export default {

  namespaced: true,

  state: {
    user: null,
    isUserSignedAsArtist: true
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
     * Mutation to convert the current user to a validated artist
     * @param state
     */
    CONVERT_TO_ARTIST: state => {
      state.user.isArtist = true
    }
  },

  actions: {
    /**
     * Action to assign the current user
     * @param context
     * @param user
     */
    SIGN_IN_USER: (context, user) => {
      context.dispatch('signers/CREATE_SIGNER', user.email, {root: true})
      user.signer = context.rootGetters['signers/signer'](user.email)
      context.commit('SIGN_IN_USER', user)
    },

    /**
     * Action to reset the current user to null
     * @param context
     */
    SIGN_OUT_USER: context => {
      context.commit('SIGN_OUT_USER')
    },

    /**
     * Action to convert the current user to a validated artist
     * @param context
     */
    CONVERT_TO_ARTIST: context => {
      context.commit('CONVERT_TO_ARTIST')
    }
  }
}

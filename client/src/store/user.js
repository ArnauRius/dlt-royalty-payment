/* Stores the current user information */

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
    isUserSigned: state => state.user !== null
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
    }
  },

  actions: {
    /**
     * Action to assign the current user
     * @param context
     * @param user
     */
    SIGN_IN_USER: (context, user) => {
      context.dispatch('signers/CREATE_SIGNER', user.email, {root: true})  //TODO: REMOVE AND MOVE TO CREATE NEW USER
      user.signer = context.rootGetters['signers/signer'](user.email)
      context.commit('SIGN_IN_USER', user)
    },

    /**
     * Action to reset the current user to null
     * @param state
     */
    SIGN_OUT_USER: context => {
      context.commit('SIGN_OUT_USER')
    }
  }
}

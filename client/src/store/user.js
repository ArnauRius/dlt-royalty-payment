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
     * Returns a boolean expressing if there is currently a logged user (True) or not (False)
     * @param state
     * @return bool
     */
    isUserLogged: state => state.user !== null
  },

  mutations: {
    /**
     * Mutation to assign the current user
     * @param state
     * @param user
     */
    LOG_IN_USER: (state, user) => {
      state.user = user
    },

    /**
     * Mutation to reset the current user to null
     * @param state
     */
    LOG_OUT_USER: state => {
      state.user = null
    }
  },

  actions: {
    /**
     * Action to assign the current user
     * @param context
     * @param user
     */
    LOG_IN_USER: (context, user) => {
      context.dispatch('signers/CREATE_SIGNER', user.email, { root: true })  //TODO: REMOVE AND MOVE TO CREATE NEW USER
      user.signer = context.rootGetters['signers/signer'](user.email)
      context.commit('LOG_IN_USER', user)
    },

    /**
     * Action to reset the current user to null
     * @param state
     */
    LOG_OUT_USER: context => {
      context.commit('LOG_OUT_USER')
    }
  }
}

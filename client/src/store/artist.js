/* Stores the current artist information */

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
     * @returns {{email: string, signer: Signer}}
     */
    artist: (state, getters) => state.artist,
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
  },

  actions: {
    /**
     * Action to assign the current artist
     * @param context
     * @param artist
     */
    SIGN_IN_ARTIST: (context, artist) => {
      context.commit('SIGN_IN_ARTIST', artist)
    },

    /**
     * Action to reset the current user to null
     * @param context
     */
    SIGN_OUT_ARTIST: context => {
      context.commit('SIGN_OUT_ARTIST')
    }
  }
}

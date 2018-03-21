/* Stores all the private/public key pairs for all the users in the current session */

import {generateSigner} from '../managers/signers-manager'

export default {

  namespaced: true,

  state: {
    signers: {} // Dictionary containing an object with a priv/pub key pair (value) for each user's email (key)
  },

  getters: {

    /**
     * Returns the Signer instance for the current user
     * @param state
     * @param getters
     * @param rootState
     * @param rootGetters
     * @returns {undefined}
     */
    signer: (state) => {
      return email => {
        return email in state.signers ? state.signers[email] : undefined
      }
    }

  },

  mutations: {
    /**
     * Mutation to create a new Signer instance for the user with email
     * @param state
     * @param email
     */
    CREATE_SIGNER: (state, email) => {
      state.signers[email] = generateSigner()
    }
  },

  actions: {
    /**
     * Action to create a new Signer instance for the user with email
     * @param context
     * @param email
     * @returns {Signer} - The created signer instance
     */
    CREATE_SIGNER: (context, email) => {
      context.commit('CREATE_SIGNER', email)
      return context.getters.signer(email)
    }
  }
}


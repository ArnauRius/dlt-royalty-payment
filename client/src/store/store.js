// Vue && Vuex imports
import Vue from 'vue'
import Vuex from 'vuex'

// Stores imports
import user from './user'
import artist from './artist'
import signers from './signers'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: false,
  modules: {
    user,
    artist,
    signers
  }
})

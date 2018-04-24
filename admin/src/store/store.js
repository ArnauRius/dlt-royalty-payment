// Vue && Vuex imports
import Vue from 'vue'
import Vuex from 'vuex'

// Stores imports
import info from './info'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: false,
  modules: {
    info
  }
})

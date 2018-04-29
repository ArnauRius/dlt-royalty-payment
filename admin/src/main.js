import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Routes from './routes'
import axios from 'axios'
import VueAxios from 'vue-axios'

// Sets Vue's plugins
Vue.use(VueRouter)
Vue.use(VueAxios, axios)w

const router = new VueRouter({
  routes: Routes,
  mode: 'history'
})

// Creates Vue's instance
new Vue({
  el: '#app',
  render: h => h(App),
  router: router
})

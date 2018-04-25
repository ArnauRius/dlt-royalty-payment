import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Routes from './routes'

// Sets Vue's plugins
Vue.use(VueRouter)

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

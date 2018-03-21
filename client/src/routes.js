// Store import
import store from './store/store'
import api from './api'

// Components imports
import Home from './components/pages/home.vue'
import Main from './components/main.vue'
import Account from './components/pages/account.vue'
import Dashboard from './components/pages/dashboard.vue'


// Defines the routes
export default [
  {
    path: '/', redirect: { name: 'home' }, component: Main, children: [
    {path: 'home', component: Home, name: 'home'},
    {path: 'account', component: Account, name: 'account', beforeEnter: checkUserAuth},
    {path: 'dashboard', component: Dashboard, name: 'dashboard', beforeEnter: checkAuthArtist},
  ]
  }
]

/**
 * Checks if user is authenticated. If not, redirect always to the '/home' route
 */
function checkUserAuth(to, from, next) {
  store.getters['user/isUserSigned'] ? next() : redirectHome(to, from, next)
}

/**
 * Checks if user is authenticated as an artist. If not, redirect always to the '/home' route
 */
function checkAuthArtist(to, from, next) {
  // TODO:
  //store.getters['user/isUserSignedAsArtist'] ? fetchDataDashboard(to, from, next) : redirectHome(to, from, next)
  next()
}

/**
 * Fetch the necessary data for dashboard.
 */
function fetchDataDashboard(to, from, next){
  //store.dispatch('artist/GET_ARTIST_DATA')
}

/**
 * Redirects to the '/home' route
 */
function redirectHome(to, from, next) {
  next({name: 'home'})
}

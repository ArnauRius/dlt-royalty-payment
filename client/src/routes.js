// Store import
import store from './store/store'

// Components imports
import Home from './components/pages/home.vue'
import Main from './components/main.vue'
import Account from './components/pages/account.vue'
import Dashboard from './components/pages/dashboard.vue'
import Explore from './components/pages/explore.vue'


// Defines the routes
export default [
  {
    path: '/', redirect: { name: 'home' }, component: Main, children: [
    {path: 'home', component: Home, name: 'home'},
    {path: 'explore', component: Explore, name: 'explore', beforeEnter: checkUserAuth},
    {path: 'account', component: Account, name: 'account', beforeEnter: checkUserAuth},
    {path: 'dashboard', component: Dashboard, name: 'dashboard', beforeEnter: checkArtistAuth},
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
function checkArtistAuth(to, from, next) {
  store.getters['artist/isArtistSigned'] ? next() : redirectHome(to, from, next)
}

/**
 * Redirects to the '/home' route
 */
function redirectHome(to, from, next) {
  next({name: 'home'})
}

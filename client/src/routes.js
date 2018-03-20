// Store import
import store from './store/store'

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
    {path: 'account', component: Account, name: 'account', beforeEnter: checkAuthUser},
    {path: 'dashboard', component: Dashboard, name: 'dashboard', beforeEnter: checkAuthArtist},
  ]
  }
]


/**
 * Checks if user is authenticated as a user. If not, redirect always to the '/home' route
 */
function checkAuthUser(to, from, next) {
  store.getters['user/isUserSigned'] ? next() : redirectHome(to, from, next)
}

/**
 * Checks if user is authenticated as an artist. If not, redirect always to the '/home' route
 */
function checkAuthArtist(to, from, next) {
  store.getters['user/isUserSignedAsArtist'] ? next() : redirectHome(to, from, next)
}


/**
 * Redirects to the '/home' route
 */
function redirectHome(to, from, next) {
  next({name: 'home'})
}

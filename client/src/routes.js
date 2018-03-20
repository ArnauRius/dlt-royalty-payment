// Store import
import store from './store/store'

// Components imports
import Home from './components/pages/home.vue'
import Account from './components/pages/account.vue'

// Defines the routes
export default [
  {
    path: '/', redirect: { name: 'home' }, children: [
    {path: 'home', component: Home, name: 'home'},
    {path: 'account', component: Account, name: 'account', beforeEnter: checkAuth},
  ]
  }
]


/**
 * Checks if user is authenticated. If not, redirect always to the '/home' route
 */
function checkAuth(to, from, next) {
  store.getters['user/isUserSigned'] ? next() : redirectHome(to, from, next)
}


/**
 * Redirects to the '/home' route
 */
function redirectHome(to, from, next) {
  next({name: 'home'})
}

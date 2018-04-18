// Store import
import store from './store/store'

// Components imports
import Home from './components/pages/home.vue'
import Main from './components/main.vue'
import Account from './components/pages/account.vue'
import Dashboard from './components/pages/dashboard.vue'
import Explorer from './components/pages/explorer.vue'


// Defines the routes
export default [
  {
    path: '/', redirect: { name: 'home' }, component: Main, children: [
    {path: 'home', component: Home, name: 'home', beforeEnter: checkUserRedirect},
    {path: 'explorer', component: Explorer, name: 'explorer', beforeEnter: checkUserAuth},
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
 * Checks if user is authenticated. If not, redirect always to the '/home' route, if yes redirect to explorer
 */
function checkUserRedirect(to, from, next) {
  if(store.getters['user/isUserSigned'] && to.fullPath === '/home') {
     redirectExplorer(to, from, next)
  }
  else{
    next();
  }
}

/**
 * Redirects to the '/home' route
 */
function redirectHome(to, from, next) {
  next({name: 'home'})
}
/**
 * Redirects to the '/home' route
 */
function redirectExplorer(to, from, next) {
  next({name: 'explorer'})
}

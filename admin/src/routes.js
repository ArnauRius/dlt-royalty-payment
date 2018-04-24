// Store import
import store from './store/store'

// Components imports
import Main from './components/main.vue'


// Defines the routes
export default [
  {
    path: '/', component: Main, children: [
    ]
  }
]

// Store import
import store from './store/store'

// Components imports
import Main from './components/main.vue'
import Index from './components/pages/index.vue'

// Defines the routes
export default [
  {
    path: '/', redirect: { name: 'index' }, component: Main, children: [
      {path: 'index', component: Index, name: 'index'},
    ]
  }
]

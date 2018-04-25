// Components imports
import Main from './components/main.vue'
import AdminPanel from './components/pages/admin-panel.vue'

// Defines the routes
export default [
  {
    path: '/', redirect: { name: 'admin-panel' }, component: Main, children: [
      {path: 'admin-panel', component: AdminPanel, name: 'admin-panel'},
    ]
  }
]

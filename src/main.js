// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Home from './routes/Home'
import VueRouter from 'vue-router'
import DataGrid from 'components/DataGrid'

Vue.use(VueRouter)

const List = {
  components: {DataGrid},
  data: () => ({
    searchQuery: '',
    gridColumns: ['name', 'version', 'license'],
    gridData: [
      { name: 'Vue.js', version: '2.0.0', license: 'MIT' },
      { name: 'webpack', version: '2.2.0', license: 'MIT' },
      { name: 'babel-core', version: '6.8.0', license: 'MIT' }
    ]
  }),
  render (h) {
    return <section style={{backgroundColor: '#ccc'}}>
    <DataGrid
      data={this.gridData}
      columns={this.gridColumns}
      filter-key={this.searchQuery} />
    </section>
  }
}

const routes = [
  { path: '/', component: Home },
  { path: '/list', component: List }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

/* eslint-disable no-new */
const createApp = () => {
  new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router
  })
}
if (!__BROWSER__) {
  module.exports = createApp
} else {
  createApp()
}

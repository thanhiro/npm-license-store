// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Home from './routes/Home'
import VueRouter from 'vue-router'
import DataGrid from 'components/DataGrid'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import VueApollo from 'vue-apollo'

const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:3020/graphql',
    transportBatching: true
  })
})

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

Vue.use(VueApollo, {
  apolloClient
})

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
  const app = new Vue({
    template: '<App/>',
    components: { App },
    router
  })

  if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
    app.el = '#app';
  }
}
if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
  console.log('client')
  createApp()
} else {
  console.log('server')
}

export default createApp


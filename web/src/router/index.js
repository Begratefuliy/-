import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const ID3 = r => require.ensure([], () => r(require('@/views/ID3')), 'ID3')
const Kmeans = r => require.ensure([], () => r(require('@/views/Kmeans')), 'Kmeans')
const home = r => require.ensure([], () => r(require('@/views/home')), 'home')

const routes = [{
  path: '/',
  component: home,
  name: '',
  children: [{
    path: '/Kmeans',
    component: Kmeans,
  },
  {
    path: '/ID3',
    component: ID3
  }
]
}

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router

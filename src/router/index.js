import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Error from '@/components/Error'

Vue.use(Router)

const Index = resolve => {
  require.ensure(['@/components/Index'], () => {
    resolve(require('@/components/Index'))
  })
}

const Charge = resolve => {
  require.ensure(['@/components/Charge'], () => {
    resolve(require('@/components/Charge'))
  })
}

const Restore = resolve => {
  require.ensure(['@/components/Restore'], () => {
    resolve(require('@/components/Restore'))
  })
}

const Search = resolve => {
  require.ensure(['@/components/Search'], () => {
    resolve(require('@/components/Search'))
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/error',
      name: 'Error',
      component: Error
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children: [
        {
          path: 'Charge',
          name: 'Charge',
          component: Charge
        },
        {
          path: '',
          name: 'Charge',
          component: Charge
        },
        {
          path: 'Search',
          name: 'Search',
          component: Search
        },
        {
          path: 'Restore',
          name: 'Restore',
          component: Restore
        }
      ]
    }
  ]
})

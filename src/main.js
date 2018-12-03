// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import axios from 'axios'
import Qs from 'qs'
import 'animate.css/animate.min.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import CookieUtil from '@/utils/cookieUtils'

axios.interceptors.request.use(config => {
  if (localStorage.JWT_TOKEN) {
    config.headers.authorization = `Bearer ${localStorage.JWT_TOKEN}`
  } else if (CookieUtil.getCookie('JWT_TOKEN')) {
    // 防止用户刷新后找到不到权限token
    config.headers.authorization = `Bearer ${CookieUtil.getCookie('JWT_TOKEN')}`
  } else {
    if (config.url !== '/api/signIn') {
      config.headers.authorization = `dummy` // 为了防止webflux的默认拦截器发送www-authenticate强制弹窗
    }
  }
  return config
}, error => {
  return Promise.reject(error.request)
})

axios.interceptors.response.use(res => {
  localStorage.JWT_TOKEN = res.headers.authorization
  CookieUtil.setCookie('JWT_TOKEN', res.headers.authorization)
  return res
}, error => {
  debugger
  if (error.request.responseURL.indexOf('/api/signIn') > 0) {
    return Promise.reject(error)
  } else if (error.response.status === 401 || error.response.status === 403 || error.response.status === 500) {
    localStorage.JWT_TOKEN = ''
    instance.$alert('您没有操作权限，请登录后重试', '警告', {
      confirmButtonText: '确定',
      type: 'error',
      callback: action => {
        instance.$router.push({ path: '/' })
      }
    })
  }
  return Promise.reject(error)
})

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.qs = Qs
Vue.use(ElementUI)
Vue.use(Vuex)

/* 快捷键设置 */
Vue.config.keyCodes.f1 = 112
Vue.config.keyCodes.f2 = 113
Vue.config.keyCodes.f3 = 114

const store = new Vuex.Store({
  state: {
    user: {
      username: '',
      id: ''
    }
  },
  getters: {
    principal: state => {
      return state.user
    }
  },
  mutations: {
    update (state, loginInfo) {
      state.user.username = loginInfo.username
      // state.user.id = loginInfo.id
    }
  }
})

/* eslint-disable no-new */
const instance = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

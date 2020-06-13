import '@babel/polyfill'
import Vue from 'vue'
import vuetify from './plugins/vuetify'
import './plugins/vue-socket-io'
import './plugins/vue-the-mask'
import App from './App'
import router from '@router'
import store from '@state/store'
import '@utils/register-service-worker'
import '@components/_globals'
import { firebaseAnalyze } from '@utils/firebase.config'

// Don't warn about using the dev version of Vue in development
Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.prototype.$analytics = firebaseAnalyze

new Vue({
  sockets: {
    connect () {
      console.log('socket connected')
    }
  },
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

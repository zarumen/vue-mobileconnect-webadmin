import Vue from 'vue'
import './plugins/vuetify'
import App from './App'
import router from '@router'
import store from '@state/store'
import '@utils/registerServiceWorker'
import '@components/_globals'
import VueSocketIO from 'vue-socket-io';

// Config socketIO Connection 
Vue.use(VueSocketIO, 'https://app.sms2mkt.com:2096', {secure: true})

// Don't warn about using the dev version of Vue in development
Vue.config.productionTip = process.env.NODE_ENV === 'production'

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')



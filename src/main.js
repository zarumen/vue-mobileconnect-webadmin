import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import './plugins/vueSocketIO'
import App from './App'
import router from '@router'
import store from '@state/store'
import '@utils/register-service-worker'
import '@components/_globals'

// Don't warn about using the dev version of Vue in development
Vue.config.productionTip = process.env.NODE_ENV === 'production'

new Vue({
  sockets: {
    connect() {
      console.log('socket connected')
    }
  },  
  router,
  store,
  render: h => h(App),
}).$mount('#app')



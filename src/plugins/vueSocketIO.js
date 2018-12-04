import Vue from 'vue'
import VueSocketIO from 'vue-socket-io'

// Config socketIO Connection 
Vue.use(VueSocketIO, 'https://app.sms2mkt.com:2096', {secure: true})

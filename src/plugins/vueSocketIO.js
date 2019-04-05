import Vue from 'vue'

import VueSocketIO from 'vue-socket.io-extended';
import io from 'socket.io-client';
 

// Config socketIO Connection 
Vue.use(VueSocketIO, io('https://app.sms2mkt.com:2096', {secure: true}))


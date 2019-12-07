import Vue from 'vue'
import store from '@state/store'
import $socket from './socket-instance'
import VueSocketIO from 'vue-socket.io-extended'

// Config socketIO Connection
Vue.use(VueSocketIO, $socket, { store })

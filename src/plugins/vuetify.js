import Vue from 'vue'
import Vuetify from 'vuetify'
import theme from './theme'
import 'vuetify/dist/vuetify.min.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify, {
  theme,
  iconfont: 'md',
  options: {
    themeVariations: ['primary', 'secondary'],
    customProperties: true
  }
})


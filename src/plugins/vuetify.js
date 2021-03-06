import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import theme from './theme'
import th from 'vuetify/es5/locale/th'
import 'vuetify/dist/vuetify.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

export default new Vuetify({
  theme: theme,
  iconfont: 'mdi',
  options: {
    themeVariations: ['primary', 'secondary'],
    customProperties: true
  },
  lang: {
    locales: { th },
    current: 'th'
  }
})

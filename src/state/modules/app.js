import { set, toggle } from '@state/helpers'

export const state = {
  drawer: true,
  color: 'green',
  image: 'https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg'
}

export const mutations = {
  setDrawer: set('drawer'),
  toggleDrawer: toggle('drawer')
}
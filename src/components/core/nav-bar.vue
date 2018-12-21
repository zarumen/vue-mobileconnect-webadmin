<script>
import Toolbar from './tool-bar'
import Drawer from './drawer'

export default {
  components: { Toolbar, Drawer },
  data() {
    return {
      drawer: true,
    }
  },
  computed: {
    showDrawer() {
      // check ว่า เป็นหน้า home หรือ login รึเปล่า ถ้าไม่ใช่ return true
      if (this.$route.name === 'home')
        return false
      if (this.$route.name === 'login')
        return false

      return true
    }
  },
  methods: {
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    }
  }
}
</script>

<template>
  <v-layout>    
    <toolbar />

    <drawer v-if="showDrawer"/>
  </v-layout>
</template>

<style lang="scss" scoped>
@import '@design';


</style>

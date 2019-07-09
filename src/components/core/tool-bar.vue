<script>
import { authComputed } from '@state/helpers'
import { mapMutations } from 'vuex'

export default {
  components: { NavBarRoutes: () => import('./nav-bar-routes') },
  data() {
    return {
      isScrolling: false,
      loggedInNavRoutes: [
        {
          name: 'profile',
          title: () => 'Logged in as ' + this.currentUser.displayName,
        },
        {
          name: 'logout',
          title: 'Logout',
        },
      ],
      loggedOutNavRoutes: [
        {
          name: 'login',
          title: 'Login',
        },
      ],
    }
  },
  computed: {
    ...authComputed,
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onClickBtn () {
      this.setDrawer(!this.$store.state.app.drawer)
    },
    onScroll () {
      if(this.$route.name ==='home') {
        
        this.isScrolling = (window.pageYOffset ||
          document.documentElement.scrollTop || 0) > 100

      } else {

        this.isScrolling = (window.pageYOffset ||
          document.documentElement.scrollTop || 0) > 50
      }
    }
  }
}
</script>

<template>
  <v-app-bar
    id="coretoolbar"
    v-scroll="onScroll"
    :color="!isScrolling ? 'transparent' : 'green lighten-3'"
    :text="!isScrolling"
    app
    dark
    class="elevation-0"
  >
    <v-app-bar-nav-icon
      v-if="loggedIn"
      @click.stop="onClickBtn"
    />
    <v-toolbar-title justify-left>
      Mobile Connect
    </v-toolbar-title>
    <v-spacer />
    <NavBarRoutes
      v-if="loggedIn"
      :routes="loggedInNavRoutes"
    />
    <NavBarRoutes
      v-else
      :routes="loggedOutNavRoutes"
    />
  </v-app-bar>
</template>

<style lang="scss" scoped>
@import '@design';

#coretoolbar {
  background-color: rgba(238, 238, 238, 0);
}
</style>

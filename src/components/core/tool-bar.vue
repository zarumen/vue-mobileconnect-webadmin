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
          color: 'primary'
        },
        {
          name: 'logout',
          title: 'Logout',
          color: 'primary'
        },
      ],
      loggedOutNavRoutes: [
        {
          name: 'login',
          title: 'Login',
          color: 'primary'
        },
      ],
    }
  },
  computed: {
    ...authComputed,
    loggedInRoute () {
      return (this.$route.name ==='home') ? this.loggedInNavRoutes.map(route => {
          route.color = 'white'
        return route
      }) : this.loggedInNavRoutes
    },
    loggedOutRoute () {
      return (this.$route.name ==='home') ? this.loggedOutNavRoutes.map(route => {
          route.color = 'white'
        return route
      }) : this.loggedOutNavRoutes
    }
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
    :flat="!isScrolling"
    app
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
      :routes="loggedInRoute"
    />
    <NavBarRoutes
      v-else
      :routes="loggedOutRoute"
    />
  </v-app-bar>
</template>

<style lang="scss" scoped>
@import '@design';

#coretoolbar {
  background-color: rgba(238, 238, 238, 0);
}
</style>

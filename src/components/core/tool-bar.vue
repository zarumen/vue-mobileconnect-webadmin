<script>
import { authComputed } from '@state/helpers'
import NavBarRoutes from './nav-bar-routes'
import { mapMutations } from 'vuex'

export default {
  components: { NavBarRoutes },
  data() {
    return {
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
  }
}
</script>

<template>
  <v-toolbar
    id="core-toolbar"
    prominent
    class="elevation-0"
  >
    <v-toolbar-side-icon
      v-if="loggedIn"
      @click.stop="onClickBtn"
    />
    <v-toolbar-title justify-left>
      Mobile Connect
    </v-toolbar-title>
    <v-spacer/>
    <v-toolbar-items>
      <NavBarRoutes
        v-if="loggedIn"
        :routes="loggedInNavRoutes"
      />
      <NavBarRoutes
        v-else
        :routes="loggedOutNavRoutes"
      />
    </v-toolbar-items>
  </v-toolbar>
</template>

<style lang="scss" scoped>
@import '@design';

#core-toolbar {
  background-color: rgba(238, 238, 238, 0);
}
</style>

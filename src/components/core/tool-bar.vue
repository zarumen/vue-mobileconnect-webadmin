<script>
import { authComputed } from '@state/helpers'
import NavBarRoutes from './nav-bar-routes'

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
      @click.stop="drawer = !drawer"
    />
    <v-toolbar-title justify-left>
      <img src="@assets/images/logo.png">
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
  background-color: #eee;
}
</style>

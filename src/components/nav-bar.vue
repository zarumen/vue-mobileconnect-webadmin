<script>
import { authComputed } from '@state/helpers'
import NavBarRoutes from './nav-bar-routes.vue'

export default {
  components: { NavBarRoutes },
  data() {
    return {
      drawer: null,
      menuItems: [
        {
          name: 'home',
          icon: 'school',
          title: 'Home',
        },
        {
          name: 'profile',
          icon: 'userCircle',
          title: 'Profile',
        },
        {
          name: 'logout',
          icon: 'signOutAlt',
          title: 'Log out',
        },
      ],
      loggedInNavRoutes: [
        {
          name: 'profile',
          title: () => 'Logged in as ' + this.currentUser.name,
        },
        {
          name: 'logout',
          title: 'Log out',
        },
      ],
      loggedOutNavRoutes: [
        {
          name: 'login',
          title: 'Log in',
        },
      ],
    }
  },
  computed: {
    ...authComputed,
  },
}
</script>

<template>
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      absolute
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.name"
          value="true"
          exact
        >
          <v-list-tile-action>
            <BaseIcon :name="item.icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      dark
      color="green darken-2"
      app
    >
      <v-toolbar-side-icon
        v-if="loggedIn"
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title>
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
  </v-layout>
</template>

<style lang="scss" module>
@import '@design';

.container {
  padding: 0;
  margin: 0 0 $size-grid-padding;
  text-align: center;
  list-style-type: none;

  > li {
    display: inline-block;
    margin-right: $size-grid-padding;
  }
}
</style>

<script>
import { authComputed } from '@state/helpers'
import NavBarRoutes from './nav-bar-routes'

export default {
  components: { NavBarRoutes },
  data() {
    return {
      drawer: false,
      isActive: false,
      loggedInNavRoutes: [
        {
          name: 'profile',
          title: () => 'Logged in as ' + this.currentUser.displayName,
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
    menuItems () {
      // init menu Items by use 'auth/isAdmin' role
      var menuItems =  []
      let menuAdmin = [
        {
          name: 'dashboard',
          icon: 'chartPie',
          title: 'Dashboard',
        },
        {
          name: 'organizations',
          icon: 'sitemap',
          title: 'Organizations Manager',
        },
        {
          name: 'shortcodes',
          icon: 'addressCard',
          title: 'Shortcodes Manager',
        },
        {
          name: 'users',
          icon: 'userFriends',
          title: 'User Manager',
        },
        {
          name: 'regex',
          icon: 'school',
          title: 'Regex Manager',
        },
        {
          name: 'campaigns',
          icon: 'storeAlt',
          title: 'Campaigns Manager',
        },
      ]
      let menuUser = [
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
      ]
      if (this.isAdmin === false) {
        menuItems = menuUser
      } else {
        menuItems = menuAdmin.concat(menuUser)
      }
      return menuItems
    }
  },
}
</script>

<template>
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.name"
          value="true"
          exact-active-class
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

<style lang="scss" module scoped>
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

.active {
  color: red;
}
</style>

<script>
import { authComputed } from '@state/helpers'
import NavBarRoutes from './nav-bar-routes'

export default {
  components: { NavBarRoutes },
  data() {
    return {
      drawer: true,
      isActive: false,
      responsive: false,
      logo: '@assets/images/mc-logo.png',
      color: 'green white--text',
      image: 'https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg',
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
    menuItems () {
      // init menu Items by use 'auth/isAdmin' role
      var menuItems =  []
      let menuAdmin = [
        {
          name: 'dashboard',
          icon: 'dashboard',
          source: 'custom',
          title: 'Dashboard',
        },
        {
          name: 'organizations',
          icon: 'business',
          title: 'Organizations Manager',
        },
        {
          name: 'shortcodes',
          icon: 'looks_6',
          title: 'Shortcodes Manager',
        },
        {
          name: 'campaigns',
          icon: 'store',
          title: 'Campaigns Manager',
        },
        {
          name: 'users',
          icon: 'supervisor_account',
          title: 'Users Manager',
        },
        {
          name: 'regex',
          icon: 'priority_high',
          title: 'Regex Manager',
        },
        {
          name: 'campaignwidgets',
          icon: 'widgets',
          source: 'custom',
          title: 'Widgets Manager',
        },
      ]
      let menuUser = [
        {
          name: 'profile',
          icon: 'person',
          title: 'Profile',
        },
        {
          name: 'logout',
          icon: 'exit_to_app',
          title: 'Logout',
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
    <v-navigation-drawer
      id="app-drawer"
      v-model="drawer"
      app
      dark
      floating
      persistent
      mobile-break-point="991"
      width="260"
    >
      <v-img
        :src="image"
        height="100%"
      >
        <v-layout
          class="fill-height"
          tag="v-list"
          column
        >
          <v-list-tile avatar>
            <v-list-tile-avatar
              color="white"
            >
              <v-img
                src="https://api.adorable.io/avatars/285/abott@adorable.png"
                height="34"
                contain
              />
            </v-list-tile-avatar>
            <v-list-tile-title class="title">
              Mobile Connect
            </v-list-tile-title>
          </v-list-tile>
          <v-divider/>
          <v-list-tile
            v-if="responsive"
          >
            <v-text-field
              class="purple-input search-input"
              label="Search..."
              color="purple"
            />
          </v-list-tile>
          <v-list-tile
            v-for="(item, i) in menuItems"
            :key="i"
            :to="item.name"
            :active-class="color"
            avatar
            class="v-list-item"
          >
            <v-list-tile-action>
              <v-icon> 
                {{ item.icon }}
              </v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="white--text">
                {{ item.title }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-layout>
      </v-img>
    </v-navigation-drawer>
  </v-layout>
</template>

<style lang="scss" scoped>
@import '@design';

#app-drawer {
    .v-list__tile {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }

    .v-image__image--contain {
      top: 9px;
      height: 60%;
    }

    .search-input {
      padding-right: 15px;
      padding-left: 15px;
      margin-bottom: 30px !important;
    }
  }
</style>

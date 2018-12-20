<script>
import { authComputed } from '@state/helpers'

export default {
  data() {
    return {
      drawer: true,
      responsive: false,
      color: 'green white--text',
      logo: '@assets/images/mc-logo.png',
      image: 'https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg',
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
              :src="logo"
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
</template>


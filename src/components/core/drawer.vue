<script>
import { authComputed } from '@state/helpers'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      responsive: false,
      color: 'secondary white--text',
      logo: '@assets/images/mc-logo.png',
      image: 'http://www.mobileconnect.co.th/img/slider/revolution/moblie-slider1.jpg',
      avatar: 'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png'
    }
  },
  computed: {
    ...authComputed,
    inputValue: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.setDrawer(val)
      }
    },
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    },
    selectedMenuItem (value) {
      // init menu Items by use 'auth/isAdmin' role
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
          name: 'users',
          icon: 'supervisor_account',
          title: 'Users Manager',
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
          name: 'regex',
          icon: 'code',
          title: 'Regex Manager',
        },
        {
          name: 'campaignwidgets',
          icon: 'widgets',
          title: 'Widgets Manager',
        },
      ]
      let menuUser = [
        {
          name: 'reportViewer',
          icon: 'assignment',
          title: 'Reports',
        },
/*         {
          name: 'campaignsViewer',
          icon: 'store',
          title: 'Campaigns',
        },
        {
          name: 'campaignWidgetsViewer',
          icon: 'widgets',
          title: 'Widgets',
        }, */
      ]
      let menuDefault = [
        {
          name: 'profile',
          icon: 'face',
          title: 'Profile',
        },
/*         {
          name: 'settings',
          icon: 'settings',
          title: 'Settings',
        }, */
        {
          name: 'logout',
          icon: 'exit_to_app',
          title: 'Logout',
        },
      ]
      if(value === 1 && this.isAdmin === true) {
        return menuAdmin
      } else if (value === 2) {
        return menuUser
      } else {
        return menuDefault
      }
    }
  }
}
</script>

<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    class="elevation-4"
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
              :src="avatar"
              contain
            />
          </v-list-tile-avatar>
          <v-list-tile-title class="title">
            <img src="@assets/images/logo.png">
          </v-list-tile-title>
        </v-list-tile>
        <v-divider />
        <!-- <v-list-tile
          v-if="responsive"
        >
          <v-text-field
            class="purple-input search-input"
            label="Search..."
            color="primary"
          />
        </v-list-tile> -->
        <!-- -->
        <v-list>
          <v-list-group
            v-if="isAdmin"
            prepend-icon="supervised_user_circle"
            value="true"
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>2Way Admin</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              v-for="(item, i) in selectedMenuItem(1)"
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
          </v-list-group>
          <v-list-group
            prepend-icon="message"
            value="true"
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>2Way User</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              v-for="(item, i) in selectedMenuItem(2)"
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
          </v-list-group>
          <v-list-group
            prepend-icon="account_circle"
            value="true"
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>Account</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              v-for="(item, i) in selectedMenuItem(3)"
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
          </v-list-group>
        </v-list>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>


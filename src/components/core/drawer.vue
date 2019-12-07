<script>
import { authComputed } from '@state/helpers'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      responsive: false,
      color: 'secondary white--text',
      logo: '@assets/images/mc-logo.png',
      image: 'https://firebasestorage.googleapis.com/v0/b/mobile-connect-sms-webadmin/o/img%2Fmoblie-slider1.jpg?alt=media&token=565426b8-16de-4179-8532-2f7c6b7bcd98'
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
    avatar () {
      // return avartar picture
      return this.getAvartar
    }
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
      const menuAdmin = [
        {
          name: 'dashboard',
          icon: 'dashboard',
          title: 'Dashboard',
          link: '/dashboard'
        },
        {
          name: 'search',
          icon: 'search',
          title: 'Search Admin',
          link: '/search'
        },
        {
          name: 'organizations',
          icon: 'business',
          title: 'Organizations Manager',
          link: '/organizations'
        },
        {
          name: 'users',
          icon: 'supervisor_account',
          title: 'Users Manager',
          link: '/users'
        },
        {
          name: 'shortcodes',
          icon: 'looks_6',
          title: 'Shortcodes Manager',
          link: '/shortcodes'
        },
        {
          name: 'campaigns',
          icon: 'store',
          title: 'Campaigns Manager',
          link: '/campaigns'
        },
        {
          name: 'reports',
          icon: 'assignment',
          title: 'Reports Manager',
          link: '/reports'
        },
        // {
        //   name: 'regex',
        //   icon: 'code',
        //   title: 'Regex Manager',
        //   link: '/regex'
        // },
        {
          name: 'campaignwidgets',
          icon: 'widgets',
          title: 'Widgets Manager',
          link: '/campaignwidgets'
        }
      ]
      const menuUser = [
        {
          name: 'campaignsViewer',
          icon: 'store',
          title: 'Campaigns',
          link: '/campaignsViewer'
        },
        {
          name: 'reportViewer',
          icon: 'assignment',
          title: 'Reports',
          link: '/reportViewer'
        }
        /*        {
          name: 'campaignWidgetsViewer',
          icon: 'widgets',
          title: 'Widgets',
        }, */
      ]
      const menuDefault = [
        {
          name: 'profile',
          icon: 'face',
          title: 'Profile',
          link: '/profile'
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
          link: '/logout'
        }
      ]
      if (value === 1 && this.isAdmin === true) {
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
    expand-on-hover
    :src="image"
    class="elevation-4"
    mobile-break-point="991"
    width="260"
  >
    <v-layout
      tag="v-list"
      column
    >
      <v-list-item>
        <v-list-item-avatar
          color="white"
        >
          <v-img
            :src="avatar"
            contain
          />
        </v-list-item-avatar>
        <v-list-item-title class="title">
          <img
            src="@assets/images/logo.png"
            height="40px"
          >
        </v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list
        nav
        dense
      >
        <v-list-group
          v-if="isAdmin"
          value="true"
        >
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon color="primary">
                  supervised_user_circle
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-title>2Way Admin</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item
            v-for="(item, i) in selectedMenuItem(1)"
            :key="i"
            :to="item.link"
            :active-class="color"
            class="v-list-item"
          >
            <v-list-item-action>
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="white--text">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group
          value="true"
        >
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon color="primary">
                  message
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-title>2Way User</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item
            v-for="(item, i) in selectedMenuItem(2)"
            :key="i"
            :to="item.link"
            :active-class="color"
          >
            <v-list-item-action>
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="white--text">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group
          value="true"
        >
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon color="primary">
                  account_circle
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-title>Account</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item
            v-for="(item, i) in selectedMenuItem(3)"
            :key="i"
            :to="item.link"
            :active-class="color"
            class="v-list-item"
          >
            <v-list-item-action>
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="white--text">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-layout>
  </v-navigation-drawer>
</template>

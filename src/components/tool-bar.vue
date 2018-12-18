<script>
export default {
  
}
</script>

<template>
  <v-toolbar
      id="core-toolbar"
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      flat
      prominent
      class="elevation-0"
      style="background: #eee;"
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


<script>

export default {
  components: { NavBar: () => import('@components/core/nav-bar') },
  computed: {
    checkHome () {
      return (this.$route.name === 'home')
    }
  },
  created () {
    window.addEventListener('beforeunload', this.removeCachedTx)
  },
  methods: {
    removeCachedTx () {
      return this.$store.dispatch('transactions/removeLocalStorageAll', null)
    }
  }
}
</script>

<template>
  <v-main
    v-if="checkHome"
  >
    <nav-bar />
    <slot />
  </v-main>
  <v-main
    v-else
    class="container"
  >
    <nav-bar />
    <slot />
  </v-main>
</template>

<style lang="scss" module>
@import '@design';

.container {
  min-width: $size-content-width-min;
  max-width: $size-content-width-max;
  margin: 0 auto;
}
</style>

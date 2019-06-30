<script>

export default {
  components: { NavBar: () => import('@components/core/nav-bar') },
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
  <v-content>
    <nav-bar />
    <slot />
  </v-content>
</template>

<style lang="scss" module>
@import '@design';

.container {
  min-width: $size-content-width-min;
  max-width: $size-content-width-max;
  margin: 0 auto;
}
</style>

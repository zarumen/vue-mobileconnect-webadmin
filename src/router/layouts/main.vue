<script>
import NavBar from '@components/core/nav-bar'

export default {
  components: { NavBar },
}
</script>

<template>
  <v-content>
    <nav-bar/>
    <slot/>
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

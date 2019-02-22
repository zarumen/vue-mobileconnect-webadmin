<script>
export default {
  props: {
    fullWidth: {
      type: Boolean,
      default: false
    },
    offset: {
      type: [Number, String],
      default: 0
    }
  },

  computed: {
    classes () {
      return {
        'v-offset--full-width': this.fullWidth
      }
    },
    styles () {
      return {
        top: `-${this.offset}px`,
        marginBottom: `-${this.offset}px`
      }
    }
  }
}
</script>

<template>
  <div
    :style="styles"
    :class="classes"
    class="v-offset"
  >
    <slot />
  </div>
</template>

<style>
.v-offset {
  position: relative;
  max-width: calc(100% - 32px);
  margin: 0 auto;
}
.v-offset--full-width {
  max-width: 100%;
}
</style>

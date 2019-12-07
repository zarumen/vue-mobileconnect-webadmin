<script>
export default {
  props: {
    dialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  watch: {
    dialog (val) {
      if (!val) return

      setTimeout(() => (this.dialog = false), 4000)
    }
  }
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    hide-overlay
    persistent
    width="300"
  >
    <v-card
      color="green"
      dark
    >
      <v-card-text>
        Please wait...
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" module>
@import '@design';
</style>

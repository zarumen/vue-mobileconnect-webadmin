<script>
export default {
  props: {
    dialogText: {
      type: String,
      default: '',
    },
    dialogTitle: {
      type: String,
      default: '',
    },
    dialog: {
      type: [String, Boolean],
      default: '',
    },
  },
  data () {
    return {
      mini: false,
      isRootComponent: true,
      // clipped: false,
      drawer: true,
      fixed: false
    }
  },
  mounted () {

  },
  methods: {
    onConfirm () {},
    onCancel () {}
  },
}
</script>

<template>
  <v-dialog 
    v-model="dialog" 
    persistent 
    max-width="320"
  >
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text>{{ dialogText }}</v-card-text>
      <v-card-actions>
        <v-btn 
          color="red"
          flat
          @click.native="$emit('onConfirm')"
        >
          Confirm
        </v-btn>
        <v-btn 
          color="error"
          flat 
          @click.native="$emit('onCancel')"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" module>
@import '@design';
</style>

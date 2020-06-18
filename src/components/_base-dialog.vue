<script>
export default {
  props: {
    dialogText: {
      type: String,
      default: ''
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    dialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data () {
    return {
      mini: false,
      isRootComponent: true,
      // clipped: false,
      drawer: true,
      form: '',
      fixed: false,
      valid: false,
      value: '',
      validate: [
        v => !!v || 'Please text "DELETE ME!" in textfield.',
        v => /^DELETE ME!$/.test(v) || 'Please text "DELETE ME!" in textfield.'
      ]
    }
  },
  mounted () {
    this.value = ''
  },
  methods: {
    onConfirm () {},
    onCancel () {
      this.value = ''
      this.$emit('onCancel')
    }
  }
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="360"
  >
    <v-card>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-card-title
          class="text-subtitle-1"
        >
          <v-icon color="red">
            warning
          </v-icon>
          &nbsp;{{ dialogTitle }}
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-layout column>
              <v-col cols="12">
                <h5 class="grey--text text-body-1 font-weight-medium">
                  {{ dialogText }}
                </h5>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="value"
                  :rules="validate"
                  append-icon="edit"
                  class="purple-input"
                  placeholder="DELETE ME!"
                  required
                />
              </v-col>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <base-button
            color="red"
            text
            @click.native="onCancel"
          >
            Cancel
          </base-button>
          <base-button
            v-if="!!value"
            :disabled="!valid"
            color="error"
            rounded
            @click.native="$emit('onConfirm')"
          >
            Confirm
          </base-button>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" module>
@import '@design';
</style>

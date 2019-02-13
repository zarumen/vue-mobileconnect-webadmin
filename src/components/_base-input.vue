<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text',
    },
    name: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        VTextField: event => this.$emit('input', event.target.value),
      }
    },
  },
}
</script>

<template>
  <v-text-field
    :type="type"
    :value="value"
    :label="name"
    v-on="listeners"
  />
</template>

<style lang="scss" module>
@import '@design';

.input {
  @extend %typography-small;

  display: block;
  width: 100%;
  padding: $size-input-padding-vertical $size-input-padding-horizontal;
  margin-bottom: $size-grid-padding;
  line-height: 1;
  border: $size-input-border solid $color-input-border;
  border-radius: $size-input-border-radius;
}
</style>

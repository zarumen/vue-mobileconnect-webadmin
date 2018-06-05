<template>
  <v-btn
    depressed
    dark
    round
    color="green"
    v-on="$listeners"
  >
    <slot/>
  </v-btn>
</template>

<style lang="scss" module>
@import '@design';

.button {
  @extend %typography-small;

  padding: $size-button-padding;
  color: $color-button-text;
  cursor: pointer;
  background: $color-button-bg;
  border: none;

  &:disabled {
    cursor: not-allowed;
    background: $color-button-disabled-bg;
  }
}
</style>

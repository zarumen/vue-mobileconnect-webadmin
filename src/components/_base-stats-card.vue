<template>
  <base-card
    v-bind="$attrs"
    class="v-card--material-stats"
    v-on="$listeners"
  >
    <v-card
      slot="offset"
      :class="`elevation-${elevation}`"
      :color="color"
      class="pa-4"
      dark
    >
      <v-icon
        size="40"
      >
        {{ icon }}
      </v-icon>
    </v-card>
    <div class="text-right">
      <p
        class="category blue-grey--text font-weight-light"
        v-text="title"
      />
      <h3 class="title display-1 font-weight-medium">
        {{ value }} <small>{{ smallValue }}</small>
      </h3>
    </div>

    <template slot="actions">
      <v-icon
        :color="subIconColor"
        size="20"
        class="mr-2"
      >
        {{ subIcon }}
      </v-icon>
      <span
        :class="subTextColor"
        class="caption font-weight-light"
        v-text="subText"
      />
    </template>
  </base-card>
</template>

<script>
import Card from './_base-card'

export default {
  inheritAttrs: false,

  props: {
    ...Card.props,
    icon: {
      type: String,
      required: true
    },
    subIcon: {
      type: String,
      default: undefined
    },
    subIconColor: {
      type: String,
      default: undefined
    },
    subTextColor: {
      type: String,
      default: undefined
    },
    subText: {
      type: String,
      default: undefined
    },
    title: {
      type: String,
      default: undefined
    },
    value: {
      type: [String, Number],
      default: undefined
    },
    smallValue: {
      type: String,
      default: undefined
    }
  }
}
</script>

<style lang="scss">
.v-card--material-stats {
  position: relative;
  display: flex;
  flex-wrap: wrap;

  .v-offset {
    display: inline-block;
    flex: 0 1;
    max-width: auto;
    padding: 0 16px 0;
    margin-top: 0;
    margin-right: auto;
    margin-bottom: 0 !important;
    margin-left: 0;
  }

  .v-card {
    flex: 0 1 auto;
    border-radius: 4px;
  }

  .v-card__text {
    position: absolute;
    top: 0;
    right: 0;
    display: inline-block;
    width: 100%;
  }

  .v-card__actions {
    flex: 1 0 100%;
  }
}
</style>

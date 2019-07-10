<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library as fontAwesomeIconLibrary } from '@fortawesome/fontawesome-svg-core'
import camelCase from 'lodash/camelCase'
import kebabCase from 'lodash/kebabCase'

fontAwesomeIconLibrary.add(
  // https://fontawesome.com/icons
  // Add new icons to this list as you need them
  // free solid
  require('@fortawesome/free-solid-svg-icons/faSync').definition,
  require('@fortawesome/free-solid-svg-icons/faSyncAlt').definition,
  // brands
  require('@fortawesome/free-solid-svg-icons/faFileExcel').definition,
  require('@fortawesome/free-solid-svg-icons/faFileCode').definition,
)

export default {
  components: {
    FontAwesomeIcon,
  },
  inheritAttrs: false,
  props: {
    source: {
      type: String,
      default: 'font-awesome',
    },
    name: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      iconPrefix: 'fas'
    }
  },
  computed: {
    nameChanged () {
      return kebabCase(this.name)
    },
    // Gets a CSS module class, e.g. iconCustomLogo
    customIconClass () {
      return this.$style[camelCase('mdi-' + this.name)]
    },
  },
}
</script>

<template>
  <FontAwesomeIcon
    v-if="source === 'font-awesome'"
    :prefix="iconPrefix"
    :icon="nameChanged"
    v-bind="$attrs"
  />
  <v-icon
    v-else-if="source === 'custom'"
    v-bind="$attrs"
  >
    {{ name }}
  </v-icon>
</template>

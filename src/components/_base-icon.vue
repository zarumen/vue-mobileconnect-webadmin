<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library as fontAwesomeIconLibrary } from '@fortawesome/fontawesome-svg-core'
import camelCase from 'lodash/camelCase'
import kebabCase from 'lodash/kebabCase'

fontAwesomeIconLibrary.add(
  // https://fontawesome.com/icons
  // Add new icons to this list as you need them
  // free solid
  require('@fortawesome/free-solid-svg-icons/faAddressCard').definition,
  require('@fortawesome/free-solid-svg-icons/faChartLine').definition,
  require('@fortawesome/free-solid-svg-icons/faChartPie').definition,
  require('@fortawesome/free-solid-svg-icons/faSync').definition,
  require('@fortawesome/free-solid-svg-icons/faSyncAlt').definition,
  require('@fortawesome/free-solid-svg-icons/faSitemap').definition,
  require('@fortawesome/free-solid-svg-icons/faStoreAlt').definition,
  require('@fortawesome/free-solid-svg-icons/faUser').definition,
  require('@fortawesome/free-solid-svg-icons/faUserFriends').definition,
  require('@fortawesome/free-solid-svg-icons/faUserCircle').definition,
  require('@fortawesome/free-solid-svg-icons/faSchool').definition,
  require('@fortawesome/free-solid-svg-icons/faSignOutAlt').definition,
  // brands
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
      return this.$style[camelCase('icon-custom-' + this.name)]
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
  <span
    v-else-if="source === 'custom'"
    :class="customIconClass"
  />
</template>

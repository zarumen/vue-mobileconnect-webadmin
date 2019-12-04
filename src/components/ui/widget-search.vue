<script>
import SearchAdmin from '@components/ui/widget-search-admin'
import SearchUser from '@components/ui/widget-search-user'

export default {
  components: { 
    SearchAdmin,
    SearchUser
  },
  props: {
    mode: {
      type: Boolean,
      default: false,
      required: true
    },
  },
  computed: {
    searchMode () {
      return (this.mode) ? SearchAdmin : SearchUser
    }
  }
}
</script>

<template>
  <component :is="searchMode" />
</template>


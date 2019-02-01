<script>
import Layout from '@layouts/main'
import ListOperators from '@components/ui/list-operators'
import ListShortcodes from '@components/ui/list-shortcodes'

export default {
  page: {
    title: 'Shortcodes',
    meta: [{ name: 'description', content: 'Shortcodes' }],
  },
  components: { Layout, ListOperators, ListShortcodes }
}
</script>

<template>
  <Layout>
    <ListOperators />
    <ListShortcodes />
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>


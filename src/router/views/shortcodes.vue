<script>

export default {
  page: {
    title: 'Shortcodes',
    meta: [{ name: 'description', content: 'Shortcodes' }]
  },
  components: {
    Layout: () => import('@layouts/main'),
    ListOperators: () => import(/* webpackChunkName: "list-operators" */ '@components/ui/list-operators'),
    ListShortcodes: () => import(/* webpackChunkName: "list-shortcodes" */ '@components/ui/list-shortcodes')
  }
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

<script>

export default {
  page: {
    title: 'Shortcodes',
    meta: [{ name: 'description', content: 'Shortcodes' }],
  },
  components: { 
    Layout: () => import('@layouts/main'), 
    ListOperators: () => import('@components/ui/list-operators'), 
    ListShortcodes: () => import('@components/ui/list-shortcodes')
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


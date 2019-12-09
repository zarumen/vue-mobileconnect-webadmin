<script>

export default {
  page: {
    title: 'Search Admin',
    meta: [{ name: 'description', content: 'Search All Transactions' }]
  },
  components: {
    Layout: () => import('@layouts/main'),
    WidgetSearch: () => import('@components/ui/widget-search')
  }
}
</script>

<template>
  <Layout>
    <widget-search />
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>

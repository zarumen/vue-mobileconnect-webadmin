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
    Search
    <base-card>
      <widget-search :mode="false" />
    </base-card>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>

<script>

export default {
  page: {
    title: 'Search Viewer',
    meta: [{ name: 'description', content: 'SearchViewer' }]
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

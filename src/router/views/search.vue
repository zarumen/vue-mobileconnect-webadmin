<script>
import { searchComputed, searchMethods } from '@state/helpers'

export default {
  page: {
    title: 'Search Admin',
    meta: [{ name: 'description', content: 'Search All Transactions' }]
  },
  components: {
    Layout: () => import('@layouts/main'),
    WidgetSearch: () => import('@components/ui/widget-search')
  },
  computed: {
    ...searchComputed
  },
  created () {
    if (!this.hadCampaignList) { this.getAllCampaigns() }
  },
  methods: {
    ...searchMethods
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

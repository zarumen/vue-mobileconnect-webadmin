<script>
import Layout from '@layouts/main'

export default {
  page: {
    title: 'Campaigns',
    meta: [{ name: 'description', content: 'Campaigns' }],
  },
  components: { Layout },
  data() {
    return {
      dialog: '',
    }
  },
}
</script>

<template>
  <Layout>
    Campaigns
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>


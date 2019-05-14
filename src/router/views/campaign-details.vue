<script>
import Layout from '@layouts/main'

export default {
  page: {
    title: 'CampaignDetails',
    meta: [{ name: 'description', content: 'CampaignDetails' }],
  },
  components: { Layout },
  mounted () {
    
  }
}
</script>

<template>
  <Layout>
    <p class="subheading">&nbsp;Campaign "{{ $route.params.campaignId }}" Details</p>
  </Layout>
</template>


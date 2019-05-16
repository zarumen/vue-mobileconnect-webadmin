<script>
import Layout from '@layouts/main'
import { mapGetters } from 'vuex'

export default {
  page: {
    title: 'CampaignDetails',
    meta: [{ name: 'description', content: 'CampaignDetails' }],
  },
  components: { Layout },
  data: () => ({
    text: ''
  }),
  computed: {
    ...mapGetters('campaigns', [
      'getOneCampaign',
    ])
  },
  created () {
    
  },
  methods: {
    clicked () {
      this.text = this.getOneCampaign(this.$route.params.campaignId)

      return this.text
    }
  }
}
</script>

<template>
  <Layout>
    <p class="subheading">
      &nbsp;Campaign "{{ $route.params.campaignId }}" Details
    </p>
    <v-btn
      color="success"
      @click="clicked()"
    >
      Click
    </v-btn>
    <p>{{ text }}</p>
  </Layout>
</template>


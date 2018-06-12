<script>
import Layout from '@layouts/main'
import FormAddCampaign from '@components/form-add-campaign'

export default {
  page: {
    title: 'Campaigns',
    meta: [{ name: 'description', content: 'Campaigns' }],
  },
  components: { Layout, FormAddCampaign },
  data() {
    return {
      dialog: '',
      addCampaignDialog: '',
    }
  },
  methods: {

  },
}
</script>

<template>
  <Layout>
    <!-- FAB panel -->
    <v-btn
      fab
      bottom
      right
      color="indigo"
      dark
      fixed
      @click.stop="addCampaignDialog = !addCampaignDialog"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <form-add-campaign
      :add-campaign-dialog="addCampaignDialog"
      @emitCloseCampaignDialog="addCampaignDialog=arguments[0]"
    />
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>


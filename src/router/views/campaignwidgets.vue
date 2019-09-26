<script>
import Layout from '@layouts/main'
import { mapGetters, mapActions } from 'vuex'
import { campaignComputed } from '@state/helpers'


export default {
  page: {
    title: 'Widgets',
    meta: [{ name: 'description', content: 'Campaigns Widget Manager' }],
  },
  components: { Layout },
  data() {
    return {
      baseModule: 'campaigns',
      dialog: '',
      dialogTitle: "Campaign Delete Dialog",
      dialogText: "Do you want to delete this campaign?",
      headers: [
        { text: 'Widget', value: 'action', sortable: false },
        {
          text: 'Code',
          left: true,
          value: 'campaignCode'
        },
        { text: 'Brand', value: 'organizationLevel3Name' },
        { text: 'Name', value: 'campaignName' },
        { text: 'Keyword', value: 'keyword' },
        { text: 'Shortcode', value: 'shortcode' },
        { text: 'Running', value: 'campaignAvailable' },
        { text: 'Status', value: 'campaignState' },
      ],
      campaignId: '',
      left: true,
      timeout: 2000,
      search: '',
      campaignWidgetRemaining: null
    }
  },
  computed: {
    ...campaignComputed,
    ...mapGetters('organizations', [
      'hadList',
    ]),
  },
  created () {

    if(!this.hadList) this.getOrganizationsList()

    if(!this.hadCampaignList) this.getAllCampaigns()

  },
  methods: {
    ...mapActions('campaigns', [
      'getAllCampaigns',
      'closeSnackBar',
    ]),
    ...mapActions('organizations', [
      'getOrganizationsList'
    ]),
    print() {
      window.print()
    },
    reloadData () {
      this.getAllCampaigns()
    },
    exitSnackbar () {
      this.$store.commit('campaigns/setSnackbar', { snackbar: false })
      this.$store.commit('campaigns/setNotice', { notice: '' })
    },
  },
}
</script>

<template>
  <Layout>
    <v-container fluid>
      <v-flex xs12>
        <v-card>
          <!-- Controller Tools Panels -->
          <v-card-title>
            <span class="title">
              Campaigns Widget {{ campaignWidgetRemaining? "("+campaignWidgetRemaining.length+")": "" }}
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Quick Search"
                single-line
                hide-details
              />
            </span>
            <v-spacer />
            <base-button 
              color="primary"
              circle
              icon
              @click.native="reloadData()"
            >
              <base-icon name="syncAlt" />            
            </base-button>
            <base-button 
              text 
              icon 
              color="primary"
            >
              <v-icon>
                print
              </v-icon>
            </base-button>
          </v-card-title>
          <BaseTable
            v-if="loading===false"
            :headers="headers"
            :items="items"
            :search="search"
            :pagination="pagination"
            :basemodule="baseModule"
            :action-btn="false"
            @updated-items="campaignWidgetRemaining = $event"
          />
        </v-card>
      </v-flex>
      <!-- Pop up Panels -->
      <v-snackbar 
        v-if="loading===false" 
        v-model="snackbar" 
        :left="true" 
        :timeout="timeout" 
        :color="mode"
      >
        {{ notice }}
        <base-button 
          dark 
          text 
          @click.native="exitSnackbar"
        >
          Close
        </base-button>
      </v-snackbar>
    </v-container>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>


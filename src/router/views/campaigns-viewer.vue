<script>
import { mapActions } from 'vuex'
import { campaignComputed } from '@state/helpers'

export default {
  page: {
    title: 'Campaigns Viewer',
    meta: [{ name: 'description', content: 'Campaigns Customers Viewer' }],
  },
  components: { 
    Layout: () => import('@layouts/main'),
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      baseModule: 'campaigns',
      addCampaignDialog: '',
      dialog: '',
      dialogTitle: "Campaign Delete Dialog",
      dialogText: "Do you want to delete this campaign?",
      headers: [
        { text: 'Views', value: 'action', align: 'center', sortable: false },
        { text: 'Header', value: 'campaignName', left: true, },
        { text: 'Brand', value: 'organizationLevel3Name' },
        { text: 'Shortcode', value: 'shortcode' },
        { text: 'Status', value: 'campaignState', align: 'center' },
        { text: 'Active', value: 'campaignActive' },
      ],
      campaignId: '',
      campaignRemaining: null,
      quickSearchFilter: '',
      left: true,
      timeout: 2000,
    }
  },
  computed: {
    ...campaignComputed,
    authLevel () {
      // set Auth Level before send to Query
      if(this.user.organizationAuth === 'Level1')
        return this.user.organizationLevel1
      
      if(this.user.organizationAuth === 'Level2')
        return this.user.organizationLevel2
      
      if(this.user.organizationAuth === 'Level3')
        return this.user.organizationLevel3

      return null
    },
  },
  watch: {

  },
  created () {

    if(!this.hadCampaignList) {
      this.reloadData()
    }
  },
  methods: {
    ...mapActions('campaigns', [
      'getCampaignsByOrg',
    ]),
    print() {
      window.print()
    },
    reloadData () {
      this.getCampaignsByOrg({
        auth: this.user.organizationAuth, 
        orgId: this.authLevel
      })
    },
    onConfirm () {
      this.dialog = false
    },
    onCancel () {
      this.campaignId = ''
      this.dialog = false
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
              Campaigns {{ campaignRemaining? "("+campaignRemaining.length+")": "" }}
              <v-text-field
                v-model="quickSearchFilter"
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
              <BaseIcon name="syncAlt" />            
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
          <!-- Insert in Base-Table Component -->
          <BaseTable
            v-if="loading===false"
            :headers="headers"
            :items="items"
            :search="quickSearchFilter"
            :pagination="pagination"
            :basemodule="baseModule"
            :action-btn="false"
            @updated-items="campaignRemaining = $event"
          />
        </v-card>
      </v-flex>
      <!-- Pop up Panels -->
      <BaseDialog 
        :dialog="dialog" 
        :dialog-title="dialogTitle" 
        :dialog-text="dialogText"
        @onConfirm="onConfirm" 
        @onCancel="onCancel"
      />
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


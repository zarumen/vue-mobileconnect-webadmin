<script>
import Layout from '@layouts/main'
import FormAddCampaign from '@components/form/form-add-campaign'
import { mapGetters, mapActions } from 'vuex'
import { campaignComputed } from '@state/helpers'

export default {
  page: {
    title: 'Campaigns',
    meta: [{ name: 'description', content: 'Campaigns' }],
  },
  components: { Layout, FormAddCampaign },
  data() {
    return {
      baseModule: 'campaigns',
      addCampaignDialog: '',
      dialog: '',
      dialogTitle: "Campaign Delete Dialog",
      dialogText: "Do you want to delete this campaign?",
      headers: [
        {
          text: 'Code',
          left: true,
          value: 'campaignCode'
        },
        { text: 'Brand', value: 'organizationLevel3Name' },
        { text: 'Header', value: 'campaignName' },
        { text: 'Keyword', value: 'keyword' },
        { text: 'Shortcode', value: 'shortcode' },
        { text: 'Start Date', value: 'campaignDateStart' },
        { text: 'End Date', value: 'campaignDateEnd' },
        { text: 'Status', value: 'campaignState' },
      ],
      campaignId: '',
      left: true,
      timeout: 2000,
    }
  },
  computed: {
    ...campaignComputed,
    ...mapGetters('organizations', [
      'hadList',
    ]),
  },
  watch: {

  },
  created () {

    if(!this.hadList)
      this.getOrganizationsList()

    if(!this.hadCampaignList)
      this.getAllCampaigns()
  },
  methods: {
    ...mapActions('campaigns', [
      'getAllCampaigns',
      'deleteCampaign',
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
    edit(item) {

    },
    remove(item) {
      this.campaignId = item.id
      this.dialog = true
    },
    onConfirm () {
      this.deleteCampaign(this.campaignId)
      this.closeSnackbar(2000)
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
              Campaigns {{ pagination? "("+pagination.totalItems+")": "" }}
              <v-text-field
                append-icon="search"
                label="Quick Search"
                single-line
                hide-details
              />
            </span>
            <v-spacer />
            <v-btn 
              class="v-btn--simple"
              color="primary"
              circle
              icon
              @click.native="reloadData()"
            >
              <BaseIcon name="syncAlt" />            
            </v-btn>
            <v-btn 
              flat 
              icon 
              color="indigo"
            >
              <v-icon>
                print
              </v-icon>
            </v-btn>
          </v-card-title>
          <!-- Insert in Base-Table Component -->
          <BaseTable
            v-if="loading===false"
            :headers="headers"
            :items="items"
            :pagination="pagination"
            :basemodule="baseModule"
            @edit="edit"
            @remove="remove"
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
        <v-btn 
          dark 
          flat 
          @click.native="exitSnackbar"
        >
          Close
        </v-btn>
      </v-snackbar>
    </v-container>
    <!-- FAB panel -->
    <v-btn
      fab
      bottom
      right
      color="primary"
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


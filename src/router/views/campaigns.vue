<script>
import { campaignComputed, campaignMethods } from '@state/helpers'
import formatDate from '@utils/format-date'

export default {
  page: {
    title: 'Campaigns',
    meta: [{ name: 'description', content: 'Campaigns' }]
  },
  components: {
    Layout: () => import('@layouts/main'),
    FormAddCampaign: () => import(/* webpackChunkName: "form-add-campaign" */ '@components/form/form-add-campaign')
  },
  data () {
    return {
      baseModule: 'campaigns',
      addCampaignDialog: '',
      dialog: '',
      dialogTitle: 'Campaign Delete Dialog',
      dialogText: 'Do you want to delete this campaign?',
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
        { text: 'Running', value: 'campaignAvailable' },
        { text: 'Status', value: 'campaignState', align: 'center' },
        { text: 'Active', value: 'campaignActive' },
        { text: 'Actions', value: 'action', align: 'center', sortable: false }
      ],
      campaignId: '',
      campaignRemaining: null,
      quickSearchFilter: '',
      left: true,
      timeout: 2000
    }
  },
  computed: {
    ...campaignComputed,
    csvData () {
      if (!this.quickSearchFilter) {
        return this.mapFieldExport(this.items)
      } else {
        return this.mapFieldExport(this.campaignRemaining)
      }
    }
  },
  watch: {

  },
  created () {
    if (!this.hadShortcodesList) { this.getAllShortcodes() }

    if (!this.hadList) { this.getOrganizationsList() }

    if (!this.hadCampaignList) { this.getAllCampaigns() }
  },
  methods: {
    ...campaignMethods,
    print () {
      window.print()
    },
    reloadData () {
      this.getAllCampaigns()
    },
    csvExport (arrData) {
      if (arrData === null) return null
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += [
        Object.keys(arrData[0]).join(';'),
        ...arrData.map(item => Object.values(item).join(';'))
      ]
        .join('\n')
        .replace(/(^\[)|(\]$)/gm, '')

      const csvdata = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', csvdata)
      link.setAttribute('download', 'export.csv')
      link.click()
    },
    mapFieldExport (arr) {
      return arr.map(item => {
        if (item.campaignDateStart) {
          return {
            campaignId: item.id,
            company: item.organizationLevel1Name || '_BLANK',
            department: item.organizationLevel2Name || '_BLANK',
            brand: item.organizationLevel3Name || '_BLANK',
            shortcode: item.shortcode || '_BLANK',
            keyword: item.keyword || '_BLANK',
            campaignActive: item.campaignActive || '_BLANK',
            campaignAvailable: item.campaignAvailable || '_BLANK',
            campaignDateStart: formatDate(item.campaignDateStart.seconds),
            campaignDateEnd: formatDate(item.campaignDateEnd.seconds)
          }
        } else {
          return {
            campaignId: item.id,
            company: item.organizationLevel1Name || '_BLANK',
            department: item.organizationLevel2Name || '_BLANK',
            brand: item.organizationLevel3Name || '_BLANK',
            shortcode: item.shortcode || '_BLANK',
            keyword: item.keyword || '_BLANK',
            campaignActive: item.campaignActive || '_BLANK',
            campaignAvailable: item.campaignAvailable || '_BLANK',
            campaignDateStart: '_BLANK',
            campaignDateEnd: '_BLANK'
          }
        }
      })
    },
    edit (item) {
      this.$store.commit('campaigns/setCampaignSelected', item.id)
      this.$store.commit('campaigns/toggleState', item.campaignState)
      this.$router.push({ name: 'campaignDetails', params: { campaignId: item.id } })
    },
    remove (item) {
      this.campaignId = item.id
      this.dialog = true
    },
    onConfirm () {
      this.deleteCampaign(this.campaignId)
      this.dialog = false
    },
    onCancel () {
      this.campaignId = ''
      this.dialog = false
    },
    exitSnackbar () {
      this.$store.commit('campaigns/setSnackbar', { snackbar: false })
      this.$store.commit('campaigns/setNotice', { notice: '' })
    }
  }
}
</script>

<template>
  <Layout>
    <v-container fluid>
      <v-col cols="12">
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
              <base-icon name="syncAlt" />
            </base-button>
            <base-button
              text
              icon
              color="primary"
              @click.native="csvExport(csvData)"
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
            :action-btn="true"
            @updated-items="campaignRemaining = $event"
            @edit="edit"
            @remove="remove"
          />
        </v-card>
      </v-col>
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
    <!-- FAB panel -->
    <base-button
      fab
      large
      bottom
      right
      color="primary"
      fixed
      @click.stop="addCampaignDialog = !addCampaignDialog"
    >
      <v-icon>add</v-icon>
    </base-button>
    <form-add-campaign
      v-if="addCampaignDialog"
      :add-campaign-dialog="addCampaignDialog"
      @emitCloseCampaignDialog="addCampaignDialog=arguments[0]"
    />
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>

<script>
import Layout from '@layouts/main'
import { mapGetters, mapActions } from 'vuex'
import { campaignComputed } from '@state/helpers'
import formatDateData from '@utils/format-date'


export default {
  page: {
    title: 'Widgets',
    meta: [{ name: 'description', content: 'Campaign Widgets' }],
  },
  components: { Layout },
  data() {
    return {
      baseModule: 'campaignwidgets',
      dialog: '',
      dialogTitle: "Campaign Delete Dialog",
      dialogText: "Do you want to delete this campaign?",
      headers: [
        { text: 'Widget', value: 'google' },
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
      mutablePagination: '',
      search: ''
    }
  },
  computed: {
    ...campaignComputed,
    ...mapGetters('organizations', [
      'hadList',
    ]),
    isNotEmpty () {
      return this.items && this.items.length > 0;
    },
    filteredItems() {
      return this.items.filter(item => {
        if(!this.search){
          return this.items
        }else{
          return (item.campaignCode.toLowerCase().includes(this.search.toLowerCase()) || 
            item.campaignName.toLowerCase().includes(this.search.toLowerCase())  )

        }
      })
    }
  },
  watch: {
    searchCampaign: function(value){
            console.log(value)
    }
  },
  created () {

    if(!this.hadList) this.getOrganizationsList()

    if(!this.hadCampaignList) this.getAllCampaigns()

    this.mutablePagination = this.pagination
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
    nextPage (newValue) {
      return this.$store.dispatch('campaigns/updatePage', newValue)
    },
    formatDate(dateData){
        if(dateData) return formatDateData(dateData.seconds)
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
                v-model.lazy="search"
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
              color="indigo"
            >
              <v-icon>
                print
              </v-icon>
            </base-button>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="filteredItems"
            :pagination.sync="mutablePagination"
            sort-icon="keyboard_arrow_down"
            class="elevation-1 pa-2"
            hide-default-footer
          >
            <!-- <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>          -->
            <template
              slot="headerCell"
              slot-scope="{ header }"
            >
              <span
                class="subheading font-weight-light light-green--text text--darken-1"
                v-text="header.text"
              />
            </template>
            <template 
              slot="items" 
              slot-scope="props"
              class="body-2" 
            >
              <td class="text-xs-center">
                <a :href="`campaignwidget/${props.item.id}`">
                  <v-icon>widgets</v-icon>
                </a>
              </td>
              <td><small>{{ props.item.campaignCode }}</small></td>
              <td><small>{{ props.item.organizationLevel3Name }}</small></td>
              <td><small>{{ props.item.campaignName }}</small></td>
              <td><small>{{ props.item.keyword }}</small></td>
              <td><small>{{ props.item.shortcode }}</small></td>
              <!-- <td><small>{{ formatDate(props.item.campaignDateStart) }}</small></td>
              <td><small>{{ formatDate(props.item.campaignDateEnd) }}</small></td> -->
              <td><small>{{ props.item.campaignAvailable }}</small></td>
              <td><small>{{ props.item.campaignState }}</small></td>
            </template>
          </v-data-table>
          <v-flex
            v-if="isNotEmpty"
            class="text-xs-center pt-2"
          >
            <v-pagination
              v-model="mutablePagination.page" 
              :length="mutablePagination.pages"
              next-icon="arrow_right"
              prev-icon="arrow_left"
              color="light-green"
              circle
              @input="nextPage"
            />
          </v-flex> 
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


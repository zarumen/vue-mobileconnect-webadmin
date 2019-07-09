<script>
// import { mapState, mapActions, mapGetters } from 'vuex'
import formatDateRelative from '@utils/format-date-relative'
import { campaignComputed, reportComputed, reportMethods } from '@state/helpers'

export default {
  page: {
    title: 'Reports Manager',
    meta: [{ name: 'description', content: 'Campaigns Reports Managemnet' }],
  },
  components: {
    Layout: () => import('@layouts/main')
  },
  data() {
    return {
      baseModule: 'reports',
      left: true,
      timeout: 2000,
      exportJobs: [],
      search: ''
    }
  },
  computed: {
    ...campaignComputed,
    ...reportComputed,
    filteredItems () {

      if(this.search) {
        return this.items.filter(item => item.campaignName.toLowerCase().includes(this.search.toLowerCase()) ||
        item.campaignCode.toLowerCase().includes(this.search.toLowerCase()))
      } else {
        return this.items
      }
    },
    checkedJobList () {
      return (this.jobList.length > 0) ? 1 : 0
    }
  },
  created () {
    // query by auth user specific
    if(!this.hadCampaignList)
      this.getAllCampaigns()
  },
  methods: {
    ...reportMethods,
    reloadData () {
      this.getAllCampaigns()
    },
    convertTime (time) {
      return formatDateRelative(time.seconds)
    },
    clicked (i) {
      return console.log(i)
    },
    createExportJob (id, code) {
      
      this.createS3DownloadFileJob({
        campaignId: id,
        fileName: code
      })

      this.getCampaignExportJobsListener({
        campaignId: id
      })

      return true
    },
    downloadExportFile (id, file) {

      this.getFileDownloadFromS3({
        campaignId: this.getCampaignSelected,
        fileName: file
      })

      return id
    },
    clickedSelectedCampaignReports (id) {

      this.getCampaignExportJobsListener({
        campaignId: id
      })
    }
  }
}
</script>

<template>
  <Layout>
    <v-container 
      fluid
      fill-height
      grid-list-xl
    >
      <v-layout
        wrap
      >
        <v-flex
          md12
          lg6
        >
          <base-card
            color="light-green"
            title="List All Campaign"
            text="List of campaigns to get reported"
          >
            <v-card-title>
              <span class="title">
                Campaigns {{ filteredItems? `(${filteredItems.length})` : '' }}
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Quick Search"
                  class="purple-input"
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
            </v-card-title>
            <v-card-text>
              <v-list three-line>
                <template
                  v-for="(item,index) in filteredItems"
                >
                  <v-list-item 
                    :key="index"
                    @click.stop="clickedSelectedCampaignReports(item.id)"
                  >
                    <v-list-item-action>
                      <v-tooltip
                        top
                        content-class="top"
                      >
                        <v-btn
                          slot="activator"
                          class="v-btn--simple"
                          color="secondary"
                          icon
                          @click.stop="createExportJob(item.id, item.campaignCode)"
                        >
                          <v-icon>cloud_download</v-icon>
                        </v-btn>
                        <span>Download New File From S3</span>
                      </v-tooltip>
                    </v-list-item-action>
                    <v-list-item-content class="ma-2">
                      <div style="width: 100%">
                        <v-layout 
                          justify-space-between 
                          row
                        >
                          <v-flex 
                            align-content-center 
                            class="my-2"
                          >
                            {{ item.campaignName }} <br>
                            <v-list-item-subtitle>{{ item.campaignCode }} : {{ item.campaignActive }}</v-list-item-subtitle>
                          </v-flex>
                        </v-layout>
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider 
                    v-if="index + 1 < items.length" 
                    :key="`divider-${index}`"
                  />
                </template>
              </v-list>
            </v-card-text>
          </base-card>
        </v-flex>
        <v-flex
          md12
          lg6
        >
          <base-card
            color="deep-purple"
            title="Report Files Management"
            text="List of Report from Selected Campaign"
          >
            <v-card-title class="title">
              <span>
                Campaign: {{ campaignSelected }}
              </span>
              <v-spacer />
              <v-btn 
                class="v-btn--simple"
                color="primary"
                circle
                icon
                @click.native="clickedSelectedCampaignReports(campaignSelected)"
              >
                <BaseIcon name="syncAlt" />            
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div v-if="!checkedJobList">
                <v-alert
                  color="deep-purple lighten-2"
                  class="v-alert--notification"
                  icon="new_releases"
                  :value="true"
                >
                  Sorry, nothing to display here, <br> Please select another Campaign or Load New One.
                </v-alert>
              </div>
              <div v-else>
                <v-list two-line>
                  <template
                    v-for="(item,index) in jobList"
                  >
                    <v-list-item 
                      :key="index"
                      @click="clicked"
                    >
                      <!-- <v-list-item-avatar>
                        <v-chip
                          color="light-green white--text"
                          small
                          label
                        >
                          {{ item.type }}
                        </v-chip>
                      </v-list-item-avatar> -->
                      <v-list-item-content 
                        class="ma-2"
                      >
                        <v-list-item-title>
                          {{ item.fileName }}
                        </v-list-item-title>
                        <v-list-item-subtitle>create Time: {{ convertTime(item.createTime) }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-tooltip
                          top
                          content-class="top"
                        >
                          <v-btn
                            slot="activator"
                            class="v-btn--simple"
                            color="primary"
                            icon
                            @click.stop="downloadExportFile(index, item.fileName)"
                          >
                            <v-icon>save_alt</v-icon>
                          </v-btn>
                          <span>Download Recent File</span>
                        </v-tooltip>
                        <v-tooltip
                          top
                          content-class="top"
                        >
                          <v-btn
                            slot="activator"
                            class="v-btn--simple"
                            color="danger"
                            icon
                          >
                            <v-icon>close</v-icon>
                          </v-btn>
                          <span>Deleted Recent File</span>
                        </v-tooltip>
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider 
                      v-if="index + 1 < items.length" 
                      :key="`divider-${index}`"
                    />
                  </template>
                </v-list>
              </div>
            </v-card-text>
          </base-card>
        </v-flex>
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
            text 
            @click.native="exitSnackbar"
          >
            Close
          </v-btn>
        </v-snackbar>
      </v-layout>
    </v-container>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>


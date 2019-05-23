<script>
import Layout from '@layouts/main'
import { campaignComputed, reportMethods } from '@state/helpers'

export default {
  page: {
    title: 'Reports',
    meta: [{ name: 'description', content: 'Reports' }],
  },
  components: { Layout },
  data() {
    return {
      baseModule: 'reports',
      left: true,
      timeout: 2000,
      exportJobs: [],
      s3downloadlink: '',
      search: ''
    }
  },
  computed: {
    ...campaignComputed,
    filteredItems () {

      if(this.search) {
        return this.items.filter(item => item.campaignName.toLowerCase().includes(this.search.toLowerCase()) ||
        item.campaignCode.toLowerCase().includes(this.search.toLowerCase()))
      } else {
        return this.items
      }

    },
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

  }
}
</script>

<template>
  <Layout>
    <v-container fluid>
      <v-flex xs12>
        <base-card
          color="light-green"
          title="Report All Campaign"
        >
          <v-card-title>
            <span class="title">
              Campaigns {{ pagination? "("+pagination.totalItems+")": "" }}
              <v-text-field
                v-model="search"
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
          </v-card-title>
          <v-card-text>
            <v-list three-line>
              <v-list-group
                v-for="(item,index) in filteredItems"
                :key="index"
              >
                <v-list-tile 
                  slot="activator" 
                >
                  <v-list-tile-content 
                    @click="getAWSExportJobsListByCampaign(item.id).then((result)=>{
                      getFirebaseExportJobsByCampaign(item.id,result)
                    })"
                  >
                    <div style="width: 100%">
                      <v-layout 
                        justify-space-between 
                        row
                      >
                        <v-flex 
                          align-content-center 
                          xs11
                        >
                          {{ item.campaignCode }}: {{ item.campaignName }} <br>
                          <v-list-tile-sub-title>{{ item.campaignActive }}</v-list-tile-sub-title>
                        </v-flex>
                        <v-flex xs1>
                          <v-tooltip
                            top
                            content-class="top"
                          >
                            <v-btn
                              slot="activator"
                              class="v-btn--simple"
                              color="secondary"
                              icon
                              @click="createExportJob(item.id,item.campaignCode,100000,'XLSX')"
                            >
                              <v-icon>view_comfy</v-icon>
                            </v-btn>
                            <span>Create Excel Export Job</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider 
                  v-if="index + 1 < items.length" 
                  :key="`divider-${index}`"
                /> 
                <!-- SUBLIST -->
                <template v-if="exportJobs[item.id]">
                  <v-list-tile-content 
                    v-for="(job) in exportJobs[item.id][0].sort((a,b)=>{     
                      var x = a.fileName; var y = b.fileName
                      return ((x < y) ? 1 : ((x > y) ? -1 : 0))     
                    })" 
                    :key="job.id"
                  >
                    <div class="d-flex">
                      <v-list-tile-sub-title style="display: flex; align-items: center; justify-content: center">
                        Type: {{ job.type }}
                      </v-list-tile-sub-title>
                      <v-list-tile-sub-title style="display: flex; align-items: center; justify-content: center">
                        {{ job.fileName }}
                      </v-list-tile-sub-title>
                      <v-tooltip
                        top
                        content-class="top"
                      >
                        <v-btn
                          slot="activator"
                          :disabled="!job.key"
                          class="v-btn--simple"
                          color="secondary"
                          icon
                          @click="getS3DownloadLink(item.id,job.key)"
                        >
                          <v-icon>cloud_download</v-icon>
                        </v-btn>
                        <span>Download</span>
                      </v-tooltip>
                    </div>
                  </v-list-tile-content>
                </template>
              </v-list-group>
            </v-list>
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
          flat 
          @click.native="exitSnackbar"
        >
          Close
        </v-btn>
      </v-snackbar>
    </v-container>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>


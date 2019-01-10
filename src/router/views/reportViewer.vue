<script>
import Layout from '@layouts/main'
import { mapGetters, mapActions } from 'vuex'
import { campaignComputed } from '@state/helpers'
import firestoreApp from "@utils/firestore.config"

export default {
  page: {
    title: 'Reports',
    meta: [{ name: 'description', content: 'Campaigns Report Viewer' }],
  },
  components: { Layout },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      baseModule: 'reportViewer',
      left: true,
      timeout: 2000,
      exportJobs: []
    }
  },
  computed: {
    ...campaignComputed,
    ...mapGetters('campaigns', [
      'hadCampaignList',
    ]),
    authLevel () {
      // set Auth Level before send to Query
      if(this.user.organizationAuth === 'Level1')
        return this.user.organizationLevel1
      
      if(this.user.organizationAuth === 'Level2')
        return this.user.organizationLevel2
      
      if(this.user.organizationAuth === 'Level3')
        return this.user.organizationLevel3
    }
  },
  watch: {

  },
  created () {
    // query by auth user specific
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
    exitSnackbar () {
      this.$store.commit('campaigns/setSnackbar', { snackbar: false })
      this.$store.commit('campaigns/setNotice', { notice: '' })
    },
    reloadData () {
      this.getCampaignsByOrg({
        auth: this.user.organizationAuth, 
        orgId: this.authLevel
      })
    },
    async getExportJobsByCampaign(campaignId) {
      let tmp
      try {
      tmp = await firestoreApp
        .collection('exportJobs').doc(campaignId).collection('jobs')
        .get()

        } catch (error) { console.log(error)}

        this.exportJobs[campaignId] = []
        let jobtmp = []
        tmp.forEach(function(item) {
          jobtmp.push(item.data());
        });

        this.exportJobs[campaignId].push(jobtmp) 
        this.exportJobs['test'] = "test"

        console.log(this.exportJobs[campaignId])
        this.$forceUpdate()
    },

  },
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
            <v-spacer/>
            <v-btn 
              class="v-btn--simple"
              color="primary"
              circle
              icon
              @click.native="reloadData()"
            >
              <BaseIcon name="syncAlt"/>            
            </v-btn>
          </v-card-title>
          <!-- Insert in Base-Table Component -->
          <v-card-text>
            <v-list three-line>
              <v-list-group
                v-for="(item,index) in items"
                :key="index"
              >
                <v-list-tile 
                  slot="activator" 
                >
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ item.campaignName }} : {{ item.campaignCode }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title >
                      {{ item.id }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>      
                  <div class="d-flex">
                    <v-tooltip
                      top
                      content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="secondary"
                        icon
                        @click="getExportJobsByCampaign(item.id)"
                      >
                        <v-icon>view_comfy</v-icon>
                      </v-btn>
                      <span>Excel</span>
                    </v-tooltip>
                    <v-tooltip
                      top
                      content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="secondary"
                        icon
                        @click="test(item.id)"
                      >
                        <v-icon>settings_ethernet</v-icon>
                      </v-btn>
                      <span>Json</span>
                    </v-tooltip>
                  </div>
                </v-list-tile>
                <v-divider 
                  v-if="index + 1 < items.length" 
                  :key="`divider-${index}`"
                />
                <!--  subList -->
                <v-list-tile 
                  v-for="job in exportJobs[item.id]" 
                  :key="job.id"
                  class="text-xs-right">
                  <v-list-tile-content >
                    <v-list-tile-sub-title >Type: {{ job[0].type }} Filename: {{ job[0].fileName }}</v-list-tile-sub-title >
                  </v-list-tile-content>
                </v-list-tile >
              </v-list-group>
            </v-list>
          </v-card-text>

        </base-card>
      </v-flex>
      <v-snackbar 
        v-if="loading===false" 
        :left="true" 
        :timeout="timeout" 
        :color="mode" 
        v-model="snackbar"
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


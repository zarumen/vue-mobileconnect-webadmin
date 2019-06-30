<script>
import { mapActions } from 'vuex'
import { campaignComputed } from '@state/helpers'
// TODO: Delete Job Button

export default {
  page: {
    title: 'Reports',
    meta: [{ name: 'description', content: 'Campaigns Report Viewer' }],
  },
  components: { 
    Layout: () => import('@layouts/main')
  },
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
      search: ''
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
    filteredItems () {

      if(this.search) {
        return this.items.filter(item => item.campaignName.toLowerCase().includes(this.search.toLowerCase()) ||
        item.campaignCode.toLowerCase().includes(this.search.toLowerCase()))
      } else {
        return this.items
      }
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
    ...mapActions('reports', [
      'createS3DownloadFileJob',
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
    createExportJob (id, code) {
      this.$store.commit('campaigns/setLoading', { loading: true })
      
      this.createS3DownloadFileJob({
        campaignId: id,
        fileName: code
      })

      return true
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
                <v-list-tile 
                  :key="index"
                >
                  <v-list-tile-action>
                    <v-tooltip
                      v-if="!loading"
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
                    <v-tooltip
                      v-else
                      top
                      content-class="top"
                    >
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="secondary"
                        icon
                        :loading="loading"
                      >
                        <v-icon>cloud_download</v-icon>
                      </v-btn>
                      <span>Downloading...</span>
                    </v-tooltip>
                  </v-list-tile-action>
                  <v-list-tile-content class="ma-2">
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
                          <v-list-tile-sub-title>{{ item.campaignCode }} : {{ item.campaignActive }}</v-list-tile-sub-title>
                        </v-flex>
                      </v-layout>
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider 
                  v-if="index + 1 < items.length" 
                  :key="`divider-${index}`"
                />
              </template>
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


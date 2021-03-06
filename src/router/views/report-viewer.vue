<script>
import { mapActions } from 'vuex'
import { campaignComputed } from '@state/helpers'
import formatDate from '@utils/format-date'
// TODO: Delete Job Button

export default {
  page: {
    title: 'Reports',
    meta: [{ name: 'description', content: 'Campaigns Report Viewer' }]
  },
  components: {
    Layout: () => import('@layouts/main')
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
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
      if (this.user.organizationAuth === 'Level1') { return this.user.organizationLevel1 }

      if (this.user.organizationAuth === 'Level2') { return this.user.organizationLevel2 }

      if (this.user.organizationAuth === 'Level3') { return this.user.organizationLevel3 }

      return null
    },
    filteredItems () {
      if (this.search) {
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
    if (!this.hadCampaignList) {
      this.reloadData()
    }
  },
  methods: {
    ...mapActions('campaigns', [
      'getCampaignsByOrg'
    ]),
    ...mapActions('reports', [
      'createS3DownloadFileJob'
    ]),
    print () {
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
    renderDate (state, item) {
      let val = ''

      if (state === 'start') {
        if (item.campaignDateStart) {
          val = formatDate(item.campaignDateStart.seconds)
        }
      }
      if (state === 'end') {
        if (item.campaignDateEnd) {
          val = formatDate(item.campaignDateEnd.seconds)
        }
      }

      return val
    },
    renderState (item) {

    }
  }
}
</script>

<template>
  <Layout>
    <v-container fluid>
      <v-col cols="12">
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
            <base-button
              color="primary"
              text
              @click.native="reloadData()"
            >
              reload
              <!-- <base-icon name="syncAlt" />           -->
            </base-button>
          </v-card-title>
          <v-card-text>
            <v-list three-line>
              <template
                v-for="(item,index) in filteredItems"
              >
                <v-list-item
                  :key="index"
                >
                  <v-list-item-action class="pt-3">
                    <v-tooltip
                      v-if="!loading"
                      top
                    >
                      <template v-slot:activator="{ on }">
                        <base-button
                          color="secondary"
                          icon
                          v-on="on"
                          @click.stop="createExportJob(item.id, item.campaignCode)"
                        >
                          <v-icon>cloud_download</v-icon>
                        </base-button>
                      </template>
                      <span>Download New File From S3</span>
                    </v-tooltip>
                    <v-tooltip
                      v-else
                      top
                    >
                      <template v-slot:activator="{ on }">
                        <base-button
                          color="secondary"
                          icon
                          :loading="loading"
                          v-on="on"
                        >
                          <v-icon>cloud_download</v-icon>
                        </base-button>
                      </template>
                      <span>Downloading...</span>
                    </v-tooltip>
                  </v-list-item-action>
                  <v-list-item-content>
                    <div>
                      <v-row
                        justify-space-between
                      >
                        <v-col
                          align-content-center
                        >
                          <v-list-item-title>{{ item.campaignName }}</v-list-item-title>
                          <v-list-item-subtitle>
                            Campaign Start :
                            <span class="green--text">{{ renderDate('start', item) }}</span>
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            Campaign End :
                            <span class="primary--text">{{ renderDate('end', item) }}</span>
                          </v-list-item-subtitle>
                        </v-col>
                      </v-row>
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
      </v-col>
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

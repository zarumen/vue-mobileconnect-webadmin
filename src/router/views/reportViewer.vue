<script>
import Layout from '@layouts/main'
import { mapGetters, mapActions } from 'vuex'
import { campaignComputed } from '@state/helpers'

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
    }
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
          text="Complete your profile"
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
              <template
                v-for="(item,index) in items"
              >
                <v-list-tile
                  :key="index"
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
              </template>
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


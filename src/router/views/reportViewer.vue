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
    ...mapGetters('organizations', [
      'hadList',
    ]),

  },
  watch: {

  },
  created () {
      this.getCampaignsByOrg(this.user.organizationLevel1,this.user.organizationLevel2,this.user.organizationLevel3)
  },
  methods: {
    ...mapActions('campaigns', [
      'getCampaignsByOrg',
      'deleteCampaign',
      'closeSnackBar',
    ]),
    print() {
      window.print()
    },
    reloadData () {
      this.getCampaignsByOrg(this.user.organizationLevel1,this.user.organizationLevel2,this.user.organizationLevel3)
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
            <v-spacer/>
            <v-btn 
              flat 
              icon 
              color="green"
              @click.native="reloadData()"
            >
              <BaseIcon name="syncAlt"/>            
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
          <base-card
            class="card-tabs"
            color="green"
          >
            <v-list 
              v-for="(item,index) in items" 
              :key="index"
              three-line
            >
              <v-list-tile >
                <!--            <v-list-tile-action>
                  <v-checkbox
                    :value="list[2]"
                    color="green"
                  />
                </v-list-tile-action> -->
                <v-layout column="1">
                  <v-list-title>{{ item.campaignCode }}</v-list-title>
                  <v-list-tile-title >
                    {{ item.campaignHeader }}
                  </v-list-tile-title> 
                </v-layout>

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
                      <v-icon >save_alt</v-icon>
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
                      <v-icon >save_alt</v-icon>
                    </v-btn>
                    <span>Json</span>
                  </v-tooltip>
                </div>
              </v-list-tile>
            </v-list>
          </base-card>
        </v-card>
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


<script>
import formatDateRelative from '@utils/format-date-relative'
import { mapGetters, mapActions } from 'vuex'

export default {
  page: {
    title: 'CampaignDetails',
    meta: [{ name: 'description', content: 'CampaignDetails' }],
  },
  components: { 
    Layout: () => import('@layouts/main'),
    Doughnut: () => import('@utils/chart/Doughnut'),
    LineChart: () => import('@utils/chart/LineChart'),
  },
  data: () => ({
    text: '',
    text2: '',
    totals: ''
  }),
  computed: {
    ...mapGetters('auth', [
      'isAdmin',
    ]),
    ...mapGetters('campaigns', [
      'getOneCampaign',
      'getOneCampaignValidate',
    ]),
    ...mapGetters('transactions', [
      'getTransactionTotals',
      'getTimestampTxTotals'
    ]),
    updatedTimestampTxTotals () {

      let date = (Date.parse(this.getTimestampTxTotals))/1000

      return formatDateRelative(date)
    },
    campaignInfo () {
      return this.getOneCampaign(this.$route.params.campaignId)
    }
  },
  created () {
    this.getCampaignValidate({
      campaignId: this.$route.params.campaignId
    })

    this.socketRegister({
      campaignState: 'production',
      campaignId: this.$route.params.campaignId
    })

    this.initializeData()
  },
  destroyed () {

    this.socketUnRegister({
      campaignState: 'production',
      campaignId: this.$route.params.campaignId
    })
  },
  methods: {
    ...mapActions('campaigns', [
      'getCampaignValidate',
      'updateStatusCampaign'
    ]),
    ...mapActions('transactions', [
      'socketRegister',
      'socketUnRegister'
    ]),
    clicked () {
      this.text = this.getOneCampaign(this.$route.params.campaignId)
      this.text2 = this.getOneCampaignValidate
      
      return this.text
    },
    initializeData () {
      // initial load socket.io data
      this.totals = this.getTransactionTotals
    },
    clickToProduciton () {
      this.updateStatusCampaign({
        campaignId: this.$route.params.campaignId
      })
    }
  },
}
</script>

<template>
  <Layout>
    <v-container
      fill-height
      fluid
      grid-list-xl
    >
      <v-row>
        <v-col 
          cols="12"
          sm="6"
          lg="3"
        >
          <base-stats-card
            color="green"
            icon="store"
            title="SMS Transactions"
            :value="(getTransactionTotals) ? getTransactionTotals : 0"
            sub-icon="alarm"
            :sub-text="updatedTimestampTxTotals"
          />
        </v-col>
        <v-col 
          cols="12"
          sm="6"
          lg="3"
        >
          <base-stats-card
            color="orange"
            icon="store"
            title="SMS Registration"
            value="8,049"
            sub-icon="alarm"
            sub-text="Last 24 Hours"
          />
        </v-col>
        <v-col 
          cols="12"
          sm="6"
          lg="3"
        >
          <base-stats-card
            color="blue"
            icon="store"
            title="Rewards Remaining"
            value="945"
            sub-icon="alarm"
            sub-text="Last 24 Hours"
          />
        </v-col>
        <v-col 
          cols="12"
          sm="6"
          lg="3"
        >
          <base-stats-card
            color="purple"
            icon="money"
            title="Revenue"
            value="$34,245"
            sub-icon="alarm"
            sub-text="Last 24 Hours"
          />
        </v-col>
        <v-col
          cols="12"
          md8
          pa-5
        >
          <base-card
            color="deep-purple"
            title="Admin Panels"
            text="Check Campaigns Details Statistics"
          >
            <h2 class="font-weight-medium secondary--text">
              Campaign: {{ campaignInfo.campaignName }}
            </h2>

            <p class="mb-5">
              &nbsp;&nbsp;{{ campaignInfo.campaignDescription }}<br>
              <span class="primary--text">&nbsp;Company Owner:</span> {{ campaignInfo.organizationLevel1Name }}<br>
              <span class="primary--text">&nbsp;Brand Owner:</span> {{ campaignInfo.organizationLevel3Name }}<br>
            </p>

            <h5 class="font-weight-medium secondary--text">
              Campaign Info and Validate Info
            </h5>
            <p class="mb-5">
              Lorem ipsum dolor sit amet, consecte tur adipi scin e<br>
              lit. Etiam vulputate augu e vel felis gravida porta.
            </p>

            <v-alert
              outlined
              color="info"
            >
              <!-- <v-row
                v-for="(skill, i) in skills"
                :key="i"
                style="color: #69A1BB;"
                wrap
              >
                <v-col
                  xs6
                  text-uppercase
                  v-text="skill.name"
                />
                <v-col
                  xs6
                  text-right
                  v-text="`${skill.value}%`"
                />
                <v-progress-linear
                  :value="skill.value"
                  color="info"
                  height="8"
                />
              </v-row> -->
            </v-alert>
          </base-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
          lg="4"
        >
          <base-card
            color="info"
            type="Line"
          >
            <Doughnut />
            <h4 class="title font-weight-light">
              KEYWORDS COUNTING
            </h4>
            <p class="category d-inline-flex font-weight-light">
              <v-icon
                color="green"
                small
              >
                arrow_upward
              </v-icon>
              <span class="green--text">
                55%
              </span>&nbsp;
              increase in today's transactions
            </p>

            <template slot="actions">
              <v-icon
                class="mr-2"
                small
              >
                access_time
              </v-icon>
              <span class="caption grey--text font-weight-light">
                updated 4 minutes ago
              </span>
            </template>
          </base-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
          lg="4"
        >
          <base-card
            color="info"
            type="Line"
          >
            <LineChart />
            <h4 class="title font-weight-light">
              TRANSACTIONS
            </h4>
            <p class="category d-inline-flex font-weight-light">
              <v-icon
                color="green"
                small
              >
                arrow_upward
              </v-icon>
              <span class="green--text">
                55%
              </span>&nbsp;
              increase in today's transactions
            </p>

            <template slot="actions">
              <v-icon
                class="mr-2"
                small
              >
                access_time
              </v-icon>
              <span class="caption grey--text font-weight-light">
                updated 4 minutes ago
              </span>
            </template>
          </base-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
          lg="4"
        >
          <base-card
            v-if="text"
          >
            <!-- <v-avatar
              slot="offset"
              class="mx-auto d-block"
              size="150"
            >
              <img
                src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/supportfemale-512.png"
              >
            </v-avatar> -->
            <v-card-text 
              class="text-center"
            >
              <h4 class="card-title font-weight-light">
                {{ text.campaignCode }}
              </h4>
              <p class="category text-gray font-weight-thin mb-3">
                {{ text.campaignName }}
              </p>
              <p class="category text-gray font-weight-thin mb-3">
                KEYWORD: {{ text.keyword }}
              </p>
              <p class="category text-gray font-weight-thin mb-3">
                SHORTCODE: {{ text.shortcode }}
              </p>
              <p class="category text-gray font-weight-thin mb-3">
                STATUS: {{ text.campaignState }}
              </p>
            </v-card-text>
            <v-card-actions>
              <base-button
                color="red"
                text
              >
                Paused
              </base-button>
              <div class="flex-grow-1" />
              <base-button
                color="primary"
                text
                @click="clickToProduciton"
              >
                Production
              </base-button>
            </v-card-actions>
          </base-card>
        </v-col>
        <v-col
          v-if="isAdmin"
          md12
          cols="12"
          lg4
        >
          <p class="subheading">
            &nbsp;Campaign "{{ $route.params.campaignId }}" Details
          </p>
          <base-button
            color="success"
            @click="clicked()"
          >
            Click
          </base-button>
        </v-col>
        <v-col
          v-if="text"
          md12
          cols="12"
          lg4
        >
          <p>{{ text }}</p>
        </v-col>
        <v-col
          v-if="text2"
          md12
          cols="12"
          lg4
        >
          <p>{{ text2 }}</p>
        </v-col>
      </v-row>
    </v-container>
  </Layout>
</template>


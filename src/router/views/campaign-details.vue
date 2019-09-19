<script>
import formatDateRelative from '@utils/format-date-relative'
import { mapGetters, mapActions } from 'vuex'

export default {
  page: {
    title: 'CampaignDetails',
    meta: [{ name: 'description', content: 'CampaignDetails' }],
  },
  components: { Layout: () => import('@layouts/main'), },
  data: () => ({
    text: '',
    text2: '',
    totals: ''
  }),
  computed: {
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
      <v-layout wrap>
        <v-flex 
          sm6
          xs12
          md6
          lg3
        >
          <base-stats-card
            color="green"
            icon="store"
            title="SMS Transactions"
            :value="(getTransactionTotals) ? getTransactionTotals : 0"
            sub-icon="alarm"
            :sub-text="updatedTimestampTxTotals"
          />
        </v-flex>
        <v-flex 
          sm6
          xs12
          md6
          lg3
        >
          <base-stats-card
            color="orange"
            icon="store"
            title="SMS Registration"
            value="8,049"
            sub-icon="alarm"
            sub-text="Last 24 Hours"
          />
        </v-flex>
        <v-flex 
          sm6
          xs12
          md6
          lg3
        >
          <base-stats-card
            color="blue"
            icon="store"
            title="Rewards Remaining"
            value="945"
            sub-icon="alarm"
            sub-text="Last 24 Hours"
          />
        </v-flex>
        <v-flex 
          sm6
          xs12
          md6
          lg3
        >
          <base-stats-card
            color="purple"
            icon="money"
            title="Revenue"
            value="$34,245"
            sub-icon="alarm"
            sub-text="Last 24 Hours"
          />
        </v-flex>
        <v-flex
          xs12
          md8
          pa-5
        >
          <base-card
            color="deep-purple"
            title="Admin Panels"
            text="Check Campaigns Details Statistics"
          >
            <h2 class="secondary--text">
              About Campaign
            </h2>

            <p class="mb-5">
              Lorem ipsum dolor sit amet, consectetur adipi<br>
              scin elit. Etiam vulputate augue vel felis gravida<br>
              porta. Lorem ipsum dolor sit amet.
            </p>

            <h5 class="secondary--text">
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
              <!-- <v-layout
                v-for="(skill, i) in skills"
                :key="i"
                style="color: #69A1BB;"
                wrap
              >
                <v-flex
                  xs6
                  text-uppercase
                  v-text="skill.name"
                />
                <v-flex
                  xs6
                  text-right
                  v-text="`${skill.value}%`"
                />
                <v-progress-linear
                  :value="skill.value"
                  color="info"
                  height="8"
                />
              </v-layout> -->
            </v-alert>
          </base-card>
        </v-flex>
        <v-flex
          md4
        >
          <base-card
            v-if="text"
            class="v-card-profile"
          >
            <v-avatar
              slot="offset"
              class="mx-auto d-block"
              size="150"
            >
              <img
                src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/supportfemale-512.png"
              >
            </v-avatar>
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
        </v-flex>
        <v-flex
          md12
          sm12
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
        </v-flex>
        <v-flex
          v-if="text"
          md12
          sm12
          lg4
        >
          <p>{{ text }}</p>
        </v-flex>
        <v-flex
          v-if="text2"
          md12
          sm12
          lg4
        >
          <p>{{ text2 }}</p>
        </v-flex>
      </v-layout>
    </v-container>
  </Layout>
</template>


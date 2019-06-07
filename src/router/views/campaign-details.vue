<script>
import Layout from '@layouts/main'
import { mapGetters } from 'vuex'

export default {
  page: {
    title: 'CampaignDetails',
    meta: [{ name: 'description', content: 'CampaignDetails' }],
  },
  components: { Layout },
  data: () => ({
    text: '',
    text2: '',
  }),
  computed: {
    ...mapGetters('campaigns', [
      'getOneCampaign',
      'getOneCampaignValidate',
    ])
  },
  created () {
    this.$store.dispatch('campaigns/getCampaignValidate', {
      campaignId: this.$route.params.campaignId
    })
  },
  methods: {
    clicked () {
      this.text = this.getOneCampaign(this.$route.params.campaignId)
      this.text2 = this.getOneCampaignValidate
      
      return this.text
    }
  }
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
            value="18,413"
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
          <base-card>
            <h2 class="info--text">
              About Campaign
            </h2>

            <p class="mb-5">
              Lorem ipsum dolor sit amet, consectetur adipi<br>
              scin elit. Etiam vulputate augue vel felis gravida<br>
              porta. Lorem ipsum dolor sit amet.
            </p>

            <h5 class="info--text">
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
                  text-xs-right
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
              class="text-xs-center"
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
              <v-btn
                color="primary"
                round
                class="font-weight-light"
              >
                Change to Production
              </v-btn>
            </v-card-text>
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
          <v-btn
            color="success"
            @click="clicked()"
          >
            Click
          </v-btn>
        </v-flex>
        <v-flex
          md12
          sm12
          lg4
        >
          <p>{{ text }}</p>
        </v-flex>
        <v-flex
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


<script>
import Layout from '@layouts/main'
import Bar from '@utils/chart/Bar'
import Doughnut from '@utils/chart/Doughnut'
import LineChart from '@utils/chart/LineChart'

export default {
  page: {
    title: 'Dashboard',
    meta: [{ name: 'description', content: 'Dashboard' }],
  },
  components: { 
    Layout,
    Bar,
    Doughnut,
    LineChart
  },
}
</script>

<template>
  <Layout>
    <v-container 
      id="dashboard" 
      fluid 
      grid-list-lg 
      class="mx-0 pa-0"
    >
      <v-layout 
        row 
        wrap
      >
        <v-flex 
          md3 
          sm6 
          xs12
        >
          <v-card 
            class="cyan darken-3" 
            light
          >
            <v-container 
              fluid 
              grid-list-sm 
              class="cyan darken-3" 
              light
            >
              <v-layout 
                class="mt-2 mb-0" 
                row 
                wrap
              >
                <v-flex xs2>
                  <v-icon 
                    class="mx-1" 
                    x-large 
                    light
                  >
                    card_membership
                  </v-icon>
                </v-flex>
                <v-flex 
                  md6 
                  sm10
                >
                  <div class="mx-1">
                    <div class="subheading">SMS Transactions</div>
                    <strong>84,568,445</strong>
                  </div>
                </v-flex>
                <v-flex 
                  class="text-xs-right" 
                  sm12 
                  md4
                >
                  <v-btn 
                    fab 
                    dark 
                    class="white--text darken-1" 
                    flat
                  >
                    <v-icon>
                      more
                    </v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex 
          md3 
          sm6 
          xs12
        >
          <v-card 
            class="deep-orange  lighten-3" 
            light
          >
            <v-container 
              fluid 
              grid-list-sm
            >
              <v-layout 
                class="mt-2 mb-0" 
                row 
                wrap
              >
                <v-flex xs2>
                  <v-icon 
                    class="mx-4" 
                    x-large 
                    light
                  >
                    card_membership
                  </v-icon>
                </v-flex>
                <v-flex 
                  md6 
                  sm10
                >
                  <div class="mx-4">
                    <div class="subheadingfont">SMS Registrations</div>
                    <strong>78,049</strong>
                  </div>
                </v-flex>
                <v-flex 
                  class="text-xs-right" 
                  sm12 
                  md4
                >
                  <v-btn 
                    fab 
                    dark 
                    class="white--text darken-1" 
                    flat
                  >
                    <v-icon>
                      more
                    </v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex 
          md3 
          sm6 
          xs12
        >
          <v-card 
            class="blue-grey darken-1" 
            light
          >
            <v-container 
              fluid 
              grid-list-sm
            >
              <v-layout 
                class="mt-2 mb-0" 
                row 
                wrap>
                <v-flex xs2>
                  <v-icon 
                    class="mx-4" 
                    x-large 
                    light
                  >
                    card_membership
                  </v-icon>
                </v-flex>
                <v-flex 
                  md6 
                  sm10
                >
                  <div class="mx-4">
                    <div class="subheadingfont">Campaigns Launched</div>
                    <strong>78</strong>
                  </div>
                </v-flex>
                <v-flex 
                  class="text-xs-right" 
                  sm12 
                  md4
                >
                  <v-btn 
                    fab 
                    dark 
                    class="white--text darken-1" 
                    flat
                  >
                    <v-icon>
                      more
                    </v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex 
          md3 
          sm6 
          xs12
        >
          <v-card 
            class="pink lighten-4" 
            light
          >
            <v-container 
              fluid 
              grid-list-sm
            >
              <v-layout 
                class="mt-2 mb-0" 
                row 
                wrap
              >
                <v-flex xs2>
                  <v-icon 
                    class="mx-4" 
                    x-large 
                    light
                  >
                    card_membership
                  </v-icon>
                </v-flex>
                <v-flex 
                  md6 
                  sm10
                >
                  <div class="mx-4">
                    <div class="subheadingfont">Bounce Rate</div>
                    <strong>53%</strong>
                  </div>
                </v-flex>
                <v-flex 
                  class="text-xs-right" 
                  sm12 
                  md4
                >
                  <v-btn 
                    fab 
                    dark 
                    class="white--text darken-1" 
                    flat
                  >
                    <v-icon>
                      more
                    </v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout 
        class="pt-1" 
        row 
        wrap
      >
        <v-flex 
          md4 
          xs12
        >
          <v-card light>
            <doughnut/>
          </v-card>
        </v-flex>
        <v-flex 
          md4 
          xs12
        >
          <v-card light>
            <bar/>
          </v-card>
        </v-flex>
        <v-flex 
          md4 
          xs12
        >
          <v-card 
            light 
            class="Chart"
          >
            <line-chart/>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>


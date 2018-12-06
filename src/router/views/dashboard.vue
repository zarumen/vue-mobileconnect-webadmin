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
  data () {
    return {
      test: 'test in data',
      dailySalesChart: {
        info: {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [
            [12, 17, 7, 17, 23, 18, 38]
          ]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dataCompletedTasksChart: {
        data: {
          labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
          series: [
            [230, 750, 450, 300, 280, 240, 200, 190]
          ]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      emailsSubscriptionChart: {
        data: {
          labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mai', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

          ]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0]
              }
            }
          }]
        ]
      },
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
            value="84,568,445"
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
            value="78,049"
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
            title="Campaigns Launched"
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
          md12
          sm12
          lg4
        >
          <base-chart-card
            :data="dailySalesChart.info"
            :options="dailySalesChart.options"
            color="info"
            type="Line"
          >
            <h4 class="title font-weight-light">Daily Sales</h4>
            <p class="category d-inline-flex font-weight-light">
              <v-icon
                color="green"
                small
              >
                mdi-arrow-up
              </v-icon>
              <span class="green--text">55%</span>&nbsp;
              increase in today's sales
            </p>

            <template slot="actions">
              <v-icon
                class="mr-2"
                small
              >
                access_time
              </v-icon>
              <span class="caption grey--text font-weight-light">updated 4 minutes ago</span>
            </template>
          </base-chart-card>
        </v-flex>
        <v-flex
          md12
          sm12
          lg4
        >
          <base-chart-card
            :data="emailsSubscriptionChart.data"
            :options="emailsSubscriptionChart.options"
            :responsive-options="emailsSubscriptionChart.responsiveOptions"
            color="red"
            type="Bar"
          >
            <h4 class="title font-weight-light">Email Subscription</h4>
            <p class="category d-inline-flex font-weight-light">Last Campaign Performance</p>

            <template slot="actions">
              <v-icon
                class="mr-2"
                small
              >
                access_time
              </v-icon>
              <span class="caption grey--text font-weight-light">updated 10 minutes ago</span>
            </template>
          </base-chart-card>
        </v-flex>
        <v-flex
          md12
          sm12
          lg4
        >
          <base-chart-card
            :data="dataCompletedTasksChart.data"
            :options="dataCompletedTasksChart.options"
            color="green"
            type="Line"
          >
            <h3 class="title font-weight-light">Completed Tasks</h3>
            <p class="category d-inline-flex font-weight-light">Last Last Campaign Performance</p>

            <template slot="actions">
              <v-icon
                class="mr-2"
                small
              >
                access_time
              </v-icon>
              <span class="caption grey--text font-weight-light">campaign sent 26 minutes ago</span>
            </template>
          </base-chart-card>
        </v-flex>
      </v-layout>
      <!-- <v-layout 
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
      </v-layout> -->
    </v-container>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>


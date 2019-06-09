<script>

export default {
  page: {
    title: 'Dashboard',
    meta: [{ name: 'description', content: 'Dashboard' }],
  },
  components: { 
    Layout: () => import('@layouts/main'),
  },
  data () {
    return {
      today: new Date(),
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
      headers: [
        {
          sortable: false,
          text: 'ID',
          value: 'id'
        },
        {
          sortable: false,
          text: 'Name',
          value: 'name'
        },
        {
          sortable: false,
          text: 'Salary',
          value: 'salary',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Country',
          value: 'country',
          align: 'right'
        },
        {
          sortable: false,
          text: 'City',
          value: 'city',
          align: 'right'
        }
      ],
      items: [
        {
          name: 'Dakota Rice',
          country: 'Niger',
          city: 'Oud-Tunrhout',
          salary: '$35,738'
        },
        {
          name: 'Minerva Hooper',
          country: 'Curaçao',
          city: 'Sinaai-Waas',
          salary: '$23,738'
        }, {
          name: 'Sage Rodriguez',
          country: 'Netherlands',
          city: 'Overland Park',
          salary: '$56,142'
        }, {
          name: 'Philip Chanley',
          country: 'Korea, South',
          city: 'Gloucester',
          salary: '$38,735'
        }, {
          name: 'Doris Greene',
          country: 'Malawi',
          city: 'Feldkirchen in Kārnten',
          salary: '$63,542'
        }
      ],
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false
      },
      events: [
        {
          title: 'Vacation',
          details: 'Going to the beach!',
          date: '2018-12-30',
          open: false
        },
        {
          title: 'Vacation',
          details: 'Going to the beach!',
          date: '2018-12-31',
          open: false
        },
        {
          title: 'Vacation',
          details: 'Going to the beach!',
          date: '2019-01-01',
          open: false
        },
        {
          title: 'Meeting',
          details: 'Spending time on how we do not have enough time',
          date: '2019-01-07',
          open: false
        },
        {
          title: '30th Birthday',
          details: 'Celebrate responsibly',
          date: '2019-01-03',
          open: false
        },
        {
          title: 'New Year',
          details: 'Eat chocolate until you pass out',
          date: '2019-01-01',
          open: false
        },
        {
          title: 'Conference',
          details: 'Mute myself the whole time and wonder why I am on this call',
          date: '2019-01-21',
          open: false
        },
        {
          title: 'Hackathon',
          details: 'Code like there is no tommorrow',
          date: '2019-02-01',
          open: false
        }
      ]
    }
  },
  computed: {
    // convert the list of events into a map of lists keyed by date
    eventsMap () {
      const map = {}
      this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e))
      return map
    },
    date () {
      return this.events.map(x => x.date)
    }
  },
  methods: {
    complete (index) {
      this.list[index] = !this.list[index]
    },
    open (event) {
      alert(event.title)
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
            <h4 class="title font-weight-light">
              Daily Sales
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
              increase in today's sales
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
            <h4 class="title font-weight-light">
              Email Subscription
            </h4>
            <p class="category d-inline-flex font-weight-light">
              Last Campaign Performance
            </p>

            <template slot="actions">
              <v-icon
                class="mr-2"
                small
              >
                access_time
              </v-icon>
              <span class="caption grey--text font-weight-light">
                updated 10 minutes ago
              </span>
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
            <h3 class="title font-weight-light">
              Completed Tasks
            </h3>
            <p class="category d-inline-flex font-weight-light">
              Last Last Campaign Performance
            </p>

            <template slot="actions">
              <v-icon
                class="mr-2"
                small
              >
                access_time
              </v-icon>
              <span class="caption grey--text font-weight-light">
                campaign sent 26 minutes ago
              </span>
            </template>
          </base-chart-card>
        </v-flex>
        <v-flex
          md12
          lg6
        >
          <base-card
            color="orange"
            title="Employee Stats"
            text="New employees on 15th September, 2016"
          >
            <v-layout>
              <v-flex>
                <v-sheet height="500">
                  <v-calendar
                    :now="today"
                    :value="today"
                    color="orange"
                  >
                    <template v-slot:day="{ present, past, date }">
                      <template v-for="event in eventsMap[date]">
                        <v-menu
                          :key="event.title"
                          v-model="event.open"
                          full-width
                          offset-x
                        >
                          <template v-slot:activator="{ on }">
                            <v-btn
                              v-if="!event.time"
                              class="v-btn--simple"
                              color="orange darken-2"
                              v-on="on"
                            >
                              {{ event.title }}
                            </v-btn>
                          </template>
                          <v-card
                            color="grey lighten-4"
                            min-width="350px"
                            flat
                          >
                            <v-toolbar
                              color="primary"
                              dark
                            >
                              <v-btn icon>
                                <v-icon>edit</v-icon>
                              </v-btn>
                              <v-toolbar-title>{{ event.title }}</v-toolbar-title>
                              <v-spacer />
                              <v-btn icon>
                                <v-icon>favorite</v-icon>
                              </v-btn>
                              <v-btn icon>
                                <v-icon>more_vert</v-icon>
                              </v-btn>
                            </v-toolbar>
                            <v-card-title primary-title>
                              <span>{{ event.details }}</span>
                            </v-card-title>
                            <v-card-actions>
                              <v-btn
                                text
                                color="secondary"
                              >
                                Cancel
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-menu>
                      </template>
                    </template>
                  </v-calendar>
                </v-sheet>
              </v-flex>
            </v-layout>
          </base-card>
        </v-flex>
        <v-flex
          md12
          lg6
        >
          <base-card
            class="card-tabs"
            color="deep-purple darken-3"
          >
            <v-flex
              slot="header"
            >
              <v-tabs
                v-model="tabs"
                color="transparent"
                slider-color="light-green"
              >
                <span
                  class="subheading font-weight-light mr-3"
                  style="align-self: center"
                >
                  Shortcode:
                </span>
                <v-tab class="mr-3">
                  <v-icon class="mr-2">
                    list
                  </v-icon>
                  List
                </v-tab>
                <v-tab class="mr-3">
                  <v-icon class="mr-2">
                    whatshot
                  </v-icon>
                  Keyword
                </v-tab>
                <v-tab>
                  <v-icon class="mr-2">
                    star
                  </v-icon>
                  Reserved
                </v-tab>
              </v-tabs>
            </v-flex>
            <v-card-title>
              <span class="title">
                ShortCode Totals 
                <v-text-field
                  append-icon="search"
                  label="Quick Search"
                  class="purple-input"
                  single-line
                  hide-details
                />
              </span>
              <v-spacer />
              <v-btn 
                v-if="tabs === 0"
                class="v-btn--simple"
                color="light-green darken-2"
                round
              >
                +SHORTCODE            
              </v-btn>
              <v-btn 
                v-if="tabs === 1"
                class="v-btn--simple"
                color="light-green darken-2"
                round
              >
                +KEYWORD            
              </v-btn>
              <v-btn 
                v-if="tabs === 2"
                class="v-btn--simple"
                color="light-green darken-2"
                round
              >
                +KEYWORD RESERVED            
              </v-btn>
            </v-card-title>

            <v-tabs-items v-model="tabs">
              <v-tab-item :value="0">
                <v-list three-line>
                  <v-list-tile @click="complete(0)">
                    <v-list-tile-action>
                      <v-checkbox
                        :value="list[0]"
                        color="green"
                      />
                    </v-list-tile-action>
                    <v-list-tile-title>
                      Sign contract for "What are conference organized afraid of?"
                    </v-list-tile-title>
                    <div class="d-flex">
                      <v-tooltip
                        top
                        content-class="top"
                      >
                        <v-btn
                          slot="activator"
                          class="v-btn--simple"
                          color="secondary"
                          icon
                        >
                          <v-icon>create</v-icon>
                        </v-btn>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip
                        top
                        content-class="top"
                      >
                        <v-btn
                          slot="activator"
                          class="v-btn--simple"
                          color="danger"
                          icon
                        >
                          <v-icon color="error">
                            close
                          </v-icon>
                        </v-btn>
                        <span>Close</span>
                      </v-tooltip>
                    </div>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile @click="complete(1)">
                    <v-list-tile-action>
                      <v-checkbox
                        :value="list[1]"
                        color="green"
                      />
                    </v-list-tile-action>
                    <v-list-tile-title>
                      Lines From Great Russian Literature? Or E-mails From My Boss?
                    </v-list-tile-title>
                    <div class="d-flex">
                      <v-tooltip
                        top
                        content-class="top"
                      >
                        <v-btn
                          slot="activator"
                          class="v-btn--simple"
                          color="secondary"
                          icon
                        >
                          <v-icon>create</v-icon>
                        </v-btn>
                        <span>Edit</span>
                      </v-tooltip>

                      <v-tooltip
                        top
                        content-class="top"
                      >
                        <v-btn
                          slot="activator"
                          class="v-btn--simple"
                          color="danger"
                          icon
                        >
                          <v-icon color="error">
                            close
                          </v-icon>
                        </v-btn>
                        <span>Close</span>
                      </v-tooltip>
                    </div>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile @click="complete(2)">
                    <v-list-tile-action>
                      <v-checkbox
                        :value="list[2]"
                        color="green"
                      />
                    </v-list-tile-action>
                    <v-list-tile-title>
                      Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit
                    </v-list-tile-title>
                    <div class="d-flex">
                      <v-tooltip
                        top
                        content-class="top"
                      >
                        <v-btn
                          slot="activator"
                          class="v-btn--simple"
                          color="secondary"
                          icon
                        >
                          <v-icon>create</v-icon>
                        </v-btn>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip
                        top
                        content-class="top"
                      >
                        <v-btn
                          slot="activator"
                          class="v-btn--simple"
                          color="danger"
                          icon
                        >
                          <v-icon color="error">
                            close
                          </v-icon>
                        </v-btn>
                        <span>Close</span>
                      </v-tooltip>
                    </div>
                  </v-list-tile>
                </v-list>
              </v-tab-item>
              <v-tab-item :value="1">
                <v-card>
                  <v-card-title>
                    2
                  </v-card-title>
                </v-card>
                <v-card>
                  <v-card-title>
                    3
                  </v-card-title>
                </v-card>
                <v-card>
                  <v-card-title>
                    4
                  </v-card-title>
                </v-card>
              </v-tab-item>
              <v-tab-item :value="2">
                3
              </v-tab-item>
            </v-tabs-items>
          </base-card>
        </v-flex>
      </v-layout>
    </v-container>
  </Layout>
</template>

<style lang="scss" module scoped>
@import '@design';

.my-event {
  width: 100%;
  padding: 3px;
  margin-bottom: 1px;
  overflow: hidden;
  font-size: 12px;
  color: rgb(255, 255, 255);
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  background-color: #1867c0;
  border: 1px solid #1867c0;
  border-radius: 2px;
}
</style>


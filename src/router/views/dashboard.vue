<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { formatDateTime } from '@utils/format-date'

export default {
  page: {
    title: 'Dashboard',
    meta: [{ name: 'description', content: 'Dashboard' }]
  },
  components: {
    Layout: () => import('@layouts/main')
  },
  data () {
    return {
      focus: '',
      test: 'test in data',
      type: 'month',
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
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
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false
      },
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days'
      }
    }
  },
  computed: {
    ...mapState('campaigns', {
    // ListItem of Data Table
      items: state => state.items
    }),
    ...mapGetters('campaigns', [
      'hadCampaignList'
    ]),
    campaignEvent () {
      if (this.items) {
        const eventsD = []
        const dataArray = this.items

        dataArray.forEach((element, index) => {
          const {
            campaignCode,
            campaignName,
            campaignDateEnd,
            campaignDateStart,
            campaignState
          } = element

          if (campaignDateStart && campaignDateEnd) {
            const startdate = this.timeFormatter(campaignDateStart.seconds)
            // let enddate = this.timeFormatter(campaignDateEnd.seconds)

            const data = {
              name: campaignCode,
              details: `${campaignName} \n\r campaignState: "${campaignState}"`,
              start: startdate,
              // end: enddate,
              color: this.randomColor()
            }
            eventsD.push(data)
          } else {

            // let data = {
            //   name: campaignCode,
            //   details: campaignName,
            //   color: this.randomColor()
            // }
            // eventsD.push(data)

          }
        })
        return eventsD
      }
      return []
    },
    // convert the list of events into a map of lists keyed by date
    today () {
      const currentDate = new Date()
      const formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate() + ' ' + currentDate.getHours() + ':' + currentDate.getMinutes()
      return formattedDate
    },
    title () {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }

      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth

      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear

      const startDay = start.day + this.nth(start.day)
      const endDay = end.day + this.nth(end.day)

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`
        case 'week':
        case '4day':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    monthFormatter () {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'short'
      })
    }
  },
  created () {
    if (!this.hadCampaignList) { this.getAllCampaigns() }
  },
  methods: {
    ...mapActions('campaigns', [
      'getAllCampaigns'
    ]),
    complete (index) {
      this.list[index] = !this.list[index]
    },
    open (event) {
      alert(event.title)
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'week'
    },
    getEventColor (event) {
      return event.color
    },
    randomColor () {
      const myArray = [
        'red', 'pink', 'purple',
        'deep-purple', 'indigo', 'blue',
        'light-blue', 'cyan', 'teal',
        'green', 'light-green', 'lime',
        'yellow', 'amber', 'orange',
        'deep-orange', 'brown', 'blue-grey'
      ]

      return myArray[Math.floor(Math.random() * myArray.length)]
    },
    setToday () {
      this.focus = this.today
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => {
          return (this.selectedOpen = true)
        }, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start
      this.end = end
    },
    nth (d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    },
    timeFormatter (seconds) {
      return formatDateTime(seconds)
    }
  }
}
</script>

<template>
  <Layout>
    <v-container
      class="grey lighten-5"
      fill-height
    >
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <base-stats-card
            color="green"
            icon="store"
            title="SMS Transactions"
            value="84,568,445"
            sub-icon="alarm"
            sub-text="Last 24 Hours"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <base-stats-card
            color="orange"
            icon="store"
            title="SMS Registration"
            value="78,049"
            sub-icon="alarm"
            sub-text="Last 24 Hours"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <base-stats-card
            color="blue"
            icon="store"
            title="Campaigns Launched"
            value="945"
            sub-icon="alarm"
            sub-text="Last 24 Hours"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
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
        <!-- <v-col
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
        </v-col>
        <v-col
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
        </v-col>
        <v-col
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
        </v-col> -->
        <v-col
          cols="12"
        >
          <base-card
            color="orange"
            title="Campaigns Start Date Calendar"
            text="Check CampaignState Status"
          >
            <v-row>
              <v-col>
                <v-sheet height="64">
                  <v-toolbar
                    flat
                    color="white"
                  >
                    <v-btn
                      outlined
                      class="mr-1"
                      small
                      @click="setToday"
                    >
                      Today
                    </v-btn>
                    <v-btn
                      fab
                      text
                      small
                      @click="prev"
                    >
                      <v-icon small>
                        mdi-chevron-left
                      </v-icon>
                    </v-btn>
                    <v-btn
                      fab
                      text
                      small
                      @click="next"
                    >
                      <v-icon small>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                    <v-toolbar-title class="caption">
                      {{ title }}
                    </v-toolbar-title>
                    <div class="flex-grow-1" />
                    <v-menu
                      bottom
                      right
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn
                          class="ml-2"
                          small
                          outlined
                          v-on="on"
                        >
                          <span>{{ typeToLabel[type] }}</span>
                          <v-icon right>
                            mdi-menu-down
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="type = 'day'">
                          <v-list-item-title>Day</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = 'week'">
                          <v-list-item-title>Week</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = 'month'">
                          <v-list-item-title>Month</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = '4day'">
                          <v-list-item-title>4 days</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-toolbar>
                </v-sheet>
                <v-sheet height="500">
                  <v-calendar
                    ref="calendar"
                    v-model="focus"
                    color="orange"
                    :now="today"
                    :type="type"
                    :events="campaignEvent"
                    :event-color="getEventColor"
                    :event-margin-bottom="3"
                    @click:event="showEvent"
                    @click:more="viewDay"
                    @click:date="viewDay"
                    @change="updateRange"
                  />
                  <v-menu
                    v-model="selectedOpen"
                    :close-on-content-click="false"
                    :activator="selectedElement"
                    offset-x
                  >
                    <v-card
                      color="grey lighten-4"
                      min-width="350px"
                      flat
                    >
                      <v-toolbar
                        :color="selectedEvent.color"
                        dark
                      >
                        <v-btn icon>
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-toolbar-title class="white--text">
                          {{ selectedEvent.name }}
                        </v-toolbar-title>
                        <div class="flex-grow-1" />
                        <v-btn icon>
                          <v-icon>mdi-heart</v-icon>
                        </v-btn>
                        <v-btn icon>
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </v-toolbar>
                      <v-card-text>
                        <span>
                          {{ selectedEvent.details }}
                        </span>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          text
                          color="primary"
                          @click="selectedOpen = false"
                        >
                          Cancel
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-sheet>
              </v-col>
            </v-row>
          </base-card>
        </v-col>
      </v-row>
    </v-container>
  </Layout>
</template>

<style lang="scss" module scoped>
@import '@design';

</style>

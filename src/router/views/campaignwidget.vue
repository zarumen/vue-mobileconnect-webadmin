<script>
import Layout from '@layouts/main'
import firestoreApp from '@utils/firestore.config'
import Chart from 'chart.js'
import formatCurrency from '@utils/format-number'
import { genTimeSeries, genEmptyArray } from '@utils/rgt-array'

const ChartData = {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: '# message per min',
      data: [],
      backgroundColor: 'rgba(31, 119, 180, 1)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    title: {
      display: true,
      text: ''
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        ticks: {
          maxTicksLimit: 30,
          stepSize: 1
        }
      }]
    }
  }
}

const VoteData = {
  type: 'bar',
  data: {
    labels: ['', '', '', ''],
    datasets: [{
      label: '# messages',
      data: [0, 0, 0, 0],
      percent: [0, 0, 0, 0],
      backgroundColor: 'rgba(31, 119, 180, 1)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    title: {
      display: true,
      text: ''
    }
  }
}

const RewardsData = {
  type: 'bar',
  data: {
    labels: ['', '', '', ''],
    datasets: [{
      label: '# messages',
      data: [0, 0, 0, 0],
      percent: [0, 0, 0, 0],
      backgroundColor: 'rgba(31, 119, 180, 1)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    title: {
      display: true,
      text: ''
    }
  }
}

export default {
  page () {
    return {
      title: 'Campaign Widget',
      meta: [
        {
          name: 'description',
          content: 'List All Campaign Menu Widget'
        }
      ]
    }
  },
  components: { Layout },
  data () {
    return {
      totals: 0,
      totalsShow: 0,
      code: '',
      code2: '',
      code3: '',
      code4: '',
      campaignWidget: {
        caption: ' ',
        units: ' ',
        multiplier: 1,
        fontColor: '1CABE9',
        type: 'totals',
        offset: 0
      },
      ChartData: ChartData,
      VoteData: VoteData,
      RewardsData: RewardsData,
      smscount: 0,
      lastMinute: 0,
      myChart: null,
      timer: null,
      minutes: 120
    }
  },
  watch: {
    campaignWidget: {
      handler (val) {
        this.code = '<iframe width="560" height="315" src="https://sms2mkt.com/campaignwidgetview/' + this.$route.params.campaignId + '/' + this.campaignWidget.offset + '/' + this.campaignWidget.caption + '/' + val.units + '/' + this.campaignWidget.multiplier + '/' + this.campaignWidget.fontColor + '/production" frameborder="0" ></iframe>'
        this.code2 = '<iframe width="560" height="315" src="https://sms2mkt.com/campaignwidgetview2/' + this.$route.params.campaignId + '/' + this.campaignWidget.offset + '/' + this.campaignWidget.caption + '/' + val.units + '/' + this.campaignWidget.multiplier + '/' + this.campaignWidget.fontColor + '/production" frameborder="0" ></iframe>'
        this.code3 = '<iframe width="560" height="315" src="https://sms2mkt.com/campaignwidgetview3/' + this.$route.params.campaignId + '/' + this.campaignWidget.offset + '/' + this.campaignWidget.caption + '/' + val.units + '/' + this.campaignWidget.multiplier + '/' + this.campaignWidget.fontColor + '/production" frameborder="0" ></iframe>'

        firestoreApp.collection('campaignWidget').doc(this.$route.params.campaignId).set(this.campaignWidget).then(function () {
          console.log('Campaign Widget Successfully Written!')
        })
        const data = (this.totals - this.campaignWidget.offset) * this.campaignWidget.multiplier
        this.totalsShow = formatCurrency(data)
      },
      deep: true
    }
  },
  created () {
    this.$socket.emit('register', 'totals', 'production', this.$route.params.campaignId)
    this.$socket.emit('register', 'keyword', 'production', this.$route.params.campaignId)
    this.$socket.emit('register', 'rewards', 'production', this.$route.params.campaignId)
    this.getCampaignWidget(this.$route.params.campaignId)

    this.$options.sockets.transactionRewards = (newdata) => {
      console.log(newdata)
      console.log(typeof newdata)

      // Rewards Widget
      if (typeof newdata === 'object') { // Register Type Keyword
        console.log(newdata)

        // console.log(Object.keys(newdata))
        // console.log(Object.values(newdata))

        const keys = Object.keys(newdata)
        const data = Object.values(newdata)
        // const reducer = (accumulator, currentValue) => accumulator + currentValue;
        const totals = data.reduce((a, b) => parseInt(a) + parseInt(b), 0)
        // console.log("total:" + totals)

        let count = 0
        keys.forEach((result) => {
          this.VoteData.data.labels[count] = result
          this.VoteData.data.datasets[0].data[count] = data[count]
          this.VoteData.data.datasets[0].percent[count] = Math.round((data[count]) / totals * 100 * 100) / 100
          count++
        })

        this.$forceUpdate()
      }
    }
    this.$options.sockets.transactionTotals = (newdata) => {
      // line chart widget
      if (this.totals !== newdata && this.totals !== 0 && typeof newdata === 'string') {
        var d = new Date()
        var stime = d.toLocaleTimeString('th', { hour: '2-digit', minute: '2-digit' })
        this.ChartData.data.labels[this.minutes - 1] = stime

        this.smscount = this.smscount + (newdata - this.totals)
        this.myChart.data.datasets[0].data[this.minutes - 1] = this.smscount
        this.myChart.update()
      }

      if (typeof newdata === 'string') { // Register Type Total
        // totals widget
        // console.log("trans:" + newdata)
        this.totals = newdata
        const data = (newdata - this.campaignWidget.offset) * this.campaignWidget.multiplier
        this.totalsShow = formatCurrency(data)
      }
    }
  },
  mounted () {
    let d = new Date()
    this.ChartData.data.labels = genTimeSeries(d, this.minutes - 1)
    this.ChartData.data.datasets[0].data = genEmptyArray(this.minutes - 1)

    this.createChart('widget-chart', this.ChartData)
    this.timer = setInterval(() => {
      d = new Date()
      this.ChartData.data.labels = genTimeSeries(d, this.minutes - 1)

      const mydata = this.myChart.data.datasets[0].data
      mydata.shift()
      this.smscount = 0
      this.myChart.update()
    }, 60000)
  },
  methods: {
    socketRegister () {
      this.$socket.emit('register', 'totals', 'production', this.$route.params.campaignId)
    },
    getCampaignWidget (campaignId) {
      return firestoreApp
        .collection('campaignWidget')
        .doc(campaignId)
        .get()
        .then(doc => {
          if (doc.exists) {
            this.campaignWidget = doc.data()
          } else {
            console.log('No such document!')
            firestoreApp.collection('campaignWidget').doc(campaignId).set(this.campaignWidget).then(function () {
              console.log('New Campaign Widget Successfully Written!')
            })
          }
        })
        .catch(error => {
          console.log(error)
          return error
        })
    },
    createChart (chartId, chartData) {
      const ctx = document.getElementById(chartId)
      this.myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options
      })
    }
  }
}
</script>
<style>
  .superbig {
    font-family: "Roboto",sans-serif;
    font-size: 70px;
  }
  .big {
    font-family: "Roboto",sans-serif;
    font-size: 30px;
    color: #1CABE2;
    text-align: center;
  }
  .area {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .item {
    width: 90%;
    min-height: 50px;
    padding: 10px;
    margin: 1px;
    font-weight: bolder;
    background-color: #F1F1FF;
  }
  .percent {
    width: 15%;
    min-height: 50px;
    padding: 10px 10px;
    margin: 1px;
    font-weight: bold;
    text-align: right;
    background-color: #F1F1FF;
  }
</style>

<template>
  <Layout>
    <v-container
      fluid
      fill-height
    >
      <v-row align="center">
        <v-col
          cols="6"
        >
          <v-form>
            <p>Total Widget</p>
            <v-text-field
              v-if="campaignWidget.type=='totals'"
              v-model="campaignWidget.offset"
              :counter="10"
              label="Offset Count"
              required
            />
            <v-text-field
              v-model="campaignWidget.caption"
              :counter="40"
              label="Caption"
            />
            <v-text-field
              v-model="campaignWidget.units"
              :counter="10"
              label="Units"
              required
            />
            <v-text-field
              v-model="campaignWidget.multiplier"
              :counter="10"
              label="Multiplier"
            />
            <v-text-field
              v-model="campaignWidget.fontColor"
              :counter="10"
              label="fontColor"
            />
            <v-textarea
              v-model="code"
              label="Message"
              counter
              full-width
              single-line
            />
          </v-form>
        </v-col>
        <v-col cols="6">
          <base-card
            color="deep-purple"
            title="Mobile Connect Info"
            text="Operator's General Informations"
          >
            <v-row
              align="center"
              justify="center"
              style="
                height: 315px;
                border: 1px solid black;"
            >
              <v-col>
                <p />
                <h1
                  :style="{color: '#'+campaignWidget.fontColor}"
                  class="big"
                >
                  {{ campaignWidget.caption }}
                </h1>
              </v-col>
              <v-col cols="12">
                <div class="text-center">
                  <h1
                    :style="{color: '#'+campaignWidget.fontColor}"
                    class="superbig"
                  >
                    {{ totalsShow }} {{ campaignWidget.units }}
                  </h1>
                </div>
              </v-col>
            </v-row>
          </base-card>
        </v-col>
        <v-col
          cols="12"
          md="8"
        >
          <v-form>
            <p>Realtime Barchart Widget</p>
            <v-text-field
              v-model="campaignWidget.minutes"
              :counter="10"
              label="Minutes"
            />
            <v-textarea
              v-model="code2"
              label="Message"
              counter
              full-width
              single-line
            />
          </v-form>
        </v-col>
        <v-col cols="12">
          <h1
            :style="{color: '#'+campaignWidget.fontColor}"
            class="big"
          >
            {{ campaignWidget.caption }}
          </h1>
        </v-col>
        <v-col
          cols="12"
          style="width: 100%; padding-right: 20px; padding-bottom: 20px; padding-left: 20px;"
        >
          <div class="text-center">
            <canvas id="widget-chart" />
          </div>
        </v-col>
        <v-col cols=12>
          <div style="padding: 10px;" />
          <v-divider />
          <div style="padding: 10px;" />
        </v-col>
        <v-col
          cols="12"
          md="8"
        >
          <v-form>
            <p>Keywords Widget</p>
            <v-textarea
              v-model="code3"
              label="Message"
              counter
              full-width
              single-line
            />
          </v-form>
        </v-col>
        <v-col
          cols="12"
        >
          <v-card color="gray darken-2">
            <v-card-title primary-title>
              <v-col
                cols=12
              >
                <div
                  class="headline"
                  style="font-weight: bolder;"
                >
                  {{ campaignWidget.caption }}
                </div>
                <!-- <span>Vote sub title</span> -->
                <div class="headline" />
                <div style="height:50px" />
                <v-col
                  v-if="VoteData.data.labels !== undefine"
                  column
                  class="pa-0 ma-0"
                >
                  <v-col
                    v-for="(label, index) in VoteData.data.labels"
                    :key="label"
                    align-left
                    fill-height
                  >
                    <div
                      class="headline percent"
                      style="width:50px;"
                    >
                      {{ index+1 }}
                    </div>
                    <div
                      class="headline percent"
                      style="width:50px;"
                    >
                      {{ label }}
                    </div>
                    <div
                      style="width:90% "
                      class="headline item"
                    >
                      <span
                        :style="'padding-left:'+VoteData.data.datasets[0].percent[index]*10+'px;'+'background-color:#010166;' "
                        title="ActionScript"
                      />
                    </div>
                    <div class="headline percent">
                      {{ Math.round(VoteData.data.datasets[0].percent[index]) }}%
                    </div>
                  </v-col>
                </v-col>
                <div style="height:10px" />
              </v-col>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </Layout>
</template>

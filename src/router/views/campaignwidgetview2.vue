<script>
import Chart from 'chart.js';
import formatCurrency from '@utils/format-number'
import { genTimeSeries, genEmptyArray } from '@utils/rgt-array'

let ChartData = {
  type: 'bar',
  data: {
    labels: ['','','','','-26','','','','','-21','','','',-16,'','','','',-11,'','','','',-6,'','','','',-1],
    datasets: [{
          label: '# message per min',
          data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          backgroundColor:'rgba(31, 119, 180, 1)',
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
                  beginAtZero:true
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

export default {
  page() {
      return {
        title: 'Campaign Widget',
        meta: [
          {
            name: 'description',
            content: `The user profile for .`,
          },
        ],
      }
  }, 
  data() {
    return {
      headerText: 'aaaa',
      height: 300,
      width: 300,
      socketMessage: '',
      timeSeries: [],
      totals: 0,
      ChartData: ChartData,
      smscount: 0,
      lastMinute: 0,
      myChart: null,
      timer: null,
      minutes: 120
    }
  },
  created() {
    this.$socket.emit('register', 'totals','production',this.$route.params.campaignId)

    this.$options.sockets.transactionTotals = (newdata) => {
          // line chart widget
          if(this.totals !== newdata && this.totals !== 0){
            console.log(this.myChart.data.datasets[0].data)
            this.smscount = this.smscount + (newdata - this.totals);
            this.myChart.data.datasets[0].data[28] = this.smscount;
            this.myChart.update()  
          }

          console.log("trans:" + newdata)
          this.totals =  newdata 
          this.socketMessage = formatCurrency((newdata - this.$route.params.offset)  * this.$route.params.multiplier)
    }   
  },
  mounted() {
    let d = new Date();
    this.ChartData.data.labels = genTimeSeries(d,this.minutes-1)
    this.ChartData.data.datasets[0].data = genEmptyArray(this.minutes-1)

    this.createChart('widget-chart', this.ChartData);
    this.timer = setInterval(() => {
    d = new Date();
    this.ChartData.data.labels = genTimeSeries(d,this.minutes-1)

      let mydata = this.myChart.data.datasets[0].data;
      mydata.shift()
      this.smscount = 0
      this.myChart.update()
    }, 60000);
  },
  methods: {
    socketRegister(){
      console.log('param campaignId:'+this.campaignId)
      this.$socket.emit('register', 'totals','production',this.$route.params.campaignId);
    },
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      this.myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
  },
}
</script>
<style>
  .superbig {
    font-size: 70px;
    color: #1CABE2;
    font-family: "Roboto",sans-serif;
  }
  .big {
    font-size: 30px;
    color: #1CABE2;
    font-family: "Roboto",sans-serif;
    text-align: center;
  }
  .area {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<template>
  <v-container 
    fluid 
    fill-height
    fill-width
  >
    <v-layout column>
      <section>
        <v-layout 
          align-center 
          justify-center 
          column
        >
          <v-flex>
            <p />
            <h1 
              :style="{color: '#'+this.$route.params.color}"
              class="big" 
            >
              {{ this.$route.params.caption }}
            </h1>
          </v-flex>
        </v-layout>
        <v-layout> 
          <v-flex 
            xs-12
            style="width: 100%; padding-left: 20px; padding-bottom: 20px; padding-right: 20px;"        
          >
            <div class="text-xs-center">
              <canvas id="widget-chart" />
            </div>
          </v-flex>
        </v-layout>
      </section>
    </v-layout>
  </v-container>
</template>

<script>
import Chart from 'chart.js';
import formatCurrency from '@utils/format-number'

let ChartData = {
  type: 'bar',
  data: {
    labels: ['','','',''],
    datasets: [{
          label: '# messages',
          data: [0,0,0,0],
          percent: [0,0,0,0],
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
      timer: null
    }
  },
  created() {
    this.$socket.emit('register', 'keyword','production',this.$route.params.campaignId)

    this.$options.sockets.transaction = (newdata) => {
      console.log(Object.keys(newdata))
      console.log(Object.values(newdata))

      let keys = Object.keys(newdata)
      let data = Object.values(newdata)
      //const reducer = (accumulator, currentValue) => accumulator + currentValue;
      let totals = data.reduce((a,b)=> parseInt(a) + parseInt(b) , 0)
      console.log("total:" + totals)
      
      let count = 0
      keys.forEach((result)=>{
       this.ChartData.data.labels[count] = result
       this.ChartData.data.datasets[0].data[count] = data[count] 
       this.ChartData.data.datasets[0].percent[count] = Math.round((data[count])/totals * 100 * 100) / 100
       count++ 
      })
     
      this.$forceUpdate()
    }   
  },
  mounted() {
    this.createChart('widget-chart', this.ChartData);
/*     this.timer = setInterval(() => {
      let mydata = this.myChart.data.datasets[0].data;
      mydata.shift()
      this.smscount = 0
      this.myChart.update()
    }, 60000); */
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
  .item {
    min-height: 50px;
    width: 90%;
    margin: 1px;
    background-color: lightgray;
    padding: 10px;
    font-weight: bolder;
  }
  .percent {
    min-height: 50px;
    width: 15%;
    margin: 1px;
    padding: 10px 10px;
    font-weight: bold;
    background-color: #F1F1FF;
    text-align: right;   
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
        <!--         <v-layout 
          align-center 
          justify-center 
          column
        >
          <v-flex>
            <p/>
            <h1 
              :style="{color: '#'+this.$route.params.color}"
              class="big" 
            >
              {{ this.$route.params.caption }}
            </h1>
          </v-flex>
        </v-layout> -->
        <v-layout> 
          <v-flex 
            xs12
          >
             <v-card color="gray darken-2" >
              <v-card-title primary-title>
                <v-layout column>
                  <div class="headline" style="font-weight: bolder;">{{ this.$route.params.caption }}</div>
                  <span>Vote sub title</span>
                  <div class="headline"></div>
                  <div style="height:50px"></div>
                  <v-layout column class="pa-0 ma-0" v-if="ChartData.data.labels !== undefine">
                    <v-layout align-center justify-space-around row fill-height v-for="label, index in ChartData.data.labels"> 
                      <div class="headline item">{{ label }} </div>
                      <div class="headline percent">{{ ChartData.data.datasets[0].percent[index]}}%</div>
                    </v-layout>
                  </v-layout>
                  <div style="height:10px"></div>
                  <span>footer</span>
                </v-layout>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </section>
    </v-layout>
  </v-container>
</template>

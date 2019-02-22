<script>
import Chart from 'chart.js';
// import formatCurrency from '@utils/format-number'

let VoteData = {
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
      VoteData: VoteData,
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
      // const reducer = (accumulator, currentValue) => accumulator + currentValue;
      let totals = data.reduce((a,b)=> parseInt(a) + parseInt(b) , 0)
      console.log("total:" + totals)
      
      let count = 0
      keys.forEach((result)=>{
       this.VoteData.data.labels[count] = result
       this.VoteData.data.datasets[0].data[count] = data[count] 
       this.VoteData.data.datasets[0].percent[count] = Math.round((data[count])/totals * 100 * 100) / 100
       count++ 
      })
     
      this.$forceUpdate()
    }   
  },
  mounted() {
    this.createChart('widget-chart', this.ChartData);
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
    font-family: "Roboto",sans-serif;
    font-size: 70px;
    color: #1CABE2;
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
    background-color: lightgray;
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
  <v-container 
    fluid 
    fill-height
    fill-width
  >
    <v-layout column>
      <section>
        <v-layout> 
          <v-flex 
            xs12
          >
            <v-card color="gray darken-2">
              <v-card-title primary-title>
                <v-layout column>
                  <div
                    class="headline"
                    style="font-weight: bolder;"
                  >
                    {{ this.$route.params.caption }}
                  </div>
                  <!-- <span>Vote sub title</span> -->
                  <div class="headline" />
                  <div style="height:50px" />
                  <v-layout
                    v-if="VoteData.data.labels !== undefine"
                    column
                    class="pa-0 ma-0"
                  >
                    <v-layout
                      v-for="(label, index) in VoteData.data.labels"
                      :key="label"
                      align-center
                      justify-space-around
                      row
                      fill-height
                    > 
                      <div class="headline item">
                        {{ label }}
                      </div>
                      <div class="headline percent">
                        {{ VoteData.data.datasets[0].percent[index] }}%
                      </div>
                    </v-layout>
                  </v-layout>
                  <div style="height:10px" />
                  <!-- <span>footer</span> -->
                </v-layout>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </section>
    </v-layout>
  </v-container>
</template>

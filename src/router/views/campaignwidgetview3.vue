<script>
import Chart from 'chart.js';
// import formatCurrency from '@utils/format-number'

let VoteData = {
  type: 'horizontalBar',
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
          xAxes: [{
              minBarLength: 2,
              gridLines: {
                  offsetGridLines: false
              }
          }],
          yAxes: [{
              ticks: {
                  // Include a dollar sign in the ticks
                  callback: function(value, index, values) {
                      return value;
                  },
                  fontSize: 16
              },
              // barThickness: 20,
              barPercentage: 0.9,
          }]
      },
      legend: {
          labels: {
              // This more specific font property overrides the global property
              fontColor: 'black',
              defaultFontSize: 16,
              boxWidth: 60
          },
       
      },
      elements: {
        rectangle: {
          borderWidth: 10,
        }
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
      VoteData: VoteData,
      smscount: 0,
      lastMinute: 0,
      myChart: null,
      timer: null
    }
  },
  created() {
    this.$socket.emit('register', 'rewards','production',this.$route.params.campaignId)

    this.$options.sockets.transactionRewards = (newdata) => {

      let Sorted = []
      Sorted['key'] = Object.keys(newdata)
      Sorted['values'] = Object.values(newdata)

    
      // console.log(Sorted)
      let Sorted2 = this.bubbleSort(Sorted)
      // console.log(Sorted2)

      // let keys = Object.keys(newdata)
      let data = Object.values(newdata)
      // const reducer = (accumulator, currentValue) => accumulator + currentValue;
      let totals = data.reduce((a,b)=> parseInt(a) + parseInt(b) , 0)
      console.log("total:" + totals)
      
      let count = 0
      Sorted2['key'].forEach((result)=>{
       this.VoteData.data.labels[count] = result
       this.VoteData.data.datasets[0].data[count] = Sorted2['values'][count] 
       this.VoteData.data.datasets[0].percent[count] = Math.round((Sorted2['values'][count])/totals * 100 * 100) / 100
       count++ 

      })
      //this.myChart.update()
      this.$forceUpdate()

    }   
  },
  mounted() {
    // this.createChart('widget-chart', this.VoteData);
  },
  methods: {
    socketRegister(){
      // console.log('param campaignId:'+this.campaignId)
      // this.$socket.emit('register', 'totals','test',this.$route.params.campaignId);
    },
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      this.myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
    bubbleSort(arr){
      let i = 0;
      let j = 0;
      for (i = 0; i < arr['values'].length-1; i++){
          // Last i elements are already in place    
          for (j = 0; j < arr['values'].length-i-1; j++){
              
              if (parseInt(arr['values'][j]) < parseInt(arr['values'][j+1])){ // swap(arr[j], arr[j+1]); 
                let tmp = arr['values'][j]                
                arr['values'][j] = arr['values'][j+1]
                arr['values'][j+1] = tmp

                let tmp2 = arr['key'][j]
                arr['key'][j] = arr['key'][j+1]
                arr['key'][j+1] = tmp2
                
              } 
                 
          }
      }
      return arr       
    }
  }
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

                        
                      <span class="headline item" style="width:59px;" title="ActionScript">{{ label }}</span>
                      <div style="width:90%" class="headline item">
                        <span  :style="'padding-left:'+VoteData.data.datasets[0].percent[index]*10+'px;'+'background-color:#F1F1FF;' " title="ActionScript"></span>
                      </div>
                      

                      <div class="headline percent" style="width:120px">
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

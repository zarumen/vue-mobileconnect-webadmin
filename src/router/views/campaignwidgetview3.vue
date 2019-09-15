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
      isMobile: false,
      timer: null
    }
  },
  created() {
    this.$socket.emit('register', 'rewards',this.$route.params.state,this.$route.params.campaignId)

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
      // this.myChart.update()
      this.$forceUpdate()

    }   
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted() {
    // this.createChart('widget-chart', this.VoteData);
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  methods: {
    onResize () {
      this.isMobile = window.innerWidth < 640
    },
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
<style scoped>
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
    min-height: 50px;
    margin: 20px;
    font-weight: bolder;
    color:#010166;
  }
  .percent {
    width: 15%;
    min-height: 50px;
    padding: 10px 10px;
    margin: 1px;
    font-weight: bold;
    color:aliceblue;   
    text-align: right;
    background-color: #010166;
  }
  .line {
    background-color: #b8ebf8
  }
  .slidinglist-enter-active {
    transition: all 4s ease;
  }
  .slidinglist-leave-active {
    transition: all 2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
</style>

<template>
  <v-container 
    fluid 
    fill-height
    fill-width
  >
    <v-row>
      <v-col 
        cols="12"
      >
        <v-expand-transition>
          <v-card color="gray darken-2">
            <v-card-title primary-title>
              <span
                class="display-1"
                style="font-weight: bolder; color:#010166;"
              >
                {{ this.$route.params.caption }}
              </span>
            </v-card-title>
            <v-card-text>
              <v-list
                v-if="VoteData.data.labels !== 'undefined'"
                class="pa-1 ma-1"
              >
                <template
                  v-for="(label, index) in VoteData.data.labels"
                >
                  <v-divider
                    v-if="index !== 0"
                    :key="`${index}-divider`"
                    class="line"
                  />
                  <v-list-item 
                    :key="index"
                    class="pa-2"
                  >
                    <div v-if="!isMobile">
                      {{ index+1 }}
                    </div>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-row
                          class="columns: 2;"
                          no-gutters
                        >
                          <v-col
                            cols="3"
                            sm="2"
                            class="mr-0"
                          >
                            <v-chip
                              color="blue-grey lighten-4"
                              class="body-2 font-weight-light item"
                            >
                              {{ "KHK"+label }}
                            </v-chip>
                          </v-col>
                          <v-col
                            cols="auto"
                            class="headline item indigo darken-4 mx-0"
                          >
                            <span
                              v-if="isMobile"
                              :style="'padding-right:'+VoteData.data.datasets[0].percent[index]/4+'rem;'"
                            />
                            <span
                              v-else
                              :style="'padding-right:'+VoteData.data.datasets[0].percent[index]/1.5+'rem;'"
                            />
                          </v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action class="ml-0">
                      <v-avatar class="indigo darken-4 white--text">
                        {{ Math.round(VoteData.data.datasets[0].percent[index]) }}%
                      </v-avatar>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-list>
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-col>
      <v-col 
        cols="12"
        style="width: 100%; padding-right: 20px; padding-bottom: 20px; padding-left: 20px;"        
      >
        <div class="text-center">
          <canvas id="widget-chart" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

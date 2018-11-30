<script>
import Layout from '@layouts/main'
import firestoreApp from "@utils/firestore.config"
import Chart from 'chart.js';
import formatCurrency from '@utils/format-number'


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
  components: { Layout },
  data() {
    return {
      totals: 0,
      totalsShow: 0,
      code: '',
      code2: '',
      campaignWidget: {
        caption: '',
        units: ' ',
        multiplier: 1,
        fontColor: '1CABE9',
        type: 'totals',
        offset: 0,
      },
      ChartData: ChartData,
      smscount: 0,
      lastMinute: 0,
      myChart: null,
      timer: null
    }
  },
  watch:{
    campaignWidget: {
      handler(val) {
        this.code =  '<iframe width="560" height="315" src="https://sms2mkt.com/campaignwidgetview/'+this.$route.params.campaignId+'/'+this.campaignWidget.offset+'/'+this.campaignWidget.caption+'/'+val.units+'/'+this.campaignWidget.multiplier+'/'+this.campaignWidget.fontColor+'" frameborder="0" ></iframe>'
        this.code2 =  '<iframe width="560" height="315" src="https://sms2mkt.com/campaignwidgetview2/'+this.$route.params.campaignId+'/'+this.campaignWidget.offset+'/'+this.campaignWidget.caption+'/'+val.units+'/'+this.campaignWidget.multiplier+'/'+this.campaignWidget.fontColor+'" frameborder="0" ></iframe>'
        
        firestoreApp.collection("campaignWidget").doc(this.$route.params.campaignId).set(this.campaignWidget).then(function() {
          console.log("Campaign Widget Successfully Written!");
        });
        let data = (this.totals - this.campaignWidget.offset) * this.campaignWidget.multiplier
        this.totalsShow = formatCurrency(data)
        },
      deep: true
    }
  },
  created() {
    this.$socket.emit('register', 'totals','production',this.$route.params.campaignId);
    this.getCampaignWidget(this.$route.params.campaignId) 
  },
  mounted() {
    let MS_PER_MINUTE = 60000;
    let d = new Date();
    let stime = d.toLocaleTimeString()
    this.ChartData.data.labels[28] = stime
    let tmp_time = new Date(d - 1 * MS_PER_MINUTE)
    this.ChartData.data.labels[27] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 2 * MS_PER_MINUTE)
    this.ChartData.data.labels[26] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 3 * MS_PER_MINUTE)
    this.ChartData.data.labels[25] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 4 * MS_PER_MINUTE)
    this.ChartData.data.labels[24] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 5 * MS_PER_MINUTE)
    this.ChartData.data.labels[23] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 6 * MS_PER_MINUTE)
    this.ChartData.data.labels[22] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 7 * MS_PER_MINUTE)
    this.ChartData.data.labels[21] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 8 * MS_PER_MINUTE)
    this.ChartData.data.labels[20] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 9 * MS_PER_MINUTE)
    this.ChartData.data.labels[19] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 10 * MS_PER_MINUTE)
    this.ChartData.data.labels[18] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 11 * MS_PER_MINUTE)
    this.ChartData.data.labels[17] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 12 * MS_PER_MINUTE)
    this.ChartData.data.labels[16] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 13 * MS_PER_MINUTE)
    this.ChartData.data.labels[15] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 14 * MS_PER_MINUTE)
    this.ChartData.data.labels[14] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 15 * MS_PER_MINUTE)
    this.ChartData.data.labels[13] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 16 * MS_PER_MINUTE)
    this.ChartData.data.labels[12] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 17 * MS_PER_MINUTE)
    this.ChartData.data.labels[11] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 18 * MS_PER_MINUTE)
    this.ChartData.data.labels[10] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 19 * MS_PER_MINUTE)
    this.ChartData.data.labels[9] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 20 * MS_PER_MINUTE)
    this.ChartData.data.labels[8] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 21 * MS_PER_MINUTE)
    this.ChartData.data.labels[7] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 22 * MS_PER_MINUTE)
    this.ChartData.data.labels[6] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 23 * MS_PER_MINUTE)
    this.ChartData.data.labels[5] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 24 * MS_PER_MINUTE)
    this.ChartData.data.labels[4] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 25 * MS_PER_MINUTE)
    this.ChartData.data.labels[3] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 26 * MS_PER_MINUTE)
    this.ChartData.data.labels[2] = tmp_time.toLocaleTimeString()
    tmp_time = new Date(d - 27 * MS_PER_MINUTE)
    this.ChartData.data.labels[1] = tmp_time.toLocaleTimeString()

    //this.ChartData.data.labels[26] = stimeminus2.toLocaleTimeString()

    console.log(this.ChartData.data.labels)
    this.createChart('widget-chart', this.ChartData);
    this.timer = setInterval(() => {
      let mydata = this.myChart.data.datasets[0].data;
      mydata.shift()
      this.smscount = 0
      this.myChart.update()
    }, 60000);
  },
  methods: {
    socketRegister(){
      this.$socket.emit('register', 'totals','production',this.$route.params.campaignId);
    },
    getCampaignWidget(campaignId) {
      
      return firestoreApp
        .collection('campaignWidget')
        .doc(campaignId)
        .get()
        .then(doc => {
          if (doc.exists) {
              this.campaignWidget = doc.data()
          } else {
              console.log("No such document!");
              firestoreApp.collection("campaignWidget").doc(campaignId).set(this.campaignWidget).then(function() {
                  console.log("New Campaign Widget Successfully Written!");
              });
          }
        })
        .catch(error => {
          console.log(error)
          return error
        })
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
  socket: {
    events: {
        transaction(newdata) {
          // line chart widget
          if(this.totals !== newdata && this.totals !== 0){
            var d = new Date();
            var stime = d.toLocaleTimeString();
            this.ChartData.data.labels[28] = stime 
            console.log(this.ChartData.data.labels)
            console.log(this.myChart.data.datasets[0].data)
            this.smscount = this.smscount + (newdata - this.totals);
            this.myChart.data.datasets[0].data[28] = this.smscount;
            this.myChart.update()  
          }

          // totals widget
          console.log("trans:" + newdata)
          this.totals =  newdata 
          let data = (newdata - this.campaignWidget.offset) * this.campaignWidget.multiplier
          this.totalsShow = formatCurrency(data)

        },  
        
        connect() {
            console.log("Websocket connected to " + this.$socket.nsp);
        },

        disconnect() {
            console.log("Websocket disconnected from " + this.$socket.nsp);
        },

        error(err) {
            console.error("Websocket error!", err);
        }
    }
  },
}
</script>
<style>
  .superbig {
    font-size: 70px;
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
  <Layout>
    <v-container 
      fluid 
      fill-height
      
    >
      <v-layout 
        class="column" 
        fill-height>
        <section
          align-center
        >
          <v-layout
            align-center>
            <v-flex 
              xs-12
              md-8>
              <v-form >
                <p>Widget Type</p>
                <v-radio-group 
                  v-model="campaignWidget.type"
                  row
                >
                  <v-radio
                    :label="`Totals`"
                    :value="'totals'"

                  />
                  <!--v-radio
                    :label="`Keywords`"
                    :value="'keywords'"
                  /-->
                </v-radio-group>
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
            </v-flex>
          </v-layout>
        </section>
        <section>
          <v-layout 
            align-center 
            justify-center 
            column
            style="    
              height: 315px;
              width: 560px;
              border: 1px solid black;"
          >
            <v-flex>
              <p/>
              <h1 
                :style="{color: '#'+campaignWidget.fontColor}"
                class="big" 
              >
                {{ campaignWidget.caption }}
              </h1>
            </v-flex>
            <v-flex xs-12>
              <div class="text-xs-center">
                <h1 
                  :style="{color: '#'+campaignWidget.fontColor}"
                  class="superbig"
                >{{ totalsShow }} {{ campaignWidget.units }}
                </h1>
              </div>
            </v-flex>
          </v-layout>
        </section>
        <p/>
        <section
          align-center
        >
          <v-layout
            align-center>
            <v-flex 
              xs-12
              md-8>
              <v-form >
                <p>Realtime Barchart Widget</p>
                <v-textarea
                  v-model="code2"
                  label="Message"
                  counter
                  full-width
                  single-line
                />
              </v-form>
            </v-flex>
          </v-layout>
        </section>
        <section>
          <v-layout 
            align-center 
            justify-center 
            column
            style="    
              height: 315px;
              width: 560px;
              border: 1px solid black;"
          >
            <v-flex>
              <p/>
              <h1 
                :style="{color: '#'+campaignWidget.fontColor}"
                class="big" 
              >
                {{ campaignWidget.caption }}
              </h1>
            </v-flex>
            <v-flex 
              xs-12
              style="width: 100%; padding-left: 20px; padding-bottom: 20px; padding-right: 20px;"        
            >
              <div class="text-xs-center" >
                <canvas id="widget-chart"/>
              </div>
            </v-flex>
          </v-layout>
        </section>
      </v-layout>
    </v-container>
  </Layout>
</template>

<script>
import Bar from '@utils/chart/Bar'
import formatCurrency from '@utils/format-number'

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
  components: { 
    Bar,
  },
  data() {
    return {
      headerText: 'aaaa',
      height: 300,
      width: 300,
      socketMessage: '',
      timeSeries: []
    }
  },
  created() {
    this.$socket.emit('register', 'totals','production',this.$route.params.campaignId);
  },
  methods: {
    socketRegister(){
      console.log('param campaignId:'+this.campaignId)
      this.$socket.emit('register', 'totals','production',this.$route.params.campaignId);
    },
  },
  socket: {
    // Prefix for event names
    // prefix: "/counter/",
    
    // If you set `namespace`, it will create a new socket connection to the namespace instead of `/`
    // namespace: "/counter",

    events: {

        // Similar as this.$socket.on("changed", (msg) => { ... });
        // If you set `prefix` to `/counter/`, the event name will be `/counter/changed`
        //
        reply(msg) {
            console.log("Reply: " + msg);
        },
        transaction(newdata) {
          console.log("trans:" + newdata)
          this.socketMessage = formatCurrency((newdata - this.$route.params.offset)  * this.$route.params.multiplier)
          this.timeSeries.push('1')
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
          <!-- border: 1px solid black; -->
          <v-flex>
            <p/>
            <h1 
              :style="{color: '#'+this.$route.params.color}"
              class="big" 
            >
              {{ this.$route.params.caption }}
            </h1>
          </v-flex>
          <v-flex xs-12>
            <div class="text-xs-center">
              <h1 
                :style="{color: '#'+this.$route.params.color}"
                class="superbig"
              >{{ socketMessage }} {{ this.$route.params.unit }}
              </h1>
            </div>
          </v-flex>
        </v-layout>
      </section>
      <!--section>
        <v-layout 
          class="pt-1" 
          row 
          wrap
        >
          <v-flex 
            md4 
            xs12
          >
            <v-card light>
              <bar/>
            </v-card>
          </v-flex>
        </v-layout>
      </section-->
    </v-layout>

  </v-container>


</template>

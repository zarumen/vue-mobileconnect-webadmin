<script>

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
      caption: '',
      code:'',
      height: 300,
      width: 300,
      socketMessage: ''
    }
  },
  created() {
    console.log(this.campaignId)
    this.$socket.emit('register', 'totals','production',this.$route.params.campaignId);  
  },
  methods: {
    socketRegister(){
      console.log('param campaignId:'+this.campaignId)
      this.$socket.emit('register', 'totals','production',this.$route.params.campaignId);
    },
    test() {
      console.log(this.$socket)


    }
  },
  watch:{
    caption: function(val) {
      this.code =  '<iframe src="https://sms2mkt.com/'+this.$route.params.campaignId+'/'+val+'"></iframe>'
    }
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
          this.socketMessage = newdata
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
  >
    <v-layout 
      class="column" 
      fill-height>
      <section 
        style=" height: 200px;"
      >
        <v-layout
          align-center>
          <v-flex class="xs-12">
            <v-form v-model="valid">
              <v-text-field
                v-model="caption"
                :counter="40"
                label="Caption"
              />
              <v-text-field
                v-model="code"
                label="Embeded Code"
              />
            </v-form>
          </v-flex>
        </v-layout>
      </section>
      <p/>
      <section>
        <v-layout 
          align-center 
          justify-center 
          column
          style="    
            height: 300px;
            border: 1px solid black;"
        >
          <v-flex>
            <h1 class="big">
              {{ caption }}
            </h1>
          </v-flex>
          <v-flex xs-12>
            <div class="text-xs-center">
              <h1 class="superbig">{{ socketMessage }} </h1>
            </div>
          </v-flex>
        </v-layout>
      </section>
    </v-layout>
  </v-container>

</template>

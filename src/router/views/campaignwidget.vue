<script>
import Layout from '@layouts/main'

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
      caption: '',
      code:'',
      height: 300,
      width: 300,
      totals: '00',
      units: '',
      multiplier: 1,
      fontColor: '#1CABE9',
      widgetTypeGroup: 1,
      offset: 0
    }
  },
  watch:{
    caption: function(val) {
      this.code =  '<iframe width="560" height="315" src="https://sms2mkt.com/campaignwidgetview/'+this.$route.params.campaignId+'/'+val+'" frameborder="0"></iframe>'
    }
  },
  created() {
    this.$socket.emit('register', 'totals','production',this.$route.params.campaignId);  
  },
  methods: {
    socketRegister(){
      this.$socket.emit('register', 'totals','production',this.$route.params.campaignId);
    },
  },
  socket: {
    events: {
        transaction(newdata) {
          console.log("trans:" + newdata)
          this.totals = newdata * this.multiplier
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
              <v-form v-model="valid">
                <p>Widget Type</p>
                <v-radio-group 
                  v-model="widgetTypeGroup"
                  row
                >
                  <v-radio
                    :label="`Totals`"
                    :value="1"
                  />
                  <v-radio
                    :label="`Keywords`"
                    :value="2"
                  />
                </v-radio-group>
                <v-text-field
                  v-if="widgetTypeGroup==1"
                  v-model="offset"
                  :counter="10"
                  label="Offset Count"
                />
                <v-text-field
                  v-model="caption"
                  :counter="40"
                  label="Caption"
                />
                <v-text-field
                  v-model="units"
                  :counter="10"
                  label="Units"
                />
                <v-text-field
                  v-model="multiplier"
                  :counter="10"
                  label="Multiplier"
                />
                <v-text-field
                  v-model="fontColor"
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
              <h1 class="big">
                {{ caption }}
              </h1>
            </v-flex>
            <v-flex xs-12>
              <div class="text-xs-center">
                <h1 class="superbig">{{ totals-offset }} {{ units }} </h1>
              </div>
            </v-flex>
          </v-layout>
        </section>
      </v-layout>
    </v-container>
  </Layout>
</template>

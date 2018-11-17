<script>
import Layout from '@layouts/main'
import firestoreApp from "@utils/firestore.config"

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
      code: '',
      campaignWidget: {
        caption: '',
        units: ' ',
        multiplier: 1,
        fontColor: '1CABE9',
        type: 'totals',
        offset: 0,
      }
    }
  },
  watch:{
    campaignWidget: {
      handler(val) {
        this.code =  '<iframe width="560" height="315" src="https://sms2mkt.com/campaignwidgetview/'+this.$route.params.campaignId+'/'+this.campaignWidget.offset+'/'+this.campaignWidget.caption+'/'+val.units+'/'+this.campaignWidget.multiplier+'/'+this.campaignWidget.fontColor+'" frameborder="0" ></iframe>'
        firestoreApp.collection("campaignWidget").doc(this.$route.params.campaignId).set(this.campaignWidget).then(function() {
          console.log("Campaign Widget Successfully Written!");
        });
      },
      deep: true
    },
  },
  created() {
    this.$socket.emit('register', 'totals','production',this.$route.params.campaignId);
    this.getCampaignWidget(this.$route.params.campaignId) 
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
  },
  socket: {
    events: {
        transaction(newdata) {
          console.log("trans:" + newdata)
          this.totals = newdata * this.campaignWidget.multiplier
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
                  <v-radio
                    :label="`Keywords`"
                    :value="'keywords'"
                  />
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
                >{{ (totals - campaignWidget.offset) * campaignWidget.multiplier }} {{ campaignWidget.units }}
                </h1>
              </div>
            </v-flex>
          </v-layout>
        </section>
      </v-layout>
    </v-container>
  </Layout>
</template>

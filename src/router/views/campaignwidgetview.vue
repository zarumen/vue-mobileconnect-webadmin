<script>
// import Bar from '@utils/chart/Bar'
import formatCurrency from '@utils/format-number'

export default {
  page () {
    return {
      title: 'Campaign Widget Details',
      meta: [
        {
          name: 'description',
          content: 'Campaign Widgets Details'
        }
      ]
    }
  },
  components: {
  },
  data () {
    return {
      headerText: 'aaaa',
      height: 300,
      width: 300,
      socketMessage: '',
      timeSeries: []
    }
  },
  created () {
    if (this.$route.params.state === 'test') {
      this.$socket.emit('register', 'totals', this.$route.params.state, this.$route.params.campaignId)
    } else {
      this.$socket.emit('register', 'totals', 'production', this.$route.params.campaignId)
    }

    this.$options.sockets.transactionTotals = (newdata) => {
      console.log('trans:' + newdata)
      this.socketMessage = formatCurrency((newdata - this.$route.params.offset) * this.$route.params.multiplier)
      this.timeSeries.push('1')
    }
  },
  methods: {
    socketRegister () {
      console.log('param campaignId:' + this.campaignId)
      this.$socket.emit('register', 'totals', 'production', this.$route.params.campaignId)
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
          align="center"
          justify="center"
          column
          style="height: 315px;"
        >
          <!-- border: 1px solid black; -->
          <v-col>
            <p />
            <h1
              :style="{color: '#'+this.$route.params.color}"
              class="big"
            >
              {{ this.$route.params.caption }}
            </h1>
          </v-col>
          <v-col xs-12>
            <div class="text-center">
              <h1
                :style="{color: '#'+this.$route.params.color}"
                class="superbig"
              >
                {{ socketMessage }} {{ this.$route.params.unit }}
              </h1>
            </div>
          </v-col>
        </v-layout>
      </section>
      <!--section>
        <v-layout
          class="pt-1"
          row
          wrap
        >
          <v-col
            md4
            cols="12"
          >
            <v-card light>
              <bar/>
            </v-card>
          </v-col>
        </v-layout>
      </section-->
    </v-layout>
  </v-container>
</template>

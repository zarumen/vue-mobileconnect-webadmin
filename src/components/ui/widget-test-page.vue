<script>
import axios from '@utils/aws-api.config'

export default {
  components: {
    VueJsonPretty: () => import('vue-json-pretty')
  },
  props: {
    shortcode: {
      type: String,
      default: '4712003'
    },
    delimiter: {
      type: String,
      default: '*'
    },
    keyword: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    alertOutput: true,
    returnOutput: '',
    returnStatus: '',
    number: 0,
    telNumber: '',
    serviceID: '',
    sendAddress: '',
    transactionID: '',
    keywordSelected: '',
    msgContext: ''
  }),
  computed: {
    id () {
      return `${this.$route.params.campaignId}`
    }
  },
  watch: {
    keywordSelected (prev, next) {
      if (prev) {
        this.msgContext += prev
      }
    }
  },
  created () {
    this.getRandomAll()
  },
  methods: {
    generateRandom (length) {
      let text = ''
      const possible = '0123456789'
      for (let i = 0; i < length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }
      return text
    },
    getRandomAll () {
      this.getRandomTelNumber()
      this.getRandomTransactionID()
      this.getRandomServiceID()
      this.getRandomSendAddress()
    },
    getRandomTelNumber () {
      this.telNumber = this.generateRandom(9)
    },
    getRandomTransactionID () {
      this.transactionID = this.generateRandom(18)
    },
    getRandomServiceID () {
      this.serviceID = this.generateRandom(18)
    },
    getRandomSendAddress () {
      this.sendAddress = `66${this.generateRandom(13)}`
    },
    insertDelimiter () {
      this.msgContext += this.delimiter
    },
    textStatusColor (code) {
      switch (code) {
        case 200:
          return 'green--text'
        case 400:
          return 'red--text'
        default:
          return 'yellow--text'
      }
    },
    sendMsg () {
      const msgBody = {
        transactionID: `${this.transactionID}`,
        shortcode: `${this.shortcode}`,
        serviceID: `${this.serviceID}`,
        sendAddress: `${this.sendAddress}`,
        msisdn: `66${this.telNumber}`,
        operator: 'testweb',
        message: `${this.msgContext}`
      }

      return axios.postData('messageTest', msgBody)
        .then(response => {
          this.alertOutput = true
          this.returnStatus = response.status
          this.returnOutput = response.data
          this.getRandomAll()
        })
        .catch(error => {
          this.alertOutput = true
          this.returnOutput = error
        })
    }
  }
}
</script>

<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-card width="400">
        <v-img
          height="200px"
          src="https://image.freepik.com/free-photo/hand-holding-man-check-sending-message-with-email-phone-blue-background_7192-1018.jpg"
        >
          <v-app-bar
            flat
            color="rgba(0, 0, 0, 0)"
          >
            <v-toolbar-title class="title white--text pl-0">
              {{ id }}
            </v-toolbar-title>

            <v-spacer />

            <v-btn
              color="white"
              icon
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-app-bar>

          <v-card-title class="white--text mt-8">
            <v-avatar size="56">
              <v-icon
                large
                color="white"
              >
                mdi-message-text
              </v-icon>
            </v-avatar>
            <span>
              {{ shortcode }}
              <span />
            </span>
          </v-card-title>
        </v-img>

        <v-card-text>
          <v-row>
            <v-col
              class="pl-4"
              cols="8"
            >
              <v-text-field
                v-model="telNumber"
                color="blue"
                label="Telephone Number"
                prefix="+66"
              />
            </v-col>
            <v-col cols="4">
              <v-btn
                color="blue"
                fab
                dark
                small
                @click="getRandomTelNumber"
              >
                <v-icon>refresh</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <div class="font-weight-light ml-2 mb-2">
            Insert Your Keyword:
          </div>
          <v-chip-group
            v-model="keywordSelected"
            active-class="cyan accent-4 white--text"
            column
          >
            <v-chip
              v-for="key in keyword"
              :key="key"
              :value="key"
            >
              {{ key }}
            </v-chip>
          </v-chip-group>

          <v-row>
            <v-col
              cols="8"
            >
              <div class="font-weight-light ml-2 my-2">
                Insert Delimiter:
              </div>
            </v-col>
            <v-col cols="4">
              <base-button
                small
                dark
                color="blue"
                @click="insertDelimiter"
              >
                Insert
              </base-button>
            </v-col>
          </v-row>

          <div class="font-weight-light ml-2 my-2">
            Message Box:
          </div>

          <v-col
            class="mt-2"
            cols="12"
          >
            <v-text-field
              v-model="msgContext"
              :label="`Message Context`"
              outlined
              rounded
            />
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <base-button
            outlined
            color="blue"
            @click="sendMsg"
          >
            Send Message
          </base-button>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-alert
        v-model="alertOutput"
        border="left"
        close-text="Close Alert"
        color="indigo darken-4"
        dark
        dismissible
      >
        <span :class="textStatusColor(returnStatus)">Return Message: {{ returnStatus }}</span>
        <vue-json-pretty
          :data="returnOutput"
          :deep="1"
          highlight-mouseover-node
          show-line
          show-double-quotes
        />
      </v-alert>
    </v-col>
  </v-row>
</template>

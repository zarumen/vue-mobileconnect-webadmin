<script>
import { headerConfigComputed, headerConfigMethods } from '@state/helpers'

export default {
  props: {
    fieldsMicrosite: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    headerDefault: [
      { text: 'Telephone Number', value: 'msisdn' },
      { text: 'Message Context', value: 'message' },
      { text: 'Reply Message', value: 'replyMessage', left: true },
      { text: 'Message Status', value: 'messageStatus' },
      { text: 'TimeCode', value: 'createDateTime', align: 'center' },
      { text: 'TxDetails', value: 'action', align: 'center', sortable: false }
    ],
    defaultSelected: null,
    micrositeSelected: null
  }),
  computed: {
    ...headerConfigComputed,
    headerArray: {
      get () {
        return this.getHeaderConfigArray
      },
      set (val) {
        console.log(val)
        // this.setElementHeaderConfig({
        //   payload: val
        // })
      }
    },
    headerCount () {
      return this.headerArray.length
    }
  },
  mounted () {
  },
  methods: {
    ...headerConfigMethods,
    initHeaderArray () {
      if (!this.hadHeaderConfig) {
        this.getHeaderConfig({
          campaignId: `${this.$route.params.campaignId}`
        })
      }
    },
    incrementHeaderArray () {
      if (this.defaultSelected) {
        return this.headerArray.push(this.defaultSelected)
      }
      if (this.micrositeSelected) {
        const el = {
          text: '',
          value: `micrositeFields.${this.micrositeSelected}`
        }
        return this.headerArray.push(el)
      }
      const emptyEl = {
        text: '',
        value: ''
      }
      return this.headerArray.push(emptyEl)
    },
    decrementHeaderArray () {
      return this.headerArray.pop()
    },
    clearSelected () {
      this.defaultSelected = null
      this.micrositeSelected = null
    },
    updateValue (id, payload) {
      this.setElementHeaderConfig({
        position: id,
        payload: payload
      })
    },
    saveToDB () {
      if (this.headerCount === 0) return null

      return this.saveHeaderConfig({
        campaignId: `${this.$route.params.campaignId}`,
        headerArray: this.headerArray
      })
    },
    setDefaultToDB () {
      if (this.headerCount === 0) return null

      return this.saveHeaderConfig({
        campaignId: `${this.$route.params.campaignId}`,
        headerArray: this.headerDefault
      })
    }
  }
}
</script>

<template>
  <v-card>
    <v-card-title class="title grey--text">
      Select Header from Database
    </v-card-title>
    <v-card-actions>
      <v-col>
        <v-select
          v-model="defaultSelected"
          :items="headerDefault"
          prepend-icon="mdi-format-list-bulleted-square"
          label="Selected Normal Fields"
          text="text"
          return-object
        />
      </v-col>
    </v-card-actions>
    <v-card-actions>
      <v-col>
        <v-select
          v-model="micrositeSelected"
          :items="fieldsMicrosite"
          prepend-icon="mdi-television"
          label="Microsite Fields"
        />
      </v-col>
      <v-btn
        text
        color="error"
        dark
        @click="clearSelected"
      >
        CLEAR
      </v-btn>
      <v-spacer />
      <v-btn
        color="error"
        dark
        fab
        small
        @click="decrementHeaderArray"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-btn
        color="success"
        dark
        fab
        small
        @click="incrementHeaderArray"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-title class="title grey--text">
      Header in Column Data Table
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row
          v-for="(element,index) in headerArray"
          :key="index"
        >
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              :value="element.text"
              :label="`Header Text ${index+1}`"
              outlined
              rounded
              @input="updateValue(index, $event)"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="element.value"
              :label="`Database Value ${index+1}`"
              filled
              rounded
              disabled
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        text
        color="error"
        dark
        @click="setDefaultToDB"
      >
        SET TO DEFAULT
      </v-btn>
      <v-btn
        text
        color="primary"
        dark
        @click="saveToDB"
      >
        SAVE
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

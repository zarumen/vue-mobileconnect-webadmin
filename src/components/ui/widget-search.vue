<script>
import { campaignSearchComputed, campaignSearchMethods } from '@state/helpers'
import { getJwtToken } from '@utils/fireauth.config'

export default {
  props: {
    checkMicrosite: {
      type: Boolean,
      default: false
    },
    fieldsMicrosite: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    baseModule: 'transactions',
    headers: [
      { text: 'Msisdn', value: 'msisdn' },
      { text: 'Msg', value: 'message' },
      { text: 'ReplyMsg', value: 'replyMessage', align: 'left' },
      { text: 'Stage', value: 'messageStatus' },
      { text: 'TimeCode', value: 'createDateTime', align: 'center' },
      { text: 'TxDetails', value: 'action', align: 'center', sortable: false }
    ],
    headersMicrosite: [],
    isEditing: false,
    msisdn: null,
    msisdnRules: [
      v => !!v || 'Telephone Number is required',
      v => (v && v.length <= 11) || 'Telephone Number must be less than 11 characters',
      v => /\d/.test(v) || 'Telephone Number must be valid'
    ],
    mask: '###########',
    id: '',
    contextMsg: '',
    startdate: 0,
    stopdate: 0
  }),
  computed: {
    ...campaignSearchComputed,
    campaignIdList () {
      return this.getAllCampaignsId
    }
  },
  created () {
    this.initHeadersMicrosite()
  },
  methods: {
    ...campaignSearchMethods,
    initHeadersMicrosite () {
      if (this.fieldsMicrosite.length > 0) {
        console.log(this.fieldsMicrosite)
        const array = this.fieldsMicrosite
        this.headersMicrosite = array.map((element, index) => {
          const a = {}
          a.text = `Field ${index + 1}`
          a.value = `micrositeFields.${element}`
          return a
        })
      }
      return []
    },
    async telSearch () {
      const token = await getJwtToken

      if (this.$route.name === 'campaignDetails') {
        // search from user
        this.getSearchMsisdn({
          admin: this.isAdmin,
          msisdn: `${this.msisdn}`,
          jwtToken: token,
          campaignId: `${this.$route.params.campaignId}`
        })
      } else {
        // search from admin
        this.getSearchMsisdn({
          admin: this.isAdmin,
          msisdn: `${this.msisdn}`,
          jwtToken: token,
          campaignId: `${this.id}`
        })
      }
    },
    async advanceSearch () {
      const token = await getJwtToken
      let tel = ''
      if (this.msisdn) {
        tel = `${this.msisdn}`
      }

      if (token) {
        this.getSearchCampaignID({
          message: `${this.contextMsg}`,
          msisdn: tel,
          jwtToken: token,
          campaignId: `${this.id}`
        })
      }
    }
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <base-card
        color="deep-purple"
        title="Search Settings"
      >
        <v-card-text>
          Explore hundreds of free API's ready for consumption! For more information visit
          <a
            class="grey--text text--lighten-3"
            href="https://github.com/toddmotto/public-apis"
            target="_blank"
          >the Github repository</a>.
          <v-text-field
            v-model="msisdn"
            v-mask="mask"
            label="Telephone Number Search"
            prepend-icon="mdi-database-search"
            :rules="msisdnRules"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!msisdn"
            color="primary"
            @click="telSearch"
          >
            Search
            <v-icon right>
              search
            </v-icon>
          </v-btn>
        </v-card-actions>
        <div v-if="isAdmin">
          <v-card-text>
            <span class="primary--text">
              Advance Search Options
            </span>
            <p />
            <v-autocomplete
              v-model="id"
              :items="campaignIdList"
              :hint="!isEditing ? 'Click the icon to edit' : 'Click the icon to save'"
              :readonly="!isEditing"
              :label="`Campaign ID Search — ${isEditing ? 'Editable' : 'Readonly'}`"
              persistent-hint
              hide-no-data
              hide-selected
              placeholder="Click Right Button and Start typing to Search"
              prepend-icon="mdi-database-search"
              return-object
              required
            >
              <template v-slot:append-outer>
                <v-slide-x-reverse-transition
                  mode="out-in"
                >
                  <v-icon
                    :key="`icon-${isEditing}`"
                    :color="isEditing ? 'success' : 'primary'"
                    @click="isEditing = !isEditing"
                    v-text="isEditing ? 'mdi-check-outline' : 'mdi-circle-edit-outline'"
                  />
                </v-slide-x-reverse-transition>
              </template>
            </v-autocomplete>
            <v-text-field
              v-model="contextMsg"
              :disabled="!isEditing"
              label="Message Context"
              prepend-icon="mdi-database-search"
            />
            <!-- <v-text-field
              v-model="startdate"
              :disabled="!isEditing"
              prepend-icon="mdi-database-search"
              label="StartDate"
            />
            <v-text-field
              v-model="stopdate"
              :disabled="!isEditing"
              prepend-icon="mdi-database-search"
              label="StopDate"
            /> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              @click="advanceSearch"
            >
              Advance Search
              <v-icon right>
                search
              </v-icon>
            </v-btn>
          </v-card-actions>
        </div>
      </base-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <!-- Controller Tools Panels -->
        <v-card-title>
          <span class="title">
            Transactions Search
          </span>
          <v-spacer />
          <!-- <base-button
            text
            icon
            color="primary"
          >
            <v-icon>
              print
            </v-icon>
          </base-button> -->
        </v-card-title>
        <!-- Insert in Base-Table Component -->
        <!-- <v-card-text v-if="!checkMicrosite"> -->
        <v-card-text>
          <BaseTable
            :headers="headers"
            :items="items"
            :basemodule="baseModule"
            :pagination="pagination"
            :action-btn="false"
          />
        </v-card-text>
        <!-- <v-card-text v-else>
          <BaseTable
            :headers="headersMicrosite"
            :items="items"
            :basemodule="baseModule"
            :pagination="pagination"
            :action-btn="false"
          />
        </v-card-text> -->
      </v-card>
    </v-col>
  </v-row>
</template>

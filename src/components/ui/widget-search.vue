<script>
import { campaignSearchComputed, campaignSearchMethods } from '@state/helpers'
import { getJwtToken } from '@utils/fireauth.config'

export default {
  components: {
    VueJsonPretty: () => import('vue-json-pretty')
  },
  props: {
    checkMicrosite: {
      type: Boolean,
      default: false
    },
    checkHeaderConfig: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    baseModule: 'transactions',
    headers: [
      { text: 'Tel No.', value: 'msisdn' },
      { text: 'Msg', value: 'message' },
      { text: 'ReplyMsg', value: 'replyMessage', align: 'left' },
      { text: 'Stage', value: 'messageStatus', align: 'right' },
      { text: 'TimeCode', value: 'createDateTime', align: 'right' }
    ],
    showAdvanceMenu: false,
    showBanMenu: false,
    campaignStatus: '',
    elDetail: { text: 'TxDetails', value: 'action', align: 'center', sortable: false },
    isEditing: false,
    alertBanList: false,
    alertRegisterList: false,
    alertBanListText: '',
    alertRegisterListText: '',
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
    },
    headersMicrosite () {
      if (this.checkHeaderConfig) {
        return this.getHeaderConfigArray
      }
      return []
    },
    mutateHeaders () {
      const head = this.headers

      if (this.$route.name === 'search') {
        return [...head, this.elDetail]
      }

      return head
    }
  },
  created () {
    this.initHeadersMicrosite()
  },
  methods: {
    ...campaignSearchMethods,
    changeTextButton (bool) {
      return (bool) ? 'Hide' : 'Expand'
    },
    searchBanList () {
      return this.searchBanListByCampaign({
        msisdn: `${this.msisdn}`,
        campaignId: `${this.id}`,
        state: `${this.campaignStatus}`
      })
        .then((res) => {
          this.alertBanList = true
          if (res) {
            this.alertBanListText = res
          }
        })
        .catch(err => console.log(err))
    },
    searchRegisterList () {
      return this.searchRegisterListByCampaign({
        msisdn: `${this.msisdn}`,
        campaignId: `${this.id}`,
        state: `${this.campaignStatus}`
      })
        .then((res) => {
          if (res) {
            this.alertRegisterList = true
            this.alertRegisterListText = res
          }
        })
        .catch(err => console.log(err))
    },
    delBanNumber () {
      this.alertBanList = false
      return this.deleteBanNumber({
        msisdn: `${this.msisdn}`,
        campaignId: `${this.id}`,
        state: `${this.campaignStatus}`
      })
    },
    delRegisterNumber () {
      this.alertRegisterList = false
      return this.deleteRegisterNumber({
        msisdn: `${this.msisdn}`,
        campaignId: `${this.id}`,
        state: `${this.campaignStatus}`
      })
    },
    initHeadersMicrosite () {
      return null
    },
    async telSearch () {
      const token = await getJwtToken

      if (this.$route.name === 'campaignDetails') {
        // search from user
        if (this.checkMicrosite) {
          this.getSearchMsisdn({
            admin: this.isAdmin,
            msisdn: `${this.msisdn}`,
            jwtToken: token,
            campaignId: `${this.$route.params.campaignId}`,
            microsite: true
          })
        } else {
          this.getSearchMsisdn({
            admin: this.isAdmin,
            msisdn: `${this.msisdn}`,
            jwtToken: token,
            campaignId: `${this.$route.params.campaignId}`,
            microsite: false
          })
        }
      } else {
        // search from admin
        this.getSearchMsisdn({
          admin: this.isAdmin,
          msisdn: `${this.msisdn}`,
          jwtToken: token,
          campaignId: `${this.id}`,
          microsite: true
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
          Search Mobile Numbers for Inquiry Transactions
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
          <base-button
            :disabled="!msisdn"
            color="primary"
            @click="telSearch"
          >
            Search
            <v-icon right>
              search
            </v-icon>
          </base-button>
        </v-card-actions>
        <div v-if="isAdmin">
          <v-toolbar
            flat
            class="primary lighten-5 ma-5"
          >
            <v-subheader>Advance Search Options</v-subheader>
            <v-spacer />
            <base-button
              text
              color="primary"
              @click="showAdvanceMenu = !showAdvanceMenu"
            >
              {{ changeTextButton(showAdvanceMenu) }}
            </base-button>
          </v-toolbar>
          <v-card-text v-if="showAdvanceMenu">
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
          <v-card-actions v-if="showAdvanceMenu">
            <v-spacer />
            <base-button
              color="primary"
              @click="advanceSearch"
            >
              Advance Search
              <v-icon right>
                search
              </v-icon>
            </base-button>
          </v-card-actions>
          <v-toolbar
            flat
            class="lime lighten-5 ma-5"
          >
            <v-subheader>Ban/Register Search Options</v-subheader>
            <v-spacer />
            <base-button
              text
              color="secondary"
              @click="showBanMenu = !showBanMenu"
            >
              {{ changeTextButton(showBanMenu) }}
            </base-button>
          </v-toolbar>
          <v-card-text v-if="showBanMenu">
            <v-autocomplete
              v-model="id"
              :items="campaignIdList"
              :hint="!isEditing ? 'Click the icon to edit' : 'Click the icon to save'"
              :readonly="!isEditing"
              :label="`Campaign ID — ${isEditing ? 'แก้ไขได้' : 'ล็อคอยู่'}`"
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
            <v-col cols="12 pl-5">
              <span>Campaign Status</span>
              <v-radio-group
                v-model="campaignStatus"
                mandatory
                row
              >
                <v-radio
                  label="TEST"
                  value="test"
                  color="amber"
                />
                <v-radio
                  label="PRODUCTION"
                  value="production"
                  color="green"
                />
              </v-radio-group>
            </v-col>
          </v-card-text>
          <v-card-actions v-if="showBanMenu">
            <v-spacer />
            <base-button
              :disabled="!msisdn"
              color="secondary"
              @click="searchRegisterList"
            >
              Register List
              <v-icon right>
                search
              </v-icon>
            </base-button>
            <base-button
              :disabled="!msisdn"
              class="error"
              @click="searchBanList"
            >
              Ban List
              <v-icon right>
                search
              </v-icon>
            </base-button>
          </v-card-actions>
          <v-card-text>
            <v-alert
              v-model="alertBanList"
              border="left"
              close-text="Close Alert"
              color="red darken-4"
              dark
              dismissible
            >
              <span class="yellow--text">Ban Number: {{ alertBanListText }}</span>
              <vue-json-pretty
                :data="getBanList"
                :deep="1"
                highlight-mouseover-node
                show-line
                show-double-quotes
              />
              <v-col class="pa-2">
                <base-button
                  outlined
                  @click="delBanNumber"
                >
                  Delete Ban Number
                </base-button>
              </v-col>
            </v-alert>
            <v-alert
              v-model="alertRegisterList"
              border="left"
              close-text="Close Alert"
              color="indigo darken-4"
              dark
              dismissible
            >
              <span class="yellow--text">Register Number: {{ alertRegisterListText }}</span>
              <vue-json-pretty
                :data="getRegisterList"
                :deep="1"
                highlight-mouseover-node
                show-line
                show-double-quotes
              />
              <v-col class="pa-2">
                <base-button
                  outlined
                  @click="delRegisterNumber"
                >
                  Delete Register Number
                </base-button>
              </v-col>
            </v-alert>
          </v-card-text>
        </div>
      </base-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <!-- Controller Tools Panels -->
        <v-card-title>
          <span class="title">
            Transactions Report
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
        <v-card-text v-if="!checkHeaderConfig">
          <!-- <v-card-text> -->
          <BaseTable
            :headers="mutateHeaders"
            :items="items"
            :basemodule="baseModule"
            :pagination="pagination"
            :action-btn="false"
          />
        </v-card-text>
        <v-card-text v-else>
          <BaseTable
            :headers="headersMicrosite"
            :items="items"
            :basemodule="baseModule"
            :pagination="pagination"
            :action-btn="false"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

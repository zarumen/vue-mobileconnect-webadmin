<script>
import { mapState, mapActions } from 'vuex'
import { helperTH } from '@utils/campaign-create-helper'

export default {
  props: {
    addCampaignDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data() {
    const defaultcForm = Object.freeze({
      campaignCode: '',
      campaignName: '',
      campaignDescription: '',
      keyword: '',
      shortcode: '',
    })
    const defaultvForm = Object.freeze({
      contextDelimiter: '',
      messageCampaignNotAvailable: '',
      messageRewardFailed: '',
      messageBoundariesLessError: '',
      messageBoundariesOverError: '',
      messageAfterEnd: '',
      messageBeforeStart: '',
      rewardsLimit: '',
    })
    const defaultpForm = Object.freeze({
      contextExclude: '',
      messageContextFailed: '',
      contextType: 'register'
    })
    const defaultspForm = Object.freeze({
      contextSubForm: '',
      messageContextFailed: ''
    })
    const defaultrForm = Object.freeze({
      rewardHasCoupon: null,
      rewardName: '',
      rewardCondition: '',
      rewardTotal: '',
      rewardConditionForm: null,
      messageRewardSuccess: ''
    })

    return {
      // Default Values
      campaignForm: Object.assign({}, defaultcForm),
      validateForm: Object.assign({}, defaultvForm),
      cState: null,
      brand: null,
      // Stepper Setups
      step: 1,
      stepName: {
        one: 'Campaign General Descriptions',
        two: 'Campaign Settings',
        three: 'Campaign Parser Configs',
        four: 'Campaign Reply Service Configs',
        five: 'Campaign Reward Configs',
        six: 'Campaign Summary Page'
      },
      valid: null,
      cTypeList: [
        'normal',
        'register',
        'vote',
        'text&win',
        'api'
      ],
      campaignType: null,
      // helper variable
      locale: 'TH',
      helper: false,
      helperText: {},
      // context parser variable
      validateTypeList: [
        {value: 'regx', condition: false},
        {value: 'validate', condition: true},
        {value: 'register', condition: false},
        {value: 'reward', condition: false},
      ],
      validateType: null,
      conditionTypeValidate: false,
      contextParser: [],
      parserValid: true,
      // parser array
      anotherParser: Object.assign({}, defaultpForm),
      subContextArray: [],
      contextFailed: Object.assign({}, defaultspForm),
      // rewards Variable
      rewards: [],
      rewardValid: true,
      // reward array
      anotherReward: Object.assign({}, defaultrForm),
      objectReward: false,
      // ---------**-------------------------------------
      // Check all value
      // ---------**------------------------------------- 
      date: null, // start date
      date2: null, // end date
      date3: null, // start test date
      date4: null, // end test date
      time: '00:00', // start time
      time2: '00:00', // end time
      time3: '00:00', // start test time
      time4: '00:00', // end test time
      menu: false, // start date menu
      menu2: false, // start time menu
      menu3: false, // end date menu
      menu4: false, // end time menu
      menu5: false, // start test date menu
      menu6: false, // start test time menu
      menu7: false, // end test date menu
      menu8: false, // end test time menu
      switch1: false,
      switch2: false,
      loading1: false,
      cardOpen: false,
      subcardOpen: false,
      itemstest: [
          { icon: 'code', iconClass: 'blue white--text', title: 'Invalid Format Message 1', subtitle: 'regex 1' },
          { icon: 'code', iconClass: 'blue white--text', title: 'Invalid Format Message 2', subtitle: 'regex 2' }
        ]
    }
  },
  computed: {
    ...mapState('organizations', {
      brandList: 'brandList'
    }),
    ...mapState('shortcodes', {
      shortcodeList: 'shortcodeList',
      keywordList: 'keywordList',
      keywordReservedList: 'keywordReservedList'
    }),
    regexDisable() {
      if(this.validateType)
        return this.validateType.condition

      return true
    },
    contextType() {
      if(this.validateType)
        return this.validateType.value

      return null
    },
    mutateKeywordList() {
      if(this.campaignForm.shortcode) {

        let kw = this.mutatekwList(this.campaignForm.shortcode)

        return kw[0].keywords
      }

      return []
    },
    mutateShortcodeList() {
      if(this.campaignForm.shortcode) {

        let scArray = this.mutatescList(this.campaignForm.shortcode)

        return scArray[0].sendername
      }
      return []
    }
  },
  watch: {

  },
  created () {
    this.mapHelper()
  },
  methods:{
    ...mapActions('campaigns', [
      'createCampaign'
    ]),
    mutatekwList(sc) {
      return this.keywordReservedList.filter(keyword => keyword.shortcode === sc)
    },
    mutatescList(sc) {
      return this.shortcodeList.filter(scList => scList.shortcode === sc)
    },
    closeDialog() {
      this.$emit('emitCloseCampaignDialog', false)
    },
    saveCampaign() {
      
      // prepare campaign Object and campaignValidation Object

      const campaignNew = this.campaignForm
      const startDate = this.date + "T" + this.time
      const endDate = this.date2 + "T" + this.time2
      const startTestDate = this.date3 + "T" + this.time3
      const endTestDate = this.date4 + "T" + this.time4
      const campaignValidationNew = this.validateForm

      if(this.brand !== null) {

        // --------------------- campaign Object ----------------------------------------
        // Campaign Status
        campaignNew['campaignAvailable'] = true // check campaign paused or unpaused
        campaignNew['campaignActive'] = true // check campaign delete or not deleted
        campaignNew['campaignState'] = this.cState // check campaign status {test, production, close} 

        campaignNew['organizationAuth'] = this.brand.organizationAuth
        campaignNew['organizationLevel1'] = this.brand.organizationLevel1
        campaignNew['organizationLevel1Name'] = this.brand.organizationLevel1Name
        campaignNew['organizationLevel2'] = this.brand.organizationLevel2
        campaignNew['organizationLevel2Name'] = this.brand.organizationLevel2Name
        campaignNew['organizationLevel3'] = this.brand.organizationLevel3
        campaignNew['organizationLevel3Name'] = this.brand.organizationLevel3Name

        // set Date in here
        campaignNew['campaignDateStart'] = new Date(startDate)
        campaignNew['campaignDateEnd'] = new Date(endDate)

        // --------------------- campaignValidation Object ----------------------------------------
        
        // set Context Parsers
        campaignValidationNew['contextParser'] = this.contextParser
        // set Reward Array
        campaignValidationNew['rewardsArray'] = this.rewards

        campaignValidationNew['rewardsHaveSequence'] = this.switch2
        campaignValidationNew['campaignAvailable'] = true
        campaignValidationNew['campaignState'] = this.cState
        campaignValidationNew['campaignSenderName'] = this.campaignForm.campaignSenderName

        // set Campaign Timing
        campaignValidationNew['campaignDateStart'] = new Date(startDate)
        campaignValidationNew['campaignDateEnd'] = new Date(endDate)
        campaignValidationNew['campaignDateTestStart'] = new Date(startTestDate)
        campaignValidationNew['campaignDateTestEnd'] = new Date(endTestDate)

        this.createCampaign({
          campaignObject: campaignNew,
          validationObject: campaignValidationNew
        })
        this.closeDialog()
      }     
    },
    mapHelper() {
      if (this.locale === 'TH') {
        this.helperText = helperTH
      }
    },
    addContextParser() {
      if (this.$refs.anotherParser.validate()) {

        let newParser = this.anotherParser

        newParser['contextType'] = this.contextType
        newParser['contextFailed'] = this.subContextArray

        if(this.conditionTypeValidate) {
          this.validateForm.rewardsLimit = 1
        }  

        this.contextParser.push(newParser)

        this.anotherParser = Object.assign({}, this.defaultpForm)
        this.subContextArray = []
        this.cardOpen = false
      }
    },
    clearContextParser() {
      this.$refs.anotherParser.reset()
      this.cardOpen = false
    },
    deleteContextParser(validateFailMsg) {

      this.contextParser = this.contextParser.filter(parser => {
        return parser.messageContextFailed !== validateFailMsg
      })
    },
    // Specific contextFailed inside Context Parser
    addSubContextArray() {
      if (this.$refs.contextFailed.validate()) {

        let newSpecific = this.contextFailed

        this.subContextArray.push(newSpecific)
        this.contextFailed = Object.assign({}, this.defaultspForm)
        this.subcardOpen = false
      }
    },
    clearSubContextArray() {
      this.$refs.contextFailed.reset()
      this.subcardOpen = false
    },
    deleteSubContextArray(validateFailMsg) {

      this.subContextArray = this.subContextArray.filter(parser => {
        return parser.messageContextFailed !== validateFailMsg
      })
    },
    addReward() {
      if(this.$refs.anotherReward.validate()) {

        let newReward = this.anotherReward

        newReward['rewardHasCoupon'] = this.switch1

        this.rewards.push(newReward)
        this.anotherReward = Object.assign({}, this.defaultrForm)
        this.cardOpen = false
      }
    },
    clearReward() {
      this.$refs.anotherReward.reset()
    },
    deleteReward(name) {
      this.rewards = this.rewards.filter(reward => {
        return reward.rewardName !== name
      })
    }
  },
}
</script>

<template>
  <v-layout 
    row
    wrap 
    justify-center
  >
    <v-dialog 
      v-model="addCampaignDialog" 
      fullscreen 
      hide-overlay 
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-form
          ref="campaignForm"
          v-model="valid"
          lazy-validation
        >
          <v-toolbar
            dark 
            color="indigo"
          >
            <v-btn 
              icon 
              dark 
              @click.native="closeDialog()"
            >
              <v-icon>
                close
              </v-icon>
            </v-btn>
            <v-toolbar-title class="white--text">
              Add New Campaign
            </v-toolbar-title>
            <v-spacer />
            <v-toolbar-items>
              <v-btn
                dark
                flat
                @click.native="helper = !helper"
              >
                Helper: TH
              </v-btn>
              <v-btn 
                dark 
                flat 
                @click.native="saveCampaign()"
              >
                Save
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <!-- Content is here -->
          <v-stepper 
            v-model="step"
            light
            vertical
          >
            <v-stepper-step 
              editable
              step="1"
            >
              {{ stepName.one }}
              <small>v.0.50 patch note: สามารถ Add campaign กรอกข้อมูล added Reward อย่างง่าย added Context Parser ทั้ง 3 รูปแบบ contextType </small>
              <small>road map: ทำ เพิ่ม List Validate รหัสใบเสร็จ และ รหัสสมาชิก, ทำปุ่ม Generate Coupon และ Upload Coupon, ทำตัวช่วย กรอกในสิ่งที่เคยกรอกไปแล้ว (Template) ทั้งในส่วนของ Regex และ ข้อความ (Message Template) และหน้าสุดท้าย ไว้ดูสรุปข้อมูล ก่อน save</small>
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-card
                color="grey lighten-4" 
                class="mb-5"
              >
                <v-card-text>
                  <v-flex 
                    xs12
                    md4
                  > 
                    <v-text-field 
                      v-model="campaignForm.campaignCode"
                      prepend-icon="fiber_new"
                      label="Campaign Code"
                    />
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">
                      {{ helperText.campaignCode }}
                    </v-subheader>
                  </v-flex>
                  <v-flex 
                    xs12
                    md8
                  > 
                    <v-text-field 
                      v-model="campaignForm.campaignName"
                      prepend-icon="shop"
                      label="Campaign Name"
                    />
                  </v-flex> 
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">
                      {{ helperText.campaignName }}
                    </v-subheader>
                  </v-flex>
                  <v-flex 
                    xs12
                    md8
                  >
                    <v-textarea
                      v-model="campaignForm.campaignDescription"
                      prepend-icon="shop_two"
                      label="Campaign Description"
                    />
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">
                      {{ helperText.campaignDescription }}
                    </v-subheader>
                  </v-flex>
                  <v-select 
                    v-model="campaignType"
                    :items="cTypeList"
                    label="Campaign Type"
                    prepend-icon="assignment"
                  />
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">
                      {{ helperText.campaignType }}
                    </v-subheader>
                  </v-flex>                
                </v-card-text>
              </v-card>
              <v-btn 
                color="primary"
                round
                @click.native="step = 2"
              >
                Continue
              </v-btn>
              <v-btn 
                class="v-btn--simple"
                color="default"
                round
                @click.native="closeDialog()"
              >
                Cancel
              </v-btn>
            </v-stepper-content>
            <v-stepper-step 
              editable
              step="2"
            >
              {{ stepName.two }}
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-card 
                color="grey lighten-4" 
                class="mb-5"
              >
                <v-card-text>
                  <v-flex 
                    xs8
                    sm6 
                    md3
                  >
                    <v-subheader><small>Campaign Owner Details:</small></v-subheader>
                    <v-combobox
                      :key="brandList.key"
                      v-model="brand"
                      :hint="`${brand}`"
                      :items="brandList"
                      item-text="displayName"
                      prepend-icon="shopping_basket"
                      label="Campaign Owners: Brand"
                      persistent-hint
                      chips
                    >
                      <template 
                        slot="item" 
                        slot-scope="data"
                      >
                        <template v-if="data.item.picURL === 'undefine'">
                          <v-list-tile-avatar 
                            color="primary"
                            class="green--text"
                          >
                            {{ data.item.displayName.slice(0, 2).toUpperCase() }}
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title>{{ data.item.displayName }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ data.item.organizationLevel2Name }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </template>
                        <template v-else>
                          <v-list-tile-avatar>
                            <img :src="data.item.picURL">
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title>{{ data.item.displayName }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ data.item.organizationLevel2Name }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </template>
                        <template
                          slot="selection" 
                          slot-scope="idata"
                        >
                          <v-chip
                            :key="JSON.stringify(idata.item)"
                            :selected="idata.selected"
                            color="primary"
                            text-color="white"
                            close
                            @input="idata.parent.selectItem(idata.item)"
                          >
                            <v-avatar>
                              <img :src="idata.item.picURL">
                            </v-avatar>
                            {{ idata.item.displayName }}
                          </v-chip>
                        </template>
                      </template>
                    </v-combobox>
                  </v-flex>  
                  <v-flex 
                    xs8
                    sm6 
                    md3
                  > 
                    <v-subheader><small>Please Enter Your Shortcode:</small></v-subheader>
                    <v-autocomplete
                      :key="shortcodeList.id"
                      v-model="campaignForm.shortcode"
                      :hint="`${campaignForm.shortcode}`"
                      :items="shortcodeList"
                      :rules="[v => !!v || 'Shortcode is required']"
                      item-text="shortcode"
                      prepend-icon="filter_6"
                      label="Shortcode"
                      type="number"
                      chips
                      solo
                    >
                      <template 
                        slot="item"
                        slot-scope="data"
                      >
                        <template v-if="typeof data.item !== 'object'">
                          <v-list-tile-content v-text="data.item" />
                        </template>
                        <template v-else>
                          <v-list-tile-content>
                            <v-list-tile-title>{{ data.item.shortcode }}</v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                        <template 
                          slot="selection"
                          slot-scope="idata"
                        >
                          <v-chip
                            :key="JSON.stringify(idata.item)"
                            :selected="idata.selected"
                            color="deep-purple"
                            close
                            @input="idata.parent.selectItem(idata.item)"
                          >
                            {{ idata.item.shortcode }}
                          </v-chip>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">
                      {{ helperText.campaignSenderName }}
                    </v-subheader>
                  </v-flex>
                  <v-flex
                    xs8
                    sm6 
                    md3
                  > 
                    <v-select 
                      v-model="campaignForm.campaignSenderName"
                      :items="mutateShortcodeList"
                      item-text="value"
                      item-value="value"
                      label="Sender Name"
                      prepend-icon="contact_mail"
                      solo
                    />
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">
                      {{ helperText.keyword }}
                    </v-subheader>
                  </v-flex> 
                  <v-flex>
                    <v-combobox 
                      v-model="campaignForm.keyword"
                      :items="mutateKeywordList"
                      prepend-icon="text_fields"
                      label="Keyword"
                      multiple
                      small-chips
                      solo
                    >
                      <template slot="no-data">
                        <v-list-tile>
                          <span class="subheading">
                            Please back to add Keyword in "Shortcode Management" Menu
                          </span>
                        </v-list-tile>
                      </template>
                    </v-combobox>
                  </v-flex>
                  <v-subheader>
                    <small>Campaign Start Status:</small>
                  </v-subheader>
                  <v-radio-group 
                    v-model="cState"
                    prepend-icon="slideshow"
                    row
                  >
                    <v-radio
                      color="deep-purple" 
                      label="Test" 
                      value="test" 
                    />
                    <v-radio 
                      color="light-green" 
                      label="Production" 
                      value="production"
                    />
                  </v-radio-group>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">
                      {{ helperText.campaignActive }}
                    </v-subheader>
                  </v-flex> 
                  <!-- START DATE PICKER -->
                  <v-flex>
                    <v-subheader>Start Date :</v-subheader>
                  </v-flex>
                  <v-layout
                    row 
                    wrap
                  >
                    <v-flex 
                      xs4 
                      md4
                    >
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="date"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="date"
                          label="Date Picker"
                          prepend-icon="event"
                          readonly
                        />
                        <v-date-picker 
                          v-model="date"
                          no-title 
                          scrollable
                          dark
                          locale="th"
                          color="deep-purple"
                        >
                          <v-spacer />
                          <v-btn 
                            class="v-btn--simple"
                            round
                            color="primary" 
                            @click="menu = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn 
                            color="primary"
                            round
                            @click="$refs.menu.save(date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex 
                      xs4 
                      md4
                    >
                      <v-menu
                        ref="menu2"
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="time"
                          label="Time Picker"
                          prepend-icon="access_time"
                          readonly
                        />
                        <v-time-picker
                          v-model="time"
                          type="month"
                          width="320"
                          color="deep-purple"
                        />
                        <v-spacer />
                        <v-btn
                          flat
                          disabled
                        />
                        <v-btn 
                          class="v-btn--simple"
                          round
                          color="primary"
                          @click="menu2 = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn 
                          round 
                          color="primary" 
                          @click="$refs.menu2.save(time)"
                        >
                          OK
                        </v-btn>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">
                      {{ helperText.campaignDateStart }}
                    </v-subheader>
                  </v-flex> 
                  <!-- END DATE PICKER -->
                  <v-flex>
                    <v-subheader>End Date :</v-subheader>
                  </v-flex>
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex 
                      xs4 
                      md4
                    >
                      <v-menu
                        ref="menu3"
                        v-model="menu3"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="date2"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="date2"
                          label="Date Picker"
                          prepend-icon="event"
                          readonly
                        />
                        <v-date-picker 
                          v-model="date2"
                          no-title 
                          scrollable
                          dark
                          locale="th"
                          color="deep-purple"
                        >
                          <v-spacer />
                          <v-btn 
                            class="v-btn--simple"
                            round
                            color="primary"
                            @click="menu3 = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn 
                            round
                            color="primary" 
                            @click="$refs.menu3.save(date2)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex 
                      xs4 
                      md4
                    >
                      <v-menu
                        ref="menu4"
                        v-model="menu4"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time2"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="time2"
                          label="Time Picker"
                          prepend-icon="access_time"
                          readonly
                        />
                        <v-time-picker
                          v-model="time2"
                          type="month"
                          width="320"
                          color="deep-purple"
                        />
                        <v-spacer />
                        <v-btn
                          flat
                          disabled
                        />
                        <v-btn 
                          class="v-btn--simple"
                          round
                          color="primary" 
                          @click="menu4 = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn 
                          round 
                          color="primary"  
                          @click="$refs.menu4.save(time2)"
                        >
                          OK
                        </v-btn>
                      </v-menu>
                    </v-flex>                    
                  </v-layout>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">
                      {{ helperText.campaignDateEnd }}
                    </v-subheader>
                  </v-flex>
                  <!-- START TEST DATE PICKER -->
                  <v-flex>
                    <v-subheader>Start Test Date :</v-subheader>
                  </v-flex>
                  <v-layout
                    row 
                    wrap
                  >
                    <v-flex 
                      xs4 
                      md4
                    >
                      <v-menu
                        ref="menu5"
                        v-model="menu5"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="date3"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="date3"
                          label="Date Picker"
                          prepend-icon="event"
                          readonly
                        />
                        <v-date-picker 
                          v-model="date3"
                          no-title 
                          scrollable
                          dark
                          locale="th"
                          color="deep-purple"
                        >
                          <v-spacer />
                          <v-btn 
                            class="v-btn--simple"
                            round
                            color="primary" 
                            @click="menu5 = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn 
                            color="primary"
                            round
                            @click="$refs.menu5.save(date3)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex 
                      xs4 
                      md4
                    >
                      <v-menu
                        ref="menu6"
                        v-model="menu6"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time3"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="time3"
                          label="Time Picker"
                          prepend-icon="access_time"
                          readonly
                        />
                        <v-time-picker
                          v-model="time3"
                          type="month"
                          width="320"
                          color="deep-purple"
                        />
                        <v-spacer />
                        <v-btn
                          flat
                          disabled
                        />
                        <v-btn 
                          class="v-btn--simple"
                          round
                          color="primary"
                          @click="menu6 = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn 
                          round 
                          color="primary" 
                          @click="$refs.menu6.save(time3)"
                        >
                          OK
                        </v-btn>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">
                      {{ helperText.campaignDateTestStart }}
                    </v-subheader>
                  </v-flex> 
                  <!-- END TEST DATE PICKER -->
                  <v-flex>
                    <v-subheader>End Test Date :</v-subheader>
                  </v-flex>
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex 
                      xs4 
                      md4
                    >
                      <v-menu
                        ref="menu7"
                        v-model="menu7"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="date4"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="date4"
                          label="Date Picker"
                          prepend-icon="event"
                          readonly
                        />
                        <v-date-picker 
                          v-model="date4"
                          no-title 
                          scrollable
                          dark
                          locale="th"
                          color="deep-purple"
                        >
                          <v-spacer />
                          <v-btn 
                            class="v-btn--simple"
                            round
                            color="primary"
                            @click="menu7 = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn 
                            round
                            color="primary" 
                            @click="$refs.menu7.save(date4)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex 
                      xs4 
                      md4
                    >
                      <v-menu
                        ref="menu8"
                        v-model="menu8"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time4"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="time4"
                          label="Time Picker"
                          prepend-icon="access_time"
                          readonly
                        />
                        <v-time-picker
                          v-model="time4"
                          type="month"
                          width="320"
                          color="deep-purple"
                        />
                        <v-spacer />
                        <v-btn
                          flat
                          disabled
                        />
                        <v-btn 
                          class="v-btn--simple"
                          round
                          color="primary" 
                          @click="menu8 = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn 
                          round 
                          color="primary"  
                          @click="$refs.menu8.save(time4)"
                        >
                          OK
                        </v-btn>
                      </v-menu>
                    </v-flex>                    
                  </v-layout>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">
                      {{ helperText.campaignDateTestEnd }}
                    </v-subheader>
                  </v-flex> 
                </v-card-text>
              </v-card>
              <v-btn 
                color="primary"
                round
                @click.native="step = 3"
              >
                Continue
              </v-btn>
              <v-btn 
                class="v-btn--simple"
                color="default"
                round
                @click.native="step = 1"
              >
                Cancel
              </v-btn>
            </v-stepper-content>
            <v-stepper-step 
              editable
              step="3"
            >
              {{ stepName.three }}
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-card 
                color="grey lighten-4" 
                class="mb-5"
              >
                <v-card-text>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">
                      {{ helperText.contextDelimiter }}
                    </v-subheader>
                  </v-flex> 
                  <v-flex 
                    xs8
                    sm6 
                    md3
                  > 
                    <v-text-field 
                      v-model="validateForm.contextDelimiter"
                      prepend-icon="priority_high"
                      solo-inverted 
                      label="Delimiter"
                    />
                  </v-flex>
                  <v-subheader>Context Parser: (In Parser Object)</v-subheader>
                  <v-flex
                    xs12
                    md6
                  > 
                    <v-list two-line>
                      <v-list-tile 
                        v-for="item in contextParser" 
                        :key="item.key" 
                        avatar
                      >
                        <v-list-tile-avatar>
                          <v-icon class="blue white--text">
                            code
                          </v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>msg: "{{ item.messageContextFailed }}"</v-list-tile-title>
                          <v-list-tile-sub-title>
                            type: {{ item.contextType }} 
                            <span class="blue--text">
                              {{ item.contextForm }}
                            </span>
                          </v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            icon
                            ripple
                            @click="deleteContextParser(item.messageContextFailed)"
                          >
                            <v-icon color="grey lighten-1">
                              delete_forever
                            </v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <p />
                  <v-btn 
                    color="primary" 
                    round
                    @click.native="cardOpen = !cardOpen"
                  >
                    <v-icon dark>
                      add
                    </v-icon>
                    Add Parser
                  </v-btn>
                  <p />
                  <v-flex 
                    xs12
                    md6
                  >
                    <v-card v-if="cardOpen">
                      <v-form 
                        ref="anotherParser"
                        v-model="parserValid"
                        lazy-validation
                      >
                        <v-subheader>Add Context Parser</v-subheader>
                        <v-card-text>
                          <v-text-field
                            v-model="anotherParser.contextExclude"
                            :rules="[v => !!v || 'Item is required']"
                            prepend-icon="priority_high"
                            solo-inverted 
                            label="Remove Character"
                            required
                          />
                          <v-flex v-if="helper">
                            <v-subheader class="red--text">
                              {{ helperText.exclude }}
                            </v-subheader>
                          </v-flex>            
                          <v-text-field 
                            v-model="anotherParser.messageContextFailed"
                            :rules="[v => !!v || 'Item is required']"
                            prepend-icon="message"
                            label="Invalid Format Message"
                            required
                          />
                          <v-flex v-if="helper">
                            <v-subheader class="red--text">
                              {{ helperText.validateFailMsg }}
                            </v-subheader>
                          </v-flex> 
                          <v-select 
                            v-model="validateType"
                            :items="validateTypeList"
                            item-text="value"
                            label="Condition Type"
                            prepend-icon="ballot"
                            return-object
                          />
                          <v-flex v-if="helper">
                            <v-subheader class="red--text">
                              {{ helperText.validateType }}
                            </v-subheader>
                          </v-flex> 
                          <v-text-field 
                            v-model="anotherParser.contextForm"
                            :disabled="regexDisable"
                            prepend-icon="priority_high"
                            solo-inverted 
                            label="Condition (Regular Expression)"
                          />
                          <v-flex v-if="helper">
                            <v-subheader class="red--text">
                              {{ helperText.validateForm }}
                            </v-subheader>
                          </v-flex>
                          <v-btn 
                            color="primary" 
                            round
                            @click.native="subcardOpen = !subcardOpen"
                          >
                            <v-icon dark>
                              add
                            </v-icon>
                            Add Specific Condition
                          </v-btn>
                          <v-subheader>Specific Condition: (In Parser Object)</v-subheader>
                          <v-flex
                            xs12
                            md6
                          > 
                            <v-list two-line>
                              <v-list-tile 
                                v-for="item in subContextArray" 
                                :key="item.key" 
                                avatar
                              >
                                <v-list-tile-avatar>
                                  <v-icon class="blue white--text">
                                    code
                                  </v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                  <v-list-tile-title>msg: {{ item.messageContextFailed }}</v-list-tile-title>
                                  <v-list-tile-sub-title>
                                    regx: 
                                    <span class="blue--text">
                                      {{ item.contextSubForm }}
                                    </span>
                                  </v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                  <v-btn
                                    icon
                                    ripple
                                    @click="deleteSubContextArray(item.messageContextFailed)"
                                  >
                                    <v-icon color="grey lighten-1">
                                      delete_forever
                                    </v-icon>
                                  </v-btn>
                                </v-list-tile-action>
                              </v-list-tile>
                            </v-list>
                          </v-flex>
                          <v-flex 
                            xs12
                            md6
                          >
                            <v-card v-if="subcardOpen">
                              <v-form 
                                ref="contextFailed"
                                v-model="parserValid"
                                lazy-validation
                              >
                                <v-card-text>
                                  <v-subheader>Add Specific Conditions</v-subheader>
                                  <v-text-field 
                                    v-model="contextFailed.messageContextFailed"
                                    :rules="[v => !!v || 'Item is required']"
                                    prepend-icon="message"
                                    label="Invalid Format Message Specific"
                                    required
                                  />
                                  <v-text-field 
                                    v-model="contextFailed.contextSubForm"
                                    prepend-icon="priority_high"
                                    solo-inverted 
                                    label="Specific Condition (Regex)"
                                  />
                                  <v-flex v-if="helper">
                                    <v-subheader class="red--text">
                                      {{ helperText.validateFailSpecificMsg }}
                                    </v-subheader>
                                  </v-flex>
                                </v-card-text>
                                <v-card-actions>
                                  <v-spacer />
                                  <v-btn 
                                    class="v-btn--simple"
                                    color="primary"
                                    round
                                    @click.native="clearSubContextArray()"
                                  >
                                    Cancel
                                  </v-btn>
                                  <v-btn
                                    color="primary"
                                    round
                                    @click.native="addSubContextArray()"
                                  >
                                    Save
                                  </v-btn>
                                </v-card-actions>
                              </v-form>
                            </v-card>
                          </v-flex>                
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer />
                          <v-btn 
                            class="v-btn--simple"
                            color="primary"
                            round
                            @click.native="clearContextParser()"
                          >
                            Cancel
                          </v-btn>
                          <v-btn 
                            :disabled="!parserValid"
                            color="primary"
                            round
                            @click.native="addContextParser()"
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card>
                  </v-flex>
                </v-card-text>
              </v-card>
              <v-btn 
                color="primary" 
                round
                @click.native="step = 4"
              >
                Continue
              </v-btn>
              <v-btn 
                class="v-btn--simple"
                color="default"
                round
                @click.native="step = 2"
              >
                Cancel
              </v-btn>
            </v-stepper-content>
            <v-stepper-step
              editable
              step="4"
            >
              {{ stepName.four }}
            </v-stepper-step>
            <v-stepper-content step="4">
              <v-card 
                color="grey lighten-4" 
                class="mb-5"
              >
                <v-card-text>
                  <v-flex 
                    xs12
                    md6
                  > 
                    <v-flex v-if="helper">
                      <v-subheader class="red--text">
                        {{ helperText.messageCampaignTestNotRegister }}
                      </v-subheader>
                    </v-flex> 
                    <v-text-field 
                      v-model="validateForm.messageCampaignTestNotRegister"
                      prepend-icon="chat"
                      label="Empty Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="red--text">
                        {{ helperText.messageCampaignNotAvailable }}
                      </v-subheader>
                    </v-flex>
                    <v-text-field 
                      v-model="validateForm.messageCampaignNotAvailable"
                      prepend-icon="chat"
                      label="Pause Service Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="red--text">
                        {{ helperText.messageCheckMsisdnNotFound }}
                      </v-subheader>
                    </v-flex> 
                    <v-text-field 
                      v-model="validateForm.messageCheckMsisdnNotFound"
                      prepend-icon="chat"
                      label="Telephone Number Checked Error Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="red--text">
                        {{ helperText.messageBoundariesLessError }}
                      </v-subheader>
                    </v-flex> 
                    <v-text-field 
                      v-model="validateForm.messageBoundariesLessError"
                      prepend-icon="chat"
                      label="Less Content Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="red--text">
                        {{ helperText.messageBoundariesOverError }}
                      </v-subheader>
                    </v-flex> 
                    <v-text-field 
                      v-model="validateForm.messageBoundariesOverError"
                      prepend-icon="chat"
                      label="Over Content Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="red--text">
                        {{ helperText.messageBeforeStart }}
                      </v-subheader>
                    </v-flex>
                    <v-text-field 
                      v-model="validateForm.messageBeforeStart"
                      prepend-icon="chat"
                      label="Before Service Active Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="red--text">
                        {{ helperText.messageAfterEnd }}
                      </v-subheader>
                    </v-flex>
                    <v-text-field 
                      v-model="validateForm.messageAfterEnd"
                      prepend-icon="chat"
                      label="After Service Active Message"
                    />
                  </v-flex>
                </v-card-text>
              </v-card>
              <v-btn 
                color="primary" 
                round
                @click.native="step = 5"
              >
                Continue
              </v-btn>
              <v-btn 
                class="v-btn--simple"
                color="default"
                round
                @click.native="step = 3"
              >
                Cancel
              </v-btn>
            </v-stepper-content>
            <v-stepper-step 
              editable
              step="5"
            >
              {{ stepName.five }}
            </v-stepper-step>
            <v-stepper-content
              step="5" 
            >
              <v-card 
                color="grey lighten-4" 
                class="mb-5"
              >
                <v-card-text>
                  <v-layout>
                    <v-flex 
                      xs12
                      md6
                    > 
                      <v-flex>
                        <v-subheader>Reward Validation:</v-subheader>
                        <v-flex v-if="helper">
                          <v-subheader class="red--text">
                            {{ helperText.rewardHasSequence }}
                          </v-subheader>
                        </v-flex> 
                        <v-switch
                          v-model="switch2"
                          color="deep-purple"
                          label="is Sequential Reward"
                        />
                        <v-switch
                          v-model="objectReward"
                          color="deep-purple"
                          label="Reward is Object?"
                        />
                        <v-flex v-if="helper">
                          <v-subheader class="red--text">
                            {{ helperText.limitReward }}
                          </v-subheader>
                        </v-flex> 
                        <v-text-field 
                          v-model="validateForm.rewardsLimit"
                          prepend-icon="phonelink_off"
                          label="Limit Rewards"
                        />
                        <v-flex v-if="helper">
                          <v-subheader class="red--text">
                            {{ helperText.failMsg }}
                          </v-subheader>
                        </v-flex> 
                        <v-text-field 
                          v-model="validateForm.messageRewardFailed"
                          prepend-icon="chat_bubble"
                          label="Fail Message"
                        />
                        <v-text-field 
                          v-model="validateForm.messageRewardsInvalid"
                          prepend-icon="chat_bubble"
                          label="Rewards Invalid Message"
                        />
                        <v-text-field 
                          v-model="validateForm.messageRewardReceivedLimit"
                          prepend-icon="chat_bubble"
                          label="Rewards Limited Message"
                        />
                      </v-flex>
                      <v-flex
                        xs12
                        md12
                      > 
                        <v-subheader>Rewards List:</v-subheader>
                        <v-list two-line>
                          <v-list-tile 
                            v-for="item in rewards" 
                            :key="item.key" 
                            avatar
                          >
                            <v-list-tile-avatar>
                              <v-icon class="deep-purple white--text">
                                redeem
                              </v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title>{{ item.rewardName }}</v-list-tile-title>
                              <v-list-tile-sub-title>{{ item.messageRewardSuccess }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                              <v-btn
                                icon
                                ripple
                                @click="deleteReward(item.rewardName)"
                              >
                                <v-icon color="grey lighten-1">
                                  delete_forever
                                </v-icon>
                              </v-btn>
                            </v-list-tile-action>
                          </v-list-tile>
                        </v-list>
                      </v-flex>
                      <v-btn 
                        color="primary"
                        round
                        @click.native="cardOpen = !cardOpen"
                      >
                        <v-icon dark>
                          add
                        </v-icon>
                        Add Reward
                      </v-btn>
                      <p />
                      <v-card v-if="cardOpen">
                        <v-form
                          ref="anotherReward"
                          v-model="rewardValid"
                          lazy-validation
                        >
                          <v-card-title>
                            <v-subheader>
                              Add Reward Validation Details: <small class="red--text">
                                &nbsp; ปุ่ม generate และ upload ยังใช้ไม่ได้
                              </small>
                            </v-subheader>
                          </v-card-title>
                          <v-card-actions>
                            <p />
                            <v-switch
                              v-model="switch1"
                              color="deep-purple"
                              label="is Coupon"
                            />
                            <v-spacer />
                            <v-btn
                              :disabled="!switch1"
                              color="blue-grey"
                              class="white--text"
                              round
                            >
                              Generated
                            </v-btn>
                            <v-btn
                              :loading="loading1"
                              :disabled="!switch1"
                              color="blue-grey"
                              class="white--text"
                              round
                              @click.native="loader = 'loading1'"
                            >
                              <v-icon 
                                left 
                                dark
                              >
                                cloud_upload
                              </v-icon>
                              Upload
                            </v-btn>
                            <p />
                          </v-card-actions>
                          <v-card-text>
                            <v-text-field
                              v-model="anotherReward.rewardId"
                              prepend-icon="atm"
                              label="Reward ID"
                            />
                            <v-text-field
                              v-model="anotherReward.rewardName"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="phonelink"
                              label="Reward Name"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="red--text">
                                {{ helperText.name }}
                              </v-subheader>
                            </v-flex> 
                            <v-text-field 
                              v-model="anotherReward.rewardTotal"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="filter_9"
                              label="Reward Total"
                              type="number"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="red--text">
                                {{ helperText.rewardTotal }}
                              </v-subheader>
                            </v-flex> 
                            <v-text-field 
                              v-model="anotherReward.rewardCondition"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="phonelink_setup"
                              label="Reward Condition Type"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="red--text">
                                {{ helperText.rewardCondition }}
                              </v-subheader>
                            </v-flex> 
                            <v-text-field 
                              v-model="anotherReward.rewardConditionForm"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="phonelink_lock"
                              label="Reward Condition Value"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="red--text">
                                {{ helperText.rewardvalidateForm }}
                              </v-subheader>
                            </v-flex>
                            <v-text-field 
                              v-model="anotherReward.messageRewardSuccess"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="chat_bubble_outline"
                              label="Success Message"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="red--text">
                                {{ helperText.messageRewardSuccess }}
                              </v-subheader>
                            </v-flex>
                            <v-text-field 
                              v-model="anotherReward.messageRewardOutOfStock"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="chat_bubble_outline"
                              label="Out of Stock Message"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="red--text">
                                {{ helperText.messageRewardOutOfStock }}
                              </v-subheader>
                            </v-flex>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer />
                            <v-btn
                              class="v-btn--simple" 
                              round
                              color="primary"
                              @click.native="clearReward()"
                            >
                              Cancel
                            </v-btn>
                            <v-btn 
                              :disabled="!rewardValid"
                              round
                              color="primary"
                              @click.native="addReward()"
                            >
                              Save
                            </v-btn>
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
              <v-btn
                color="primary"
                round
                @click.native="step = 6"
              >
                Continue
              </v-btn>
              <v-btn 
                class="v-btn--simple"
                color="default"
                round
                @click.native="step = 4"
              >
                Cancel
              </v-btn>
            </v-stepper-content>
            <v-stepper-step 
              step="6" 
              editable
            >
              {{ stepName.six }}
            </v-stepper-step>
            <v-stepper-content
              step="6" 
            >
              <v-card 
                color="grey lighten-4" 
                class="mb-5"
              >
                <v-card-text>
                  <v-layout>
                    <v-flex 
                      xs12
                    > 
                      <p class="indigo--text">
                        <strong>Step 6: Summary Page</strong>
                      </p>

                      <p>
                        compaign Code: <strong class="green--text">
                          {{ campaignForm.campaignCode }}
                        </strong>
                      </p>
                      <p>
                        compaign Name: <strong class="green--text">
                          {{ campaignForm.campaignName }}
                        </strong>
                      </p>
                      <p>
                        compaign Description: <strong class="green--text">
                          {{ campaignForm.campaignDescription }}
                        </strong>
                      </p>
                      <p>
                        compaign Type: <strong class="green--text">
                          {{ campaignType }}
                        </strong>
                      </p>
                      <p>
                        compaign Keyword: <strong class="green--text">
                          {{ campaignForm.keyword }}
                        </strong>
                      </p>
                      <p>
                        compaign Shortcode: <strong class="green--text">
                          {{ campaignForm.shortcode }}
                        </strong>
                      </p>
                      <!-- <p>compaign's Brand: <strong class="green- -text">{{ brand.organizationLevel3Name }}</strong></p> -->
                      <p>
                        compaign's Start Date: <strong class="green--text">
                          {{ date }}
                        </strong> Time: <strong class="green--text">
                          {{ time }}
                        </strong>
                      </p>
                      <p>
                        compaign's End Date: <strong class="green--text">
                          {{ date2 }}
                        </strong> Time: <strong class="green--text">
                          {{ time2 }}
                        </strong>
                      </p>
                      <p>
                        compaign's Test Start Date: <strong class="green--text">
                          {{ date3 }}
                        </strong> Time: <strong class="green--text">
                          {{ time3 }}
                        </strong>
                      </p>
                      <p>
                        compaign's Test End Date: <strong class="green--text">
                          {{ date4 }}
                        </strong> Time: <strong class="green--text">
                          {{ time4 }}
                        </strong>
                      </p>
                      <p>
                        campaign State: <strong class="green--text">
                          {{ cState }}
                        </strong>
                      </p>
                      <p>
                        Empty Message: <strong class="green--text">
                          {{ validateForm.campaignNotAvailableMsg }}
                        </strong>
                      </p>
                      <p>
                        Fail Message: <strong class="green--text">
                          {{ validateForm.failMsg }}
                        </strong>
                      </p>
                      <p>
                        Limit Reward: <strong class="green--text">
                          {{ validateForm.limitReward }}
                        </strong>
                      </p>
                      <p>
                        Delimiter: <strong class="green--text">
                          {{ validateForm.contextDelimiter }}
                        </strong>
                      </p>
                      <p>
                        Less Content Message: <strong class="green--text">
                          {{ validateForm.messageBoundariesLessError }}
                        </strong>
                      </p>
                      <p>
                        Over Content Message: <strong class="green--text">
                          {{ validateForm.messageBoundariesOverError }}
                        </strong>
                      </p>
                      <p>
                        After Service Active: <strong class="green--text">
                          {{ validateForm.messageAfterEnd }}
                        </strong>
                      </p>
                      <p>
                        Before Service Active: <strong class="green--text">
                          {{ validateForm.messageBeforeStart }}
                        </strong>
                      </p>
                      <p>
                        Pause Service Message: <strong class="green--text">
                          {{ validateForm.messageCampaignNotAvailable }}
                        </strong>
                      </p>
                      <p>
                        Telephone Number Checked Error Message: <strong class="green--text">
                          {{ validateForm.messageCheckMsisdnNotFound }}
                        </strong>
                      </p>
                      <p>
                        Empty Message: <strong class="green--text">
                          {{ validateForm.messageCampaignTestNotRegister }}
                        </strong>
                      </p>
                      <p class="indigo--text">
                        ------------------------------Still Workings--------------------------------
                      </p>
                      <p>
                        contextParser: <strong class="green--text">
                          {{ contextParser }}
                        </strong>
                      </p>
                      <p>rewards: {{ rewards }}</p>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
              <v-btn
                color="primary"
                round
                @click.native="step = 1"
              >
                Continue
              </v-btn>
              <v-btn 
                class="v-btn--simple"
                color="default"
                round
                @click.native="step = 5"
              >
                Cancel
              </v-btn>
            </v-stepper-content>
          </v-stepper>
        </v-form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


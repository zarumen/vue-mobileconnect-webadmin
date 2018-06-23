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
      campaignHeader: '',
      campaignDescription: '',
      keyword: '',
      shortcode: '',
    })
    const defaultvForm = Object.freeze({
      campaignNotAvailableMsg: '',
      failMsg: '',
      limitReward: '',
      validateBoundaries: '',
      validateBoundariesLessErrMsg: '',
      validateBoundariesOverErrMsg: '',
      validateMsgAfterEnd: '',
      validateMsgBeforeStart: '',
      validateMsgPausedService: '',
    })
    const defaultpForm = Object.freeze({
      exclude: '',
      validateFailMsg: '',
      validateForm: null,
      validateType: 'coupon'
    })
    const defaultrForm = Object.freeze({
      coupon: null,
      name: '',
      rewardCondition: '',
      rewardTotal: '',
      validateForm: null,
      winMsg: ''
    })

    return {
      // Default Values
      campaignForm: Object.assign({}, defaultcForm),
      validateForm: Object.assign({}, defaultvForm),
      cActive: 'Active',
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
      // helper variable
      locale: 'TH',
      helper: false,
      helperText: {},
      // context parser variable
      validateTypeList: [
        {value: 'regex', condition: false},
        {value: 'coupon', condition: true},
      ],
      validateType: true,
      contextParser: [],
      parserValid: true,
      // parser array
      anotherParser: Object.assign({}, defaultpForm),
      // rewards Variable
      rewards: [],
      rewardValid: true,
      // reward array
      anotherReward: Object.assign({}, defaultrForm),
      // ---------**-------------------------------------
      // Test Value
      // ---------**------------------------------------- 
      date: null,
      date2: null,
      time: '00:00',
      time2: '00:00',
      menu: false,
      menu3: false,
      menu4: false,
      menu6: false,
      switch1: false,
      switch2: false,
      loading1: false,
      cardOpen: false,
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
    closeDialog() {
      this.$emit('emitCloseCampaignDialog', false)
    },
    saveCampaign() {
      
      // prepare campaign Object and campaignValidation Object

      const campaignNew = this.campaignForm
      const startDate = this.date + "T" + this.time
      const endDate = this.date2 + "T" + this.time2
      const campaignValidationNew = this.validateForm

      if(this.brand !== null) {

        // --------------------- campaign Object ----------------------------------------
        campaignNew['campaignAvailable'] = true

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
        campaignNew['campaignActive'] = this.cActive

        // --------------------- campaignValidation Object ----------------------------------------
        
        // set Context Parsers
        campaignValidationNew['contextParser'] = this.contextParser
        // set Reward Array
        campaignValidationNew['rewards'] = this.rewards

        campaignValidationNew['rewardHasSequence'] = this.switch2
        campaignValidationNew['campaignAvailable'] = true

        campaignValidationNew['campaignDateStart'] = new Date(startDate)
        campaignValidationNew['campaignDateEnd'] = new Date(endDate)
        campaignValidationNew['campaignActive'] = this.cActive

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

        if (newParser.validateForm) {
          newParser['validateType'] = 'regex'
        } else {
          newParser['validateType'] = 'coupon'
        }

        this.contextParser.push(newParser)
        this.anotherParser = Object.assign({}, this.defaultpForm)
        this.cardOpen = false
      }
    },
    clearContextParser() {
      this.$refs.anotherParser.reset()
    },
    deleteContextParser(excludeCharacter) {

      this.contextParser = this.contextParser.filter(parser => {
        return parser.exclude !== excludeCharacter
      })
    },
    addReward() {
      if(this.$refs.anotherReward.validate()) {

        let newReward = this.anotherReward

        newReward['coupon'] = this.switch1

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
        return reward.name !== name
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
      transition="dialog-bottom-transition">
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
            <v-toolbar-title>
              Add New Campaign
            </v-toolbar-title>
            <v-spacer/>
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
              <small>v.0.20 patch note: สามารถ Add campaign กรอกข้อมูล added Reward และ contextParser ได้แล้ว มีปุ่ม Helper ไว้แสดงข้อความช่วยเบื้องต้น </small>
              <small>road map: ทำปุ่ม Generate Coupon และ Upload Coupon, ทำตัวช่วย กรอกในสิ่งที่เคยกรอกไปแล้ว (Template) ทั้งในส่วนของ Regex และ ข้อความ (Message Template) และหน้าสุดท้าย ไว้ดูสรุปข้อมูล ก่อน save</small>
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
                    <v-subheader class="red--text">{{ helperText.campaignCode }}</v-subheader>
                  </v-flex>
                  <v-flex 
                    xs12
                    md8
                  > 
                    <v-text-field 
                      v-model="campaignForm.campaignHeader"
                      prepend-icon="shop"
                      label="Campaign Name"
                    />
                  </v-flex> 
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">{{ helperText.campaignHeader }}</v-subheader>
                  </v-flex>
                  <v-flex 
                    xs12
                    md8
                  >
                    <v-text-field
                      v-model="campaignForm.campaignDescription"
                      prepend-icon="shop_two"
                      label="Campaign Description"
                      multi-line
                    />
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">{{ helperText.campaignDescription }}</v-subheader>
                  </v-flex>               
                </v-card-text>
              </v-card>
              <v-btn 
                color="blue" 
                class="white--text"
                @click.native="step = 2"
              >
                Continue
              </v-btn>
              <v-btn 
                flat
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
                    <v-select
                      v-model="brand"
                      :hint="`${brand}`"
                      :items="brandList"
                      :key="brandList.key"
                      item-text="displayName"
                      prepend-icon="shopping_basket"
                      label="Campaign Owners: Brand"
                      persistent-hint
                      autocomplete
                    >
                      <template 
                        slot="item" 
                        slot-scope="data"
                      >
                        <template v-if="typeof data.item !== 'object'">
                          <v-list-tile-content v-text="data.item"/>
                        </template>
                        <template v-else>
                          <v-list-tile-content>
                            <v-list-tile-title v-html="data.item.displayName"/>
                            <v-list-tile-sub-title v-html="`${data.item.organizationLevel1Name} > ${data.item.organizationLevel2Name}`"/>
                          </v-list-tile-content>
                        </template>
                        <template 
                          slot="selection" 
                          slot-scope="data"
                        >
                          <v-chip
                            :selected="data.selected"
                            :key="JSON.stringify(data.item)"
                            close
                            @input="data.parent.selectItem(data.item)"
                          >
                            {{ data.item.displayName }}
                          </v-chip>
                        </template>
                      </template>
                    </v-select>
                  </v-flex>
                  <v-flex 
                    xs8
                    sm6 
                    md3
                  > 
                    <v-text-field 
                      v-model="campaignForm.keyword"
                      prepend-icon="text_fields"
                      mask="NNNNNN"
                      label="Keyword"
                    />
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">{{ helperText.keyword }}</v-subheader>
                  </v-flex>  
                  <v-flex 
                    xs8
                    sm6 
                    md3
                  > 
                    <v-text-field 
                      v-model="campaignForm.shortcode"
                      prepend-icon="looks_6"
                      mask="########"
                      label="Shortcode"
                    />
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">{{ helperText.shortcode }}</v-subheader>
                  </v-flex> 
                  <v-subheader>
                    <small>Campaign Start Status:</small>
                  </v-subheader>
                  <v-radio-group 
                    v-model="cActive"
                    prepend-icon="slideshow"
                    row
                  >
                    <v-radio
                      color="blue darken-3" 
                      label="Active" 
                      value="Active" 
                    />
                    <v-radio 
                      color="red" 
                      label="InActive" 
                      value="InActive"
                    />
                    <v-radio 
                      color="blue lighten-2" 
                      label="Paused" 
                      value="Paused"
                    />
                  </v-radio-group>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">{{ helperText.campaignActive }}</v-subheader>
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
                        :close-on-content-click="false"
                        v-model="menu"
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
                          color="blue"
                        >
                          <v-spacer/>
                          <v-btn 
                            flat
                            color="blue" 
                            @click="menu = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn 
                            flat 
                            color="blue" 
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
                        ref="menu3"
                        :close-on-content-click="false"
                        v-model="menu3"
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
                          color="blue"
                        />
                        <v-spacer/>
                        <v-btn
                          flat
                          disabled
                        />
                        <v-btn 
                          flat
                          color="blue"
                          @click="menu3 = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn 
                          flat 
                          color="blue" 
                          @click="$refs.menu3.save(time)"
                        >
                          OK
                        </v-btn>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">{{ helperText.campaignDateStart }}</v-subheader>
                  </v-flex> 
                  <!-- END DATE PICKER -->
                  <v-flex>
                    <v-subheader>End Date</v-subheader>
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
                        ref="menu4"
                        :close-on-content-click="false"
                        v-model="menu4"
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
                          color="blue"
                        >
                          <v-spacer/>
                          <v-btn 
                            flat 
                            color="blue" 
                            @click="menu = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn 
                            flat 
                            color="blue" 
                            @click="$refs.menu4.save(date2)"
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
                        :close-on-content-click="false"
                        v-model="menu6"
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
                          color="blue"
                        />
                        <v-spacer/>
                        <v-btn
                          flat
                          disabled
                        />
                        <v-btn 
                          flat
                          color="blue"
                          @click="menu6 = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn 
                          flat 
                          color="blue" 
                          @click="$refs.menu6.save(time2)"
                        >
                          OK
                        </v-btn>
                      </v-menu>
                    </v-flex>                    
                  </v-layout>
                  <v-flex v-if="helper">
                    <v-subheader class="red--text">{{ helperText.campaignDateEnd }}</v-subheader>
                  </v-flex> 
                </v-card-text>
              </v-card>
              <v-btn 
                color="blue" 
                class="white--text"
                @click.native="step = 3"
              >
                Continue
              </v-btn>
              <v-btn 
                flat
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
                    <v-subheader class="red--text">{{ helperText.validateBoundaries }}</v-subheader>
                  </v-flex> 
                  <v-flex 
                    xs8
                    sm6 
                    md3
                  > 
                    <v-text-field 
                      v-model="validateForm.validateBoundaries"
                      solo-inverted 
                      label="Delimiter"
                    />
                  </v-flex>
                  <v-subheader>Context Parser: (In Parser Object)</v-subheader>
                  <v-flex
                    xs8
                    md6
                  > 
                    <v-list two-line>
                      <v-list-tile 
                        v-for="item in contextParser" 
                        :key="item.key" 
                        avatar
                      >
                        <v-list-tile-avatar>
                          <v-icon class="blue white--text">code</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ item.validateFailMsg }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ item.validateType }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            icon
                            ripple
                            @click="deleteContextParser(item.exclude)"
                          >
                            <v-icon color="grey lighten-1">delete_forever</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <p/>
                  <v-btn 
                    color="blue" 
                    class="white--text"
                    round
                    @click.native="cardOpen = !cardOpen"
                  >
                    <v-icon dark>add</v-icon>
                    Add Parser
                  </v-btn>
                  <p/>
                  <v-flex 
                    xs8
                    sm6 
                    md5
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
                            v-model="anotherParser.exclude"
                            :rules="[v => !!v || 'Item is required']"
                            solo-inverted 
                            label="Remove Character"
                            required
                          />
                          <v-flex v-if="helper">
                            <v-subheader class="red--text">{{ helperText.exclude }}</v-subheader>
                          </v-flex>            
                          <v-text-field 
                            v-model="anotherParser.validateFailMsg"
                            :rules="[v => !!v || 'Item is required']"
                            prepend-icon="message"
                            label="Invalid Format Message"
                            required
                          />
                          <v-flex v-if="helper">
                            <v-subheader class="red--text">{{ helperText.validateFailMsg }}</v-subheader>
                          </v-flex> 
                          <v-select 
                            v-model="validateType"
                            :items="validateTypeList"
                            :hint="`${validateType}`"
                            item-text="value"
                            item-value="condition"
                            label="Condition Type"
                            prepend-icon="assignment"
                            persistent-hint
                          />
                          <v-flex v-if="helper">
                            <v-subheader class="red--text">{{ helperText.validateType }}</v-subheader>
                          </v-flex> 
                          <v-text-field 
                            v-model="anotherParser.validateForm"
                            :disabled="validateType"
                            solo-inverted 
                            label="Condition (Regular Expression)"
                          />
                          <v-flex v-if="helper">
                            <v-subheader class="red--text">{{ helperText.validateForm }}</v-subheader>
                          </v-flex>                      
                        </v-card-text> 
                        <v-card-actions>
                          <v-spacer/>
                          <v-btn 
                            :disabled="!parserValid"
                            color="blue" 
                            class="white--text"
                            @click.native="addContextParser()"
                          >
                            Save
                          </v-btn>
                          <v-btn 
                            flat
                            @click.native="clearContextParser()"
                          >
                            Cancel
                          </v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card>
                  </v-flex>
                </v-card-text>
              </v-card>
              <v-btn 
                color="blue" 
                class="white--text"
                @click.native="step = 4"
              >
                Continue
              </v-btn>
              <v-btn 
                flat
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
                      <v-subheader class="red--text">{{ helperText.campaignNotAvailableMsg }}</v-subheader>
                    </v-flex> 
                    <v-text-field 
                      v-model="validateForm.campaignNotAvailableMsg"
                      prepend-icon="chat"
                      label="Empty Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="red--text">{{ helperText.validateBoundariesLessErrMsg }}</v-subheader>
                    </v-flex> 
                    <v-text-field 
                      v-model="validateForm.validateBoundariesLessErrMsg"
                      prepend-icon="chat"
                      label="Less Content Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="red--text">{{ helperText.validateBoundariesOverErrMsg }}</v-subheader>
                    </v-flex> 
                    <v-text-field 
                      v-model="validateForm.validateBoundariesOverErrMsg"
                      prepend-icon="chat"
                      label="Over Content Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="red--text">{{ helperText.validateMsgBeforeStart }}</v-subheader>
                    </v-flex>
                    <v-text-field 
                      v-model="validateForm.validateMsgBeforeStart"
                      prepend-icon="chat"
                      label="Before Service Active Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="red--text">{{ helperText.validateMsgAfterEnd }}</v-subheader>
                    </v-flex>
                    <v-text-field 
                      v-model="validateForm.validateMsgAfterEnd"
                      prepend-icon="chat"
                      label="After Service Active Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="red--text">{{ helperText.validateMsgPausedService }}</v-subheader>
                    </v-flex>
                    <v-text-field 
                      v-model="validateForm.validateMsgPausedService"
                      prepend-icon="chat"
                      label="Pause Service Message"
                    />
                  </v-flex>
                </v-card-text>
              </v-card>
              <v-btn 
                color="blue" 
                class="white--text"
                @click.native="step = 5"
              >
                Continue
              </v-btn>
              <v-btn 
                flat
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
                      xs6
                    > 
                      <v-flex>
                        <v-subheader>Reward Validation:</v-subheader>
                        <v-flex v-if="helper">
                          <v-subheader class="red--text">{{ helperText.rewardHasSequence }}</v-subheader>
                        </v-flex> 
                        <v-switch
                          v-model="switch2"
                          color="blue"
                          label="is Sequential Reward"
                        />
                        <v-flex v-if="helper">
                          <v-subheader class="red--text">{{ helperText.limitReward }}</v-subheader>
                        </v-flex> 
                        <v-text-field 
                          v-model="validateForm.limitReward"
                          prepend-icon="phonelink_off"
                          label="Limit Rewards"
                        />
                        <v-flex v-if="helper">
                          <v-subheader class="red--text">{{ helperText.failMsg }}</v-subheader>
                        </v-flex> 
                        <v-text-field 
                          v-model="validateForm.failMsg"
                          prepend-icon="chat_bubble"
                          label="Fail Message"
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
                              <v-icon class="blue white--text">redeem</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                              <v-list-tile-sub-title>{{ item.winMsg }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                              <v-btn
                                icon
                                ripple
                                @click="deleteReward(item.name)"
                              >
                                <v-icon color="grey lighten-1">delete_forever</v-icon>
                              </v-btn>
                            </v-list-tile-action>
                          </v-list-tile>
                        </v-list>
                      </v-flex>
                      <v-btn 
                        color="blue" 
                        class="white--text"
                        round
                        @click.native="cardOpen = !cardOpen"
                      >
                        <v-icon dark>add</v-icon>
                        Add Reward
                      </v-btn>
                      <p/>
                      <v-card v-if="cardOpen">
                        <v-form
                          ref="anotherReward"
                          v-model="rewardValid"
                          lazy-validation
                        >
                          <v-card-title>
                            <v-subheader>Add Reward Validation Details:</v-subheader>
                          </v-card-title>
                          <v-card-actions>
                            <p/>
                            <v-switch
                              v-model="switch1"
                              color="blue"
                              label="is Coupon"
                            />
                            <v-spacer/>
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
                            <p/>
                          </v-card-actions>
                          <v-card-text>
                            <v-text-field
                              v-model="anotherReward.name"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="phonelink"
                              label="Reward Name"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="red--text">{{ helperText.name }}</v-subheader>
                            </v-flex> 
                            <v-text-field 
                              v-model="anotherReward.rewardTotal"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="filter_9"
                              label="Reward Total"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="red--text">{{ helperText.rewardTotal }}</v-subheader>
                            </v-flex> 
                            <v-text-field 
                              v-model="anotherReward.rewardCondition"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="phonelink_setup"
                              label="Reward Condition Type"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="red--text">{{ helperText.rewardCondition }}</v-subheader>
                            </v-flex> 
                            <v-text-field 
                              v-model="anotherReward.validateForm"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="phonelink_lock"
                              label="Reward Condition Value"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="red--text">{{ helperText.rewardvalidateForm }}</v-subheader>
                            </v-flex>
                            <v-text-field 
                              v-model="anotherReward.winMsg"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="chat_bubble_outline"
                              label="Success Message"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="red--text">{{ helperText.winMsg }}</v-subheader>
                            </v-flex>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer/>
                            <v-btn 
                              :disabled="!rewardValid"
                              color="blue" 
                              class="white--text"
                              @click.native="addReward()"
                            >
                              Save
                            </v-btn>
                            <v-btn 
                              flat
                              @click.native="clearReward()"
                            >
                              Cancel
                            </v-btn>
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
              <v-btn
                color="blue" 
                class="white--text"
                @click.native="step = 6"
              >
                Continue
              </v-btn>
              <v-btn 
                flat
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
                      <p>Step 6: Summary Page</p>
                      <p>{{ campaignForm }}</p>
                      <p>{{ validateForm }}</p>
                      <p>{{ contextParser }}</p>
                      <p>{{ rewards }}</p>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
              <v-btn
                color="blue" 
                class="white--text"
                @click.native="step = 1"
              >
                Continue
              </v-btn>
              <v-btn 
                flat
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


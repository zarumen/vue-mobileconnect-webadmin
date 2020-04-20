<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { arrayToObject } from '@utils/array-to-object'
import { helperTH } from '@utils/campaign-create-helper'
import { fireStorageApp } from '@utils/firestorage.config'

var storageRef = fireStorageApp.ref()

export default {
  props: {
    addCampaignDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data () {
    const defaultcForm = Object.freeze({
      campaignCode: '',
      campaignName: '',
      campaignDescription: '',
      keyword: '',
      shortcode: ''
    })
    const defaultvForm = Object.freeze({
      contextDelimiter: '',
      messageCampaignNotAvailable: '',
      messageRewardsFailed: '',
      messageBoundariesLessError: '',
      messageBoundariesOverError: '',
      messageAfterEnd: '',
      messageBeforeStart: '',
      rewardsLimit: 0
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

    const defaultussdForm = Object.freeze({
      ACCOUNT: '',
      DEFAULTREPLY: '',
      LANGUAGE: 'T',
      PASSWORD: '',
      URL: '',
      OPERATORS: {
        ais: {
          failure: false,
          success: false
        },
        dtac: {
          failure: false,
          success: false
        },
        true: {
          failure: false,
          success: false
        },
        ussdtrue: {
          failure: false,
          success: false
        },
        testweb: {
          failure: false,
          success: false
        }
      }
    })

    return {
      // Default Values
      campaignForm: Object.assign({}, defaultcForm),
      validateForm: Object.assign({}, defaultvForm),
      ussdForm: Object.assign({}, defaultussdForm),
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
        'api',
        'reward',
        'microsite'
      ],
      rewardConditionTypeList: [
        'all',
        'regx'
        // 'lastDigit',
        // 'sequentialRegx'
      ],
      campaignCodeRule: [
        v => !!v || 'This Field is required',
        v => /^[a-zA-Z0-9_]*$/.test(v) || 'Code รูปแบบไม่ถูกต้อง',
        v => this.checkDuplicatedcampaignId(v) || 'มี ID ซ้ำ ซ้ำกับที่มีอยู่แล้ว กรุณาเปลี่ยนใหม่',
        v => !(v.length <= 8) || 'ID must be more than 8 characters'
      ],
      checkKeywordRules: [
        v => !!v || 'This Field is required',
        v => this.checkDuplicatedKeyword(v) || 'Keyword ซ้ำกับที่มีอยู่แล้ว'
      ],
      campaignType: null,
      campaignLongMessage: false,
      // helper variable
      locale: 'TH',
      helper: false,
      helperText: {},
      searchVal: '',
      micrositeField: [],
      micrositeFieldEx: [
        'fullname', 'gender', 'email', 'birthdate', 'address'
      ],
      // context parser variable
      validateTypeList: [
        { value: 'regx', condition: false },
        { value: 'validate', condition: true },
        { value: 'register', condition: false },
        { value: 'reward', condition: false }
      ],
      validateType: null,
      conditionTypeValidate: false,
      contextParserUndefined: false,
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
      ],
      // Verify Code Variable
      switchUploadVC: false,
      fileNameTestVC: '',
      fileUrlTestVC: '',
      fileNameProVC: '',
      fileUrlProVC: '',
      fileTypeVC: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
      // Coupon Code Variable
      fileNameTestCP: [],
      fileUrlTestCP: [],
      fileNameProCP: [],
      fileUrlProCP: [],
      fileTypeCP: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
      // Coupon Code Generator Variable
      couponGenDialog: '',
      couponTestGen: false,
      couponProductionGen: false,
      couponDigits: 0,
      couponTotals: 0,
      couponResult: [],
      // ---------**-------------------------------------
      // Operators Bulk Configs
      // ---------**-------------------------------------
      optionBulk: false,
      optionAis: false,
      optionTrue: false,
      optionDtac: false,
      optionTestweb: false,
      optionUssdTrue: false
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
    ...mapGetters('campaigns', [
      'getAllCampaignsId'
    ]),
    checkObjectReward () {
      return (this.campaignType === 'reward')
    },
    keywordInKeywordList () {
      const sCheck = this.campaignForm.shortcode

      if (sCheck) {
        const kws = this.keywordList.find(sc => sc.shortcode === sCheck)

        return kws.keywords
      }

      return []
    },
    regexDisable () {
      if (this.validateType) { return this.validateType.condition }

      return true
    },
    contextType () {
      if (this.validateType) { return this.validateType.value }

      return null
    },
    mutateKeywordList () {
      const scCheck = this.campaignForm.shortcode

      if (scCheck) {
        const checkedInReservedList = this.keywordReservedList.some(sc => sc.shortcode === scCheck)

        if (checkedInReservedList) {
          console.log('have keyword Reserved!')
          const kw = this.mutatekwReservedList(scCheck)

          return kw.keywordsArray
        }

        return []
      }

      return []
    },
    mutateShortcodeList () {
      if (this.campaignForm.shortcode) {
        const scArray = this.mutatescList(this.campaignForm.shortcode)

        return scArray.sendername
      }
      return []
    },
    isSwitchUploadOn: {
      get () {
        if (this.validateForm.campaignHasMsisdnList) { return this.validateForm.campaignHasMsisdnList }

        return this.switchUploadVC
      },
      set (val) {
        this.switchUploadVC = val
      }
    }
  },
  watch: {
    validateForm: {
      handler (validateForm) {
        if (this.validateForm.campaignHasMsisdnList) {
          this.switchUploadVC = !this.switchUploadVC
          this.toggleSwitchUpload(this.switchUploadVC)
        }
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    this.mapHelper()
  },
  methods: {
    ...mapActions('campaigns', [
      'createCampaign'
    ]),
    toggleSwitchUpload (val) {
      if (this.validateForm.campaignHasMsisdnList) {
        return this.validateForm.campaignHasMsisdnList
      }

      return val
    },
    checkDuplicatedKeyword (keywordArr) {
      if (keywordArr) {
        if (!this.keywordInKeywordList) return true
        // ถ้ามี keyword เข้ามาให้ เช็คว่า มี keyword ที่ใช้อยู่รึิเปล่า
        const checkArr = keywordArr.map(element => {
          // return เป็น Boolean Array ของ keywords [true, false, true]
          return this.keywordInKeywordList.includes(element)
        })
        // ถ้ามี แม้แต่ 1 ตัวที่เป็น true ให้โชว์ error ว่า มี keyword ซ้ำ
        if (checkArr.includes(true)) {
          // show Error
          return false
        }
        // doesn't show Error
        return true
      }
      // doesn't show Error
      return true
    },
    checkDuplicatedcampaignId (id) {
      if (id) {
        const arr = []
        arr.push(id)

        if (!this.getAllCampaignsId) return true
        // ถ้ามี keyword เข้ามาให้ เช็คว่า มี keyword ที่ใช้อยู่รึิเปล่า
        const checkArr = arr.map(element => {
          // return เป็น Boolean Array ของ keywords [true, false, true]
          return this.getAllCampaignsId.includes(element)
        })
        // ถ้ามี แม้แต่ 1 ตัวที่เป็น true ให้โชว์ error ว่า มี keyword ซ้ำ
        if (checkArr.includes(true)) {
          // show Error
          return false
        }
        // doesn't show Error
        return true
      }
      // doesn't show Error
      return true
    },
    mutatekwList (sc) {
      return this.keywordList.find(keyword => keyword.shortcode === sc)
    },
    mutatekwReservedList (sc) {
      return this.keywordReservedList.find(keyword => keyword.shortcode === sc)
    },
    mutatescList (sc) {
      return this.shortcodeList.find(scList => scList.shortcode === sc)
    },
    closeDialog () {
      this.$emit('emitCloseCampaignDialog', false)
    },
    saveCampaign () {
      // check forms in v-form validation
      this.$refs.campaignForm.validate()
      // prepare campaign Object and campaignValidation Object

      const campaignNew = this.campaignForm
      const startDate = this.date + 'T' + this.time
      const endDate = this.date2 + 'T' + this.time2
      const startTestDate = this.date3 + 'T' + this.time3
      const endTestDate = this.date4 + 'T' + this.time4
      const campaignValidationNew = this.validateForm

      if (this.brand !== null) {
        // --------------------- campaign Object ----------------------------------------
        // Campaign Status
        campaignNew.campaignAvailable = true // check campaign paused or unpaused
        campaignNew.campaignActive = true // check campaign delete or not deleted
        campaignNew.campaignState = this.cState // check campaign status {test, production, close}
        campaignNew.campaignType = this.campaignType // added campaign type

        campaignNew.organizationAuth = this.brand.organizationAuth
        campaignNew.organizationLevel1 = this.brand.organizationLevel1
        campaignNew.organizationLevel1Name = this.brand.organizationLevel1Name
        campaignNew.organizationLevel2 = this.brand.organizationLevel2
        campaignNew.organizationLevel2Name = this.brand.organizationLevel2Name
        campaignNew.organizationLevel3 = this.brand.organizationLevel3
        campaignNew.organizationLevel3Name = this.brand.organizationLevel3Name
        campaignNew.brandPicUrl = this.brand.picURL

        // set Check Campaign Verify Code
        if (this.isSwitchUploadOn) {
          campaignNew.campaignHasVerifyCode = true
        } else {
          campaignNew.campaignHasVerifyCode = false
        }

        // check campaign has UNICODE Features (default: false)
        if (this.campaignLongMessage) {
          campaignValidationNew.campaignLongMessage = true
        } else {
          campaignValidationNew.campaignLongMessage = false
        }

        // set Date in here
        campaignNew.campaignDateStart = new Date(startDate)
        campaignNew.campaignDateEnd = new Date(endDate)

        // --------------------- campaignValidation Object ----------------------------------------

        // check microsite fields
        if (campaignNew.campaignType === 'microsite') {
          campaignValidationNew.micrositeFields = this.micrositeField
        }
        // set Context Parsers
        if (!this.contextParserUndefined || this.contextParser.length > 0) {
          campaignValidationNew.contextParser = this.contextParser
        } else {
          delete campaignValidationNew.contextDelimiter
        }
        // SET OPTION BULK TO CAMPAIGN

        if (this.optionBulk) {
          campaignValidationNew.bulkConfig = this.ussdForm
        }

        // set Reward Array or Object
        if (this.checkObjectReward) {
          campaignValidationNew.rewardsObject = arrayToObject(this.rewards, 'rewardId')
        } else {
          campaignValidationNew.rewardsArray = this.rewards
        }

        campaignValidationNew.rewardsHaveSequence = this.switch2
        campaignValidationNew.campaignAvailable = true
        campaignValidationNew.campaignState = this.cState
        campaignValidationNew.campaignSenderName = this.campaignForm.campaignSenderName

        // set Campaign Timing
        campaignValidationNew.campaignDateStart = new Date(startDate)
        campaignValidationNew.campaignDateEnd = new Date(endDate)
        campaignValidationNew.campaignDateTestStart = new Date(startTestDate)
        campaignValidationNew.campaignDateTestEnd = new Date(endTestDate)

        if (this.switchUploadVC) {
          // upload Verify_Code here

          // TEST FILE
          this.uploadVerifyCode({
            id: this.campaignForm.campaignCode,
            state: 'test',
            filename: this.fileNameTestVC,
            fileUrl: this.fileUrlTestVC
          })

          // PRODUCTION FILE
          this.uploadVerifyCode({
            id: this.campaignForm.campaignCode,
            state: 'production',
            filename: this.fileNameProVC,
            fileUrl: this.fileUrlProVC
          })
        }

        if (this.switch1) {
          // upload Coupons here

          // TEST FILE
          this.uploadCoupons({
            id: this.campaignForm.campaignCode,
            state: 'test',
            fileName: this.fileNameTestCP,
            fileUrl: this.fileUrlTestCP
          })

          // PRODUCTION FILE
          this.uploadCoupons({
            id: this.campaignForm.campaignCode,
            state: 'production',
            fileName: this.fileNameProCP,
            fileUrl: this.fileUrlProCP
          })
        }

        this.createCampaign({
          campaignObject: campaignNew,
          validationObject: campaignValidationNew
        })
        this.closeDialog()
      }
    },
    mapHelper () {
      if (this.locale === 'TH') {
        this.helperText = helperTH
      }
    },
    addContextParser () {
      if (this.$refs.anotherParser.validate()) {
        const newParser = this.anotherParser

        newParser.contextType = this.contextType
        if (this.subContextArray.length > 0) {
          // check if contextFail has element added it to Main Context parser
          newParser.contextFailed = this.subContextArray
        }

        if (this.conditionTypeValidate) {
          this.validateForm.rewardsLimit = 1
        }

        this.contextParser.push(newParser)

        this.anotherParser = Object.assign({}, this.defaultpForm)
        this.subContextArray = []
        this.cardOpen = false
      }
    },
    clearContextParser () {
      this.$refs.anotherParser.reset()
      this.cardOpen = false
    },
    deleteContextParser (validateFailMsg) {
      this.contextParser = this.contextParser.filter(parser => {
        return parser.messageContextFailed !== validateFailMsg
      })
    },
    // Specific contextFailed inside Context Parser
    addSubContextArray () {
      if (this.$refs.contextFailed.validate()) {
        const newSpecific = this.contextFailed

        this.subContextArray.push(newSpecific)
        this.contextFailed = Object.assign({}, this.defaultspForm)
        this.subcardOpen = false
      }
    },
    clearSubContextArray () {
      this.$refs.contextFailed.reset()
      this.subcardOpen = false
    },
    deleteSubContextArray (validateFailMsg) {
      this.subContextArray = this.subContextArray.filter(parser => {
        return parser.messageContextFailed !== validateFailMsg
      })
    },
    addReward () {
      if (this.$refs.anotherReward.validate()) {
        const newReward = this.anotherReward

        newReward.rewardHasCoupon = this.switch1

        this.rewards.push(newReward)
        this.anotherReward = Object.assign({}, this.defaultrForm)
        this.cardOpen = false
      }
    },
    clearReward () {
      this.$refs.anotherReward.reset()
    },
    deleteReward (name) {
      this.rewards = this.rewards.filter(reward => {
        return reward.rewardName !== name
      })
    },
    // VERIFY CODE ZONE
    uploadVerifyCode ({ id, state, filename, fileUrl }) {
      const ref = storageRef.child(`campaigns/${id}/verifyCodeFile/${state}/${filename}`)

      ref.putString(fileUrl, 'data_url')
        .then((snapshot) => {
          console.log('Uploaded a data_url string!')
        })
    },
    // ADD COUPONS METHODS
    updatedTestArrayName (e) {
      this.fileNameTestCP.push(e)
    },
    updatedTestArrayUrl (e) {
      this.fileUrlTestCP.push(e)
    },
    updatedProArrayName (e) {
      this.fileNameProCP.push(e)
    },
    updatedProArrayUrl (e) {
      this.fileUrlProCP.push(e)
    },
    uploadCoupons ({ id, state, fileName, fileUrl }) {
      console.log(fileName)
      fileName.forEach((file, index) => {
        const ref = storageRef.child(`campaigns/${id}/couponsFile/${state}/${index}-${file}`)

        ref.putString(fileUrl[index], 'data_url')
          .then((snapshot) => {
            console.log('Uploaded a data_url string!')
          })
      })
    },
    clickedGen () {
      for (let i = 0; i < this.couponTotals; i++) {
        this.couponResult.push(this.generateId(this.couponDigits))
      }

      let csvContent = 'data:text/csv;charset=utf-8,'

      this.couponResult.forEach((rowArray) => {
        csvContent += rowArray + '\r\n'
      })

      const encodedUri = encodeURI(csvContent)

      if (this.couponTestGen) {
        this.fileNameTestCP.push(`coupons_${this.couponTotals}_generated.csv`)
        this.fileUrlTestCP.push(encodedUri)
      }

      if (this.couponProductionGen) {
        this.fileNameProCP.push(`coupons_${this.couponTotals}_generated.csv`)
        this.fileUrlProCP.push(encodedUri)
      }

      this.couponGenDialog = !this.couponGenDialog

      return encodedUri
    },
    dec2hex (dec) {
      return ('0' + dec.toString(36)).substr(-2)
    },
    activatedOperators (option) {
      return (option) ? 'Open' : 'Close'
    },
    // generateId :: Integer -> String
    generateId (len) {
      const arr = new Uint8Array((len || 40) / 2)
      window.crypto.getRandomValues(arr)
      return Array.from(arr, this.dec2hex).join('')
    }
  }
}
</script>

<template>
  <v-row
    justify="center"
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
            color="deep-purple"
          >
            <base-button
              icon
              dark
              @click.native="closeDialog()"
            >
              <v-icon>
                close
              </v-icon>
            </base-button>
            <v-toolbar-title class="white--text">
              Add New Campaign
            </v-toolbar-title>
            <v-spacer />
            <v-toolbar-items>
              <base-button
                dark
                text
                @click.native="helper = !helper"
              >
                Helper: TH
              </base-button>
              <base-button
                dark
                text
                @click.native="saveCampaign()"
              >
                Save
              </base-button>
            </v-toolbar-items>
          </v-toolbar>
          <!-- Content is here -->
          <v-stepper
            v-model="step"
            light
            vertical
          >
            <v-stepper-step
              :complete="step > 1"
              editable
              step="1"
            >
              {{ stepName.one }}
              <small>v.1.1 patch note: can set Bulk Option Config, and Bulk-API</small>
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-card
                color="grey lighten-4"
                class="mb-5"
              >
                <v-card-text>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignCode }}
                    </v-subheader>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="campaignForm.campaignCode"
                      prepend-icon="fiber_new"
                      :rules="campaignCodeRule"
                      :counter="20"
                      label="Campaign Code"
                      required
                    />
                  </v-col>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignName }}
                    </v-subheader>
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                  >
                    <v-text-field
                      v-model="campaignForm.campaignName"
                      prepend-icon="shop"
                      label="Campaign Name"
                    />
                  </v-col>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignDescription }}
                    </v-subheader>
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                  >
                    <v-textarea
                      v-model="campaignForm.campaignDescription"
                      prepend-icon="shop_two"
                      label="Campaign Description"
                    />
                  </v-col>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignType }}
                    </v-subheader>
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                  >
                    <v-select
                      v-model="campaignType"
                      :items="cTypeList"
                      label="Campaign Type"
                      prepend-icon="assignment"
                    />
                  </v-col>
                  <v-col
                    v-if="campaignType === 'api'"
                    cols="12"
                    md="8"
                  >
                    <v-text-field
                      v-model="validateForm.apiURL"
                      prepend-icon="settings_applications"
                      label="Api Url"
                    />
                    <v-text-field
                      v-model="validateForm.apiReport"
                      prepend-icon="receipt"
                      label="Api Report"
                    />
                  </v-col>
                  <v-col
                    v-if="campaignType === 'microsite'"
                    cols="12"
                  >
                    <v-combobox
                      v-model="micrositeField"
                      :items="micrositeFieldEx"
                      :search-input.sync="searchVal"
                      hide-selected
                      hint="Add Multiple Values"
                      label="Microsite Fields"
                      prepend-icon="assignment"
                      multiple
                      persistent-hint
                      small-chips
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              No results matching "<strong>{{ searchVal }}</strong>". Press <kbd>enter</kbd> to create a new one
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-combobox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                  >
                    <v-switch
                      v-model="optionBulk"
                      :label="`Open Bulk Option to Send SMS`"
                    />
                  </v-col>
                  <v-col
                    v-if="optionBulk"
                    cols="12"
                  >
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.ussdLanguage }}
                      </v-subheader>
                    </v-col>
                    <v-select
                      v-model="ussdForm.LANGUAGE"
                      :items="['T', 'E']"
                      prepend-icon="language"
                      label="Language"
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.ussdUrl }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="ussdForm.URL"
                      prepend-icon="http"
                      label="Url"
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.ussdAccount }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="ussdForm.ACCOUNT"
                      prepend-icon="account_box"
                      label="Account"
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.ussdPassword }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="ussdForm.PASSWORD"
                      prepend-icon="vpn_key"
                      label="Password"
                      counter="0"
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.ussdDefaultReply }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="ussdForm.DEFAULTREPLY"
                      prepend-icon="reply"
                      label="Default Reply"
                      counter="70"
                    />
                    <span><v-icon class="pr-2 my-2">call_split</v-icon>OPERATORS</span>
                    <v-sheet class="pa-5">
                      <v-col v-if="helper">
                        <v-subheader class="helpertext">
                          {{ helperText.ussdOperators }}
                        </v-subheader>
                        <v-subheader class="helpertext">
                          {{ helperText.ussdOperatorsSuccess }}
                        </v-subheader>
                        <v-subheader class="helpertext">
                          {{ helperText.ussdOperatorsFailure }}
                        </v-subheader>
                      </v-col>
                      <v-switch
                        v-model="optionAis"
                        inset
                        :label="`AIS: ${activatedOperators(optionAis)}`"
                      />
                      <v-sheet
                        v-if="optionAis"
                        class="pa-3"
                      >
                        <v-switch
                          v-model="ussdForm.OPERATORS.ais.success"
                          :label="`Success: ${ussdForm.OPERATORS.ais.success}`"
                        />
                        <v-switch
                          v-model="ussdForm.OPERATORS.ais.failure"
                          :label="`Failure: ${ussdForm.OPERATORS.ais.failure}`"
                        />
                      </v-sheet>
                      <v-switch
                        v-model="optionDtac"
                        inset
                        :label="`DTAC: ${activatedOperators(optionDtac)}`"
                      />
                      <v-sheet
                        v-if="optionDtac"
                        class="pa-3"
                      >
                        <v-switch
                          v-model="ussdForm.OPERATORS.dtac.success"
                          :label="`Success: ${ussdForm.OPERATORS.dtac.success}`"
                        />
                        <v-switch
                          v-model="ussdForm.OPERATORS.dtac.failure"
                          :label="`Failure: ${(ussdForm.OPERATORS.dtac.failure)}`"
                        />
                      </v-sheet>
                      <v-switch
                        v-model="optionTrue"
                        inset
                        :label="`TRUE: ${activatedOperators(optionTrue)}`"
                      />
                      <v-sheet
                        v-if="optionTrue"
                        class="pa-3"
                      >
                        <v-switch
                          v-model="ussdForm.OPERATORS.true.success"
                          :label="`Success: ${ussdForm.OPERATORS.true.success}`"
                        />
                        <v-switch
                          v-model="ussdForm.OPERATORS.true.failure"
                          :label="`Failure: ${ussdForm.OPERATORS.true.failure}`"
                        />
                      </v-sheet>
                      <v-switch
                        v-model="optionUssdTrue"
                        inset
                        :label="`USSD TRUE: ${activatedOperators(optionUssdTrue)}`"
                      />
                      <v-sheet
                        v-if="optionUssdTrue"
                        class="pa-3"
                      >
                        <v-switch
                          v-model="ussdForm.OPERATORS.ussdtrue.success"
                          :label="`Success: ${ussdForm.OPERATORS.ussdtrue.success}`"
                        />
                        <v-switch
                          v-model="ussdForm.OPERATORS.ussdtrue.failure"
                          :label="`Failure: ${ussdForm.OPERATORS.ussdtrue.failure}`"
                        />
                      </v-sheet>
                      <v-switch
                        v-model="optionTestweb"
                        inset
                        :label="`TESTWEB: ${activatedOperators(optionTestweb)}`"
                      />
                      <v-sheet
                        v-if="optionTestweb"
                        class="pa-3"
                      >
                        <v-switch
                          v-model="ussdForm.OPERATORS.testweb.success"
                          :label="`Success: ${ussdForm.OPERATORS.testweb.success}`"
                        />
                        <v-switch
                          v-model="ussdForm.OPERATORS.testweb.failure"
                          :label="`Failure: ${ussdForm.OPERATORS.testweb.failure}`"
                        />
                      </v-sheet>
                    </v-sheet>
                  </v-col>
                </v-card-text>
              </v-card>
              <base-button
                color="primary"
                rounded
                @click.native="step = 2"
              >
                Continue
              </base-button>
              <base-button
                color="primary"
                text
                @click.native="closeDialog()"
              >
                Cancel
              </base-button>
            </v-stepper-content>
            <v-stepper-step
              :complete="step > 2"
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
                  <v-col
                    cols="12"
                  >
                    <v-subheader><small>Campaign Features Check:</small></v-subheader>
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.campaignLongMessage }}
                      </v-subheader>
                    </v-col>
                    <v-switch
                      v-model="campaignLongMessage"
                      color="primary"
                      label="Use Campaign Long Message"
                    />
                  </v-col>
                  <v-col
                    cols="8"
                    sm="6"
                    md="3"
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
                      <template v-slot:item="data">
                        <template v-if="data.item.picURL === 'undefine'">
                          <v-list-item-avatar
                            class="secondary white--text"
                          >
                            {{ data.item.displayName.slice(0, 2).toUpperCase() }}
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>{{ data.item.displayName }}</v-list-item-title>
                            <v-list-item-subtitle>{{ data.item.organizationLevel1Name }} > {{ data.item.organizationLevel2Name }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                        <template v-else>
                          <v-list-item-avatar>
                            <img :src="data.item.picURL">
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>{{ data.item.displayName }}</v-list-item-title>
                            <v-list-item-subtitle>{{ data.item.organizationLevel1Name }} > {{ data.item.organizationLevel2Name }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </template>
                      <template v-slot:selection="data">
                        <v-chip
                          :key="JSON.stringify(data.item)"
                          :input-value="data.selected"
                          color="primary"
                          text-color="white"
                          close
                          @input="idata.parent.selectItem(data.item)"
                        >
                          <v-avatar>
                            <img :src="data.item.picURL">
                          </v-avatar>
                          {{ data.item.displayName }}
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-col>
                  <v-col
                    cols="8"
                    sm="6"
                    md="3"
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
                          <v-list-item-content v-text="data.item" />
                        </template>
                        <template v-else>
                          <v-list-item-content>
                            <v-list-item-title>{{ data.item.shortcode }}</v-list-item-title>
                          </v-list-item-content>
                        </template>
                        <template
                          slot="selection"
                          slot-scope="idata"
                        >
                          <v-chip
                            :key="JSON.stringify(idata.item)"
                            :input-value="idata.selected"
                            color="deep-purple"
                            close
                            @input="idata.parent.selectItem(idata.item)"
                          >
                            {{ idata.item.shortcode }}
                          </v-chip>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignSenderName }}
                    </v-subheader>
                  </v-col>
                  <v-col
                    cols="8"
                    sm="6"
                    md="3"
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
                  </v-col>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.keyword }}
                    </v-subheader>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="campaignForm.keyword"
                      :items="mutateKeywordList"
                      :rules="checkKeywordRules"
                      prepend-icon="text_fields"
                      label="Keyword"
                      multiple
                      small-chips
                      solo
                    >
                      <template slot="no-data">
                        <v-list-item>
                          <span class="subheading">
                            Please back to add Keyword in "Shortcode Management" Menu
                          </span>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                  <v-subheader>
                    <small>Campaign Start Status:</small>
                  </v-subheader>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignActive }}
                    </v-subheader>
                  </v-col>
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
                  <!-- START DATE PICKER -->
                  <v-col>
                    <v-subheader>Start Date :</v-subheader>
                  </v-col>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignDateStart }}
                    </v-subheader>
                  </v-col>
                  <v-row>
                    <v-col
                      cols="4"
                      md="4"
                    >
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="date"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            slot="activator"
                            v-model="date"
                            label="Date Picker"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="date"
                          no-title
                          scrollable
                          dark
                          locale="th"
                          color="deep-purple"
                        >
                          <div class="flex-grow-1" />
                          <base-button
                            text
                            color="primary"
                            @click="menu = false"
                          >
                            Cancel
                          </base-button>
                          <base-button
                            color="primary"
                            rounded
                            @click="$refs.menu.save(date)"
                          >
                            OK
                          </base-button>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col
                      cols="4"
                      md="4"
                    >
                      <v-menu
                        ref="menu2"
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            slot="activator"
                            v-model="time"
                            label="Time Picker"
                            prepend-icon="access_time"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-time-picker
                          v-model="time"
                          color="deep-purple"
                        />
                        <v-row class="grey lighten-5">
                          <div class="flex-grow-1" />
                          <v-col
                            cols="auto"
                            class="mx-2"
                          >
                            <base-button
                              text
                              color="primary"
                              @click="menu2 = false"
                            >
                              Cancel
                            </base-button>
                            <base-button
                              rounded
                              color="primary"
                              @click="$refs.menu2.save(time)"
                            >
                              OK
                            </base-button>
                          </v-col>
                        </v-row>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <!-- END DATE PICKER -->
                  <v-col>
                    <v-subheader>End Date :</v-subheader>
                  </v-col>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignDateEnd }}
                    </v-subheader>
                  </v-col>
                  <v-row>
                    <v-col
                      cols="4"
                      md="4"
                    >
                      <v-menu
                        ref="menu3"
                        v-model="menu3"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="date2"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            slot="activator"
                            v-model="date2"
                            label="Date Picker"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="date2"
                          no-title
                          scrollable
                          dark
                          locale="th"
                          color="deep-purple"
                        >
                          <div class="flex-grow-1" />
                          <base-button
                            text
                            color="primary"
                            @click="menu3 = false"
                          >
                            Cancel
                          </base-button>
                          <base-button
                            rounded
                            color="primary"
                            @click="$refs.menu3.save(date2)"
                          >
                            OK
                          </base-button>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col
                      cols="4"
                      md="4"
                    >
                      <v-menu
                        ref="menu4"
                        v-model="menu4"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time2"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            slot="activator"
                            v-model="time2"
                            label="Time Picker"
                            prepend-icon="access_time"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-time-picker
                          v-model="time2"
                          width="320"
                          color="deep-purple"
                        />
                        <v-row>
                          <div class="flex-grow-1" />
                          <v-col
                            cols="auto"
                            class="mx-2"
                          >
                            <base-button
                              text
                              color="primary"
                              @click="menu4 = false"
                            >
                              Cancel
                            </base-button>
                            <base-button
                              rounded
                              color="primary"
                              @click="$refs.menu4.save(time2)"
                            >
                              OK
                            </base-button>
                          </v-col>
                        </v-row>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <!-- START TEST DATE PICKER -->
                  <v-col>
                    <v-subheader>Start Test Date :</v-subheader>
                  </v-col>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignDateTestStart }}
                    </v-subheader>
                  </v-col>
                  <v-row>
                    <v-col
                      cols="4"
                      md="4"
                    >
                      <v-menu
                        ref="menu5"
                        v-model="menu5"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="date3"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            slot="activator"
                            v-model="date3"
                            label="Date Picker"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="date3"
                          no-title
                          scrollable
                          dark
                          locale="th"
                          color="deep-purple"
                        >
                          <div class="flex-grow-1" />
                          <base-button
                            text
                            color="primary"
                            @click="menu5 = false"
                          >
                            Cancel
                          </base-button>
                          <base-button
                            color="primary"
                            rounded
                            @click="$refs.menu5.save(date3)"
                          >
                            OK
                          </base-button>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col
                      cols="4"
                      md="4"
                    >
                      <v-menu
                        ref="menu6"
                        v-model="menu6"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time3"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            slot="activator"
                            v-model="time3"
                            label="Time Picker"
                            prepend-icon="access_time"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-time-picker
                          v-model="time3"
                          color="deep-purple"
                        />
                        <v-row>
                          <div class="flex-grow-1" />
                          <v-col
                            cols="auto"
                            class="mx-2"
                          >
                            <base-button
                              text
                              color="primary"
                              @click="menu6 = false"
                            >
                              Cancel
                            </base-button>
                            <base-button
                              rounded
                              color="primary"
                              @click="$refs.menu6.save(time3)"
                            >
                              OK
                            </base-button>
                          </v-col>
                        </v-row>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <!-- END TEST DATE PICKER -->
                  <v-col>
                    <v-subheader>End Test Date :</v-subheader>
                  </v-col>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignDateTestEnd }}
                    </v-subheader>
                  </v-col>
                  <v-row>
                    <v-col
                      cols="4"
                      md="4"
                    >
                      <v-menu
                        ref="menu7"
                        v-model="menu7"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="date4"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            slot="activator"
                            v-model="date4"
                            label="Date Picker"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="date4"
                          no-title
                          scrollable
                          dark
                          locale="th"
                          color="deep-purple"
                        >
                          <div class="flex-grow-1" />
                          <base-button
                            text
                            color="primary"
                            @click="menu7 = false"
                          >
                            Cancel
                          </base-button>
                          <base-button
                            rounded
                            color="primary"
                            @click="$refs.menu7.save(date4)"
                          >
                            OK
                          </base-button>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col
                      cols="4"
                      md="4"
                    >
                      <v-menu
                        ref="menu8"
                        v-model="menu8"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time4"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            slot="activator"
                            v-model="time4"
                            label="Time Picker"
                            prepend-icon="access_time"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-time-picker
                          v-model="time4"
                          color="deep-purple"
                        />
                        <v-row>
                          <div class="flex-grow-1" />
                          <v-col
                            cols="auto"
                            class="mx-2"
                          >
                            <base-button
                              text
                              color="primary"
                              @click="menu8 = false"
                            >
                              Cancel
                            </base-button>
                            <base-button
                              rounded
                              color="primary"
                              @click="$refs.menu8.save(time4)"
                            >
                              OK
                            </base-button>
                          </v-col>
                        </v-row>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <base-button
                color="primary"
                rounded
                @click.native="step = 3"
              >
                Continue
              </base-button>
              <base-button
                color="primary"
                text
                @click.native="step = 1"
              >
                Cancel
              </base-button>
            </v-stepper-content>
            <v-stepper-step
              :complete="step > 3"
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
                  <v-subheader>Campaign Validate Details</v-subheader>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.contextDelimiter }}
                    </v-subheader>
                  </v-col>
                  <v-col
                    cols="8"
                    sm="6"
                    md="3"
                  >
                    <v-text-field
                      v-model="validateForm.contextDelimiter"
                      prepend-icon="priority_high"
                      solo-inverted
                      label="Delimiter"
                    />
                  </v-col>
                  <v-subheader>Upload VerifyCode File:</v-subheader>
                  <v-subheader
                    v-if="contextType === 'validate'"
                    class="red--text"
                  >
                    เมื่อ Parser มี Condition Type = "validate" ให้ UPLOAD VERIFY_CODE ตรงนี้ด้วย
                  </v-subheader>
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignHasVerifyCode }}
                    </v-subheader>
                  </v-col>
                  <v-switch
                    v-model="isSwitchUploadOn"
                    color="deep-purple"
                    label="Has VerifyCode"
                  />
                  <v-col v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignHasMsisdnList }}
                    </v-subheader>
                  </v-col>
                  <v-switch
                    v-model="validateForm.campaignHasMsisdnList"
                    color="deep-purple"
                    label="VerifyCode Has Msisdn List"
                  />
                  <v-col>
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.verifyCodeTestUpload }}
                      </v-subheader>
                    </v-col>
                    <BaseUploadfield
                      :accept="fileTypeVC"
                      :disabled="!switchUploadVC"
                      :label="`VerifyCode TEST Upload`"
                      @input="fileNameTestVC=arguments[0]"
                      @formData="fileUrlTestVC=arguments[0]"
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.verifyCodeProductionUpload }}
                      </v-subheader>
                    </v-col>
                    <BaseUploadfield
                      :accept="fileTypeVC"
                      :disabled="!switchUploadVC"
                      :label="`VerifyCode PRODUCTION Upload`"
                      @input="fileNameProVC=arguments[0]"
                      @formData="fileUrlProVC=arguments[0]"
                    />
                  </v-col>
                  <v-subheader>Context Parser: (In Parser Object)</v-subheader>
                  <v-subheader
                    v-if="checkObjectReward"
                    class="red--text"
                  >
                    ตอนเพิ่ม Parser ให้เลือก Condition Type อย่างน้อย 1 ตัวเป็น Type "REWARD"
                  </v-subheader>
                  <v-subheader
                    v-if="campaignType === 'register'"
                    class="red--text"
                  >
                    ตอนเพิ่ม Parser ให้เลือก Condition Type อย่างน้อย 1 ตัวเป็น Type "REGISTER"
                  </v-subheader>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-list two-line>
                      <v-list-item
                        v-for="item in contextParser"
                        :key="item.key"
                      >
                        <v-list-item-avatar>
                          <v-icon class="blue white--text">
                            code
                          </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>msg: "{{ item.messageContextFailed }}"</v-list-item-title>
                          <v-list-item-subtitle>
                            type: {{ item.contextType }}
                            <span class="blue--text">
                              {{ item.contextForm }}
                            </span>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <base-button
                            icon
                            ripple
                            @click="deleteContextParser(item.messageContextFailed)"
                          >
                            <v-icon color="grey lighten-1">
                              delete_forever
                            </v-icon>
                          </base-button>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <p />
                  <base-button
                    color="primary"
                    rounded
                    @click.native="cardOpen = !cardOpen"
                  >
                    <v-icon dark>
                      add
                    </v-icon>
                    Add Parser
                  </base-button>
                  <p />
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-card v-if="cardOpen">
                      <v-form
                        ref="anotherParser"
                        v-model="parserValid"
                        lazy-validation
                      >
                        <v-subheader>Add Context Parser</v-subheader>
                        <v-card-text>
                          <v-col v-if="helper">
                            <v-subheader class="helpertext">
                              {{ helperText.exclude }}
                            </v-subheader>
                          </v-col>
                          <v-text-field
                            v-model="anotherParser.contextExclude"
                            :rules="[v => !!v || 'Item is required']"
                            prepend-icon="priority_high"
                            solo-inverted
                            label="Remove Character"
                            required
                          />
                          <v-col v-if="helper">
                            <v-subheader class="helpertext">
                              {{ helperText.messageContextFailed }}
                            </v-subheader>
                          </v-col>
                          <v-text-field
                            v-model="anotherParser.messageContextFailed"
                            :rules="[v => !!v || 'Item is required']"
                            :counter="70"
                            prepend-icon="message"
                            label="Invalid Format Message"
                            required
                          />
                          <v-col v-if="helper">
                            <v-subheader class="helpertext">
                              {{ helperText.validateType }}
                            </v-subheader>
                          </v-col>
                          <v-select
                            v-model="validateType"
                            :items="validateTypeList"
                            item-text="value"
                            label="Condition Type"
                            prepend-icon="ballot"
                            return-object
                          />
                          <v-col v-if="helper">
                            <v-subheader class="helpertext">
                              {{ helperText.validateForm }}
                            </v-subheader>
                          </v-col>
                          <v-text-field
                            v-model="anotherParser.contextForm"
                            :disabled="regexDisable"
                            prepend-icon="priority_high"
                            solo-inverted
                            label="Condition (Regular Expression)"
                          />
                          <base-button
                            color="primary"
                            rounded
                            @click.native="subcardOpen = !subcardOpen"
                          >
                            <v-icon dark>
                              add
                            </v-icon>
                            Add Specific Condition
                          </base-button>
                          <v-subheader>Specific Condition: (In Parser Object)</v-subheader>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-list two-line>
                              <v-list-item
                                v-for="item in subContextArray"
                                :key="item.key"
                              >
                                <v-list-item-avatar>
                                  <v-icon class="blue white--text">
                                    code
                                  </v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                  <v-list-item-title>msg: {{ item.messageContextFailed }}</v-list-item-title>
                                  <v-list-item-subtitle>
                                    regx:
                                    <span class="blue--text">
                                      {{ item.contextSubForm }}
                                    </span>
                                  </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                  <base-button
                                    icon
                                    ripple
                                    @click="deleteSubContextArray(item.messageContextFailed)"
                                  >
                                    <v-icon color="grey lighten-1">
                                      delete_forever
                                    </v-icon>
                                  </base-button>
                                </v-list-item-action>
                              </v-list-item>
                            </v-list>
                          </v-col>
                          <v-col
                            cols="12"
                            md="9"
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
                                    :counter="70"
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
                                  <v-col v-if="helper">
                                    <v-subheader class="helpertext">
                                      {{ helperText.validateFailSpecificMsg }}
                                    </v-subheader>
                                  </v-col>
                                </v-card-text>
                                <v-card-actions>
                                  <v-spacer />
                                  <base-button
                                    color="primary"
                                    text
                                    @click.native="clearSubContextArray()"
                                  >
                                    Cancel
                                  </base-button>
                                  <base-button
                                    rounded
                                    color="primary"
                                    @click.native="addSubContextArray()"
                                  >
                                    Save
                                  </base-button>
                                </v-card-actions>
                              </v-form>
                            </v-card>
                          </v-col>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer />
                          <base-button
                            color="primary"
                            text
                            @click.native="clearContextParser()"
                          >
                            Cancel
                          </base-button>
                          <base-button
                            :disabled="!parserValid"
                            color="primary"
                            rounded
                            @click.native="addContextParser()"
                          >
                            Save
                          </base-button>
                        </v-card-actions>
                      </v-form>
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-col v-if="helper">
                      <v-subheader class="helpertext error--text">
                        {{ helperText.contextParserUndefined }}
                      </v-subheader>
                    </v-col>
                    <v-switch
                      v-model="contextParserUndefined"
                      color="error"
                      inset
                      label="Campaign Has Not Context Parser"
                    />
                  </v-col>
                </v-card-text>
              </v-card>
              <base-button
                color="primary"
                rounded
                @click.native="step = 4"
              >
                Continue
              </base-button>
              <base-button
                color="primary"
                text
                @click.native="step = 2"
              >
                Cancel
              </base-button>
            </v-stepper-content>
            <v-stepper-step
              :complete="step > 4"
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
                  <v-col
                    cols="12"
                    md="8"
                  >
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageCampaignTestNotRegister }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="validateForm.messageCampaignTestNotRegister"
                      :counter="70"
                      prepend-icon="chat"
                      label="Empty Message"
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageCampaignNotAvailable }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="validateForm.messageCampaignNotAvailable"
                      :counter="70"
                      prepend-icon="chat"
                      label="Pause Service Message"
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageBoundariesLessError }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="validateForm.messageBoundariesLessError"
                      :rules="[v => !!v || 'Item is required']"
                      :counter="70"
                      prepend-icon="chat"
                      label="Less Content Message"
                      required
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageBoundariesOverError }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="validateForm.messageBoundariesOverError"
                      :rules="[v => !!v || 'Item is required']"
                      :counter="70"
                      prepend-icon="chat"
                      label="Over Content Message"
                      required
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageBeforeStart }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="validateForm.messageBeforeStart"
                      :rules="[v => !!v || 'Item is required']"
                      :counter="70"
                      prepend-icon="chat"
                      label="Before Service Active Message"
                      required
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageAfterEnd }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="validateForm.messageAfterEnd"
                      :rules="[v => !!v || 'Item is required']"
                      :counter="70"
                      prepend-icon="chat"
                      label="After Service Active Message"
                      required
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageRegisterFail }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="validateForm.messageRegisterFail"
                      :counter="70"
                      prepend-icon="chat"
                      label="Already Registered Message"
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageValidateFail }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="validateForm.messageValidateFail"
                      :counter="70"
                      prepend-icon="chat"
                      label="Validate Verify Code Failed Message"
                    />
                    <v-col v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageCheckMsisdnNotFound }}
                      </v-subheader>
                    </v-col>
                    <v-text-field
                      v-model="validateForm.messageCheckMsisdnNotFound"
                      :counter="70"
                      prepend-icon="chat"
                      label="Validate Verify Code with Mobile Number Failed Message"
                    />
                  </v-col>
                </v-card-text>
              </v-card>
              <base-button
                color="primary"
                rounded
                @click.native="step = 5"
              >
                Continue
              </base-button>
              <base-button
                color="primary"
                text
                @click.native="step = 3"
              >
                Cancel
              </base-button>
            </v-stepper-content>
            <v-stepper-step
              :complete="step > 5"
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
                  <v-row>
                    <v-col
                      cols="12"
                    >
                      <v-subheader>Rewards Validation:</v-subheader>
                      <v-col v-if="helper">
                        <v-subheader class="helpertext">
                          {{ helperText.rewardHasSequence }}
                        </v-subheader>
                      </v-col>
                      <v-switch
                        v-model="switch2"
                        color="deep-purple"
                        label="Is Sequential Rewards?"
                      />
                      <v-col v-if="helper">
                        <v-subheader class="helpertext">
                          {{ helperText.rewardHasObject }}
                        </v-subheader>
                      </v-col>
                      <v-switch
                        v-model="checkObjectReward"
                        color="deep-purple"
                        label="Can Customer Choose your Rewards?"
                      />
                      <v-col v-if="helper">
                        <v-subheader class="helpertext">
                          {{ helperText.limitReward }}
                        </v-subheader>
                      </v-col>
                      <v-text-field
                        v-model.number="validateForm.rewardsLimit"
                        prepend-icon="phonelink_off"
                        label="Limit Rewards"
                        type="number"
                      />
                      <v-col v-if="helper">
                        <v-subheader class="helpertext">
                          {{ helperText.messageRewardsFailed }}
                        </v-subheader>
                      </v-col>
                      <v-text-field
                        v-model="validateForm.messageRewardsFailed"
                        :counter="70"
                        prepend-icon="chat_bubble"
                        label="Fail Message"
                      />
                      <v-col v-if="helper">
                        <v-subheader class="helpertext">
                          {{ helperText.messageRewardsInvalid }}
                        </v-subheader>
                      </v-col>
                      <v-text-field
                        v-model="validateForm.messageRewardsInvalid"
                        :counter="70"
                        prepend-icon="chat_bubble"
                        label="Rewards Invalid Message"
                      />
                      <v-col v-if="helper">
                        <v-subheader class="helpertext">
                          {{ helperText.messageRewardReceivedLimit }}
                        </v-subheader>
                      </v-col>
                      <v-text-field
                        v-model="validateForm.messageRewardReceivedLimit"
                        :counter="70"
                        prepend-icon="chat_bubble"
                        label="Rewards Limited Message"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                    >
                      <v-subheader>Rewards List:</v-subheader>
                      <v-list two-line>
                        <v-list-item
                          v-for="item in rewards"
                          :key="item.key"
                        >
                          <v-list-item-avatar>
                            <v-icon class="deep-purple white--text">
                              redeem
                            </v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>{{ item.rewardName }}</v-list-item-title>
                            <v-list-item-subtitle>{{ item.messageRewardSuccess }}</v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-action>
                            <base-button
                              icon
                              ripple
                              @click="deleteReward(item.rewardName)"
                            >
                              <v-icon color="grey lighten-1">
                                delete_forever
                              </v-icon>
                            </base-button>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <base-button
                        color="primary"
                        rounded
                        @click.native="cardOpen = !cardOpen"
                      >
                        <v-icon dark>
                          add
                        </v-icon>
                        Add Reward
                      </base-button>
                      <p />
                      <v-card v-if="cardOpen">
                        <v-form
                          ref="anotherReward"
                          v-model="rewardValid"
                          lazy-validation
                        >
                          <v-card-title>
                            <v-subheader>
                              Add Reward Validation Details:
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
                            <base-button
                              :disabled="!switch1"
                              color="deep-purple lighten-2"
                              class="white--text"
                              rounded
                              @click.stop="couponGenDialog = !couponGenDialog"
                            >
                              Generated
                            </base-button>
                            <!-- <base-button
                              :loading="loading1"
                              :disabled="!switch1"
                              color="blue-grey"
                              class="white--text"
                              rounded
                              @click.native="loader = 'loading1'"
                            >
                              <v-icon
                                left
                                dark
                              >
                                cloud_upload
                              </v-icon>
                              Upload
                            </base-button> -->
                            <p />
                          </v-card-actions>
                          <v-card-text>
                            <v-col>
                              <v-col v-if="helper">
                                <v-subheader class="helpertext">
                                  {{ helperText.couponsTestUpload }}
                                </v-subheader>
                              </v-col>
                              <BaseUploadfield
                                :accept="fileTypeCP"
                                :disabled="!switch1"
                                :label="`Coupons TEST Upload`"
                                @input="updatedTestArrayName"
                                @formData="updatedTestArrayUrl"
                              />
                              <v-col v-if="helper">
                                <v-subheader class="helpertext">
                                  {{ helperText.couponsProductionUpload }}
                                </v-subheader>
                              </v-col>
                              <BaseUploadfield
                                :accept="fileTypeCP"
                                :disabled="!switch1"
                                :label="`Coupons PRODUCTION Upload`"
                                @input="updatedProArrayName"
                                @formData="updatedProArrayUrl"
                              />
                            </v-col>
                            <v-col v-if="helper">
                              <v-subheader class="helpertext">
                                {{ helperText.rewardId }}
                              </v-subheader>
                            </v-col>
                            <v-text-field
                              v-model="anotherReward.rewardId"
                              prepend-icon="atm"
                              label="Reward ID"
                            />
                            <v-col v-if="helper">
                              <v-subheader class="helpertext">
                                {{ helperText.name }}
                              </v-subheader>
                            </v-col>
                            <v-text-field
                              v-model="anotherReward.rewardName"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="phonelink"
                              label="Reward Name"
                              required
                            />
                            <v-col v-if="helper">
                              <v-subheader class="helpertext">
                                {{ helperText.rewardTotal }}
                              </v-subheader>
                            </v-col>
                            <v-text-field
                              v-model.number="anotherReward.rewardTotal"
                              :rules="[v => v >= 0 || 'User Number']"
                              prepend-icon="filter_9"
                              label="Reward Total"
                              type="number"
                              required
                            />
                            <v-col v-if="helper">
                              <v-subheader class="helpertext">
                                {{ helperText.rewardCondition }}
                              </v-subheader>
                            </v-col>
                            <v-select
                              v-model="anotherReward.rewardCondition"
                              :items="rewardConditionTypeList"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="phonelink_setup"
                              label="Reward Condition Type"
                              required
                            />
                            <v-col v-if="helper">
                              <v-subheader class="helpertext">
                                {{ helperText.rewardvalidateForm }}
                              </v-subheader>
                            </v-col>
                            <v-text-field
                              v-model="anotherReward.rewardConditionForm"
                              :disabled="anotherReward.rewardCondition === 'all'"
                              prepend-icon="phonelink_lock"
                              label="Reward Condition Value"
                              solo-inverted
                            />
                            <v-col v-if="helper">
                              <v-subheader class="helpertext">
                                {{ helperText.messageRewardSuccess }}
                              </v-subheader>
                            </v-col>
                            <v-text-field
                              v-model="anotherReward.messageRewardSuccess"
                              :rules="[v => !!v || 'Item is required']"
                              :counter="70"
                              prepend-icon="chat_bubble_outline"
                              label="Success Message"
                              required
                            />
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer />
                            <base-button
                              text
                              color="primary"
                              @click.native="clearReward()"
                            >
                              Cancel
                            </base-button>
                            <base-button
                              :disabled="!rewardValid"
                              rounded
                              color="primary"
                              @click.native="addReward()"
                            >
                              Save
                            </base-button>
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <base-button
                color="primary"
                rounded
                @click.native="step = 6"
              >
                Continue
              </base-button>
              <base-button
                color="primary"
                text
                @click.native="step = 4"
              >
                Cancel
              </base-button>
            </v-stepper-content>
            <v-stepper-step
              :complete="step > 6"
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
                  <v-row>
                    <v-col
                      cols="12"
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
                        Delimiter: <strong class="green--text">
                          "{{ validateForm.contextDelimiter }}"
                        </strong>
                      </p>
                      <p>
                        campaign Has Verifycode: <strong class="green--text">
                          {{ isSwitchUploadOn }}
                        </strong>
                      </p>
                      <p>
                        campaign Has Verifycode { MobileNumber:MemberCode } or { MobileNumber }: <strong class="green--text">
                          {{ validateForm.campaignHasMsisdnList }}
                        </strong>
                      </p>
                      <p>
                        Verifycode TEST Filename: <strong class="green--text">
                          {{ fileNameTestVC }}
                        </strong>
                      </p>
                      <p>
                        Verifycode PRODUCTION Filename: <strong class="green--text">
                          {{ fileNameProVC }}
                        </strong>
                      </p>
                      <p class="indigo--text">
                        ------------------------------Services Messages--------------------------------
                      </p>
                      <p>
                        Empty Message: <strong class="green--text">
                          {{ validateForm.messageCampaignTestNotRegister }}
                        </strong>
                      </p>
                      <p>
                        Pause Service Message: <strong class="green--text">
                          {{ validateForm.messageCampaignNotAvailable }}
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
                        Before Service Active: <strong class="green--text">
                          {{ validateForm.messageBeforeStart }}
                        </strong>
                      </p>
                      <p>
                        After Service Active: <strong class="green--text">
                          {{ validateForm.messageAfterEnd }}
                        </strong>
                      </p>
                      <p>
                        Already Registered Message: <strong class="green--text">
                          {{ validateForm.messageRegisterFail }}
                        </strong>
                      </p>
                      <p>
                        Validate Verify Code Failed Message: <strong class="green--text">
                          {{ validateForm.messageValidateFail }}
                        </strong>
                      </p>
                      <p>
                        Telephone Number Checked Error Message: <strong class="green--text">
                          {{ validateForm.messageCheckMsisdnNotFound }}
                        </strong>
                      </p>
                      <p>
                        Limit Reward: <strong class="green--text">
                          {{ validateForm.rewardsLimit }}
                        </strong>
                      </p>
                      <p>
                        Rewards Fail Message: <strong class="green--text">
                          {{ validateForm.messageRewardsFailed }}
                        </strong>
                      </p>
                      <p>
                        Rewards Invalid Message: <strong class="green--text">
                          {{ validateForm.messageRewardsInvalid }}
                        </strong>
                      </p>
                      <p>
                        Reward Received Limit Message: <strong class="green--text">
                          {{ validateForm.messageRewardReceivedLimit }}
                        </strong>
                      </p>
                      <p class="indigo--text">
                        ------------------------------Still Workings--------------------------------
                      </p>
                      <p>
                        Parser Valid: <strong class="green--text">
                          {{ parserValid }}
                        </strong>
                      </p>
                      <p>
                        contextParser: <strong class="green--text">
                          {{ contextParser }}
                        </strong>
                      </p>
                      <p>rewards: {{ JSON.stringify(rewards, null, 2) }}</p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <base-button
                color="primary"
                rounded
                @click.native="step = 1"
              >
                Continue
              </base-button>
              <base-button
                color="primary"
                text
                @click.native="step = 5"
              >
                Cancel
              </base-button>
            </v-stepper-content>
          </v-stepper>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="couponGenDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">
            Create Coupons
          </span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="couponDigits"
                  v-mask="`##`"
                  :rules="[v => v > 0 || 'DIGITS always is more than 0']"
                  label="Digits"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="couponTotals"
                  v-mask="`#######`"
                  label="Totals"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-checkbox
                  v-model="couponTestGen"
                  label="TEST"
                  color="deep-purple lighten-3"
                  hide-details
                />
                <v-checkbox
                  v-model="couponProductionGen"
                  label="PRODUCTION"
                  color="deep-purple lighten-1"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <base-button
            color="primary"
            rounded
            @click="couponGenDialog = !couponGenDialog"
          >
            Cancel
          </base-button>
          <base-button
            class=""
            color="primary"
            rounded
            @click="clickedGen"
          >
            Generated
          </base-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style lang="scss" scoped>
@import '@design';

.helpertext {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: $purple-A400;
}
</style>

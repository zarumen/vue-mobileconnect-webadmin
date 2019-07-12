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
      messageRewardsFailed: '',
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
        'api',
        'reward'
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
      'getAllCampaignsId',
    ]),
    checkObjectReward () {

      return (this.campaignType === 'reward')
    },
    keywordInKeywordList () {
      let sCheck = this.campaignForm.shortcode

      if(sCheck) {
        let kws = this.keywordList.find(sc => sc.shortcode === sCheck)

        return kws.keywords
      }

      return []
    },
    regexDisable () {
      if(this.validateType)
        return this.validateType.condition

      return true
    },
    contextType () {
      if(this.validateType)
        return this.validateType.value

      return null
    },
    mutateKeywordList () {
      
      let scCheck = this.campaignForm.shortcode

      if(scCheck) {

        let checkedInReservedList = this.keywordReservedList.some(sc => sc.shortcode === scCheck)
        
        if(checkedInReservedList) {
          console.log('have keyword Reserved!')
          let kw = this.mutatekwReservedList(scCheck)

          return kw.keywordsArray
        }

        return []
      }

      return []
    },
    mutateShortcodeList () {
      if(this.campaignForm.shortcode) {

        let scArray = this.mutatescList(this.campaignForm.shortcode)

        return scArray.sendername
      }
      return []
    },
    isSwitchUploadOn: {
      get () {

        if(this.validateForm.campaignHasMsisdnList) {
          
          return this.validateForm.campaignHasMsisdnList
        }

        return this.switchUploadVC
      },
      set (val) {
        this.switchUploadVC = val
      }
    }
  },
  watch: {   
    switchUploadVC: {
      handler(switchUploadVC) {
        if(this.validateForm.campaignHasMsisdnList) {
          this.toggleSwitchUpload(this.switchUploadVC)
        }
      },
      immediate: true
    },
    validateForm: {
      handler(validateForm) {
        if(this.validateForm.campaignHasMsisdnList) {
          this.switchUploadVC = !this.switchUploadVC
          this.toggleSwitchUpload(this.switchUploadVC)
        }
      },
      immediate: true
    }
  },
  created () {
    this.mapHelper()
  },
  methods:{
    ...mapActions('campaigns', [
      'createCampaign'
    ]),
    toggleSwitchUpload (val) {
      if(this.validateForm.campaignHasMsisdnList) {
        return this.validateForm.campaignHasMsisdnList
      }

      return val
    },
    checkDuplicatedKeyword (keywordArr) {

      if(keywordArr) {

        if(!this.keywordInKeywordList) return true
        // ถ้ามี keyword เข้ามาให้ เช็คว่า มี keyword ที่ใช้อยู่รึิเปล่า
        let checkArr = keywordArr.map(element => {
          // return เป็น Boolean Array ของ keywords [true, false, true]
          return this.keywordInKeywordList.includes(element)
        })
        // ถ้ามี แม้แต่ 1 ตัวที่เป็น true ให้โชว์ error ว่า มี keyword ซ้ำ
        if(checkArr.includes(true)) {
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

      if(id) {

        let arr = []
        arr.push(id)

        if(!this.getAllCampaignsId) return true
        // ถ้ามี keyword เข้ามาให้ เช็คว่า มี keyword ที่ใช้อยู่รึิเปล่า
        let checkArr = arr.map(element => {
          // return เป็น Boolean Array ของ keywords [true, false, true]
          return this.getAllCampaignsId.includes(element)
        })
        // ถ้ามี แม้แต่ 1 ตัวที่เป็น true ให้โชว์ error ว่า มี keyword ซ้ำ
        if(checkArr.includes(true)) {
          // show Error
          return false
        }
        // doesn't show Error
        return true
      }
      // doesn't show Error
      return true
    },
    mutatekwList(sc) {
      return this.keywordList.find(keyword => keyword.shortcode === sc)
    },
    mutatekwReservedList(sc) {
      return this.keywordReservedList.find(keyword => keyword.shortcode === sc)
    },
    mutatescList(sc) {
      return this.shortcodeList.find(scList => scList.shortcode === sc)
    },
    closeDialog() {
      this.$emit('emitCloseCampaignDialog', false)
    },
    saveCampaign() {
      // check forms in v-form validation
      this.$refs.campaignForm.validate()
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
        campaignNew['campaignType'] = this.campaignType // added campaign type

        campaignNew['organizationAuth'] = this.brand.organizationAuth
        campaignNew['organizationLevel1'] = this.brand.organizationLevel1
        campaignNew['organizationLevel1Name'] = this.brand.organizationLevel1Name
        campaignNew['organizationLevel2'] = this.brand.organizationLevel2
        campaignNew['organizationLevel2Name'] = this.brand.organizationLevel2Name
        campaignNew['organizationLevel3'] = this.brand.organizationLevel3
        campaignNew['organizationLevel3Name'] = this.brand.organizationLevel3Name
        campaignNew['brandPicUrl'] = this.brand.picURL

        // set Check Campaign Verify Code
        if(this.switchUploadVC) {          
          campaignNew['campaignHasVerifyCode'] = true
        } else {
          campaignNew['campaignHasVerifyCode'] = false
        }

        // set Date in here
        campaignNew['campaignDateStart'] = new Date(startDate)
        campaignNew['campaignDateEnd'] = new Date(endDate)

        // --------------------- campaignValidation Object ----------------------------------------
        
        // set Context Parsers
        campaignValidationNew['contextParser'] = this.contextParser
        // set Reward Array or Object
        if(this.checkObjectReward) {
          campaignValidationNew['rewardsObject'] = arrayToObject(this.rewards, "rewardId")
        } else {
          campaignValidationNew['rewardsArray'] = this.rewards
        }

        campaignValidationNew['rewardsHaveSequence'] = this.switch2
        campaignValidationNew['campaignAvailable'] = true
        campaignValidationNew['campaignState'] = this.cState
        campaignValidationNew['campaignSenderName'] = this.campaignForm.campaignSenderName

        // set Campaign Timing
        campaignValidationNew['campaignDateStart'] = new Date(startDate)
        campaignValidationNew['campaignDateEnd'] = new Date(endDate)
        campaignValidationNew['campaignDateTestStart'] = new Date(startTestDate)
        campaignValidationNew['campaignDateTestEnd'] = new Date(endTestDate)

        if(this.switchUploadVC) {
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

        if(this.switch1) {
          // upload Coupons here

          // TEST FILE
          this.uploadCoupons({
            id: this.campaignForm.campaignCode, 
            state: 'test', 
            filename: this.fileNameTestCP, 
            fileUrl: this.fileUrlTestCP
          })

          // PRODUCTION FILE
          this.uploadCoupons({
            id: this.campaignForm.campaignCode,
            state: 'production',
            filename: this.fileNameProCP, 
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
    },
    // VERIFY CODE ZONE
    uploadVerifyCode ({ id, state, filename, fileUrl }) {

      let ref = storageRef.child(`campaigns/${id}/verifyCodeFile/${state}/${filename}`)

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
      fileName.forEach((file, index) => {

        let ref = storageRef.child(`campaigns/${id}/couponsFile/${state}/${index}-${file}`)

        ref.putString(fileUrl[index], 'data_url')
          .then((snapshot) => {
          console.log('Uploaded a data_url string!')
        })

      })
    },
    clickedGen () {
      for(let i = 0; i < this.couponTotals; i++){
        this.couponResult.push(this.generateId(this.couponDigits))
      }

      let csvContent = 'data:text/csv;charset=utf-8,'

      this.couponResult.forEach((rowArray) => {
          csvContent += rowArray + "\r\n";
      })

      let encodedUri = encodeURI(csvContent)

      if(this.couponTestGen) {
        
        this.fileNameTestCP.push(`coupons_${this.couponTotals}_generated.csv`)
        this.fileUrlTestCP.push(encodedUri)
      }

      if(this.couponProductionGen) {
        
        this.fileNameProCP.push(`coupons_${this.couponTotals}_generated.csv`)
        this.fileUrlProCP.push(encodedUri)
      }

      this.couponGenDialog = !this.couponGenDialog

      return encodedUri
    },
    dec2hex (dec) {
      return ('0' + dec.toString(36)).substr(-2)
    },
    // generateId :: Integer -> String
    generateId (len) {
      let arr = new Uint8Array((len || 40) / 2)
      window.crypto.getRandomValues(arr)
      return Array.from(arr, this.dec2hex).join('')
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
            color="deep-purple"
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
                text
                @click.native="helper = !helper"
              >
                Helper: TH
              </v-btn>
              <v-btn 
                dark 
                text 
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
              <small>v.0.8.1 patch note: Generate Coupon และ Upload Coupon ได้แล้ว, ทำ Form upload verify_code โดยแยก เป็น 2 ลิ้งค์คือ ไฟล์สำหรับ TEST และ PRODUCTION </small>
              <small>road map: ทำตัวช่วย กรอกในสิ่งที่เคยกรอกไปแล้ว (Template) ทั้งในส่วนของ Regex และ ข้อความ (Message Template) และหน้าสุดท้าย ไว้ดูสรุปข้อมูล ก่อน save</small>
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-card
                color="grey lighten-4" 
                class="mb-5"
              >
                <v-card-text>
                  <v-flex v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignCode }}
                    </v-subheader>
                  </v-flex>
                  <v-flex 
                    xs12
                    md4
                  > 
                    <v-text-field 
                      v-model="campaignForm.campaignCode"
                      prepend-icon="fiber_new"
                      :rules="campaignCodeRule"
                      :counter="20"
                      label="Campaign Code"
                      required
                    />
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignName }}
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
                    <v-subheader class="helpertext">
                      {{ helperText.campaignDescription }}
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
                    <v-subheader class="helpertext">
                      {{ helperText.campaignType }}
                    </v-subheader>
                  </v-flex>                
                  <v-select 
                    v-model="campaignType"
                    :items="cTypeList"
                    label="Campaign Type"
                    prepend-icon="assignment"
                  />
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
                          <v-list-item-avatar 
                            color="primary"
                            class="green--text"
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
                        <template
                          slot="selection" 
                          slot-scope="idata"
                        >
                          <v-chip
                            :key="JSON.stringify(idata.item)"
                            :input-value="idata.selected"
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
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="helpertext">
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
                    <v-subheader class="helpertext">
                      {{ helperText.keyword }}
                    </v-subheader>
                  </v-flex> 
                  <v-flex>
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
                  </v-flex>
                  <v-subheader>
                    <small>Campaign Start Status:</small>
                  </v-subheader>
                  <v-flex v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignActive }}
                    </v-subheader>
                  </v-flex> 
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
                  <v-flex>
                    <v-subheader>Start Date :</v-subheader>
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignDateStart }}
                    </v-subheader>
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
                          text
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
                  <!-- END DATE PICKER -->
                  <v-flex>
                    <v-subheader>End Date :</v-subheader>
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignDateEnd }}
                    </v-subheader>
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
                          text
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
                  <!-- START TEST DATE PICKER -->
                  <v-flex>
                    <v-subheader>Start Test Date :</v-subheader>
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignDateTestStart }}
                    </v-subheader>
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
                          text
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
                  <!-- END TEST DATE PICKER -->
                  <v-flex>
                    <v-subheader>End Test Date :</v-subheader>
                  </v-flex>
                  <v-flex v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignDateTestEnd }}
                    </v-subheader>
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
                          text
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
                  <v-subheader>Campaign Validate Details</v-subheader>
                  <v-flex v-if="helper">
                    <v-subheader class="helpertext">
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
                  <v-subheader>Upload VerifyCode File:</v-subheader>
                  <v-subheader
                    v-if="contextType === 'validate'"
                    class="red--text"
                  >
                    เมื่อ Parser มี Condition Type = "validate" ให้ UPLOAD VERIFY_CODE ตรงนี้ด้วย
                  </v-subheader>
                  <v-flex v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignHasVerifyCode }}
                    </v-subheader>
                  </v-flex> 
                  <v-switch
                    v-model="isSwitchUploadOn"
                    color="deep-purple"
                    label="Has VerifyCode (1 Column)"
                  />
                  <v-flex v-if="helper">
                    <v-subheader class="helpertext">
                      {{ helperText.campaignHasMsisdnList }}
                    </v-subheader>
                  </v-flex> 
                  <v-switch
                    v-model="validateForm.campaignHasMsisdnList"
                    color="deep-purple"
                    label="Has VerifyCode (2 Column)"
                  />
                  <v-flex>
                    <v-flex v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.verifyCodeTestUpload }}
                      </v-subheader>
                    </v-flex> 
                    <BaseUploadfield
                      :accept="fileTypeVC"
                      :disabled="!switchUploadVC"
                      :label="`VerifyCode TEST Upload`"
                      @input="fileNameTestVC=arguments[0]"
                      @formData="fileUrlTestVC=arguments[0]"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.verifyCodeProductionUpload }}
                      </v-subheader>
                    </v-flex> 
                    <BaseUploadfield
                      :accept="fileTypeVC"
                      :disabled="!switchUploadVC"
                      :label="`VerifyCode PRODUCTION Upload`"
                      @input="fileNameProVC=arguments[0]"
                      @formData="fileUrlProVC=arguments[0]"
                    />
                  </v-flex>
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
                  <v-flex
                    xs12
                    md6
                  > 
                    <v-list two-line>
                      <v-list-item 
                        v-for="item in contextParser" 
                        :key="item.key" 
                        avatar
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
                          <v-btn
                            icon
                            ripple
                            @click="deleteContextParser(item.messageContextFailed)"
                          >
                            <v-icon color="grey lighten-1">
                              delete_forever
                            </v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
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
                          <v-flex v-if="helper">
                            <v-subheader class="helpertext">
                              {{ helperText.exclude }}
                            </v-subheader>
                          </v-flex>            
                          <v-text-field
                            v-model="anotherParser.contextExclude"
                            :rules="[v => !!v || 'Item is required']"
                            prepend-icon="priority_high"
                            solo-inverted 
                            label="Remove Character"
                            required
                          />
                          <v-flex v-if="helper">
                            <v-subheader class="helpertext">
                              {{ helperText.messageContextFailed }}
                            </v-subheader>
                          </v-flex> 
                          <v-text-field 
                            v-model="anotherParser.messageContextFailed"
                            :rules="[v => !!v || 'Item is required']"
                            :counter="70"
                            prepend-icon="message"
                            label="Invalid Format Message"
                            required
                          />
                          <v-flex v-if="helper">
                            <v-subheader class="helpertext">
                              {{ helperText.validateType }}
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
                            <v-subheader class="helpertext">
                              {{ helperText.validateForm }}
                            </v-subheader>
                          </v-flex>
                          <v-text-field 
                            v-model="anotherParser.contextForm"
                            :disabled="regexDisable"
                            prepend-icon="priority_high"
                            solo-inverted 
                            label="Condition (Regular Expression)"
                          />
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
                              <v-list-item 
                                v-for="item in subContextArray" 
                                :key="item.key" 
                                avatar
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
                                  <v-btn
                                    icon
                                    ripple
                                    @click="deleteSubContextArray(item.messageContextFailed)"
                                  >
                                    <v-icon color="grey lighten-1">
                                      delete_forever
                                    </v-icon>
                                  </v-btn>
                                </v-list-item-action>
                              </v-list-item>
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
                                  <v-flex v-if="helper">
                                    <v-subheader class="helpertext">
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
                      <v-subheader class="helpertext">
                        {{ helperText.messageCampaignTestNotRegister }}
                      </v-subheader>
                    </v-flex> 
                    <v-text-field 
                      v-model="validateForm.messageCampaignTestNotRegister"
                      :counter="70"
                      prepend-icon="chat"
                      label="Empty Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageCampaignNotAvailable }}
                      </v-subheader>
                    </v-flex>
                    <v-text-field 
                      v-model="validateForm.messageCampaignNotAvailable"
                      :counter="70"
                      prepend-icon="chat"
                      label="Pause Service Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageBoundariesLessError }}
                      </v-subheader>
                    </v-flex> 
                    <v-text-field 
                      v-model="validateForm.messageBoundariesLessError"
                      :rules="[v => !!v || 'Item is required']"
                      :counter="70"
                      prepend-icon="chat"
                      label="Less Content Message"
                      required
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageBoundariesOverError }}
                      </v-subheader>
                    </v-flex> 
                    <v-text-field 
                      v-model="validateForm.messageBoundariesOverError"
                      :rules="[v => !!v || 'Item is required']"
                      :counter="70"
                      prepend-icon="chat"
                      label="Over Content Message"
                      required
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageBeforeStart }}
                      </v-subheader>
                    </v-flex>
                    <v-text-field 
                      v-model="validateForm.messageBeforeStart"
                      :rules="[v => !!v || 'Item is required']"
                      :counter="70"
                      prepend-icon="chat"
                      label="Before Service Active Message"
                      required
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageAfterEnd }}
                      </v-subheader>
                    </v-flex>
                    <v-text-field 
                      v-model="validateForm.messageAfterEnd"
                      :rules="[v => !!v || 'Item is required']"
                      :counter="70"
                      prepend-icon="chat"
                      label="After Service Active Message"
                      required
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageRegisterFail }}
                      </v-subheader>
                    </v-flex>
                    <v-text-field 
                      v-model="validateForm.messageRegisterFail"
                      :counter="70"
                      prepend-icon="chat"
                      label="Already Registered Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageValidateFail }}
                      </v-subheader>
                    </v-flex>
                    <v-text-field 
                      v-model="validateForm.messageValidateFail"
                      :counter="70"
                      prepend-icon="chat"
                      label="Validate Verify Code Failed Message"
                    />
                    <v-flex v-if="helper">
                      <v-subheader class="helpertext">
                        {{ helperText.messageCheckMsisdnNotFound }}
                      </v-subheader>
                    </v-flex> 
                    <v-text-field 
                      v-model="validateForm.messageCheckMsisdnNotFound"
                      :counter="70"
                      prepend-icon="chat"
                      label="Validate Verify Code with Mobile Number Failed Message"
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
                        <v-subheader>Rewards Validation:</v-subheader>
                        <v-flex v-if="helper">
                          <v-subheader class="helpertext">
                            {{ helperText.rewardHasSequence }}
                          </v-subheader>
                        </v-flex> 
                        <v-switch
                          v-model="switch2"
                          color="deep-purple"
                          label="Is Sequential Rewards?"
                        />
                        <v-flex v-if="helper">
                          <v-subheader class="helpertext">
                            {{ helperText.rewardHasObject }}
                          </v-subheader>
                        </v-flex> 
                        <v-switch
                          v-model="checkObjectReward"
                          color="deep-purple"
                          label="Can Customer Choose your Rewards?"
                        />
                        <v-flex v-if="helper">
                          <v-subheader class="helpertext">
                            {{ helperText.limitReward }}
                          </v-subheader>
                        </v-flex> 
                        <v-text-field 
                          v-model.number="validateForm.rewardsLimit"
                          prepend-icon="phonelink_off"
                          label="Limit Rewards"
                          type="number"
                        />
                        <v-flex v-if="helper">
                          <v-subheader class="helpertext">
                            {{ helperText.messageRewardsFailed }}
                          </v-subheader>
                        </v-flex> 
                        <v-text-field 
                          v-model="validateForm.messageRewardsFailed"
                          :counter="70"
                          prepend-icon="chat_bubble"
                          label="Fail Message"
                        />
                        <v-flex v-if="helper">
                          <v-subheader class="helpertext">
                            {{ helperText.messageRewardsInvalid }}
                          </v-subheader>
                        </v-flex>
                        <v-text-field 
                          v-model="validateForm.messageRewardsInvalid"
                          :counter="70"
                          prepend-icon="chat_bubble"
                          label="Rewards Invalid Message"
                        />
                        <v-flex v-if="helper">
                          <v-subheader class="helpertext">
                            {{ helperText.messageRewardReceivedLimit }}
                          </v-subheader>
                        </v-flex>
                        <v-text-field 
                          v-model="validateForm.messageRewardReceivedLimit"
                          :counter="70"
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
                          <v-list-item 
                            v-for="item in rewards" 
                            :key="item.key" 
                            avatar
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
                              <v-btn
                                icon
                                ripple
                                @click="deleteReward(item.rewardName)"
                              >
                                <v-icon color="grey lighten-1">
                                  delete_forever
                                </v-icon>
                              </v-btn>
                            </v-list-item-action>
                          </v-list-item>
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
                            <v-btn
                              :disabled="!switch1"
                              color="deep-purple lighten-2"
                              class="white--text"
                              round
                              @click.stop="couponGenDialog = !couponGenDialog"
                            >
                              Generated
                            </v-btn>
                            <!-- <v-btn
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
                            </v-btn> -->
                            <p />
                          </v-card-actions>
                          <v-card-text>
                            <v-flex>
                              <v-flex v-if="helper">
                                <v-subheader class="helpertext">
                                  {{ helperText.couponsTestUpload }}
                                </v-subheader>
                              </v-flex> 
                              <BaseUploadfield
                                :accept="fileTypeCP"
                                :disabled="!switch1"
                                :label="`Coupons TEST Upload`"
                                @input="updatedTestArrayName"
                                @formData="updatedTestArrayUrl"
                              />
                              <v-flex v-if="helper">
                                <v-subheader class="helpertext">
                                  {{ helperText.couponsProductionUpload }}
                                </v-subheader>
                              </v-flex> 
                              <BaseUploadfield
                                :accept="fileTypeCP"
                                :disabled="!switch1"
                                :label="`Coupons PRODUCTION Upload`"
                                @input="updatedProArrayName"
                                @formData="updatedProArrayUrl"
                              />
                            </v-flex>
                            <v-flex v-if="helper">
                              <v-subheader class="helpertext">
                                {{ helperText.rewardId }}
                              </v-subheader>
                            </v-flex>
                            <v-text-field
                              v-model="anotherReward.rewardId"
                              prepend-icon="atm"
                              label="Reward ID"
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="helpertext">
                                {{ helperText.name }}
                              </v-subheader>
                            </v-flex> 
                            <v-text-field
                              v-model="anotherReward.rewardName"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="phonelink"
                              label="Reward Name"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="helpertext">
                                {{ helperText.rewardTotal }}
                              </v-subheader>
                            </v-flex> 
                            <v-text-field 
                              v-model.number="anotherReward.rewardTotal"
                              :rules="[v => v >= 0 || 'User Number']"
                              prepend-icon="filter_9"
                              label="Reward Total"
                              type="number"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="helpertext">
                                {{ helperText.rewardCondition }}
                              </v-subheader>
                            </v-flex> 
                            <v-select
                              v-model="anotherReward.rewardCondition"
                              :items="rewardConditionTypeList"
                              :rules="[v => !!v || 'Item is required']"
                              prepend-icon="phonelink_setup"
                              label="Reward Condition Type"
                              required
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="helpertext">
                                {{ helperText.rewardvalidateForm }}
                              </v-subheader>
                            </v-flex>
                            <v-text-field 
                              v-model="anotherReward.rewardConditionForm"
                              :disabled="anotherReward.rewardCondition === 'all'"
                              prepend-icon="phonelink_lock"
                              label="Reward Condition Value"
                              solo-inverted
                            />
                            <v-flex v-if="helper">
                              <v-subheader class="helpertext">
                                {{ helperText.messageRewardSuccess }}
                              </v-subheader>
                            </v-flex>
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
                        Delimiter: <strong class="green--text">
                          {{ validateForm.contextDelimiter }}
                        </strong>
                      </p>
                      <p>
                        campaign Has Verifycode: <strong class="green--text">
                          {{ switchUploadVC }}
                        </strong>
                      </p>
                      <p>
                        campaign Has Verifycode (2 Column) { MobileNumber:Verifycode }: <strong class="green--text">
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
            <v-layout wrap>
              <v-flex
                xs12
                sm6
                md4
              >
                <v-text-field
                  v-model="couponDigits"
                  :rules="[v => v > 0 || 'DIGITS always is more than 0']"
                  mask="##"
                  label="Digits"
                />
              </v-flex>
              <v-flex
                xs12
                sm6
                md4
              >
                <v-text-field
                  v-model="couponTotals"
                  mask="#######"
                  label="Totals"
                />
              </v-flex>
              <v-flex
                xs12
                sm6
                md4
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
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            class="v-btn--simple" 
            color="primary"
            round
            @click="couponGenDialog = !couponGenDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            class=""
            color="primary"
            round
            @click="clickedGen"
          >
            Generated
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<style lang="scss" scoped>
@import '@design';

.helpertext {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: $purple-A400;
}
</style>

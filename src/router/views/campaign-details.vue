<script>
import formatDateRelative from '@utils/format-date-relative'
import { formatDateTime } from '@utils/format-date'
import { campaignDetailsComputed, campaignDetailsMethods } from '@state/helpers'

const defaultDupForm = Object.freeze({
  dupCampaignCode: '',
  dupCampaignName: '',
  dupCampaignDesc: '',
  dupShortcode: '',
  dupSendername: '',
  dupKeyword: ''
})

export default {
  page: {
    title: 'CampaignDetails',
    meta: [{ name: 'description', content: 'CampaignDetails' }]
  },
  components: {
    Layout: () => import('@layouts/main'),
    Doughnut: () => import('@utils/chart/Doughnut'),
    LineChart: () => import('@utils/chart/LineChart'),
    WidgetSearch: () => import('@components/ui/widget-search'),
    WidgetTestPage: () => import('@components/ui/widget-test-page'),
    WidgetHeaderConfig: () => import('@components/ui/widget-header-config'),
    WidgetCampaignValidate: () => import('@components/ui/widget-campaign-validate')
  },
  data: () => ({
    baseModule: 'transactions',
    headers: [
      { text: 'Msisdn', value: 'msisdn' },
      { text: 'Msg', value: 'message' },
      { text: 'ReplyMsg', value: 'replyMessage', left: true },
      { text: 'Stage', value: 'messageStatus' },
      { text: 'TimeCode', value: 'createDateTime', align: 'center' },
      { text: 'StepMsg', value: 'stepName' },
      { text: 'StateMsg', value: 'campaignState' },
      { text: 'TxDetails', value: 'action', align: 'center', sortable: false }
    ],
    text: '',
    totals: '',
    tabs: 0,
    state: 'test',
    timeout: 2000,
    editCampaign: false,
    // dialog variables
    disableDialog: false,
    dialogTitle: 'Campaign Delete Dialog',
    dialogText: 'Do you want to delete this campaign?',
    pauseDialog: false,
    productionDialog: false,
    duplicateDialog: false,
    duplicateConfirmDialog: false,
    valid: true,
    // ---------**-------------------------------------
    // Campaign DUPLICATED variables
    // ---------**-------------------------------------
    dupform: Object.assign({}, defaultDupForm),
    cState: 'test',
    fieldRules: [
      v => !!v || 'This Field is required'
    ],
    // date-time
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
    // verify code treeview variables
    vcFileSelected: [],
    isLoading1: false,
    open1: [],
    vcTypes: [],
    vcFiles: [],
    vcFileUploadName: '',
    vcFileUploadUrl: '',
    showUploadMenu: false,
    showAddMenu: false,
    VerifyCodeAlert: false,
    VerifyCodeSearchAlert: false,
    searchCodeValue: '',
    addCodeValue: '',
    verifycodeStatusText: '',
    // coupons treeview variables
    cpFileSelected: [],
    isLoading2: false,
    open2: [],
    cpTypes: [],
    cpFiles: [],
    cpFileUploadName: '',
    cpFileUploadUrl: '',
    rewardIdSelected: 0,
    limitListCoupon: 10,
    couponsRules: [
      v => (Number.isInteger(v) && v > 0) || 'Get Positive Number',
      v => v <= 20 || 'You Should Watch Limit Below 20'
    ],
    searchCouponValue: '',
    addCouponValue: '',
    showCUploadMenu: false,
    showCAddMenu: false,
    couponAlert: false
  }),
  computed: {
    ...campaignDetailsComputed,
    updatedTimestampTxTotals () {
      const date = (Date.parse(this.getTimestampTxTotals)) / 1000

      return formatDateRelative(date)
    },
    // Campaigns CampaignsValidate Info
    campaignInfo () {
      return this.getOneCampaign(this.$route.params.campaignId)
    },
    campaignValidateInfo () {
      return this.getOneCampaignValidate
    },
    // Date Time Format Computed
    startDate () {
      if (this.campaignValidateInfo) {
        return formatDateTime(this.campaignValidateInfo.campaignDateStart.seconds)
      }
      return ''
    },
    endDate () {
      if (this.campaignValidateInfo) {
        return formatDateTime(this.campaignValidateInfo.campaignDateEnd.seconds)
      }
      return ''
    },
    startTestDate () {
      if (this.campaignValidateInfo) {
        return formatDateTime(this.campaignValidateInfo.campaignDateTestStart.seconds)
      }
      return ''
    },
    endTestDate () {
      if (this.campaignValidateInfo) {
        return formatDateTime(this.campaignValidateInfo.campaignDateTestEnd.seconds)
      }
      return ''
    },
    // campaign MICROSITE
    checkMicrositeCampaign () {
      return this.campaignInfo.campaignType === 'microsite'
    },
    micrositeFields () {
      if (this.checkMicrositeCampaign) {
        return this.campaignValidateInfo.micrositeFields
      }
      return []
    },
    // shortcode & keyword List
    shortcodeList () {
      return this.getShortcodesList.map(x => x.shortcode)
    },
    senderNameList () {
      const scCheck = this.dupform.dupShortcode

      if (scCheck) {
        const scObj = this.getShortcodesList.find(x => x.shortcode === scCheck)

        return scObj.sendername
      }
      return []
    },
    mutateKeywordList () {
      const scCheck = this.dupform.dupShortcode

      if (scCheck) {
        const checkedInReservedList = this.getShortcodesReservedList.some(sc => sc.shortcode === scCheck)

        if (checkedInReservedList) {
          console.log('have keyword Reserved!')
          const kw = this.getShortcodesReservedList.find(x => x.shortcode === scCheck)
          console.log(kw)

          return [...kw.keywordsArray]
        }

        return []
      }

      return []
    },
    objNewDate () {
      const startDate = this.date + 'T' + this.time
      const endDate = this.date2 + 'T' + this.time2
      const startTestDate = this.date3 + 'T' + this.time3
      const endTestDate = this.date4 + 'T' + this.time4

      return {
        campaignDateStart: new Date(startDate),
        campaignDateEnd: new Date(endDate),
        campaignDateTestStart: new Date(startTestDate),
        campaignDateTestEnd: new Date(endTestDate)
      }
    },
    // Check Text Keywords
    txSuccess () {
      return this.getTransactionSuccess
    },
    txKeyword () {
      if (!this.isEmpty(this.getTransactionKeyword)) {
        const result = Object.values(this.getTransactionKeyword).reduce((t, n) => parseInt(t) + parseInt(n))

        return result
      }
      return 0
    },
    // verify Code computed
    verifyCodeItems () {
      const children = this.vcTypes.map(type => ({
        id: type,
        name: this.makeTitle(type),
        children: this.getChildren(type, this.vcFiles)
      }))

      return [{
        id: 1,
        name: 'Root Folder',
        children
      }]
    },
    shouldShowTree () {
      return this.vcFiles.length > 0 && !this.isLoading1
    },
    classVerifyStatus () {
      if (this.campaignInfo.campaignHasVerifyCode) {
        return 'green--text'
      }
      return 'red--text'
    },
    handleAlertVerifyCode () {
      return (this.addCodeValue.length > 0)
    },
    handleAlertCoupon () {
      return (this.addCouponValue.length > 0)
    },
    searchResult () {
      return this.getCheckVerifyCode
    },
    // Coupons computed
    checkRewardsHaveCoupons () {
      if (this.campaignValidateInfo.rewardsArray) {
        // check ว่า campaign นี้มี coupons รึเปล่า
        return this.campaignValidateInfo.rewardsArray.some(x => x.rewardHasCoupon === true)
      }
      return false
    },
    listRewardId () {
      if (this.campaignValidateInfo.rewardsArray) {
        return this.campaignValidateInfo.rewardsArray.map(x => x.rewardId)
      }
      return []
    },
    couponsList () {
      if (this.getListCoupons.length > 0) {
        return this.getListCoupons
      }
      return []
    },
    couponCodeItems () {
      const children = this.cpTypes.map(type => ({
        id: type,
        name: this.makeTitle(type),
        children: this.getChildren(type, this.cpFiles)
      }))

      return [{
        id: 1,
        name: 'Root Folder',
        children
      }]
    },
    shouldShowCpTree () {
      return this.cpFiles.length > 0 && !this.isLoading2
    }
  },
  watch: {
    vcFiles (val) {
      this.vcTypes = val.reduce((acc, cur) => {
        const type = cur.type

        if (!acc.includes(type)) acc.push(type)

        return acc
      }, []).sort()
    },
    cpFiles (val) {
      this.cpTypes = val.reduce((acc, cur) => {
        const type = cur.type

        if (!acc.includes(type)) acc.push(type)

        return acc
      }, []).sort()
    }
  },
  mounted () {
    this.initializeData()
  },
  destroyed () {
    this.socketUnRegister({
      campaignState: this.state,
      campaignId: this.$route.params.campaignId
    })
  },
  methods: {
    ...campaignDetailsMethods,
    changeTextButton (bool) {
      return (bool) ? 'Hide' : 'Expand'
    },
    validate () {
      this.$refs.dupform.validate()

      this.duplicateConfirmDialog = true
    },
    createDupCampaign () {
      const formatDupForm = {
        campaignCode: this.dupform.dupCampaignCode,
        campaignName: this.dupform.dupCampaignName,
        campaignDescription: this.dupform.dupCampaignDesc,
        shortcode: this.dupform.dupShortcode,
        campaignSenderName: this.dupform.dupSendername,
        keyword: this.dupform.dupKeyword
      }

      const newCampaign = {
        ...this.campaignInfo,
        ...this.objNewDate,
        ...formatDupForm,
        campaignState: this.cState,
        campaignActive: true,
        campaignAvailable: true
      }

      const newValidateCampaign = {
        ...this.campaignValidateInfo,
        ...this.objNewDate,
        campaignState: this.cState,
        campaignId: this.dupform.dupCampaignCode,
        campaignSenderName: this.dupform.dupSendername,
        campaignActive: true,
        campaignAvailable: true
      }

      return this.createCampaign(newCampaign, newValidateCampaign)
    },
    initializeData () {
      // initial load socket.io data
      this.totals = this.getTransactionTotals
      this.state = this.getCampaignStateSelected

      this.getCampaignValidate({
        campaignId: this.$route.params.campaignId
      })

      this.reloadVerifyCodeTotals()
      this.reloadCouponsTotals()

      this.socketRegister({
        campaignState: this.state,
        campaignId: this.$route.params.campaignId
      })
    },
    reloadVerifyCodeTotals () {
      this.getVerifyCodeFromRedis({
        campaignState: this.state,
        campaignId: this.$route.params.campaignId
      })
    },
    deleteVerifyCodeTotals () {
      this.delVerifyCodeFromRedis({
        campaignState: this.state,
        campaignId: this.$route.params.campaignId
      })
    },
    reloadCouponsTotals () {
      this.getCouponsFromRedis({
        campaignState: this.state,
        campaignId: this.$route.params.campaignId,
        rewardId: 0
      })
    },
    deleteCouponsTotals () {
      this.delCouponsFromRedis({
        campaignState: this.state,
        campaignId: this.$route.params.campaignId,
        rewardId: 0
      })
    },
    clickToProduction () {
      this.updateStatusCampaign({
        campaignId: this.$route.params.campaignId
      })
      this.productionDialog = false
    },
    clickToPaused () {
      this.updatePausedCampaign({
        campaignId: this.$route.params.campaignId,
        runningAvailable: this.campaignInfo.campaignAvailable
      })
      this.pauseDialog = false
    },
    onConfirm () {
      this.deleteCampaign(this.$route.params.campaignId)
      this.disableDialog = false
    },
    onCancel () {
      this.disableDialog = false
    },
    editCampaignValidate () {
      this.editCampaign = !this.editCampaign
    },
    // ------------------------------------- LOAD ZONE -------------------------------------
    loadCouponTree () {
      // if (this.cpFiles.length) return

      this.fetchCoupons({
        campaignId: this.$route.params.campaignId
      })
        .then(res => {
          this.cpFiles = res
        })
    },
    loadVerifyCodeTree () {
      // if (this.vcFiles.length) return

      this.fetchVerifyCode({
        campaignId: this.$route.params.campaignId
      })
        .then(res => {
          this.vcFiles = res
        })
    },
    loadTransaction () {
      // load 20 lastest transactions from dynamoDB
      this.getLastestTransactions({
        campaignState: this.state,
        campaignId: this.$route.params.campaignId
      })
    },
    exitSnackbar () {
      this.$store.commit(`${this.baseModule}/setSnackbar`, { snackbar: false })
      this.$store.commit(`${this.baseModule}/setNotice`, { notice: '' })
    },
    makeTitle (name) {
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    },
    getChildren (type, allFiles) {
      const files = []

      for (const file of allFiles) {
        if (file.type !== type) continue

        files.push({
          ...file,
          name: this.makeTitle(file.name)
        })
      }

      return files.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
    onOpen () {
      this.text = 'open'
    },
    onCalibrated () {
      // calibrated all transactions
      this.calibratedCampaignTx({
        campaignState: this.state
      })
        .then(response => {
          const msg = `Calibrated ${response.length} Transactions From Database Success!`
          console.log(msg)
          window.location.reload()
        })
        .catch(error => {
          console.log(error)
        })
    },
    isEmpty (obj) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) return false
      }
      return true
    },
    classStatus (status) {
      if (status) {
        return 'green--text'
      }
      return 'red--text'
    },
    classColorSelected (arr) {
      if (Object.prototype.hasOwnProperty.call(arr[0], 'fullPath')) {
        return 'green'
      }
      return 'indigo'
    },
    // upload files verifycode &  campaigncode
    upload (type, fileSelected, fileUploadName, fileUploadUrl) {
      if (fileSelected.length === 0) return

      let text = ''
      let path = ''
      fileSelected.forEach(item => {
        text = item.id
      })
      if (type === 'verifycode') {
        path = `campaigns/${this.$route.params.campaignId}/verifyCodeFile/${text}/${fileUploadName}`
      } else {
        path = `campaigns/${this.$route.params.campaignId}/couponsFile/${text}/${fileUploadName}`
      }

      this.uploadFile({
        fileUrl: fileUploadUrl,
        path: path
      })
        .then(x => (x === 'verifyCodeFile')
          ? this.loadVerifyCodeTree()
          : this.loadCouponTree())
    },
    // delete upload verifycode file & coupons file
    deleteFile (fileSelected) {
      if (fileSelected.length === 0) return

      let text = ''
      fileSelected.forEach(item => {
        text = item.fullPath
      })

      this.deleteUploadFile({
        path: text
      })
        .then(x => (x === 'verifyCodeFile')
          ? this.loadVerifyCodeTree()
          : this.loadCouponTree())
    },
    searchOneVerifyCode () {
      this.VerifyCodeSearchAlert = true

      if (this.searchCodeValue.length > 0) {
        // search verify code from redis
        return this.searchVerifyCodeFromRedis({
          campaignId: this.$route.params.campaignId,
          campaignState: this.state,
          data: this.searchCodeValue
        })
      }
    },
    postOneVerifyCode () {
      this.VerifyCodeAlert = true

      if (this.handleAlertVerifyCode) {
        // post one verify code to redis
        return this.postOneVerfyCodeToRedis({
          campaignId: this.$route.params.campaignId,
          state: this.state,
          data: this.addCodeValue
        })
          .then((res) => {
            this.verifycodeStatusText = res.output.message
          })
          .catch((err) => console.log(err))
      }
    },
    listCoupons () {
      // post one verify code to redis
      if (this.rewardIdSelected && this.couponsList.length > 0) {
        return this.searchCouponsFromRedis({
          campaignId: this.$route.params.campaignId,
          campaignState: this.state,
          data: this.addCouponValue,
          rewardId: this.rewardIdSelected,
          startAt: this.searchCouponValue,
          limit: this.limitListCoupon
        })
      } else {
        return console.log('nothing to do')
      }
    },
    postOneCoupon () {
      this.couponAlert = true

      if (this.handleAlertCoupon) {
        // post one verify code to redis
        return this.postCouponsToRedis({
          campaignId: this.$route.params.campaignId,
          state: this.state,
          data: this.addCouponValue,
          rewardId: this.rewardIdSelected
        })
      }
    },
    putVerifyCode () {
      if (this.vcFileSelected.length === 0) return

      let path = ''
      this.vcFileSelected.forEach(item => {
        path = item.fullPath
      })

      this.putVerifyCodeToRedis({
        campaignId: this.$route.params.campaignId,
        state: this.state,
        data: path
      })
    },
    putCoupons () {
      if (this.cpFileSelected.length === 0) return

      let path = ''
      this.cpFileSelected.forEach(item => {
        path = item.fullPath
      })

      this.putCouponsToRedis({
        campaignId: this.$route.params.campaignId,
        state: this.state,
        data: path,
        rewardId: 0
      })
    }
  }
}
</script>

<template>
  <Layout>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          lg="3"
        >
          <base-stats-card
            color="green"
            icon="store"
            title="SMS Transactions"
            :value="(getTransactionTotals) ? getTransactionTotals : 0"
            sub-icon="alarm"
            :sub-text="updatedTimestampTxTotals"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="3"
        >
          <base-stats-card
            color="orange"
            icon="store"
            title="SMS Registration"
            :value="`${txSuccess}`"
            sub-icon="alarm"
            :sub-text="updatedTimestampTxTotals"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="3"
        >
          <base-stats-card
            color="blue"
            icon="store"
            title="Campaign Type"
            :value="`${campaignInfo.campaignType}`"
            sub-icon="alarm"
            sub-text="Last 24 Hours"
          />
        </v-col>
        <v-col
          v-if="isAdmin"
          cols="12"
          sm="6"
          lg="3"
        >
          <base-stats-card
            color="purple"
            icon="face"
            sub-icon="open_in_browser"
            sub-icon-color="secondary"
            title="User Level State"
            :small-value="`Administrator`"
            :campaign-active="campaignInfo.campaignActive"
            :campaign-state="state"
            :campaign-running="campaignInfo.campaignAvailable"
            :admin-panel="isAdmin"
            @onCalibrated="onCalibrated"
            @onOpen="onOpen"
          />
        </v-col>
        <v-col
          v-else
          cols="12"
          sm="6"
          lg="3"
        >
          <base-stats-card
            color="purple"
            icon="face"
            title="User Level State"
            :small-value="`User`"
            sub-icon="open_in_browser"
            :sub-text="updatedTimestampTxTotals"
          />
        </v-col>
        <v-col
          v-if="text"
          cols="12"
        >
          <base-card
            class="card-tabs"
            color="purple"
          >
            <v-col
              slot="header"
            >
              <v-tabs
                v-model="tabs"
                background-color="transparent"
                slider-color="deep-purple"
                dark
                next-icon="arrow_right"
                prev-icon="arrow_left"
                show-arrows="mobile"
              >
                <span
                  class="subheading font-weight-light mr-3"
                  style="align-self: center"
                >
                  Admin Panels:
                </span>
                <v-tab class="mr-3">
                  <v-icon class="mr-2">
                    chrome_reader_mode
                  </v-icon>
                  <span
                    v-if="tabs === 0"
                  >
                    Control Panel
                  </span>
                </v-tab>
                <v-tab class="mr-3">
                  <v-icon class="mr-2">
                    settings_applications
                  </v-icon>
                  <span
                    v-if="tabs === 1"
                  >
                    Validate Info
                  </span>
                </v-tab>
                <v-tab class="mr-3">
                  <v-icon class="mr-2">
                    star
                  </v-icon>
                  <span
                    v-if="tabs === 2"
                  >
                    Verify Code
                  </span>
                </v-tab>
                <v-tab>
                  <v-icon class="mr-2">
                    card_giftcard
                  </v-icon>
                  <span
                    v-if="tabs === 3"
                  >
                    Coupons
                  </span>
                </v-tab>
                <v-tab>
                  <v-icon class="mr-2">
                    textsms
                  </v-icon>
                  <span
                    v-if="tabs === 4"
                  >
                    Transactions
                  </span>
                </v-tab>
                <v-tab>
                  <v-icon class="mr-2">
                    assessment
                  </v-icon>
                  <span
                    v-if="tabs === 5"
                  >
                    Report Config
                  </span>
                </v-tab>
                <v-tab>
                  <v-icon class="mr-2">
                    mdi-database-search
                  </v-icon>
                  <span
                    v-if="tabs === 6"
                  >
                    Test Page
                  </span>
                </v-tab>
              </v-tabs>
            </v-col>
            <v-card-title>
              <span
                v-if="tabs === 0"
                class="title"
              >
                Campaign:
                <span class="text-body-2 primary--text">
                  {{ campaignInfo.campaignCode }}
                </span>
              </span>
              <span
                v-if="tabs === 1"
                class="title"
              >
                Campaign Validate:
                <span class="text-body-2 primary--text">
                  {{ campaignInfo.campaignCode }}
                </span>
              </span>
              <span
                v-if="tabs === 2"
                class="title"
              >
                Campaign Has Verify Code
                <span :class="classStatus(campaignInfo.campaignHasVerifyCode)">
                  ({{ campaignInfo.campaignHasVerifyCode }})
                </span>
              </span>
              <span
                v-if="tabs === 3"
                class="title"
              >
                Campaign Has Coupons Code
                <span :class="classStatus(checkRewardsHaveCoupons)">
                  ({{ checkRewardsHaveCoupons }})
                </span>
              </span>
              <span
                v-if="tabs === 4"
                class="title"
              >
                Campaign Transactions
              </span>
              <span
                v-if="tabs === 5"
                class="title"
              >
                Headers Report Config
              </span>
              <span
                v-if="tabs === 6"
                class="title"
              >
                Test Page
              </span>
              <v-spacer />
              <span v-if="tabs === 0">
                &nbsp;
              </span>
              <span v-if="tabs === 1">
                <base-button
                  color="primary"
                  text
                  @click.stop="editCampaignValidate"
                >
                  Edit
                </base-button>
              </span>
              <span v-if="tabs === 2">
                <base-button
                  color="secondary"
                  rounded
                  @click.stop="putVerifyCode"
                >
                  +Add
                </base-button>
                <base-button
                  color="error"
                  text
                  @click.stop="deleteVerifyCodeTotals"
                >
                  Clear
                </base-button>
              </span>
              <span v-if="tabs === 3">
                <base-button
                  color="secondary"
                  text
                  @click.stop="putCoupons"
                >
                  ADD
                </base-button>
                <base-button
                  color="error"
                  text
                  @click.stop="deleteCouponsTotals"
                >
                  Clear All
                </base-button>
              </span>
              <span v-if="tabs === 4">
                <base-button
                  color="primary"
                  circle
                  icon
                  @click.native="loadTransaction()"
                >
                  RELOAD
                </base-button>
              </span>
            </v-card-title>

            <v-tabs-items v-model="tabs">
              <v-tab-item :value="0">
                <!-- campaign Info -->
                <v-card-text>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content
                        class="text-body-2 indigo--text"
                      >
                        Campaign State Management:
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        Disable Campaign:
                      </v-list-item-content>
                      <v-list-item-content
                        align="end"
                      >
                        <base-button
                          color="red"
                          text
                          @click.native="disableDialog = true"
                        >
                          <v-icon left>
                            close
                          </v-icon>
                          Disabled
                        </base-button>
                        <BaseDialog
                          :dialog="disableDialog"
                          :dialog-title="dialogTitle"
                          :dialog-text="dialogText"
                          @onConfirm="onConfirm"
                          @onCancel="onCancel"
                        />
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        Pause Campaign:
                      </v-list-item-content>
                      <v-list-item-content
                        align="end"
                      >
                        <v-dialog
                          v-model="pauseDialog"
                          width="500"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <base-button
                              color="warning"
                              text
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon left>
                                pause
                              </v-icon>
                              Paused
                            </base-button>
                          </template>
                          <v-card>
                            <v-card-title
                              class="text-h5 grey lighten-2"
                              primary-title
                            >
                              Paused Dialog
                            </v-card-title>
                            <v-card-text class="mt-5">
                              Do you want to PAUSE this campaign?
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer />
                              <v-btn
                                color="warning"
                                text
                                @click="pauseDialog = !pauseDialog"
                              >
                                cancel
                              </v-btn>
                              <v-btn
                                color="warning"
                                rounded
                                @click="clickToPaused"
                              >
                                confirm
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        Change Campaign To Production:
                      </v-list-item-content>
                      <v-list-item-content
                        align="end"
                      >
                        <v-dialog
                          v-model="productionDialog"
                          width="500"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <base-button
                              color="green"
                              text
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon left>
                                mdi-checkbox-marked-circle
                              </v-icon>
                              Production
                            </base-button>
                          </template>
                          <v-card>
                            <v-card-title
                              class="text-h5 grey lighten-2"
                              primary-title
                            >
                              Production Dialog
                            </v-card-title>
                            <v-card-text class="mt-5">
                              Do you want to change this campaign to PRODUCTION?
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer />
                              <v-btn
                                color="green"
                                text
                                @click="productionDialog = !productionDialog"
                              >
                                cancel
                              </v-btn>
                              <v-btn
                                color="green white--text"
                                rounded
                                @click="clickToProduction"
                              >
                                confirm
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content
                        class="text-body-2 indigo--text"
                      >
                        Campaign Duplicate Management:
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        Duplicate Campaign:
                      </v-list-item-content>
                      <v-list-item-content
                        align="end"
                      >
                        <v-dialog
                          v-model="duplicateDialog"
                          width="500"
                          persistent
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <base-button
                              color="primary"
                              text
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon left>
                                content_copy
                              </v-icon>
                              Duplicated
                            </base-button>
                          </template>
                          <v-card>
                            <v-card-title
                              class="text-h5 grey lighten-2"
                              primary-title
                            >
                              Duplicate Dialog
                              <v-spacer />
                              <v-btn
                                color="red"
                                icon
                                @click="duplicateDialog = !duplicateDialog"
                              >
                                <v-icon>
                                  close
                                </v-icon>
                              </v-btn>
                            </v-card-title>
                            <v-card-text class="mt-5">
                              <v-form
                                ref="dupform"
                                v-model="valid"
                                lazy-validation
                              >
                                <v-row>
                                  <v-col cols="12">
                                    <v-alert type="warning">
                                      If you want to used same shortcode and keyword, just DISABLED old campaign first!
                                    </v-alert>
                                  </v-col>
                                  <v-col cols="8">
                                    <v-text-field
                                      v-model="dupform.dupCampaignCode"
                                      label="Campaign Code"
                                      prepend-icon="face"
                                      :rules="fieldRules"
                                      required
                                    />
                                  </v-col>
                                  <v-col cols="8">
                                    <v-text-field
                                      v-model="dupform.dupCampaignName"
                                      label="Campaign Name"
                                      prepend-icon="shop"
                                      :rules="fieldRules"
                                      required
                                    />
                                  </v-col>
                                  <v-col cols="12">
                                    <v-textarea
                                      v-model="dupform.dupCampaignDesc"
                                      label="Campaign Description"
                                      prepend-icon="shop_two"
                                      :rules="fieldRules"
                                      required
                                    />
                                  </v-col>
                                  <v-col cols="12">
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
                                  </v-col>
                                  <v-col cols="8">
                                    <v-autocomplete
                                      v-model="dupform.dupShortcode"
                                      :items="shortcodeList"
                                      :rules="fieldRules"
                                      label="Shortcode"
                                      prepend-icon="looks_6"
                                      required
                                    />
                                  </v-col>
                                  <v-col cols="8">
                                    <v-select
                                      v-model="dupform.dupSendername"
                                      :items="senderNameList"
                                      :rules="fieldRules"
                                      label="Sendername"
                                      prepend-icon="looks"
                                      required
                                    />
                                  </v-col>
                                  <v-col cols="12">
                                    <v-select
                                      v-model="dupform.dupKeyword"
                                      :items="mutateKeywordList"
                                      :rules="fieldRules"
                                      multiple
                                      label="Keyword"
                                      prepend-icon="text_fields"
                                      required
                                    />
                                  </v-col>
                                  <!-- START DATE PICKER -->
                                  <v-col>
                                    <v-subheader>Start Date :</v-subheader>
                                  </v-col>
                                  <v-row>
                                    <v-col
                                      cols="12"
                                      md="6"
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
                                            :rules="fieldRules"
                                            readonly
                                            required
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
                                      cols="12"
                                      md="6"
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
                                  <v-row>
                                    <v-col
                                      cols="6"
                                      md="6"
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
                                            :rules="fieldRules"
                                            readonly
                                            required
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
                                      cols="6"
                                      md="6"
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
                                    <v-subheader>Start TEST Date :</v-subheader>
                                  </v-col>
                                  <v-row>
                                    <v-col
                                      cols="6"
                                      md="6"
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
                                            :rules="fieldRules"
                                            required
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
                                      cols="6"
                                      md="6"
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
                                    <v-subheader>End TEST Date :</v-subheader>
                                  </v-col>
                                  <v-row>
                                    <v-col
                                      cols="6"
                                      md="6"
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
                                            :rules="fieldRules"
                                            required
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
                                      cols="6"
                                      md="6"
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
                                </v-row>
                              </v-form>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer />
                              <v-btn
                                color="warning"
                                text
                                @click.stop="$refs.dupform.reset()"
                              >
                                clear
                              </v-btn>
                              <v-btn
                                color="primary"
                                text
                                @click.stop="duplicateDialog = !duplicateDialog"
                              >
                                cancel
                              </v-btn>
                              <v-dialog
                                v-model="duplicateConfirmDialog"
                                width="500"
                              >
                                <v-card>
                                  <v-card-title
                                    class="text-h5 grey lighten-2"
                                    primary-title
                                  >
                                    Confirm Dialog
                                  </v-card-title>
                                  <v-card-text class="mt-5">
                                    Do you want to DUPLICATED this campaign?
                                  </v-card-text>
                                  <v-card-actions>
                                    <v-spacer />
                                    <v-btn
                                      color="primary"
                                      text
                                      @click="duplicateConfirmDialog = !duplicateConfirmDialog"
                                    >
                                      cancel
                                    </v-btn>
                                    <v-btn
                                      color="primary"
                                      rounded
                                      :disabled="!valid"
                                      @click="createDupCampaign"
                                    >
                                      confirm
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                              <v-btn
                                color="primary"
                                rounded
                                :disabled="!valid"
                                @click.stop="validate"
                              >
                                confirm
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-tab-item>
              <v-tab-item :value="1">
                <v-card-text>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content
                        class="text-body-2 indigo--text"
                      >
                        Campaign Validate Status:
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        Campaign Has Verify Code:
                      </v-list-item-content>
                      <v-list-item-content
                        :class="classStatus(campaignInfo.campaignHasVerifyCode)"
                        align="end"
                      >
                        {{ campaignInfo.campaignHasVerifyCode }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        Campaign Has verify by MsisdnList (TelephoneNumber):
                      </v-list-item-content>
                      <v-list-item-content
                        :class="classStatus(campaignValidateInfo.campaignHasMsisdnList)"
                        align="end"
                      >
                        {{ (campaignValidateInfo.campaignHasMsisdnList) ? 'HAVE' : 'NOT-HAVE' }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        Campaign Rewards Has Coupons:
                      </v-list-item-content>
                      <v-list-item-content
                        :class="classStatus(checkRewardsHaveCoupons)"
                        align="end"
                      >
                        {{ checkRewardsHaveCoupons }}
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <widget-campaign-validate
                    :edit-mode="editCampaign"
                    :campaign-validate-info="campaignValidateInfo"
                  />
                </v-card-text>
              </v-tab-item>
              <v-tab-item :value="2">
                <!-- Verify Code config panel -->
                <v-card class="elevation-0">
                  <v-toolbar
                    flat
                  >
                    <v-toolbar-title>Verify Code in Database</v-toolbar-title>
                    <base-icon
                      class="px-2"
                      :source="`custom`"
                      name="mdi-ticket"
                    />
                    <v-toolbar-title>
                      ({{ getTotalsVerifyCode }})
                    </v-toolbar-title>
                    <div class="flex-grow-1" />
                    <v-toolbar-items>
                      <base-button
                        color="primary"
                        icon
                        click.native="reloadVerifyCodeTotals"
                      >
                        <base-icon name="syncAlt" />
                      </base-button>
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-row>
                    <v-col>
                      <v-card-text>
                        <v-treeview
                          v-model="vcFileSelected"
                          :load-children="loadVerifyCodeTree"
                          :open="open1"
                          :items="verifyCodeItems"
                          selected-color="primary"
                          selection-type="independent"
                          open-on-click
                          selectable
                          return-object
                          expand-icon="mdi-chevron-down"
                        >
                          <template v-slot:prepend="{ item, open }">
                            <v-icon v-if="!item.fullPath">
                              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                            </v-icon>
                            <v-icon v-else>
                              mdi-file-excel-box
                            </v-icon>
                          </template>
                        </v-treeview>
                      </v-card-text>
                    </v-col>
                    <v-divider vertical />
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-card-text>
                        <div
                          v-if="vcFileSelected.length === 0"
                          key="title"
                          class="title font-weight-light grey--text pa-4 text-center"
                        >
                          Select your files to Action
                        </div>

                        <v-scroll-x-transition
                          group
                          hide-on-leave
                        >
                          <v-chip
                            v-for="(selection, i) in vcFileSelected"
                            :key="i"
                            :color="classColorSelected(vcFileSelected)"
                            dark
                            class="ma-1"
                          >
                            <v-icon
                              left
                            >
                              mdi-file-excel-box
                            </v-icon>
                            {{ selection.name }}
                          </v-chip>
                        </v-scroll-x-transition>
                      </v-card-text>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-toolbar
                      flat
                      class="purple lighten-5 ma-5"
                    >
                      <v-subheader>Additional VerifyCode Upload File</v-subheader>
                      <v-spacer />
                      <v-btn
                        text
                        color="primary"
                        @click="showUploadMenu = !showUploadMenu"
                      >
                        {{ changeTextButton(showUploadMenu) }}
                      </v-btn>
                    </v-toolbar>
                    <v-col
                      v-show="showUploadMenu"
                      cols="12"
                    >
                      <v-card-text>
                        <BaseUploadfield
                          :accept="`.csv`"
                          :label="`VerifyCode Upload`"
                          @input="vcFileUploadName=arguments[0]"
                          @formData="vcFileUploadUrl=arguments[0]"
                        />
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          text
                          color="error darken-1"
                          @click="deleteFile(vcFileSelected)"
                        >
                          Delete
                          <v-icon right>
                            mdi-content-save
                          </v-icon>
                        </v-btn>

                        <div class="flex-grow-1" />
                        <v-btn
                          text
                          color="green darken-1"
                          @click="upload('verifycode', vcFileSelected, vcFileUploadName, vcFileUploadUrl)"
                        >
                          Upload
                          <v-icon right>
                            mdi-content-save
                          </v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-toolbar
                      flat
                      class="deep-purple lighten-5 ma-5"
                    >
                      <v-subheader>Additional VerifyCode Single Code</v-subheader>
                      <v-spacer />
                      <v-btn
                        text
                        color="primary"
                        @click="showAddMenu = !showAddMenu"
                      >
                        {{ changeTextButton(showAddMenu) }}
                      </v-btn>
                    </v-toolbar>
                    <v-col
                      v-show="showAddMenu"
                      cols="12"
                    >
                      <v-card-text>
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-text-field
                              v-model="addCodeValue"
                              label="Fill Your Verify Code Here!"
                              prepend-icon="mdi-plus-circle"
                            />
                            <v-btn
                              rounded
                              color="success"
                              @click="postOneVerifyCode"
                            >
                              Add
                            </v-btn>
                            <base-button
                              color="error"
                              text
                              @click.stop="addCodeValue = ''"
                            >
                              Clear
                            </base-button>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-alert
                              v-if="handleAlertVerifyCode"
                              v-model="VerifyCodeAlert"
                              border="left"
                              close-text="Close Alert"
                              color="success accent-4"
                              dark
                              dismissible
                            >
                              คุณได้เพิ่ม Verify Code:
                              <strong class="title amber--text">{{ addCodeValue }}</strong>
                              แล้ว
                              <br>Result:
                              <br> <strong class="amber--text">{{ verifycodeStatusText }}</strong>
                            </v-alert>
                            <v-alert
                              v-else
                              v-model="VerifyCodeAlert"
                              border="left"
                              close-text="Close Alert"
                              color="error"
                              dark
                              dismissible
                            >
                              คุณไม่ได้กรอก VerifyCode ในช่องกรอก!!
                            </v-alert>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-toolbar
                      flat
                      class="grey lighten-5 ma-5"
                    >
                      <v-subheader>Search VerifyCode</v-subheader>
                    </v-toolbar>
                    <v-col
                      cols="12"
                    >
                      <v-card-text>
                        <v-row>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                              v-model="searchCodeValue"
                              label="Search Verify Code"
                              prepend-icon="search"
                            />
                            <v-btn
                              rounded
                              color="primary"
                              @click.stop="searchOneVerifyCode"
                            >
                              Search
                            </v-btn>
                            <base-button
                              color="error"
                              text
                              @click.stop="searchCodeValue = ''"
                            >
                              Clear
                            </base-button>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-alert
                              v-model="VerifyCodeSearchAlert"
                              border="left"
                              close-text="Close Alert"
                              color="primary accent-4"
                              dark
                              dismissible
                            >
                              ผลการค้นหา Verify Code:
                              <br> <strong class="title yellow--text">{{ searchResult }}</strong>
                            </v-alert>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item :value="3">
                <!-- Coupons Panels -->
                <v-card class="elevation-0">
                  <v-toolbar
                    flat
                  >
                    <v-toolbar-title>Coupons in Database</v-toolbar-title>
                    <base-icon
                      class="px-2"
                      :source="`custom`"
                      name="mdi-ticket"
                    />
                    <v-toolbar-title>
                      ({{ getTotalsCoupon }})
                    </v-toolbar-title>
                    <div class="flex-grow-1" />
                    <v-toolbar-items>
                      <base-button
                        color="primary"
                        icon
                        click.native="reloadVerifyCodeTotals"
                      >
                        <base-icon name="syncAlt" />
                      </base-button>
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-row>
                    <v-col>
                      <v-card-text>
                        <v-treeview
                          v-model="cpFileSelected"
                          :load-children="loadCouponTree"
                          :open="open2"
                          :items="couponCodeItems"
                          selected-color="primary"
                          selection-type="independent"
                          open-on-click
                          selectable
                          return-object
                          expand-icon="mdi-chevron-down"
                        >
                          <template v-slot:prepend="{ item, open }">
                            <v-icon v-if="!item.fullPath">
                              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                            </v-icon>
                            <v-icon v-else>
                              mdi-file-excel-box
                            </v-icon>
                          </template>
                        </v-treeview>
                      </v-card-text>
                    </v-col>
                    <v-divider vertical />
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-card-text>
                        <div
                          v-if="cpFileSelected.length === 0"
                          key="title"
                          class="title font-weight-light grey--text pa-4 text-center"
                        >
                          Select your files to Action
                        </div>

                        <v-scroll-x-transition
                          group
                          hide-on-leave
                        >
                          <v-chip
                            v-for="(selection, i) in cpFileSelected"
                            :key="i"
                            :color="classColorSelected(cpFileSelected)"
                            dark
                            class="ma-1"
                          >
                            <v-icon
                              left
                            >
                              mdi-file-excel-box
                            </v-icon>
                            {{ selection.name }}
                          </v-chip>
                        </v-scroll-x-transition>
                      </v-card-text>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-toolbar
                      flat
                      class="light-green lighten-5 ma-5"
                    >
                      <v-subheader>Additional Coupons Upload File</v-subheader>
                      <v-spacer />
                      <v-btn
                        text
                        color="green"
                        @click="showCAddMenu = !showCAddMenu"
                      >
                        {{ changeTextButton(showCAddMenu) }}
                      </v-btn>
                    </v-toolbar>
                    <v-col
                      v-show="showCAddMenu"
                      cols="12"
                    >
                      <v-card-text>
                        <BaseUploadfield
                          :accept="`.csv`"
                          :label="`Coupons Upload`"
                          @input="cpFileUploadName=arguments[0]"
                          @formData="cpFileUploadUrl=arguments[0]"
                        />
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          text
                          color="error darken-1"
                          @click="deleteFile(cpFileSelected)"
                        >
                          Delete
                          <v-icon right>
                            mdi-content-save
                          </v-icon>
                        </v-btn>

                        <div class="flex-grow-1" />
                        <v-btn
                          text
                          color="green darken-1"
                          @click="upload('coupons', cpFileSelected, cpFileUploadName, cpFileUploadUrl)"
                        >
                          Upload
                          <v-icon right>
                            mdi-content-save
                          </v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-toolbar
                      flat
                      class="light-green lighten-4 ma-5"
                    >
                      <v-subheader>Additional Coupons Single Code</v-subheader>
                      <v-spacer />
                      <v-btn
                        text
                        color="green"
                        @click="showCUploadMenu = !showCUploadMenu"
                      >
                        {{ changeTextButton(showCUploadMenu) }}
                      </v-btn>
                    </v-toolbar>
                    <v-col
                      v-show="showCUploadMenu"
                      cols="12"
                    >
                      <v-card-text>
                        <v-row>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-select
                              v-model="rewardIdSelected"
                              :items="listRewardId"
                              label="Reward ID"
                              prepend-icon="mdi-numeric-1-box"
                            />
                            <v-text-field
                              v-model="addCouponValue"
                              label="Fill Your Coupon Here!"
                              prepend-icon="mdi-plus-circle"
                            />
                            <v-btn
                              rounded
                              color="success"
                              @click.stop="postOneCoupon"
                            >
                              Add
                            </v-btn>
                            <base-button
                              color="error"
                              text
                              @click.stop="addCouponValue = ''"
                            >
                              Clear
                            </base-button>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-alert
                              v-if="handleAlertCoupon"
                              v-model="couponAlert"
                              border="left"
                              close-text="Close Alert"
                              color="success accent-4"
                              dark
                              dismissible
                            >
                              คุณได้เพิ่ม <br>Coupon Code:
                              <strong class="title amber--text">{{ addCouponValue }}</strong>
                              <br>เข้า Database แล้ว
                            </v-alert>
                            <v-alert
                              v-else
                              v-model="couponAlert"
                              border="left"
                              close-text="Close Alert"
                              color="error"
                              dark
                              dismissible
                            >
                              คุณไม่ได้กรอก Coupon Code ในช่องกรอก!!
                            </v-alert>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-toolbar
                      flat
                      class="grey lighten-5 ma-5"
                    >
                      <v-subheader>List Coupons : Slide Start to List Coupon</v-subheader>
                    </v-toolbar>
                    <v-col
                      cols="12"
                    >
                      <v-card-text>
                        <v-row>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-slider
                              v-model="searchCouponValue"
                              :max="getTotalsCoupon"
                              prepend-icon="search"
                              thumb-label="always"
                            />
                            <v-select
                              v-model="rewardIdSelected"
                              :items="listRewardId"
                              label="Reward ID"
                              prepend-icon="mdi-numeric-1-box"
                            />
                            <v-text-field
                              v-model.number="limitListCoupon"
                              :rules="couponsRules"
                              label="Max Number"
                              prepend-icon="mdi-playlist-check"
                            />
                            <v-btn
                              text
                              color="success"
                              @click="listCoupons"
                            >
                              List Coupons
                            </v-btn>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <span>Result:</span>
                            <v-list dense>
                              <v-list-item
                                v-for="(item, i) in couponsList"
                                :key="i"
                              >
                                <v-list-item-content class="primary--text">
                                  {{ item }}
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item :value="4">
                <!-- Campaign Transactions Table -->
                <v-card>
                  <!-- Insert in Base-Table Component -->
                  <BaseTable
                    :headers="headers"
                    :items="items"
                    :pagination="pagination"
                    :basemodule="baseModule"
                    :action-btn="false"
                  />
                </v-card>
              </v-tab-item>
              <v-tab-item :value="5">
                <!-- Header Field Configs -->
                <widget-header-config
                  :fields-microsite="micrositeFields"
                />
              </v-tab-item>
              <v-tab-item :value="6">
                <widget-test-page
                  :shortcode="campaignInfo.shortcode"
                  :keyword="campaignInfo.keyword"
                  :delimiter="campaignValidateInfo.contextDelimiter"
                />
              </v-tab-item>
            </v-tabs-items>
          </base-card>
        </v-col>
        <v-col
          cols="12"
        >
          <base-card
            color="deep-purple"
            title="Campaign Details"
            text="Check Campaigns Details Information"
          >
            <span class="font-weight-medium py-4 text-h5">
              &nbsp;Campaign: <span class="primary--text">{{ campaignInfo.campaignName }}</span>
            </span>

            <p class="ma-5">
              {{ campaignInfo.campaignDescription }}<br><br>
            </p>

            <v-list dense>
              <v-list-item>
                <v-list-item-content>Campaign Owner:</v-list-item-content>
                <v-list-item-content class="primary--text align-end">
                  {{ campaignInfo.organizationLevel1Name }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Campaign Owner's Department:</v-list-item-content>
                <v-list-item-content class="primary--text align-end">
                  {{ campaignInfo.organizationLevel2Name }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Campaign Owner's Brand:</v-list-item-content>
                <v-list-item-content class="primary--text align-end">
                  {{ campaignInfo.organizationLevel3Name }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Campaign Type:</v-list-item-content>
                <v-list-item-content class="secondary--text align-end">
                  {{ campaignInfo.campaignType }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Campaign Shortcode:</v-list-item-content>
                <v-list-item-content class="primary--text align-end">
                  {{ campaignInfo.shortcode }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Campaign Sendername:</v-list-item-content>
                <v-list-item-content class="primary--text align-end">
                  {{ campaignInfo.campaignSenderName }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Campaign Keyword:</v-list-item-content>
                <v-list-item-content class="align-end">
                  <v-chip-group
                    column
                    color="primary"
                  >
                    <v-chip
                      v-for="tag in campaignInfo.keyword"
                      :key="tag"
                      x-small
                    >
                      {{ tag }}
                    </v-chip>
                  </v-chip-group>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="primary--text">
                  Campaign Time Intervals
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Campaign TEST Start Date:</v-list-item-content>
                <v-list-item-content class="warning--text align-end">
                  {{ startTestDate }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Campaign TEST End Date:</v-list-item-content>
                <v-list-item-content class="warning--text align-end">
                  {{ endTestDate }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Campaign Start Date:</v-list-item-content>
                <v-list-item-content class="secondary--text align-end">
                  {{ startDate }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Campaign End Date:</v-list-item-content>
                <v-list-item-content class="secondary--text align-end">
                  {{ endDate }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </base-card>
        </v-col>
        <v-col
          v-if="!isAdmin"
          cols="12"
        >
          <widget-search
            :check-microsite="checkMicrositeCampaign"
            :check-header-config="hadHeaderConfig"
          />
        </v-col>
        <v-col
          v-if="isAdmin"
          cols="12"
          md="6"
          lg="4"
        >
          <base-card
            color="info"
            type="Line"
          >
            <Doughnut />
            <h4 class="title font-weight-light">
              KEYWORDS COUNTING
            </h4>
            <p class="category d-inline-flex font-weight-light">
              <v-icon
                color="green"
                small
              >
                arrow_upward
              </v-icon>
              <span class="green--text">
                55%
              </span>&nbsp;
              increase in today's transactions
            </p>

            <template slot="actions">
              <v-icon
                class="mr-2"
                small
              >
                access_time
              </v-icon>
              <span class="text-caption grey--text font-weight-light">
                updated 4 minutes ago
              </span>
            </template>
          </base-card>
        </v-col>
        <v-col
          v-if="isAdmin"
          cols="12"
          md="6"
          lg="4"
        >
          <base-card
            color="info"
            type="Line"
          >
            <LineChart />
            <h4 class="title font-weight-light">
              TRANSACTIONS
            </h4>
            <p class="category d-inline-flex font-weight-light">
              <v-icon
                color="green"
                small
              >
                arrow_upward
              </v-icon>
              <span class="green--text">
                55%
              </span>&nbsp;
              increase in today's transactions
            </p>

            <template slot="actions">
              <v-icon
                class="mr-2"
                small
              >
                access_time
              </v-icon>
              <span class="text-caption grey--text font-weight-light">
                updated 4 minutes ago
              </span>
            </template>
          </base-card>
        </v-col>
      </v-row>
      <v-snackbar
        v-if="loading===false"
        v-model="snackbar"
        :left="true"
        :timeout="timeout"
        :color="mode"
      >
        {{ notice }}
        <base-button
          dark
          text
          @click.native="exitSnackbar"
        >
          Close
        </base-button>
      </v-snackbar>
    </v-container>
  </Layout>
</template>

<script>
import formatDateRelative from '@utils/format-date-relative'
import { formatDateTime } from '@utils/format-date'
import { campaignDetailsComputed, campaignDetailsMethods } from '@state/helpers'

export default {
  page: {
    title: 'CampaignDetails',
    meta: [{ name: 'description', content: 'CampaignDetails' }],
  },
  components: { 
    Layout: () => import('@layouts/main'),
    Doughnut: () => import('@utils/chart/Doughnut'),
    LineChart: () => import('@utils/chart/LineChart'),
    VueJsonPretty: () => import('vue-json-pretty'),
  },
  data: () => ({
    baseModule: 'transactions',
    headers: [
      { text: 'Msisdn', value: 'msisdn' },
      { text: 'Msg', value: 'message' },
      { text: 'ReplyMsg', value: 'replyMessage', left: true, },
      { text: 'Stage', value: 'messageStatus' },
      { text: 'TimeCode', value: 'groupID', align: 'center' },
      { text: 'StepMsg', value: 'stepName' },
      { text: 'StateMsg', value: 'campaignState' },
    ],
    text: '',
    totals: '',
    tabs: 0,
    state: 'test',
    timeout: 2000,
    // verify code treeview variables
    vcFileSelected: [],
    isLoading1: false,
    open1: [],
    vcTypes: [],
    vcFiles: [],
    vcFileUploadName: '',
    vcFileUploadUrl: '',
    // coupons treeview variables
    cpFileSelected: [],
    isLoading2: false,
    open2: [],
    cpTypes: [],
    cpFiles: [],
    cpFileUploadName: '',
    cpFileUploadUrl: '',
  }),
  computed: {
    ...campaignDetailsComputed,
    updatedTimestampTxTotals () {

      let date = (Date.parse(this.getTimestampTxTotals))/1000

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
      if(this.campaignValidateInfo) {
        return formatDateTime(this.campaignValidateInfo.campaignDateStart.seconds)
      }
      return ''
    },
    endDate () {
      if(this.campaignValidateInfo) {
        return formatDateTime(this.campaignValidateInfo.campaignDateEnd.seconds)
      }
      return ''
    },
    startTestDate () {
      if(this.campaignValidateInfo) {
        return formatDateTime(this.campaignValidateInfo.campaignDateTestStart.seconds)
      }
      return ''
    },
    endTestDate () {
      if(this.campaignValidateInfo) {
        return formatDateTime(this.campaignValidateInfo.campaignDateTestEnd.seconds)
      }
      return ''
    },
    // Check Text Keywords
    txKeyword () {
      if(!this.isEmpty(this.getTransactionKeyword)) {
        let result = Object.values(this.getTransactionKeyword).reduce((t, n) => parseInt(t) + parseInt(n))

        return result
      }
      return 0
    },
    // verify Code computed
    verifyCodeItems () {
      const children = this.vcTypes.map(type => ({
        id: type,
        name: this.makeTitle(type),
        children: this.getChildren(type, this.vcFiles),
      }))

      return [{
        id: 1,
        name: 'Root Folder',
        children,
      }]
    },
    shouldShowTree () {
      return this.vcFiles.length > 0 && !this.isLoading1
    },
    classVerifyStatus () {
      if(this.campaignInfo.campaignHasVerifyCode) {
        return 'green--text'
      }
      return 'red--text'
    },
    // Coupons computed
    checkRewardsHaveCoupons () {
      if(this.campaignValidateInfo.rewardsArray) {
        // check ว่า campaign นี้มี coupons รึเปล่า
        return this.campaignValidateInfo.rewardsArray.some(x => x.rewardHasCoupon === true)
      }
      return false
    },
    couponCodeItems () {
      const children = this.cpTypes.map(type => ({
        id: type,
        name: this.makeTitle(type),
        children: this.getChildren(type, this.cpFiles),
      }))

      return [{
        id: 1,
        name: 'Root Folder',
        children,
      }]
    },
    shouldShowCpTree () {
      return this.cpFiles.length > 0 && !this.isLoading2
    },
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
    },
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
    clickToProduciton () {
      this.updateStatusCampaign({
        campaignId: this.$route.params.campaignId
      })
    },
    // ------------------------------------- LOAD ZONE -------------------------------------
    loadCouponTree () {
      if (this.cpFiles.length) return

      this.fetchCoupons({
        campaignId: this.$route.params.campaignId
      })
      .then(res => {
        this.cpFiles = res
      })
    },
    loadVerifyCodeTree () {
      if (this.vcFiles.length) return

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
          name: this.makeTitle(file.name),
        })
      }

      return files.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
    onOpen () {
      this.text = 'open'
    },
    isEmpty (obj) {
      for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
      }
      return true;
    },
    classStatus (status) {
      if(status) {
        return 'green--text'
      }
      return 'red--text'
    },
    classColorSelected (arr) {
      if(arr[0].hasOwnProperty('fullPath')) {
        return 'green'
      }
      return 'indigo'
    },
    // upload files verifycode
    upload () {
      let text = ''
      this.vcFileSelected.forEach(item => {
        text = item.id
      })
      let path = `campaigns/${this.$route.params.campaignId}/verifyCodeFile/${text}/${this.vcFileUploadName}`

      this.uploadFile({
        fileUrl: this.vcFileUploadUrl,
        path: path,
      })
    },
    deleteFile () {
      if(this.vcFileSelected.length === 0) return

      let text = ''
      this.vcFileSelected.forEach(item => {
        text = item.fullPath
      })

      this.deleteUploadFile({
        path: text
      })
    },
    putVerifyCode () {
      if(this.vcFileSelected.length === 0) return

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
      if(this.cpFileSelected.length === 0) return

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
    },
  },
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
            :value="`${txKeyword}`"
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
            title="Rewards Remaining"
            value="945"
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
                show-arrows
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
                  Campaign Info
                </v-tab>
                <v-tab class="mr-3">
                  <v-icon class="mr-2">
                    settings_applications
                  </v-icon>
                  Validate Info
                </v-tab>
                <v-tab class="mr-3">
                  <v-icon class="mr-2">
                    star
                  </v-icon>
                  Verify Code
                </v-tab>
                <v-tab>
                  <v-icon class="mr-2">
                    card_giftcard
                  </v-icon>
                  Coupons
                </v-tab>
                <v-tab>
                  <v-icon class="mr-2">
                    textsms
                  </v-icon>
                  Transactions
                </v-tab>
              </v-tabs>
            </v-col>
            <v-card-title>
              <span 
                v-if="tabs === 0" 
                class="title"
              >
                Campaign:
                <span class="body-2 primary--text">
                  {{ campaignInfo.campaignCode }}
                </span>
                <base-button 
                  color="secondary"
                  circle
                  icon
                  small
                >
                  <v-icon>edit</v-icon>
                </base-button>
              </span>
              <span 
                v-if="tabs === 1" 
                class="title"
              >
                Campaign Validate:
                <span class="body-2 primary--text">
                  {{ campaignInfo.campaignCode }}
                </span>
                <base-button
                  color="secondary"
                  circle
                  icon
                  small
                >
                  <v-icon>edit</v-icon>
                </base-button>
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
              <v-spacer />
              <span v-if="tabs === 0">
                <base-button
                  color="warning"
                  text
                >
                  Paused
                </base-button>
                <base-button
                  color="primary"
                  text
                  @click="clickToProduciton"
                >
                  Production
                </base-button>
              </span>
              <span v-if="tabs === 1">
                &nbsp;
              </span>
              <span v-if="tabs === 2">
                <base-button
                  color="secondary"
                  text
                  @click.stop="putVerifyCode"
                >
                  Add
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
                  color="warning"
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
                  <base-icon name="syncAlt" />            
                </base-button>
              </span>
            </v-card-title>

            <v-tabs-items v-model="tabs">
              <v-tab-item :value="0">
                <!-- campaign Info -->
                <v-card-text>
                  <v-row>
                    <v-col 
                      cols="12"
                    > 
                      <p class="body-1 indigo--text">
                        <strong>Campaign General Information</strong>
                      </p>

                      <p>
                        compaign Code: <strong class="green--text">
                          {{ campaignInfo.campaignCode }}
                        </strong>
                      </p>
                      <p>
                        compaign Name: <strong class="green--text">
                          {{ campaignInfo.campaignName }}
                        </strong>
                      </p>
                      <p>
                        compaign Description: <strong class="green--text">
                          {{ campaignInfo.campaignDescription }}
                        </strong>
                      </p>
                      <p>
                        compaign Type: <strong class="green--text">
                          {{ campaignInfo.campaignType }}
                        </strong>
                      </p>
                      <p>
                        compaign Owner Company: <strong class="green--text">
                          {{ campaignInfo.organizationLevel1Name }}
                        </strong>
                      </p>
                      <p>
                        compaign Owner Department: <strong class="green--text">
                          {{ campaignInfo.organizationLevel2Name }}
                        </strong>
                      </p>
                      <p>
                        compaign Owner Brand: <strong class="green--text">
                          {{ campaignInfo.organizationLevel3Name }}
                        </strong>
                      </p>
                      <p>
                        compaign Keyword: <strong class="green--text">
                          {{ campaignInfo.keyword }}
                        </strong>
                      </p>
                      <p>
                        compaign Shortcode: <strong class="green--text">
                          {{ campaignInfo.shortcode }}
                        </strong>
                      </p>
                      <!-- <p>compaign's Brand: <strong class="green- -text">{{ brand.organizationLevel3Name }}</strong></p> -->
                      <p>
                        compaign's Start Date: <strong class="green--text">
                          {{ startDate }}
                        </strong>
                      </p>
                      <p>
                        compaign's End Date: <strong class="green--text">
                          {{ endDate }}
                        </strong>
                      </p>
                      <p>
                        compaign's Test Start Date: <strong class="green--text">
                          {{ startTestDate }}
                        </strong>
                      </p>
                      <p>
                        compaign's Test End Date: <strong class="green--text">
                          {{ endTestDate }}
                        </strong>
                      </p>
                      <!-- <p>
                        Delimiter: <strong class="green--text">
                          {{ campaignValidateInfo.contextDelimiter }}
                        </strong>
                      </p>
                      <p>
                        campaign Has Verifycode: <strong class="green--text">
                          {{ switchUploadVC }}
                        </strong>
                      </p>
                      <p>
                        campaign Has Verifycode (2 Column) { MobileNumber:Verifycode }: <strong class="green--text">
                          {{ campaignValidateInfo.campaignHasMsisdnList }}
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
                      <p>rewards: {{ JSON.stringify(rewards, null, 2) }}</p> -->
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-tab-item>
              <v-tab-item :value="1">
                <v-card-text>
                  <v-row>
                    <v-col 
                      cols="12"
                    >
                      <p class="body-2 indigo--text">
                        Campaign Validate Status:
                      </p>
                      <p>
                        Campaign Has Verify Code: <strong class="green--text">
                          {{ campaignInfo.campaignHasVerifyCode }}
                        </strong>
                      </p>
                      <p>
                        campaign Has verify by MsisdnList:  <strong class="green--text">
                          {{ campaignValidateInfo.campaignHasMsisdnList }}
                        </strong>
                      </p>
                      <p>
                        Campaign Rewards Has Coupons: <strong class="green--text">
                          {{ checkRewardsHaveCoupons }}
                        </strong>
                      </p>
                      <p class="body-2 indigo--text">
                        Campaign Contexts Parser:
                      </p>
                      <p>
                        Context Delimiter: <strong class="green--text">
                          "{{ campaignValidateInfo.contextDelimiter }}"
                        </strong>
                      </p>
                      <p>
                        Context Sections: <strong class="green--text">
                          {{ (campaignValidateInfo.contextParser) ? campaignValidateInfo.contextParser.length : 0 }} Parts
                        </strong>
                      </p>
                      <vue-json-pretty
                        :data="campaignValidateInfo.contextParser"
                        :deep="2"
                        highlight-mouseover-node
                        show-line
                        show-double-quotes
                      />
                    </v-col>
                    <v-col 
                      cols="12"
                    >
                      <p class="body-2 indigo--text">
                        Services Messages:
                      </p>
                      <p>
                        Empty Message: <strong class="green--text">
                          {{ campaignValidateInfo.messageCampaignTestNotRegister }}
                        </strong>
                      </p>
                      <p>
                        Pause Service Message: <strong class="green--text">
                          {{ campaignValidateInfo.messageCampaignNotAvailable }}
                        </strong>
                      </p>
                      <p>
                        Less Content Message: <strong class="green--text">
                          {{ campaignValidateInfo.messageBoundariesLessError }}
                        </strong>
                      </p>
                      <p>
                        Over Content Message: <strong class="green--text">
                          {{ campaignValidateInfo.messageBoundariesOverError }}
                        </strong>
                      </p>
                      <p>
                        Before Service Active: <strong class="green--text">
                          {{ campaignValidateInfo.messageBeforeStart }}
                        </strong>
                      </p>
                      <p>
                        After Service Active: <strong class="green--text">
                          {{ campaignValidateInfo.messageAfterEnd }}
                        </strong>
                      </p>
                      <p>
                        Already Registered Message: <strong class="green--text">
                          {{ campaignValidateInfo.messageRegisterFail }}
                        </strong>
                      </p>
                      <p>
                        Validate Verify Code Failed Message: <strong class="green--text">
                          {{ campaignValidateInfo.messageValidateFail }}
                        </strong>
                      </p>
                      <p>
                        Telephone Number Checked Error Message: <strong class="green--text">
                          {{ campaignValidateInfo.messageCheckMsisdnNotFound }}
                        </strong>
                      </p>
                      <p class="body-2 indigo--text">
                        Rewards Sessions:
                      </p>
                      <p>
                        Rewards Fail Message: <strong class="green--text">
                          {{ campaignValidateInfo.messageRewardsFailed }}
                        </strong>
                      </p>
                      <p>
                        Rewards Invalid Message: <strong class="green--text">
                          {{ campaignValidateInfo.messageRewardsInvalid }}
                        </strong>
                      </p>
                      <p>
                        Reward Received Limit Message: <strong class="green--text">
                          {{ campaignValidateInfo.messageRewardReceivedLimit }}
                        </strong>
                      </p>
                      <p>
                        Reward have Sequence: <strong class="green--text">
                          {{ campaignValidateInfo.rewardsHaveSequence }}
                        </strong>
                      </p>
                      <p>
                        Reward All Limit: <strong class="green--text">
                          {{ campaignValidateInfo.rewardsLimit }}
                        </strong>
                      </p>
                      <div v-if="campaignValidateInfo.rewardsArray">
                        <p>
                          Reward Type: <strong class="green--text">
                            Array
                          </strong>
                        </p>
                        <p class="body-2 indigo--text">
                          Rewards Details:
                        </p>
                        <vue-json-pretty
                          :data="campaignValidateInfo.rewardsArray"
                          highlight-mouseover-node
                          show-line
                          show-double-quotes
                        />
                      </div>
                      <div v-if="campaignValidateInfo.rewardsObject">
                        <p>
                          Reward Type: <strong class="green--text">
                            Object
                          </strong>
                        </p>
                        <p class="body-2 indigo--text">
                          Rewards Details:
                        </p>
                        <vue-json-pretty
                          :data="campaignValidateInfo.rewardsObject"
                          :deep="1"
                          highlight-mouseover-node
                          show-line
                          show-double-quotes
                        />
                      </div>
                    </v-col>
                  </v-row>
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
                    <v-col
                      cols="12"
                    >
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
                    >
                      <v-subheader>Additional VerifyCode Upload File</v-subheader>
                    </v-toolbar>
                    <v-col cols="12">
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
                          @click="deleteFile"
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
                          @click="upload"
                        >
                          Upload
                          <v-icon right>
                            mdi-content-save
                          </v-icon>
                        </v-btn>
                      </v-card-actions>
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
                    >
                      <v-subheader>Additional Coupons Upload File</v-subheader>
                    </v-toolbar>
                    <v-col cols="12">
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
                          @click="deleteFile"
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
                          @click="upload"
                        >
                          Upload
                          <v-icon right>
                            mdi-content-save
                          </v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item :value="4">
                <!-- keyword reserved -->
                <v-card>
                  <!-- Insert in Base-Table Component -->
                  <BaseTable
                    v-if="loading===false"
                    :headers="headers"
                    :items="items"
                    :pagination="pagination"
                    :basemodule="baseModule"
                    :action-btn="false"
                  />
                </v-card>
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
            <h4 class="font-weight-medium primary--text">
              Campaign: {{ campaignInfo.campaignName }}
            </h4>

            <p class="mb-5">
              &nbsp;&nbsp;{{ campaignInfo.campaignDescription }}<br><br>
              <span class="primary--text">Campaign Type:</span> {{ campaignInfo.campaignType }}<br><br>
              <span class="primary--text">Campaign Owner:</span> {{ campaignInfo.organizationLevel1Name }}<br><br>
              <span class="primary--text">Campaign Keyword:</span> {{ campaignInfo.keyword }}<br><br>
              <span class="primary--text">Campaign Shortcode:</span> {{ campaignInfo.shortcode }}<br>
            </p>

            <h5 class="font-weight-medium secondary--text">
              Time Interval
            </h5>
            <p class="mb-5">
              <span class="primary--text">Campaign StartDate:</span> {{ startDate }}<br><br>
              <span class="primary--text">Campaign EndDate:</span> {{ endDate }}<br><br>
            </p>
          </base-card>
        </v-col>
        <v-col
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
              <span class="caption grey--text font-weight-light">
                updated 4 minutes ago
              </span>
            </template>
          </base-card>
        </v-col>
        <v-col
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
              <span class="caption grey--text font-weight-light">
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


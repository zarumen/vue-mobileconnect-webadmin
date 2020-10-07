import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    currentUser: state => state.currentUser
  }),
  ...mapGetters('auth', ['loggedIn', 'isAdmin', 'getAvartar'])
}

export const authMethods = mapActions('auth', ['logIn', 'logOut'])

export const orgComputed = {
  ...mapState('organizations', {
    // ListItem of Data Table
    items: state => state.items,
    // Set Up Data Table Pagination &
    pagination: state => state.pagination,
    page: state => state.pagination.page,
    // Loading (Looking || Hiding) &
    loading: state => state.loading,
    // Snackbar Status and UI Set Up
    mode: state => state.mode,
    snackbar: state => state.snackbar,
    notice: state => state.notice
  }),
  ...mapGetters('organizations', [
    'hadList',
    'getCompanyList',
    'getDepartmentList',
    'getBrandList'
  ])
}

export const orgMethods = mapActions('organizations', ['getOrganizationsList', 'addCompanyToOrganization'])

export const userComputed = {
  ...mapState('users', {
    // ListItem of Data Table
    items: state => state.items,
    // Set Up Data Table Pagination &
    pagination: state => state.pagination,
    page: state => state.pagination.page,
    // Loading (Looking || Hiding) &
    loading: state => state.loading,
    // Snackbar Status and UI Set Up
    mode: state => state.mode,
    snackbar: state => state.snackbar,
    notice: state => state.notice
  }),
  ...mapGetters('users', [
    'hadUserList'
  ])
}

export const userMethods = mapActions('users', ['getAllUsers', 'fetchUser', 'createUser'])

export const searchComputed = mapGetters('campaigns', ['hadCampaignList'])

export const searchMethods = mapActions('campaigns', ['getAllCampaigns'])

export const campaignComputed = {
  ...mapState('campaigns', {
    // ListItem of Data Table
    items: state => state.items,
    item: state => state.item,
    // Set Up Data Table Pagination &
    pagination: state => state.pagination,
    page: state => state.pagination.page,
    // Loading (Looking || Hiding) &
    loading: state => state.loading,
    // Snackbar Status and UI Set Up
    mode: state => state.mode,
    snackbar: state => state.snackbar,
    notice: state => state.notice
  }),
  ...mapGetters('organizations', [
    'hadList'
  ]),
  ...mapGetters('campaigns', [
    'hadCampaignList'
  ]),
  ...mapGetters('shortcodes', [
    'hadShortcodesList'
  ])
}

export const campaignMethods = {
  ...mapActions('campaigns', [
    'getAllCampaigns',
    'deleteCampaign',
    'closeSnackBar'
  ]),
  ...mapActions('organizations', [
    'getOrganizationsList'
  ]),
  ...mapActions('shortcodes', [
    'getAllShortcodes'
  ])
}

export const campaignDetailsComputed = {
  ...mapState('transactions', {
    // ListItem of Data Table
    items: state => state.items,
    // // Set Up Data Table Pagination &
    pagination: state => state.pagination,
    page: state => state.pagination.page,
    // Loading (Looking || Hiding) &
    loading: state => state.loading,
    // Snackbar Status and UI Set Up
    mode: state => state.mode,
    snackbar: state => state.snackbar,
    notice: state => state.notice
  }),
  ...mapGetters('auth', [
    'isAdmin'
  ]),
  ...mapGetters('campaigns', [
    'getOneCampaign',
    'getOneCampaignValidate',
    'getCampaignStateSelected'
  ]),
  ...mapGetters('transactions', [
    'getTransactionTotals',
    'getTransactionKeyword',
    'getTransactionSuccess',
    'getTimestampTxTotals',
    'getTotalsVerifyCode',
    'getCheckVerifyCode',
    'getListCoupons',
    'getTotalsCoupon',
    'hadHeaderConfig',
    'getHeaderConfigArray'
  ]),
  ...mapGetters('shortcodes', [
    'hadShortcodesList',
    'getShortcodesList',
    'getShortcodesReservedList'
  ])
}

export const campaignDetailsMethods = {
  ...mapActions('campaigns', [
    'createCampaign',
    'getCampaignValidate',
    'updateStatusCampaign',
    'updatePausedCampaign',
    'calibratedCampaignTx'
  ]),
  ...mapActions('transactions', [
    'socketRegister',
    'socketUnRegister',
    'getLastestTransactions',
    'getVerifyCodeFromRedis',
    'putVerifyCodeToRedis',
    'searchVerifyCodeFromRedis',
    'postOneVerfyCodeToRedis',
    'delVerifyCodeFromRedis',
    'getCouponsFromRedis',
    'searchCouponsFromRedis',
    'postCouponsToRedis',
    'putCouponsToRedis',
    'delCouponsFromRedis',
    'getHeaderConfig'
  ]),
  ...mapActions('storage', [
    'fetchCoupons',
    'fetchVerifyCode',
    'uploadFile',
    'deleteUploadFile'
  ])
}

export const campaignSearchComputed = {
  ...mapState('transactions', {
    // ListItem of Data Table
    items: state => state.items,
    // // Set Up Data Table Pagination &
    pagination: state => state.pagination,
    page: state => state.pagination.page,
    // Loading (Looking || Hiding) &
    loading: state => state.loading,
    // Snackbar Status and UI Set Up
    mode: state => state.mode,
    snackbar: state => state.snackbar,
    notice: state => state.notice
  }),
  ...mapGetters('auth', [
    'isAdmin'
  ]),
  ...mapGetters('campaigns', [
    'hadCampaignList',
    'getBanList',
    'getRegisterList',
    'getAllCampaignsId',
    'getCampaignStateSelected'
  ]),
  ...mapGetters('transactions', [
    'hadItems',
    'hadHeaderConfig',
    'getHeaderConfigArray'
  ])
}

export const campaignSearchMethods = {
  ...mapActions('campaigns', [
    'updateStatusCampaign',
    'searchBanListByCampaign',
    'searchRegisterListByCampaign',
    'calibratedCampaignTx'
  ]),
  ...mapActions('transactions', [
    'getSearchCampaignID',
    'getSearchMsisdn'
  ])
}

export const headerConfigComputed = {
  ...mapGetters('transactions', [
    'hadHeaderConfig',
    'getHeaderConfigArray'
  ])
}

export const headerConfigMethods = {
  ...mapActions('transactions', [
    'saveHeaderConfig',
    'getHeaderConfig',
    'changeElementHeader'
  ]),
  ...mapMutations('transactions', [
    'setElementHeaderConfig'
  ])
}

export const reportComputed = {
  ...mapState('reports', {
    jobList: state => state.jobList,
    campaignSelected: state => state.campaignSelected
  }),
  ...mapGetters('reports', [
    'getCampaignSelected'
  ])
}

export const reportMethods = {
  ...mapActions('campaigns', [
    'getAllCampaigns'
  ]),
  ...mapActions('reports', [
    'createS3DownloadFileJob',
    'getCampaignExportJobsListener',
    'getFileDownloadFromS3'
  ])
}

export const operatorComputed = {
  ...mapState('shortcodes', {
    // ListItem of Data Table
    operators: state => state.operators,
    items: state => state.items,
    // // Set Up Data Table Pagination &
    pagination: state => state.pagination,
    page: state => state.pagination.page,
    // Loading (Looking || Hiding) &
    loading: state => state.loading,
    // Snackbar Status and UI Set Up
    mode: state => state.mode,
    snackbar: state => state.snackbar,
    notice: state => state.notice
  }),
  ...mapGetters('shortcodes', [
    'hadOperatorsList'
  ])
}

export const operatorMethods = {
  ...mapActions('shortcodes', [
    'getAllOperators'
  ])
}

export const shortcodeComputed = {
  ...mapState('shortcodes', {
    // ListItem of Data
    operators: state => state.operators,
    shortcodeList: state => state.shortcodeList,
    keywordList: state => state.keywordList,
    keywordReservedList: state => state.keywordReservedList,
    // Loading (Looking || Hiding) &
    loading: state => state.sLoading,
    // Snackbar Status and UI Set Up
    mode: state => state.mode,
    snackbar: state => state.snackbar,
    notice: state => state.notice
  }),
  ...mapGetters('shortcodes', [
    'hadShortcodesList',
    'getShortcodesReservedList'
  ])
}

export const shortcodeMethods = {
  ...mapActions('shortcodes', [
    'getAllShortcodes',
    'getShortcodesFromFirestore',
    'getKeywordsActiveFromFirestore',
    'getKeywordsReservedFromFirestore',
    'deleteKeywordReserved'
  ]),
  ...mapMutations('shortcodes', [
    'setElementKeywordReservedList'
  ])
}

export const set = property => (state, payload) => (state[property] = payload)

export const toggle = property => state => (state[property] = !state[property])

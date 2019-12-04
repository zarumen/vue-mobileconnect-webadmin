import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    currentUser: state => state.currentUser,
  }),
  ...mapGetters('auth', ['loggedIn', 'isAdmin', 'getAvartar']),
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
    'hadUserList',
  ])
}

export const userMethods = mapActions('users', ['getAllUsers', 'fetchUser', 'createUser'])

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
    'hadList',
  ]),
  ...mapGetters('campaigns', [
    'hadCampaignList',
  ]),
  ...mapGetters('shortcodes', [
    'hadShortcodesList',
  ])
}

export const campaignMethods = {
  ...mapActions('campaigns', [
    'getAllCampaigns',
    'deleteCampaign',
    'closeSnackBar',
  ]),
  ...mapActions('organizations', [
    'getOrganizationsList'
  ]),
  ...mapActions('shortcodes', [
  'getAllShortcodes',
  ]),
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
    'isAdmin',
  ]),
  ...mapGetters('campaigns', [
    'getOneCampaign',
    'getOneCampaignValidate',
    'getCampaignStateSelected',
  ]),
  ...mapGetters('transactions', [
    'getTransactionTotals',
    'getTransactionKeyword',
    'getTransactionSuccess',
    'getTimestampTxTotals',
    'getTotalsVerifyCode',
    'getTotalsCoupon'
  ]),
}

export const campaignDetailsMethods = {
  ...mapActions('campaigns', [
    'getCampaignValidate',
    'updateStatusCampaign',
    'calibratedCampaignTx'
  ]),
  ...mapActions('transactions', [
    'socketRegister',
    'socketUnRegister',
    'getLastestTransactions',
    'getVerifyCodeFromRedis',
    'putVerifyCodeToRedis',
    'delVerifyCodeFromRedis',
    'getCouponsFromRedis',
    'putCouponsToRedis',
    'delCouponsFromRedis'
  ]),
  ...mapActions('storage', [
    'fetchCoupons',
    'fetchVerifyCode',
    'uploadFile',
    'deleteUploadFile'
  ]),
}

export const reportComputed = {
  ...mapState('reports', {
    jobList: state => state.jobList,
    campaignSelected: state => state.campaignSelected
  }),
  ...mapGetters('reports', [
    'getCampaignSelected',
  ])
}

export const reportMethods = {
  ...mapActions('campaigns', [
    'getAllCampaigns',
  ]),
  ...mapActions('reports', [
    'createS3DownloadFileJob',
    'getCampaignExportJobsListener',
    'getFileDownloadFromS3',
  ]),
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
    'hadOperatorsList',
  ])
}

export const operatorMethods = {
  ...mapActions('shortcodes', [
    'getAllOperators',
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
    'setElementKeywordReservedList',
  ]),
}

export const set = property => (state, payload) => (state[property] = payload)

export const toggle = property => state => (state[property] = !state[property])

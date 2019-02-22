import { mapState, mapGetters, mapActions } from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    currentUser: state => state.currentUser,
  }),
  ...mapGetters('auth', ['loggedIn', 'isAdmin']),
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
  ...mapGetters('campaigns', [
    'hadCampaignList',
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
  ])
}

export const shortcodeMethods = {
  ...mapActions('shortcodes', [
    'getAllShortcodes',
    'getShortcodesFromFirestore',
    'getKeywordsActiveFromFirestore',
    'getKeywordsReservedFromFirestore'
  ])
}

export const set = property => (state, payload) => (state[property] = payload)

export const toggle = property => state => (state[property] = !state[property])

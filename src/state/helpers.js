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

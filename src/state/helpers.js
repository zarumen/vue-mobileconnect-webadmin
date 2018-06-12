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
    items: state => state.organizationsList,
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

}

export const userMethods = {}

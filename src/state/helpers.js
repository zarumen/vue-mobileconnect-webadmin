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
    items: state => state.organizationList
  })
}

export const orgMethods = mapActions('organizations', 'getOrganizationsList')

import fireauthApp from '@utils/fireauth.config'
import firestoreApp from '@utils/firestore.config'

export const state = {
  currentUser: getSavedState('auth.currentUser'),
  userInfo: getSavedState('auth.userInfo'),
  isAdmin: getSavedState('auth.admin')
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn: state => !!state.currentUser,
  // check Admin role
  isAdmin: state => state.isAdmin,
  // get User Email
  getEmail: state => state.currentUser.email,
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue
    saveState('auth.currentUser', newValue)
  },
  setUserInfo(state, newValue) {
    state.userInfo = newValue
    saveState('auth.userInfo', newValue)
  },
  setAdminRole(state, newValue) {
    state.isAdmin = newValue
    saveState('auth.admin', newValue)
  }
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ dispatch }) {
    dispatch('validate')
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  validate({ state, commit }) {
    // check localStorage have data ?
    if (!state.currentUser) return Promise.resolve(null)

    if (!state.userInfo) return Promise.resolve(null)

    // check validate localStorage data valid
    if (state.userInfo.email !== state.currentUser.email) {
      commit ('SET_CURRENT_USER', null)
      commit ('setUserInfo', null)
      commit ('setAdminRole', false)
      return Promise.resolve(null)
    }

    // refresh all data in localStorage
    return fireauthApp.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {

        // refresh new ID Token when token expired
        if (firebaseUser.qa !== state.currentUser.idToken) {
          let user = {
            photoURL: firebaseUser.photoURL,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            idToken: firebaseUser.qa
          }
          commit ('SET_CURRENT_USER', user)
        }
        
        return firebaseUser
      } else {
        return Promise.resolve(null)
      }
    })

  },

  logIn({ commit, dispatch, getters }, { username, password } = {}) {
    // check loggedIn has true ?
    if (getters.loggedIn) return dispatch('validate')

    return fireauthApp
      .signInWithEmailAndPassword(username, password)
      .then(firebaseUser => {
        let user = {
          photoURL: firebaseUser.user.photoURL,
          email: firebaseUser.user.email,
          displayName: firebaseUser.user.displayName,
          idToken: firebaseUser.user.qa
        }
        commit('SET_CURRENT_USER', user)

        firestoreApp
          .collection('users')
          .where('email', '==', user.email)
          .get()
          .then(querySnapshot => {
            var updatedUser = {}
            querySnapshot.forEach(doc => {
              updatedUser = doc.data()
              updatedUser['id'] = doc.id
            })
            let userIsAdmin = updatedUser.isAdmin
            commit('setAdminRole', userIsAdmin)
            commit('setUserInfo', updatedUser)
            return updatedUser
          })
          .catch(error => {
            console.log(error)
            if (error.response.status === 401) {
              commit('setUserInfo', null)
              commit('SET_CURRENT_USER', null)
              commit('setAdminRole', false)
            }
            return null
          })
      })
  },

  logOut({ commit }) {

    commit('SET_CURRENT_USER', null)
    commit('setUserInfo', null)
    commit('setAdminRole', false)

    removeState('auth.currentUser')
    removeState('auth.userInfo')
    removeState('auth.admin')
  },
}

// ===
// Private helpers
// ===

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

function removeState(key) {
  window.localStorage.removeItem(key)
}

import fireauthApp from '@utils/fireauth.config'
import firestoreApp from '@utils/firestore.config'
import { firebasePref } from '@utils/firebase-pref.config'
import assign from 'lodash/assign'

const defaultCurrentUserObj = {
  displayName: null,
  email: null,
  idToken: null,
  photoURL: null
}

export const state = {
  currentUser: getSavedState('auth.currentUser'),
  userInfo: getSavedState('auth.userInfo'),
  isAdmin: getSavedState('auth.admin'),
  avartar: {
    male: 'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png',
    female: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-512.png',
    admin: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/supportfemale-512.png',
    anonymous: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
  }
}

export const getters = {
  // Whether the user is currently logged in.
  // TODO: change loggedIn checked State
  loggedIn: state => haveIdToken(state.currentUser),
  // check Admin role
  isAdmin: state => state.isAdmin,
  // get User Email
  getUserInfo: state => state.userInfo,
  getAvartar: (state) => {
    if (state.isAdmin) {
      return state.avartar.admin
    } else {
      if (state.userInfo) {
        if (state.userInfo.gender === 'Male') {
          return state.avartar.male
        } else if (state.userInfo.gender === 'Female') {
          return state.avartar.female
        } else {
          return state.avartar.anonymous
        }
      }
    }
  }
}

export const mutations = {
  SET_CURRENT_USER (state, newValue) {
    state.currentUser = newValue
    saveState('auth.currentUser', newValue)
  },
  setDisplayNameUpdated (state, payload) {
    assign(state.currentUser, payload)
  },
  setUserInfo (state, newValue) {
    state.userInfo = newValue
    saveState('auth.userInfo', newValue)
  },
  setAdminRole (state, newValue) {
    state.isAdmin = newValue
    saveState('auth.admin', newValue)
  }
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init ({ dispatch }) {
    dispatch('validate')
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  async validate ({ state, commit, dispatch }) {
    // check localStorage have data ?
    if (!state.currentUser) return Promise.resolve(null)

    // check validate localStorage data valid
    if (!state.currentUser.email) {
      commit('SET_CURRENT_USER', defaultCurrentUserObj)
      commit('setUserInfo', null)
      commit('setAdminRole', false)

      removeState('auth.currentUser')
      removeState('auth.userInfo')
      removeState('auth.admin')
      return Promise.resolve(null)
    }

    // refresh all data in localStorage
    return new Promise((resolve, reject) => {
      fireauthApp.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          // refresh new ID Token when token expired
          // return when use dispatch.then((email) => { ... })
          resolve(firebaseUser.email)
        } else {
          // if session Expired clear
          dispatch('logOut')
          resolve(null)
        }
      })
    })
  },

  async fetchUserInfo ({ commit }, user) {
    firestoreApp
      .collection('users')
      .where('email', '==', user.email)
      .get()
      .then(querySnapshot => {
        let updatedUser = {}
        querySnapshot.forEach(doc => {
          updatedUser = doc.data()
          updatedUser.id = doc.id
        })
        const userIsAdmin = updatedUser.isAdmin
        commit('setAdminRole', userIsAdmin)
        commit('setUserInfo', updatedUser)
        return Promise.resolve(updatedUser)
      })
      .catch(error => {
        console.log(error)
        if (error.response.status === 401) {
          commit('setUserInfo', null)
          commit('SET_CURRENT_USER', defaultCurrentUserObj)
          commit('setAdminRole', false)
        }
        return Promise.resolve(null)
      })
  },

  async logIn ({ commit, dispatch, getters }, { username, password } = {}) {
    // check loggedIn has true ?
    if (getters.loggedIn) return dispatch('validate')

    const trace = firebasePref.trace('userLogin')
    trace.start()

    let loginUser = null
    let user = {}

    try {
      loginUser = await fireauthApp.signInWithEmailAndPassword(username, password)

      trace.putAttribute('verified', `${loginUser.user.email}`)
      trace.stop()

      user = {
        photoURL: loginUser.user.photoURL,
        email: loginUser.user.email,
        displayName: loginUser.user.displayName,
        idToken: loginUser.user.refreshToken
      }
    } catch (error) {
      console.log(error)
      trace.putAttribute('errorCode', `${error.code}`)
      trace.stop()
    }

    if (loginUser) {
      commit('SET_CURRENT_USER', user)
      dispatch('fetchUserInfo', user)

      console.log('set user and fetch userinfo!')
      return Promise.resolve(user)
    } else {
      console.log('can\'t login to firebase!')
      return Promise.resolve(null)
    }
  },

  logOut ({ commit, dispatch }) {
    commit('SET_CURRENT_USER', defaultCurrentUserObj)
    commit('setUserInfo', null)
    commit('setAdminRole', false)

    dispatch('transactions/removeLocalStorageAll', null, { root: true })

    window.sessionStorage.removeItem('vuex')
    removeState('auth.currentUser')
    removeState('auth.userInfo')
    removeState('auth.admin')
  }
}

// ===
// Private helpers
// ===

function haveIdToken (obj) {
  if (obj === null) return false

  if (Object.prototype.hasOwnProperty.call(obj, 'idToken')) {
    if (obj.idToken !== null) {
      return true
    } else {
      return false
    }
  }

  return false
}

// function getJWT () {
//   return new Promise((resolve, reject) => {
//     fireauthApp.currentUser.getIdToken(/* forceRefresh */ true)
//       .then(function(idToken) {
//         // Send token to your backend via HTTPS
//         return resolve(idToken)
//       }).catch(function(error) {
//         return reject(error)
//       })
//   })
// }

function getSavedState (key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState (key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

function removeState (key) {
  window.localStorage.removeItem(key)
}

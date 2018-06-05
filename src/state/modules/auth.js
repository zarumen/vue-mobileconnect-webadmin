import { firebaseApp } from "@utils/firebase.config"
import firestoreApp from "@utils/firestore.config"
// import firebase from "firebase/app"



// const api = firebaseConfig.apiKey

export const state = {
  currentUser: getSavedState("auth.currentUser"),
  userInfo: getSavedState("auth.userInfo"),
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.currentUser
  },
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue
    saveState("auth.currentUser", newValue)
  },
  setUserInfo(state, newValue) {
    state.userInfo = newValue
    saveState("auth.userInfo", newValue)
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ dispatch }) {
    dispatch("validate")
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  validate({ state }) {
    if (!state.currentUser) return Promise.resolve(null)

    // var thirdApp = firebase.initializeApp(firebaseConfig, "Third")
    return firebaseApp.auth().currentUser.getIdToken(true)
      .then(token => {
        if (state.currentUser.refreshToken === token) return

        state.currentUser['refreshToken'] = token

        return token

      }).catch(error => {
        console.log(error)
      }) 
  },

  logIn({ commit, dispatch, getters }, { username, password } = {}) {
    // var secondaryApp = firebase.initializeApp(firebaseConfig, "Second")
    // var firestoreApp = secondaryApp.firestore()
    if (getters.loggedIn) return dispatch("validate")

    return firebaseApp.auth()
      .signInWithEmailAndPassword(username, password)
      .then(firebaseUser => {
        console.log(firebaseUser.user)
        let user = {
          uid: firebaseUser.user.uid,
          email: firebaseUser.user.email,
          displayName: firebaseUser.user.displayName,
          refreshToken: firebaseUser.user.refreshToken
        }
        firestoreApp
          .collection("users")
          .where("email", "==", user.email)
          .get()
          .then(querySnapshot => {
            console.log(querySnapshot)
            var updatedUser = {}
            querySnapshot.forEach(doc => {
              console.log(doc.data())
              updatedUser = doc.data()
              updatedUser["id"] = doc.id
            })
            commit("setUserInfo", updatedUser)
            commit("SET_CURRENT_USER", user)
            return updatedUser
          })
          .catch(error => {
            console.log(error)
            if (error.response.status === 401) {
              commit("setUserInfo", null)
              commit("SET_CURRENT_USER", null)
            }
            return null
          })
      })
  },

  logOut({ commit }) {
    commit("SET_CURRENT_USER", null)
    commit("setUserInfo", null)
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

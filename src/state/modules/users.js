import { firebaseConfig } from '@utils/firebase.config'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firstApp = firebase.initializeApp(firebaseConfig, 'First')

export const state = {
  cached: [],
}

export const getters = {}

export const mutations = {
  CACHE_USER(state, newUser) {
    state.cached.push(newUser)
  },
}

export const actions = {
  fetchUser({ commit, state, rootState }, { username }) {
    const { currentUser } = rootState.auth
    if (currentUser && currentUser.email === username) {
      return Promise.resolve(currentUser)
    }

    return firstApp.firestore()
      .collection('users')
      .where('email', '==', currentUser.email)
      .get()
      .then(querySnapshot => {
        var updatedUser = {}
        querySnapshot.forEach(doc => {
          updatedUser = doc.data()
          updatedUser['id'] = doc.id
        })
        commit('CACHE_USER', updatedUser)
        return updatedUser
      })
  },
}

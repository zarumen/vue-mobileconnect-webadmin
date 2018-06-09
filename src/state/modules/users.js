// import fireauthApp from '@utils/fireauth.config'
import firestoreApp from "@utils/firestore.config"

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
    // 1. Check if we already have the user as a current user.
    const { currentUser } = rootState.auth
    if (currentUser && currentUser.email === username) {
      return Promise.resolve(currentUser)
    }
    // 2. Check if we've already fetched and cached the user.
    const matchedUser = state.cached.find(user => user.email === username)
    if (matchedUser) {
      return Promise.resolve(currentUser)
    }

    // 3. Fetch the user from the API and cache it in case
    //    we need it again in the future.
    return firestoreApp
      .collection('users')
      .where('email', '==', username)
      .get()
      .then(querySnapshot => {
        var updatedUser = {}
        querySnapshot.forEach(doc => {
          updatedUser = doc.data()
          updatedUser['id'] = doc.id
        })
        commit('setUserInfo', updatedUser)
        return updatedUser
      })      
  },
  createUser( { commit, state }, { username, password } ) {

  },
}

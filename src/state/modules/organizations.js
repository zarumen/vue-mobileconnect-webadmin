import firestoreApp from '@utils/firestore.config'

export const state = {
  organizationList: [],
  companyList: [],
  departmentList: [],
  brandList: []
}

export const getters = {}

export const mutations = {
  setOrganizationList(state, newValue) {
    state.organizationList = newValue
  },

}

export const actions = {
  createOrganization() {
    

  },
  getOrganizationById({ commit }, { id }) {

  },
  getOrganizationsListById({ commit }, { authLevel, id }) {

  },
  getOrganizationsList({ commit, state }) {
    if (!state.organizationList) return Promise.resolve(null)

    return firestoreApp
      .collection('organizations')
      .get()
      .then(querySnapshot => {
          let orgList = []
          querySnapshot.forEach(res => {
            console.log(res.data())
            orgList.push(res.data())
          })
          commit('setOrganizationList', orgList)
          return orgList
      })
      .catch(error => {
          console.log(error)
          return error
      })
  },
  getCompanyList({ commit }) {

  },
  getDepartmentList({ commit }) {

  },
  getBrandList({ commit }) {

  }
}

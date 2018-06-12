import firebase from '@firebase/app'
import '@firebase/firestore'
import firestoreApp from '@utils/firestore.config'

import {
  sendSuccessNotice,
  sendErrorNotice,
  closeNotice,
  commitPagination,
} from '@utils/pagination-util'

export const state = {
  items: [],
  pagination: {},
  loading: false,
  mode: '',
  snackbar: false,
  notice: '',
  organization: {},
  organizationsList: [],
  companyList: [],
  departmentList: [],
  brandList: []
}

export const getters = {
  hadList(state) {
    return !!state.organizationsList
  },
  getCompanyList(state) {
    return state.companyList
  },
  getDepartmentList(state) {
    return state.departmentList
  },
  getBrandList(state) {
    return state.brandList
  }
}

export const mutations = {
  setOrganizationsList(state, newValue) {
    state.organizationsList = newValue
  },
  setCompanyList(state, newValue) {
    state.companyList = newValue
  },
  setDepartmentList(state, newValue) {
    state.departmentList = newValue
  },
  setBrandList(state, newValue) {
    state.brandList = newValue
  },
  setPagination (state, pagination) {
    state.pagination = pagination;
  },
  setLoading(state, { loading }) {
    state.loading = loading
  },
  setNotice (state, { notice }) {
    console.log(' notice .... ', notice)
    state.notice = notice
  },
  setSnackbar (state, { snackbar }) {
    state.snackbar = snackbar
  },
  setMode (state, { mode }) {
    state.mode = mode
  },
  setItems (state, items) {
    state.items = items
  }
}

export const actions = {
  // ===
  // CREAT Zone
  // ===
  addCompanyToOrganization({ commit, dispatch }, organization) {

    console.log('Company action!')

    return firestoreApp
      .collection('organizations')
      .add(organization)
      .then(docRef => {
        docRef.update({
          lastUpdated: getserverTimestamp(),
          organizationLevel1: docRef.id
        })

        console.log("Document written with ID: ", docRef.id);
        // dispatch('getOrganizationsList')
        sendSuccessNotice(commit, 'New Company has been added.')
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'Operation failed! Please try again later. ')
        closeNotice(commit, 1500)
        return error
      })
  },
  addDepartmentToOrganization({ commit, dispatch }, organization) {

    console.log('Department Action')

    return firestoreApp
      .collection('organizations')
      .add(organization)
      .then(docRef => {
        docRef.update({
          lastUpdated: getserverTimestamp(),
          organizationLevel2: docRef.id
        })

        console.log("Document written with ID: ", docRef.id);
        // dispatch('getOrganizationsList')
        sendSuccessNotice(commit, 'New Department has been added.')
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'Operation failed! Please try again later. ')
        closeNotice(commit, 1500)
        return error
      })
  },
  addBrandToOrganization({ commit, dispatch }, organization) {

    console.log('Brand Action')
    
    return firestoreApp
      .collection('organizations')
      .add(organization)
      .then(docRef => {
        docRef.update({
          lastUpdated: getserverTimestamp(),
          organizationLevel3: docRef.id
        })

        console.log("Document written with ID: ", docRef.id);
        // dispatch('getOrganizationsList')
        sendSuccessNotice(commit, 'New Brand has been added.')
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'Operation failed! Please try again later. ')
        closeNotice(commit, 1500)
        return error
      })
  },
  // ===
  // READ Zone
  // ===
  getOrganizationById({ commit }, { id }) {
    console.log(id)
    return id
  },
  getOrganizationsListById({ commit }, { authLevel, id }) {

  },
  getOrganizationsList({ commit, state }) {
    if (!state.organizationsList) return Promise.resolve(null)

    commit('setLoading', { loading: true })
    return firestoreApp
      .collection('organizations')
      .orderBy('lastUpdated', 'desc')
      .get()
      .then(querySnapshot => {
          let orgList = []
          querySnapshot.forEach(res => {
            let data = {}
            data = res.data()
            data['id'] = res.id
            orgList.push(data)
          })

          // Split Array Organization => Company, Deparment, Brand
          const orgLevel1List = orgList
            .filter(org => 
              org.organizationAuth === 'Level1'
          )

          const orgLevel2List = orgList
            .filter(org => 
              org.organizationAuth === 'Level2'
          )

          const orgLevel3List = orgList
            .filter(org => 
              org.organizationAuth === 'Level3'
          )

          // set All state
          commit('setCompanyList', orgLevel1List)
          commit('setDepartmentList', orgLevel2List)
          commit('setBrandList', orgLevel3List)
          commit('setOrganizationsList', orgList)

          commitPagination(commit, orgList)
          commit('setLoading', { loading: false })
          sendSuccessNotice(commit, 'Organization Refresh!')
          return orgList
      })
      .catch(error => {
          commit('setLoading', { loading: false })
          console.log(error)
          return error
      })
  },
  // ===
  // DELETE Zone
  // ===
  deleteOrganization({ commit, dispatch }, organizationId) {

    commit('setLoading', { loading: true })
    return firestoreApp
      .collection('organizations')
      .doc(organizationId)
      .delete()
      .then(() => {
        dispatch('getOrganizationsList')
        sendSuccessNotice(commit, 'Organization Deleted!')
      })
      .catch(error => {
        console.log("Error removing document: ", error)
      })
  },
}
// ===
// Private helpers
// ===

function getserverTimestamp() {
  return firebase.firestore.FieldValue.serverTimestamp()
}

import firebase from '@firebase/app'
import '@firebase/firestore'
import firestoreApp from '@utils/firestore.config'

import {
  sendSuccessNotice,
  sendErrorNotice,
  closeNotice,
  commitPagination,
  getDefaultPagination,
} from '@utils/pagination-util'

export const state = {
  // Data Table Initial Setup Variables
  items: null,
  pagination: getDefaultPagination(),
  loading: false,
  mode: '',
  snackbar: false,
  notice: '',
  // List of Company, Department, Brand Dropdown Setup Variables
  companyList: [],
  departmentList: [],
  brandList: [],
  // Search Result Variables
  organization: {},
  organizationsList: [],
}

export const getters = {
  hadList(state) {
    return !!state.items
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
    state.pagination = pagination
  },
  // update Page
  updatePage(state, paginationPage) {
    state.pagination.page = paginationPage
  },
  setLoading(state, { loading }) {
    state.loading = loading
  },
  setNotice (state, { notice }) {
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
        closeNotice(commit, 1500)
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
        closeNotice(commit, 1500)
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
        closeNotice(commit, 1500)
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
    if (this.hadList) return Promise.resolve(null)

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

          commitPagination(commit, orgList)
          commit('setLoading', { loading: false })
          sendSuccessNotice(commit, 'Organization Refresh!')
          closeNotice(commit, 1500)
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
        closeNotice(commit, 2000)
      })
      .catch(error => {
        commit('setLoading', { loading: false })
        console.log("Error removing document: ", error)
      })
  },
  // ===
  // ETC. Zone
  // ===
  closeSnackBar ({ commit }, timeout ) {
    closeNotice(commit, timeout);
  }
}
// ===
// Private helpers
// ===

function getserverTimestamp() {
  return firebase.firestore.FieldValue.serverTimestamp()
}

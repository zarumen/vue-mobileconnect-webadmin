import firestoreApp from "@utils/firestore.config"

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
  item: null,
  pagination: getDefaultPagination(),
  loading: false,
  mode: '',
  snackbar: false,
  notice: '',  
}

export const getters = {
  hadCampaignList(state) {
    return !!state.items
  }
}

export const mutations = {
  setPagination (state, pagination) {
    state.pagination = pagination
  },
  // update Page
  setPage(state, paginationPage) {
    state.pagination.page = paginationPage
  },
  // Mutate Value in Pagination
  setItems (state, items) {
    state.items = items
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
}

export const actions = {
  // ===
  // CREATE Zone
  // ===
  async createCampaign({ commit, dispatch }, { campaignObject, validationObject } = {}) {

    commit('setLoading', { loading: true })

    console.log(campaignObject)
    
    let keyword = campaignObject.keyword
    let shortcode = campaignObject.shortcode
    let newCampaign = null
    let newValidateCampaign = null

    try {

      newCampaign = await firestoreApp
        .collection('campaigns')
        .doc(`${campaignObject.campaignCode}`)
        .set(campaignObject)

      let data = {}
       
      keyword.forEach(key => {
        data[key] = newCampaign.id
      })
      
      await firestoreApp
        .collection('campaignKeywordByShortcode')
        .doc(shortcode)
        .set(data, { merge: true })

      newValidateCampaign = await firestoreApp
        .collection('campaignValidate')
        .doc(newCampaign.id)
        .set(validationObject)

    } catch (error) { console.log(error)}

    if (newValidateCampaign) {

      sendSuccessNotice(commit, 'New Campaign has been added.')
      closeNotice(commit, 3000)
      commit('setLoading', { loading: false })
      dispatch('getAllCampaigns')

    } else {

      commit('setLoading', { loading: false })
      sendErrorNotice(commit, 'Create Campaign failed! Please try again later. ')
      closeNotice(commit, 3000)

    }

  },
  // ===
  // READ Zone
  // ===
  getAllCampaigns({ commit }) {
    
    commit('setLoading', { loading: true })
    
    return firestoreApp
      .collection('campaigns')
      .get()
      .then(querySnapshot => {

        let campaignList = []

        querySnapshot.forEach(doc => {
          let data = {}
          data = doc.data()
          data['id'] = doc.id
          campaignList.push(data)
        })

        commitPagination(commit, campaignList)
        commit('setLoading', { loading: false })
        sendSuccessNotice(commit, 'Load Campaigns Finished!')
        closeNotice(commit, 2000)
        return campaignList
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Load Failed!')
        closeNotice(commit, 2000)
        return error
      })
  },
  getCampaignsByOrg({ commit }, { auth, orgId } = {}) {

    console.log(auth, orgId)

    if(!orgId) return Promise.resolve(null)

    let authQuery = `organization${auth}`

    console.log(authQuery)
    
    commit('setLoading', { loading: true })
    commit('setItems', null)
    
    return firestoreApp
      .collection('campaigns')
      .where(authQuery, "==", orgId)
      .get()
      .then(querySnapshot => {

        let campaignList = []

        querySnapshot.forEach(doc => {
            let data = doc.data()
            data['id'] = doc.id
            campaignList.push(data)
        })

        commitPagination(commit, campaignList)
        commit('setLoading', { loading: false })
        sendSuccessNotice(commit, 'Load Campaigns Finished!')
        closeNotice(commit, 2000)
        return campaignList
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Load Failed!')
        closeNotice(commit, 2000)
        return error
      })
  },

  // ===
  // UPDATE Zone
  // ===
  updatePage({ commit }, { pageNumber }) {
    commit('setPage', pageNumber)
  },
  // ===
  // DELETE Zone
  // ===
  deleteCampaign({ commit, dispatch }, campaignId) {
    
    commit('setLoading', { loading: true })

    return firestoreApp
      .collection('campaigns')
      .doc(campaignId)
      .delete()
      .then(() => {
        dispatch('getAllCampaigns')
        sendSuccessNotice(commit, 'Campaign Deleted!')
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
    closeNotice(commit, timeout)
  },
  clearItem ({ commit }) {
    commit('setItems', null)
  }
}

export function getExportJobsByCampaign(campaignId) {
  
  return firestoreApp
    .collection('exportJobs').doc(campaignId).collection('jobs')
    .get()
    .then(querySnapshot => {

      let exportJobs = []

      querySnapshot.forEach(doc => {
        let data = {}
        data = doc.data()
        data['id'] = doc.id
        exportJobs.push(data)
      })
      return exportJobs
    })
    .catch(error => {
      console.log(error)
      return error
    })
}
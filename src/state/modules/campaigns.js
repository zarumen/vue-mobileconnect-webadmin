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
        .add(campaignObject)

      let data = {}
      data[keyword] = newCampaign.id

      await firestoreApp
        .collection('campaignKeywordByShortcode')
        .doc(shortcode)
        .set(data)

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
  getAllCampaignsByOrg({ commit }, organizationLevel1, organizationLevel2, organizationLevel3) {
    
    console.log(organizationLevel1)
    commit('setLoading', { loading: true })
    
    return firestoreApp
      .collection('campaigns')
      .get()
      .then(querySnapshot => {

        let campaignList = []

        querySnapshot.forEach(doc => {
          let data = {}
          data = doc.data()
          if(data.organizationLevel1 == organizationLevel1 || data.organizationLevel2 == organizationLevel2 || data.organizationLevel3 == organizationLevel3){
            data['id'] = doc.id
            campaignList.push(data)
          }
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
}

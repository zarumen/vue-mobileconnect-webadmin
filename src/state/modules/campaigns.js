import firestoreApp from "@utils/firestore.config"

import {
  sendSuccessNotice,
  sendErrorNotice,
  closeNotice,
  commitPagination,
  getDefaultPagination,
} from '@utils/pagination-util'
import { Store } from "vuex";

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
  updatePage(state, paginationPage) {
    state.pagination.page = paginationPage
  },
  updateSortBy(state, paginationSortBy) {
    state.pagination.sortBy = paginationSortBy
  },
  updateDescending(state, paginationDesc) {
    state.pagination.descending = paginationDesc
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
  },
  setItem (state, item) {
    state.item = item
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
  getCampaign({ commit, dispatch },campaignId) {
    
    commit('setLoading', { loading: true })
    
    return firestoreApp
      .collection('campaigns').doc(campaignId)
      .get()
      .then(function(doc) {
        let campaign = {}
        if (doc.exists) {
            
            campaign = doc.data()
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        console.log("Document data:", campaign)
        commit('setItem', campaign)
        return campaign
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

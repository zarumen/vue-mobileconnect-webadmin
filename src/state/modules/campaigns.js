import { set } from '@state/helpers'
import assign from 'lodash/assign'
import firestoreApp from "@utils/firestore.config"
import getServerTimestamp from '@utils/firestore-timestamp'

import {
  sendSuccessNotice,
  sendErrorNotice,
  closeNotice,
  commitPagination,
  getDefaultPagination,
} from '@utils/pagination-util'

export const state = {
  // Data Table Initial Setup Variables
  campaignSelected: null,
  items: null,
  item: null,
  itemValidate: null,
  pagination: getDefaultPagination(),
  loading: false,
  mode: '',
  snackbar: false,
  notice: '',  
}

export const getters = {
  hadCampaignList (state) {
    return !!state.items
  },
  getAllCampaignsId (state) {

    if(state.items)
      return state.items.map(item => item.id)

    return []
  },
  getOneCampaign: (state) => (id) => {

    if(state.items)
      return state.items.find(item => item.id === id)

    return []
  },
  getOneCampaignValidate: (state) => state.itemValidate,
  getOneCampaignSelected: (state) => state.campaignSelected,
}

export const mutations = {
  setItemValidate: set('itemValidate'),
  setCampaignSelected: set('campaignSelected'),
  setElementItemValidate (state, payload) {
    assign(state.itemValidate, payload)
  },
  setPagination (state, pagination) {
    state.pagination = pagination
  },
  // update Page
  setPage (state, paginationElement) {
    assign(state.pagination, paginationElement)
  },
  // Mutate Value in Pagination
  setItems (state, items) {
    state.items = items
  },
  setLoading (state, { loading }) {
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

    campaignObject['campaignCreateTime'] = getServerTimestamp()
    
    let keyword = campaignObject.keyword
    let shortcode = campaignObject.shortcode
    let createError = false

    try {

      await firestoreApp
        .collection('campaigns')
        .doc(`${campaignObject.campaignCode}`)
        .set(campaignObject)
      
      await firestoreApp
        .collection('campaignValidate')
        .doc(`${campaignObject.campaignCode}`)
        .set(validationObject)
        
      
      let data = {}
      let updatedKey = {}
      
      // วน loop keywords ทั้งหมด ลงในที่ที่จะ update ทั้ง KeywordByShortcode และ KeywordReserved
      keyword.forEach(key => {
        data[key] = `${campaignObject.campaignCode}`
        updatedKey[`keywords.${key}`] = false
      })
      
      await firestoreApp
        .collection('campaignKeywordByShortcode')
        .doc(shortcode)
        .set(data, { merge: true })

      await firestoreApp
        .collection('campaignKeywordReserved')
        .doc(`${shortcode}`)
        .update(updatedKey)


    } catch (error) { 
        createError = true
        console.log(error)
    }

    if (!createError) {

      // switch Shortcode Reserved to Shortcode Active
      dispatch('shortcodes/mutateKeywordReservedListByCreateCampaign', {
        shortcode: shortcode,
        keyword: keyword
      }, { root: true })

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
      .orderBy('campaignCreateTime', 'desc')
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
      .orderBy('campaignDateStart', 'desc')
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
  getCampaignValidate ({ commit }, { campaignId }) {

    return firestoreApp
    .collection('campaignValidate')
    .doc(campaignId)
    .get()
    .then(doc => {
      if (doc.exists) {

        let data = doc.data()
        
        commit('setItemValidate', data)

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!")
        commit('setItemValidate', null)
      }
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
  updatePage({ commit }, pageNumber) {
    commit('setPage', { page: pageNumber })
  },
  updatePages({ commit }, pagesNumber) {
    commit('setPage', { pages: pagesNumber })
  },
  updatePagination({ commit }, pagiObj) {
    commit('setPage', pagiObj)
  },
  // ===
  // DELETE Zone
  // ===
  async deleteCampaign({ state, commit, dispatch }, campaignId) {
    
    commit('setLoading', { loading: true })

    let batch = firestoreApp.batch()

    let campaignRef = firestoreApp
      .collection('campaigns')
      .doc(`${campaignId}`)

    batch.delete(campaignRef)

    let campaignValidateRef = firestoreApp
      .collection('campaignValidate')
      .doc(`${campaignId}`)

    batch.delete(campaignValidateRef)

    return batch.commit()
      .then(() => {
        // dispatch delete keywordByShortcode to tricked return to keywordReserved = true 

        let obj = state.items.find(item => item.id === campaignId)

        let keyworddeleted = obj.keyword
        let shortcodedeleted = obj.shortcode

        dispatch('shortcodes/deleteKeywordByShortcode', {
          shortcode: shortcodedeleted,
          keyword: keyworddeleted
        }, { root: true })

        commit('setLoading', { loading: false })
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
  },
  setLoadingFromAnotherModule ({ commit }, bool) {
    commit('setLoading', { loading: bool })
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


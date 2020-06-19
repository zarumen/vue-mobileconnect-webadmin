import { set } from '@state/helpers'
import assign from 'lodash/assign'
import axios from '@utils/aws-api.config'
import firestoreApp from '@utils/firestore.config'
import { firebasePref } from '@utils/firebase-pref.config'
import getServerTimestamp from '@utils/firestore-timestamp'

import {
  sendSuccessNotice,
  sendErrorNotice,
  closeNotice,
  commitPagination,
  getDefaultPagination
} from '@utils/pagination-util'

export const state = {
  // Data Table Initial Setup Variables
  campaignSelected: null,
  campaignStateSelected: 'test',
  items: null,
  item: null,
  itemValidate: null,
  pagination: getDefaultPagination(),
  loading: false,
  mode: '',
  snackbar: false,
  notice: ''
}

export const getters = {
  hadCampaignList (state) {
    return !!state.items // (state.items !=== null || undefined) ? true : false
  },
  getAllCampaignsId (state) {
    if (state.items) { return state.items.map(item => item.id) }

    return []
  },
  getOneCampaign: (state) => (id) => {
    if (state.items) { return state.items.find(item => item.id === id) }

    return []
  },
  getOneCampaignValidate: (state) => state.itemValidate,
  getOneCampaignSelected: (state) => state.campaignSelected,
  getCampaignStateSelected: (state) => state.campaignStateSelected
}

export const mutations = {
  setItemValidate: set('itemValidate'),
  setCampaignSelected: set('campaignSelected'),
  toggleState: set('campaignStateSelected'),
  setElementItemValidate (state, payload) {
    assign(state.itemValidate, payload)
    state.itemValidate = { ...state.itemValidate, ...payload }
  },
  setPagination (state, pagination) {
    state.pagination = pagination
  },
  // update Page
  setPage (state, paginationElement) {
    assign(state.pagination, paginationElement)
    state.pagination = { ...state.pagination, ...paginationElement }
  },
  setElementCampaignList (state, { position, payload }) {
    assign(state.items[position], payload)
    state.items = [...state.items]
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
  }
}

export const actions = {
  // ===
  // CREATE Zone
  // ===
  async createCampaign ({ commit, dispatch }, { campaignObject, validationObject } = {}) {
    commit('setLoading', { loading: true })

    campaignObject.campaignCreateTime = getServerTimestamp()

    const keyword = campaignObject.keyword
    const shortcode = campaignObject.shortcode
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

      const data = {}
      const updatedKey = {}

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
  getAllCampaigns ({ commit }) {
    const trace = firebasePref.trace('allCampaignQuery')
    trace.start()

    commit('setLoading', { loading: true })

    return firestoreApp
      .collection('campaigns')
      .orderBy('campaignCreateTime', 'desc')
      .get()
      .then(querySnapshot => {
        const campaignList = []

        querySnapshot.forEach(doc => {
          let data = {}
          data = doc.data()
          data.id = doc.id
          campaignList.push(data)
        })

        commitPagination(commit, campaignList)
        commit('setLoading', { loading: false })
        sendSuccessNotice(commit, 'Load Campaigns Finished!')
        closeNotice(commit, 2000)
        trace.incrementMetric('allCampaignSize', campaignList.length)
        trace.stop()
        return campaignList
      })
      .catch(error => {
        console.log(error)
        trace.putAttribute('errorLoadAllCampaign', 'error')
        trace.stop()
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Load Failed!')
        closeNotice(commit, 2000)
        return error
      })
  },
  getCampaignsByOrg ({ commit }, { auth, orgId } = {}) {
    console.log(auth, orgId)
    const trace = firebasePref.trace('getCampaignByOrgQuery')
    trace.start()

    if (!orgId) return Promise.resolve(null)

    const authQuery = `organization${auth}`

    console.log(authQuery)

    commit('setLoading', { loading: true })
    commit('setItems', null)

    return firestoreApp
      .collection('campaigns')
      .where(authQuery, '==', orgId)
      .orderBy('campaignDateStart', 'desc')
      .get()
      .then(querySnapshot => {
        const campaignList = []

        querySnapshot.forEach(doc => {
          const data = doc.data()
          data.id = doc.id
          campaignList.push(data)
        })

        commitPagination(commit, campaignList)
        commit('setLoading', { loading: false })
        sendSuccessNotice(commit, 'Load Campaigns Finished!')
        closeNotice(commit, 2000)
        trace.incrementMetric('campaignSize', campaignList.length)
        trace.stop()
        return campaignList
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Load Failed!')
        closeNotice(commit, 2000)
        trace.putAttribute('errorLoadCampaign', 'error')
        trace.stop()
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
          const data = doc.data()

          commit('setItemValidate', data)
        } else {
        // doc.data() will be undefined in this case
          console.log('No such document!')
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
  // TODO: update Field in Campaigns & CampaignValidate
  editCampaignValidate ({ commit }, { campaignId, validateObj }) {
    commit('setElementItemValidate', validateObj)
    // update to firestore
    return firestoreApp
      .collection('campaignValidate')
      .doc(`${campaignId}`)
      .set(validateObj, { merge: true })
      .then(() => {
        console.log('success')
        sendSuccessNotice(commit, 'CampaignValidate has been Updated.')
        closeNotice(commit, 3000)
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'CampaignValidate Update Failed!')
        closeNotice(commit, 2000)
        return error
      })
  },
  async calibratedCampaignTx ({ state }, { campaignState }) {
    const campaignId = state.campaignSelected

    const totalsTx = await axios.putData(`transaction/${campaignId}/${campaignState}/totals`)
    const successTx = await axios.putData(`transaction/${campaignId}/${campaignState}/success`)
    const rewardsTx = await axios.putData(`transaction/${campaignId}/${campaignState}/rewards`)

    return Promise.all([totalsTx, successTx, rewardsTx])
  },
  updatePage ({ commit }, pageNumber) {
    commit('setPage', { page: pageNumber })
  },
  updatePages ({ commit }, pagesNumber) {
    commit('setPage', { pages: pagesNumber })
  },
  updatePagination ({ commit }, pagiObj) {
    commit('setPage', pagiObj)
  },
  updateCampaignValidate ({ commit }, validateObj) {
    commit('setElementItemValidate', validateObj)
  },
  async updateStatusCampaign ({ state, commit }, { campaignId }) {
    const index = state.items.map(e => e.id).indexOf(campaignId)
    const status = { campaignState: 'production' }

    await firestoreApp
      .collection('campaignValidate')
      .doc(`${campaignId}`)
      .set(status, { merge: true })

    await firestoreApp
      .collection('campaigns')
      .doc(`${campaignId}`)
      .set(status, { merge: true })

    commit('toggleState', 'production')
    commit('setElementCampaignList', {
      position: index,
      payload: status
    })
  },
  async updatePausedCampaign ({ state, commit }, { campaignId, runningAvailable }) {
    const index = state.items.map(e => e.id).indexOf(campaignId)
    const status = {}

    if (runningAvailable) {
      status.campaignAvailable = false
    } else {
      status.campaignAvailable = true
    }

    await firestoreApp
      .collection('campaignValidate')
      .doc(`${campaignId}`)
      .set(status, { merge: true })

    await firestoreApp
      .collection('campaigns')
      .doc(`${campaignId}`)
      .set(status, { merge: true })

    commit('setElementItemValidate', status)
    commit('setElementCampaignList', {
      position: index,
      payload: status
    })
  },
  // ===
  // DELETE Zone
  // ===
  async deleteCampaign ({ state, commit, dispatch }, campaignId) {
    commit('setLoading', { loading: true })

    const batch = firestoreApp.batch()

    const campaignRef = firestoreApp
      .collection('campaigns')
      .doc(`${campaignId}`)

    batch.set(campaignRef, { campaignActive: false }, { merge: true })

    const campaignValidateRef = firestoreApp
      .collection('campaignValidate')
      .doc(`${campaignId}`)

    batch.set(campaignValidateRef, { campaignActive: false }, { merge: true })

    return batch.commit()
      .then(() => {
        // dispatch delete keywordByShortcode to tricked return to keywordReserved = true

        const obj = state.items.find(item => item.id === campaignId)

        const keyworddeleted = obj.keyword
        const shortcodedeleted = obj.shortcode

        dispatch('shortcodes/deleteKeywordByShortcode', {
          shortcode: shortcodedeleted,
          keyword: keyworddeleted
        }, { root: true })

        commit('setLoading', { loading: false })
        dispatch('getAllCampaigns')
        dispatch('deleteCampaignResource', { campaignId: campaignId })
        sendSuccessNotice(commit, 'Campaign Deleted!')
        closeNotice(commit, 2000)
      })
      .catch(error => {
        commit('setLoading', { loading: false })
        console.log('Error removing document: ', error)
      })
  },
  async deleteCampaignResource ({ commit }, { campaignId }) {
    // delete campaigns Register Records from Redis
    const resTest = await axios.deleteData(`registerrecords/${campaignId}/test/totals`)
    const resProd = await axios.deleteData(`registerrecords/${campaignId}/production/totals`)

    return console.log(resTest, resProd)
  },
  // ===
  // ETC. Zone
  // ===
  closeSnackBar ({ commit }, timeout) {
    closeNotice(commit, timeout)
  },
  clearItem ({ commit }) {
    commit('setItems', null)
  },
  setLoadingFromAnotherModule ({ commit }, bool) {
    commit('setLoading', { loading: bool })
  }
}

export function getExportJobsByCampaign (campaignId) {
  return firestoreApp
    .collection('exportJobs').doc(campaignId).collection('jobs')
    .get()
    .then(querySnapshot => {
      const exportJobs = []

      querySnapshot.forEach(doc => {
        let data = {}
        data = doc.data()
        data.id = doc.id
        exportJobs.push(data)
      })
      return exportJobs
    })
    .catch(error => {
      console.log(error)
      return error
    })
}

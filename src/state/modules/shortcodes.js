import { set } from '@state/helpers'
import firestoreApp from "@utils/firestore.config"
import _ from 'lodash/assign'

import {
  sendSuccessNotice,
  sendErrorNotice,
  closeNotice,
  commitPagination,
} from '@utils/pagination-util'


export const state = {
  // -------------- Shortcode Parameter -------------------//
  shortcodeList: null,
  keywordList: null,
  keywordReservedList: null,
  sLoading: false,
  // -------------- Operator Parameter -------------------//
  // Data Table Initial Setup Variables
  items: null,
  operators: null,
  operatorConfig: null,
  pagination: {},
  loading: false,
  mode: '',
  snackbar: false,
  notice: '',
}

export const getters = {
  hadOperatorsList: (state) => !!state.items,
  hadShortcodesList: (state) => !!state.shortcodeList,
  hadOperatorConfig: (state) => !!state.operatorConfig,
  getOneOpsConfig: (state) => state.operatorConfig
}

export const mutations = {
  // -------------- Shortcode Parameter Mutations -------------------//
  setShortcodeList: set('shortcodeList'),
  setKeywordList: set('keywordList'),
  setKeywordReservedList: set('keywordReservedList'),
  setSLoading(state, { loading }) {
    state.sLoading = loading
  },
  // -------------- Operator Parameter Mutations -------------------//
  setPagination: set('pagination'),
  setOperators: set('operators'),
  // mutate Operator Config
  setOperatorConfig (state, payload) {
    _.assign(state.operatorConfig, payload)
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
  createShortcode({ commit, dispatch }, { shortcode, info }) {
    // TODO: สร้าง shortcode จอง

    return firestoreApp
      .collection('shortcodeConfig')
      .doc(`${shortcode.shortcode}`)
      .set(info, { merge: true })
      .then(docRef => {
        console.log("Document written with ID: ", shortcode);
        dispatch('getShortcodesFromFirestore')
        sendSuccessNotice(commit, 'New Shortcode has been added.')
        closeNotice(commit, 1500)
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'Operation failed! Please try again later. ')
        closeNotice(commit, 1500)
        return error
      })
  },
  createOperatorConfig({ commit, dispatch }, { shortcode, operator, config }) {

    return firestoreApp
      .collection('shortcodeConfig')
      .doc(`${shortcode}`)
      .collection('operator')
      .doc(`${operator}`)
      .set(config, { merge: true })
      .then(() => {
        console.log(`Document written with ID: ${shortcode} ops: ${operator}`);
        dispatch('getShortcodesFromFirestore')
        sendSuccessNotice(commit, 'New OperatorConfig has been added.')
        closeNotice(commit, 1500)
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'Operation Config save failed! Please try again later. ')
        closeNotice(commit, 1500)
        return error
      })
  },
  createKeywordsReserved({ commit, dispatch }, { shortcode, keywords }) {
    // สร้าง keywords จอง

    return firestoreApp
      .collection('campaignKeywordReserved')
      .doc(`${shortcode}`)
      .set(keywords, { merge: true })
      .then(docRef => {

        console.log("Document written with ID: ", shortcode);
        dispatch('getKeywordsReservedFromFirestore')
        sendSuccessNotice(commit, 'New Keywords has been added.')
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
  getAllOperators({ commit }) {

    commit('setLoading', { loading: true })

    return firestoreApp
      .collection('operatorInfo')
      .get()
      .then(querySnapshot => {

        let opList = []
        let opArray = []

        querySnapshot.forEach(doc => {
          let data = {}
          data = doc.data()
          data['operator'] = doc.id
          opArray.push(doc.id)
          opList.push(data)
        })

        commitPagination(commit, opList)
        commit('setOperators', opArray)
        commit('setLoading', { loading: false })
        sendSuccessNotice(commit, 'Load Operators Finished!')
        closeNotice(commit, 2000)
        return opList
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Load Operators Failed!')
        closeNotice(commit, 2000)
        return error
      })
  },
  async getAllShortcodes({ commit }) {

    commit('setSLoading', { loading: true })

    let sListQuery = []
    let kListQuery = []
    let kReservedListQuery = []

    try {

      sListQuery = await firestoreApp.collection('shortcodeConfig').get()
      kListQuery = await firestoreApp.collection('campaignKeywordByShortcode').get()
      kReservedListQuery = await firestoreApp.collection('campaignKeywordReserved').get()

    } catch (error) {
      console.log(error)
    }

    if(sListQuery && kListQuery && kReservedListQuery) {
      let sList = []
      let kList = []
      let kReservedList = []

      sListQuery.forEach(doc => {
        let data = {}
        data = doc.data()
        data['shortcode'] = doc.id
        sList.push(data)
      })

      kListQuery.forEach(doc => {
        let data = {}
        data['rawData'] = doc.data()
        let array = Object.getOwnPropertyNames(doc.data())
        data['shortcode'] = doc.id
        data['keywords'] = array
        kList.push(data)
      })

      kReservedListQuery.forEach(doc => {
        let data = {}
        data['rawData'] = doc.data()
        let array = Object.getOwnPropertyNames(doc.data())
        data['shortcode'] = doc.id
        data['keywords'] = array
        kReservedList.push(data)
      })
      console.log('yes')
      commit('setShortcodeList', sList)
      commit('setKeywordList', kList)
      commit('setKeywordReservedList', kReservedList)
      commit('setSLoading', { loading: false })
      sendSuccessNotice(commit, 'Load All ShortCodes Finished!')
      closeNotice(commit, 2000)

    } else {
      console.log('no')
      commit('setShortcodeList', null)
      commit('setKeywordList', null)
      commit('setKeywordReservedList', null)
      commit('setSLoading', { loading: false })
      sendErrorNotice(commit, 'Load All ShortCodes Failed!')
      closeNotice(commit, 2000)
    }
  },
  getShortcodesFromFirestore({ commit }) {

    console.log('loading!!')
    commit('setSLoading', { loading: true })

    return firestoreApp
      .collection('shortcodeConfig')
      .get()
      .then(querySnapshot => {
        let shortcodeList = []

        querySnapshot.forEach(doc => {
          let data = {}
          data = doc.data()
          data['shortcode'] = doc.id
          shortcodeList.push(data)
        })

        commit('setShortcodeList', shortcodeList)
        commit('setSLoading', { loading: false })
        sendSuccessNotice(commit, 'Load ShortCodes Finished!')
        closeNotice(commit, 2000)
        return shortcodeList
      })
      .catch(error => {
        console.log(error)
        commit('setShortcodeList', null)
        commit('setSLoading', { loading: false })
        sendErrorNotice(commit, 'Load ShortCodes Failed!')
        closeNotice(commit, 2000)
      })
  },
  getKeywordsActiveFromFirestore({ commit }) {

    commit('setSLoading', { loading: true })

    return firestoreApp
      .collection('campaignKeywordByShortcode')
      .get()
      .then(querySnapshot => {
        let keywordList = []

        querySnapshot.forEach(doc => {
          let data = {}
          data['rawData'] = doc.data()
          let array = Object.getOwnPropertyNames(doc.data())
          data['shortcode'] = doc.id
          data['keywords'] = array
          keywordList.push(data)
        })

        commit('setKeywordList', keywordList)
        commit('setSLoading', { loading: false })
        sendSuccessNotice(commit, 'Load Keywords Finished!')
        closeNotice(commit, 2000)
        return keywordList
      })
      .catch(error => {
        console.log(error)
        commit('setKeywordList', null)
        commit('setSLoading', { loading: false })
        sendErrorNotice(commit, 'Load Keywords Failed!')
        closeNotice(commit, 2000)
      })
  },
  getKeywordsReservedFromFirestore({ commit }){

    commit('setSLoading', { loading: true })

    return firestoreApp
      .collection('campaignKeywordReserved')
      .get()
      .then(querySnapshot => {
        let kReservedList = []

        querySnapshot.forEach(doc => {
          let data = {}
          data['rawData'] = doc.data()
          let array = Object.getOwnPropertyNames(doc.data())
          data['shortcode'] = doc.id
          data['keywords'] = array
          kReservedList.push(data)
        })

        commit('setKeywordReservedList', kReservedList)
        commit('setSLoading', { loading: false })
        sendSuccessNotice(commit, 'Load Keywords Finished!')
        closeNotice(commit, 2000)
        return kReservedList
      })
      .catch(error => {
        console.log(error)
        commit('setKeywordReservedList', null)
        commit('setSLoading', { loading: false })
        sendErrorNotice(commit, 'Load Keywords Failed!')
        closeNotice(commit, 2000)
      })
  },
  getOperatorConfig({ commit }, { operator, shortcode }) {

    return firestoreApp
      .collection('shortcodeConfig')
      .doc(`${shortcode}`)
      .collection('operator')
      .doc(`${operator}`)
      .get()
      .then(opsDocSnapshot => {
        let operatorConf = {}

        if (opsDocSnapshot.exists) {
          // do something with the data
          operatorConf = opsDocSnapshot.data()

        } else {
          console.log('document not found');
        }
        commit('setOperatorConfig', operatorConf)
        return operatorConf
      })
      .catch(error => console.log(`operatorConfig Error: ${error}`))
  }, 
  // ===
  // UPDATE Zone
  // ===
  mutateOperatorConfig({ commit }, payload) {
    commit('setOperatorConfig', payload)
  },
  editOperatorConfig({ commit }, { shortcode, operator, config }) {

    return firestoreApp
      .collection('shortcodeConfig')
      .doc(`${shortcode}`)
      .collection('operator')
      .doc(`${operator}`)
      .update(config)
      .then(() => {
        console.log(`Document written with ID: ${shortcode} ops: ${operator}`);
        sendSuccessNotice(commit, 'OperatorConfig has been edited.')
        closeNotice(commit, 1500)
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'Operation Config save failed! Please try again later. ')
        closeNotice(commit, 1500)
        return error
      })
  },
  // ===
  // DELETE Zone
  // ===
  // ===
  // ETC. Zone
  // ===
}

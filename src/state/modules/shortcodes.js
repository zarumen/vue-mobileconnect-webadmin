import { set } from '@state/helpers'
import firestoreApp from "@utils/firestore.config"
import { fireStoreFieldValue } from "@utils/firestore-timestamp"
import assign from 'lodash/assign'

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
  operatorConfig: {
    password: '',
    type: '',
    url: '',
    username: ''
  },
  pagination: {},
  loading: false,
  mode: '',
  snackbar: false,
  notice: '',
}

export const getters = {
  hadOperatorsList: (state) => !!state.items,
  hadShortcodesList: (state) => !!state.shortcodeList,
  getShortcodesList: (state) => state.shortcodeList,
  hadOperatorConfig: (state) => !!state.operatorConfig,
  getOneOpsConfig: (state) => state.operatorConfig,
  getShortcodesReservedList: (state) => state.keywordReservedList,
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
    state.operatorConfig =  payload
  },
  setElementOperatorConfig (state, payload) {
    assign(state.operatorConfig, payload)
  },
  setElementKeywordList (state, { position, payload }) {
    assign(state.keywordList[position], payload)
  },
  setElementShortcodesList (state, { position, payload }) {
    state.shortcodeList[position].operatorName = []
    assign(state.shortcodeList[position].operatorName, payload)
  },
  setElementKeywordReservedByCreateCampaign (state, { position, payloadCreate, payloadReserved }) {

    state.keywordReservedList[position].keywordsArray = []
    state.keywordReservedList[position].keywordsFalseArray = []

    assign(state.keywordReservedList[position].keywordsArray, payloadCreate)
    assign(state.keywordReservedList[position].keywordsFalseArray, payloadReserved)
  },
  setElementKeywordReservedList (state, { position, payload }) {
    state.keywordReservedList[position].keywordsArray = []
    assign(state.keywordReservedList[position].keywordsArray, payload)
  },
  setSendernameInShortcodesList (state, { position, payload }) {
    state.shortcodeList[position].sendername = []
    assign(state.shortcodeList[position].sendername, payload)
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

    let batch = firestoreApp.batch()

    // สร้าง shortcodeInfo ใน shortcodeConfig
    let shortcodeConfigRef = firestoreApp
      .collection('shortcodeConfig')
      .doc(`${shortcode.shortcode}`)
    
    batch.set(shortcodeConfigRef ,info, { merge: true })
    
    // สร้าง shortcode ใน keyword Reserved
    let keywordReservedRef = firestoreApp
      .collection('campaignKeywordReserved')
      .doc(`${shortcode.shortcode}`)

    batch.set(keywordReservedRef, {
      keywords: {}
    })

    return batch.commit()
      .then(() => {
        console.log("Document written with ID: ", shortcode);
        dispatch('getShortcodesFromFirestore')
        dispatch('getKeywordsReservedFromFirestore')
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
  createKeywordByShortcode({ commit, dispatch }, { shortcode, keywordsTestObj, keywordsResObj }) {
    // สร้าง Keyword Test ใน keywordByShortcode

    let batch = firestoreApp.batch()

    let keywordByShortcodeRef = firestoreApp
      .collection('campaignKeywordByShortcode')
      .doc(`${shortcode}`)

      batch.set(keywordByShortcodeRef, keywordsTestObj, { merge: true })

    let keywordReservedRef = firestoreApp
      .collection('campaignKeywordReserved')
      .doc(`${shortcode}`)

      batch.set(keywordReservedRef, {
        keywords: keywordsResObj
      }, { merge: true })

    return batch.commit()
      .then(() => {

        console.log("Document written with ID: ", shortcode);
        dispatch('getKeywordsActiveFromFirestore')
        dispatch('getKeywordsReservedFromFirestore')
        sendSuccessNotice(commit, 'TEST Keywords has been added.')
        closeNotice(commit, 1500)
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'Operation failed! Please try again later. ')
        closeNotice(commit, 1500)
        return error
      })
  },
  createKeywordsReserved({ commit, dispatch }, { shortcode, keywords }) {
    // สร้าง keywords จอง

    return firestoreApp
      .collection('campaignKeywordReserved')
      .doc(`${shortcode}`)
      .set({
        keywords: keywords
      }, { merge: true })
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
  async getAllShortcodes({ commit, dispatch }) {

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
        let raw = doc.data()
        data['rawData'] = raw

        let arr = adjustKeywordData(raw.keywords)

        let arrFilter = arr.filter((y) => y.value === true).map(item => item.key)
        let arrFalseFilter = arr.filter((y) => y.value === false).map(item => item.key)
        
        data['shortcode'] = doc.id
        data['keywordsArray'] = arrFilter
        data['keywordsFalseArray'] = arrFalseFilter

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
          let raw = doc.data()
          data['rawData'] = raw

          let arr = adjustKeywordData(raw.keywords)

          let arrFilter = arr.filter((y) => y.value === true).map(item => item.key)
          let arrFalseFilter = arr.filter((y) => y.value === false).map(item => item.key)

          data['shortcode'] = doc.id
          data['keywordsArray'] = arrFilter
          data['keywordsFalseArray'] = arrFalseFilter

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
  mutateKeywordReservedListByCreateCampaign({ commit, state }, { shortcode, keyword }) {

    let positionObj = state.keywordReservedList.find(k => k.shortcode === shortcode)

    let position = state.keywordReservedList.indexOf(positionObj)

    let array = state.keywordReservedList[position].keywordsArray.slice()
    let falseArray = state.keywordReservedList[position].keywordsFalseArray.slice()

    let addArray = array.push(keyword)
    let cutArray = falseArray.filter(cutkey => cutkey !== keyword)

    commit('setElementKeywordReservedByCreateCampaign', {
      position: position,
      payloadCreate: addArray,
      payloadReserved: cutArray
    })
  },
  mutateKeywordReservedListByDeleteCampaign({ commit, state }, { shortcode, keyword }) {
    let positionObj
    let position
    let array
    let falseArray
    let addArray
    let cutArray
    
    positionObj = state.keywordReservedList.find(k => k.shortcode === shortcode)
    position = state.keywordReservedList.indexOf(positionObj)
    
    array = state.keywordReservedList[position].keywordsArray.slice()
    falseArray = state.keywordReservedList[position].keywordsFalseArray.slice()

    if(typeof keyword === 'string') {
  
      cutArray = array.filter(cutkey => cutkey !== keyword)
      addArray = falseArray.push(keyword)

    } else {

      keyword.forEach(key => {

        cutArray = array.filter(cutkey => cutkey !== key)
        addArray = falseArray.push(key)

      })
    }

    commit('setElementKeywordReservedByCreateCampaign', {
      position: position,
      payloadCreate: cutArray,
      payloadReserved: addArray
    })


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
  updatedKeywordReservedByDeleteCampaign({ commit, dispatch }, { shortcode, keyword }) {

    let keywordRef = firestoreApp.collection('campaignKeywordReserved').doc(`${shortcode}`)

    let updateObj = {}

    if (typeof keyword === 'string') {
      updateObj = {
        [`keywords.${keyword}`]: true
      }
    } else if (typeof keyword === 'undefined') {
      // passed away
    }  else {
      keyword.forEach(key => {
        updateObj[`keywords.${key}`] = true
      })
    }

    return keywordRef
      .update(updateObj)
      .then(() => {

        // dispatch('mutateKeywordReservedListByDeleteCampaign', {
        //   shortcode: shortcode,
        //   keyword: keyword
        // })
        dispatch('getKeywordsReservedFromFirestore')

        console.log(`Delete Keyword Byshortcode!`);
        sendSuccessNotice(commit, 'Keyword reserved has been updated.')
        closeNotice(commit, 1500)
        return `yes`
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'Keyword reserved update failed! Please try again later. ')
        closeNotice(commit, 1500)
        return error
      })

  },
  editSenderName({ commit }, { shortcode, senderArray }) {

    return firestoreApp
      .collection('shortcodeConfig')
      .doc(`${shortcode}`)
      .update({
        sendername: senderArray
      })
      .then(() => {
        sendSuccessNotice(commit, 'SenderName has been edited.')
        closeNotice(commit, 1500)
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'SenderName save failed! Please try again later. ')
        closeNotice(commit, 1500)
        return error
      })
  },
  // ===
  // DELETE Zone
  // ===
  deleteOperatorConfig({ commit }, { shortcode, operator }) {

    return firestoreApp
      .collection('shortcodeConfig')
      .doc(`${shortcode}`)
      .collection('operator')
      .doc(`${operator}`)
      .delete()
      .then(() => {

        console.log(`Delete Operator Config`);
        sendSuccessNotice(commit, 'OperatorConfig has been deleted.')
        closeNotice(commit, 1500)
        return `yes`
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'Operation Config delete failed! Please try again later. ')
        closeNotice(commit, 1500)
        return error
      })
  },
  deleteKeywordByShortcode({ commit, dispatch }, { shortcode, keyword }) {

    let keywordRef = firestoreApp.collection('campaignKeywordByShortcode').doc(`${shortcode}`)

    let updateObj = {}

    if (typeof keyword === 'string') {
      updateObj = {
        [`${keyword}`]: fireStoreFieldValue.delete()
      }
    } else if (typeof keyword === 'undefined') {
      // passed away
    } else {
      keyword.forEach(key => {
        updateObj[`${key}`] = fireStoreFieldValue.delete()
      })
    }

    return keywordRef
      .update(updateObj)
      .then(() => {

        dispatch('updatedKeywordReservedByDeleteCampaign', {
          shortcode: shortcode,
          keyword: keyword
        })

        dispatch('getKeywordsActiveFromFirestore')

        console.log(`Delete Keyword Byshortcode!`);
        sendSuccessNotice(commit, 'Keyword active has been deleted.')
        closeNotice(commit, 1500)
        return `yes`
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'Keyword delete failed! Please try again later. ')
        closeNotice(commit, 1500)
        return error
      })
  },
  deleteKeywordReserved({ commit }, { shortcode, keyword }) {

    let keywordRef = firestoreApp.collection('campaignKeywordReserved').doc(`${shortcode}`)

    return keywordRef
      .update({
          [`keywords.${keyword}`]: fireStoreFieldValue.delete()
      })
      .then(() => {

        console.log(`Delete Keyword Reserved!`);
        sendSuccessNotice(commit, 'Keyword has been deleted.')
        closeNotice(commit, 1500)
        return `yes`
      })
      .catch(error => {
        console.log(error)
        sendErrorNotice(commit, 'Keyword delete failed! Please try again later. ')
        closeNotice(commit, 1500)
        return error
      })
  },
  // ===
  // ETC. Zone
  // ===
}

// ===
// Private helpers
// ===
function adjustKeywordData (rawdata) {
  const arrData = []

  Object.keys(rawdata).forEach((item) => {
    let m = {}
    m['key'] = item
    m['value'] = rawdata[item] // value
    
    arrData.push(m)
  });

  return arrData
}

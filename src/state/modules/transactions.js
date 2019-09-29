import { set } from '@state/helpers'
import $socket from '@/plugins/socket-instance'
import axios from "@utils/aws-api.config"
import assign from 'lodash/assign'

import {
  sendSuccessNotice,
  sendErrorNotice,
  closeNotice,
  commitPagination,
  getDefaultPagination,
} from '@utils/pagination-util'

export const state = {
  isConnected: false,
  stateProduction: 'production',
  stateTest: 'test',
  textRegister: 'register',
  textKeyword: 'keyword',
  textRewards: 'rewards',
  textTotals: 'totals',
  timestampTxTotals: null,
  // Flags Item save to LocalStorage
  flagTotals: 0,
  flagTimestampTxTotals: null,
  // Server Event Variables
  transactionRewards: null,
  transactionTotals: null,
  transactionKeyword: null,
  // Coupons & Verify Code zone
  totalsVerifyCode: '',
  totalsCoupon: '',
  // table & snackbar variables
  items: null,
  pagination: getDefaultPagination(),
  loading: false,
  mode: '',
  snackbar: false,
  notice: '',
}

export const getters = {
  getTransactionTotals: (state) => {
    let cId = state.campaignSelected

    let cacheTransactionTotals = getSavedState(`transactions.${cId}.txTotals`)

    if (state.transactionTotals === cacheTransactionTotals) {
      return state.flagTotals
    } else {
      return state.transactionTotals
    }
  },
  getTransactionKeyword: (state) => state.transactionKeyword,
  getTotalsVerifyCode: (state) => state.totalsVerifyCode,
  getTotalsCoupon: (state) => state.totalsCoupon,
  getTimestampTxTotals: (state) => {
    let cId = state.campaignSelected

    let cacheTxTotals = getSavedState(`transactions.${cId}.timestampTxTotals`)
    console.log(cacheTxTotals)

    if (state.transactionTotals === state.flagTotals) {
      return state.flagTimestampTxTotals
    } else {
      return state.timestampTxTotals
    }
  },
}

export const mutations = {
  setTotalsVerifyCode: set('totalsVerifyCode'),
  setItems: set('items'),
  setPagination: set('pagination'),
  setPage (state, paginationElement) {
    assign(state.pagination, paginationElement)
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
  SOCKET_CONNECT (state) {
    state.isConnected = true
  },
  SOCKET_DISCONNECT (state) {
    state.isConnected = false
  },
  SOCKET_TRANSACTIONREWARDS (state, payload) {
    state.transactionRewards = payload
  },
  SOCKET_TRANSACTIONTOTALS (state, payload) {
    state.transactionTotals = payload
  },
  SOCKET_TRANSACTIONKEYWORD (state, payload) {
    state.transactionKeyword = payload
  },
  setTimestampTxTotals (state, payload) {
    state.timestampTxTotals = payload
  },
  setFlagTotals (state, payload) {
    state.flagTotals = payload
    saveState(`transactions.${state.campaignSelected}.txTotals`, payload)
  },
  setFlagTimeStampTxTotals (state, payload) {
    state.flagTimestampTxTotals = payload
    saveState(`transactions.${state.campaignSelected}.timestampTxTotals`, payload)
  },
  setCampaignSelected (state, payload) {
    state.campaignSelected = payload
  },
}

export const actions = {
  getLastestTransactions ({ commit }, { campaignState, campaignId }) {
    

    return axios.getData(`transaction/${campaignId}/${campaignState}/latest`)
      .then(response => {

        let msg = `Load ${response.data.input.stage} Transactions From Database Success!`
        commitPagination(commit, response.data.output.data)
        sendSuccessNotice(commit, msg)
        closeNotice(commit, 3000)
        commit('setLoading', { loading: false })
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, `Load Failed!`)
        closeNotice(commit, 3000)
      })
  },
  // verify code zone
  putVerifyCodeToRedis({ commit, dispatch }, {campaignId, state, data}) {

    commit('setLoading', { loading: true })
    let file = {
      "filepath": `${data}`
    }

    return axios.putData(`verifycode/${campaignId}/${state}`, file)
      .then(response => {

        let msg = `Put ${response.data.output.totals} codes to ${state} Database`
        sendSuccessNotice(commit, msg)
        closeNotice(commit, 3000)
        commit('setLoading', { loading: false })

        dispatch('getVerifyCodeFromRedis', {
          campaignId: campaignId,
          campaignState: state
        })
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, `Put code to Database Failed!`)
        closeNotice(commit, 3000)
      })
  },
  getVerifyCodeFromRedis({ commit }, { campaignId, campaignState }) {

    commit('setLoading', { loading: true })

    return axios.getData(`verifycode/${campaignId}/${campaignState}/totals`)
      .then(response => {

        commit('setTotalsVerifyCode', response.data.output.totals)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, `Load Code Failed! Please check Connection`)
        closeNotice(commit, 3000)
      })
  },
  delVerifyCodeFromRedis({ commit }, { campaignId, campaignState }) {

    commit('setLoading', { loading: true })
    return axios.deleteData(`verifycode/${campaignId}/${campaignState}/totals`)
      .then(response => {

        commit('setTotalsVerifyCode', 0)
        sendSuccessNotice(commit, `${response.data.output.message}`)
        closeNotice(commit, 3000)
        commit('setLoading', { loading: false })
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, `Put code to Database Failed!`)
        closeNotice(commit, 3000)
      })
  },
  // REGISTER SOCKET IO
  socketRegister ({ state, commit }, { campaignState, campaignId }) {
    
    commit('SOCKET_CONNECT')
    commit('setCampaignSelected', campaignId)
    
    
    if(campaignState === 'test') {
      $socket.emit('register', 'totals', state.stateTest, campaignId);
      $socket.emit('register', 'keyword', state.stateTest, campaignId);
      $socket.emit('register', 'rewards', state.stateTest, campaignId);
    }
    
    if(campaignState === 'production') {
      $socket.emit('register', 'totals', state.stateProduction, campaignId);
      $socket.emit('register', 'keyword', state.stateProduction, campaignId);
      $socket.emit('register', 'rewards', state.stateProduction, campaignId);
    }
  },
  // DE-REGISTER SOCKET IO
  socketUnRegister ({ state, commit }, { campaignState, campaignId }) {

    if(campaignState === 'test') {
      $socket.emit('deregister', 'totals', state.stateTest, campaignId);
      $socket.emit('deregister', 'keyword', state.stateTest, campaignId);
      $socket.emit('deregister', 'rewards', state.stateTest, campaignId);
    }
    
    if(campaignState === 'production') {
      $socket.emit('deregister', 'totals', state.stateProduction, campaignId);
      $socket.emit('deregister', 'keyword', state.stateProduction, campaignId);
      $socket.emit('deregister', 'rewards', state.stateProduction, campaignId);
    }
    removeState(`transactions.${state.campaignSelected}.txTotals`)
    removeState(`transactions.${state.campaignSelected}.timestampTxTotals`)

    commit('SOCKET_DISCONNECT')
  },
  socket_transactionRewards ({ commit }, txData) {
    console.log(`rewards: ${JSON.stringify(txData)}`)
  },
  socket_transactionKeyword ({ commit }, txData) {
    console.log(`keyword: ${JSON.stringify(txData)}`)
  },
  socket_transactionTotals ({ state, commit }, txData, time = new Date()) {
    // Data จะ refresh ทุกครั้ง เมื่อ มี Data ใหม่ และ กด refresh
    console.log(`totals: ${txData} time: ${time}`)

    if (txData === null) {
      commit('setFlagTotals', 0)
      commit('setFlagTimeStampTxTotals', time)
      commit('SOCKET_TRANSACTIONTOTALS', txData)
      commit('setTimestampTxTotals', time)
    }
    if (txData === state.flagTotals) {
      // data hasn't changed
      commit('SOCKET_TRANSACTIONTOTALS', txData)
      commit('setTimestampTxTotals', time)
    }
    if(txData !== state.flagTotals) {
      //  updated when data has changed
      commit('setFlagTotals', txData)
      commit('setFlagTimeStampTxTotals', time)
      commit('SOCKET_TRANSACTIONTOTALS', txData)
      commit('setTimestampTxTotals', time)
    }

  },
  async removeLocalStorageAll ({ dispatch }, data) {
    let removeArr = []
    let campaignsArr = []

    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).substring(0,12) === 'transactions') {
        removeArr.push(localStorage.key(i))

        let arr = localStorage.key(i).split(".")
        campaignsArr.push(arr[1])
      }
    }

    // Iterate over arr and remove the items by key
    removeArr.forEach(i => {
      removeState(i)
    })

    let uniq = [...new Set(campaignsArr)]
    uniq.forEach(value => {
      dispatch('socketUnRegister', {
        campaignState: 'production',
        campaignId: value
      })
    })
  },
  updatePage({ commit }, pageNumber) {
    commit('setPage', { page: pageNumber })
  },
  updatePages({ commit }, pagesNumber) {
    commit('setPage', { pages: pagesNumber })
  },
  updatePagination({ commit }, pagiObj) {
    commit('setPage', pagiObj)
  },
  closeSnackBar ({ commit }, timeout ) {
    closeNotice(commit, timeout)
  },
}

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

function removeState(key) {
  window.localStorage.removeItem(key)
}
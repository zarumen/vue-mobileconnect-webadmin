import { set } from '@state/helpers'
import firestoreApp from '@utils/firestore.config'
import $socket from '@/plugins/socket-instance'
import axios from '@utils/aws-api.config'
import assign from 'lodash/assign'

import {
  sendSuccessNotice,
  sendErrorNotice,
  closeNotice,
  commitPagination,
  getDefaultPagination
} from '@utils/pagination-util'

export const state = {
  isConnected: false,
  stateProduction: 'production',
  stateTest: 'test',
  textRegister: 'register',
  textKeyword: 'keyword',
  textRewards: 'rewards',
  textTotals: 'totals',
  textSuccess: 'success',
  textRewardPercent: 'rewardspercentage',
  timestampTxTotals: null,
  // Flags Item save to LocalStorage
  flagTotals: 0,
  flagTimestampTxTotals: null,
  // Server Event Variables
  transactionRewards: null,
  transactionTotals: null,
  transactionKeyword: null,
  transactionSuccess: null,
  rewardsPercentage: null,
  // Coupons & Verify Code zone
  checkVerifyCode: '',
  listCoupons: [],
  totalsVerifyCode: '',
  totalsCoupon: 0,
  // table & snackbar variables
  items: [],
  pagination: getDefaultPagination(),
  loading: false,
  mode: '',
  snackbar: false,
  notice: '',
  // header table Config
  headerConfig: []
}

export const getters = {
  hadItems: (state) => !!state.items && state.items.length > 0,
  hadHeaderConfig: (state) => !!state.headerConfig && state.headerConfig.length > 0,
  getHeaderConfigArray: (state) => state.headerConfig,
  getTransactionTotals: (state) => {
    const cId = state.campaignSelected

    const cacheTransactionTotals = getSavedState(`transactions.${cId}.txTotals`)

    if (state.transactionTotals === cacheTransactionTotals) {
      return state.flagTotals
    } else {
      return state.transactionTotals
    }
  },
  getTransactionSuccess: (state) => state.transactionSuccess,
  getTransactionKeyword: (state) => state.transactionKeyword,
  getCheckVerifyCode: (state) => state.checkVerifyCode,
  getTotalsVerifyCode: (state) => state.totalsVerifyCode,
  getTotalsCoupon: (state) => state.totalsCoupon,
  getListCoupons: (state) => state.listCoupons,
  getTimestampTxTotals: (state) => {
    if (state.transactionTotals === state.flagTotals) {
      return state.flagTimestampTxTotals
    } else {
      return state.timestampTxTotals
    }
  }
}

export const mutations = {
  setTotalsVerifyCode: set('totalsVerifyCode'),
  setCheckVerifyCode: set('checkVerifyCode'),
  setListCoupons: set('listCoupons'),
  setTotalsCoupon: set('totalsCoupon'),
  setItems: set('items'),
  setPagination: set('pagination'),
  setHeaderConfig: set('headerConfig'),
  setElementHeaderConfig (state, { position, payload }) {
    const a = { text: payload }
    assign(state.headerConfig[position], a)
  },
  setPage (state, paginationElement) {
    assign(state.pagination, paginationElement)
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
  SOCKET_TRANSACTIONSUCCESS (state, payload) {
    state.transactionSuccess = payload
  },
  SOCKET_REWARDPERCENTAGE (state, payload) {
    state.rewardsPercentage = payload
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
  }
}

export const actions = {
  // header config zone
  saveHeaderConfig ({ commit }, { campaignId, headerArray }) {
    const dataSave = headerArray
      .reduce((map, obj) => {
        map[obj.text] = obj.value
        return map
      }, {})

    return firestoreApp
      .collection('headerConfig')
      .doc(campaignId)
      .set(dataSave)
      .then(() => {
        commit('setHeaderConfig', headerArray)
        return headerArray
      })
      .catch(error => {
        console.log(error)
        return error
      })
  },
  getHeaderConfig ({ commit }, { campaignId }) {
    return firestoreApp
      .collection('headerConfig')
      .doc(campaignId)
      .get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data()

          const arrayConverted = Object.entries(data)
            .map((element) => {
              const a = {}
              a.text = `${element[0]}`
              a.value = `${element[1]}`
              return a
            })

          commit('setHeaderConfig', arrayConverted)
        } else {
        // doc.data() will be undefined in this case
          console.log('No such document!')
          commit('setHeaderConfig', [])
        }
      })
      .catch(error => {
        console.log(error)
        return error
      })
  },
  // transactions Zone
  getLastestTransactions ({ commit }, { campaignState, campaignId }) {
    return axios.getData(`transaction/${campaignId}/${campaignState}/latest`)
      .then(response => {
        const msg = `Load ${response.data.input.stage} Transactions From Database Success!`
        commitPagination(commit, response.data.output.data)
        sendSuccessNotice(commit, msg)
        closeNotice(commit, 3000)
        commit('setLoading', { loading: false })
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Load Failed!')
        closeNotice(commit, 3000)
      })
  },
  getSearchMsisdn ({ commit }, { admin, msisdn, jwtToken, campaignId, microsite }) {
    let queryString = `?JWTToken=${jwtToken}`

    if (!admin) {
      queryString += `&campaignid=${campaignId}`
    }

    if (microsite) {
      queryString += '&campaignType=microsite'
    }

    return axios.getData(`transaction/msisdn/${msisdn}/${queryString}`)
      .then(response => {
        console.log(response)
        const msg = `Load ${response.data.input.msisdn} Transactions From Database Success!`
        commitPagination(commit, response.data.output.data)
        sendSuccessNotice(commit, msg)
        closeNotice(commit, 3000)
        commit('setLoading', { loading: false })
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Load Failed!')
        closeNotice(commit, 3000)
      })
  },
  getSearchCampaignID ({ commit }, { message, msisdn, jwtToken, campaignId }) {
    console.log(campaignId)
    let queryString = `?JWTToken=${jwtToken}`

    if (msisdn !== '') {
      queryString += `&msisdn=${msisdn}`
    }
    if (message !== '') {
      queryString += `&message=${message}`
    }

    console.log(queryString)

    return axios.getData(`transaction/campaignID/${campaignId}/${queryString}`)
      .then(response => {
        const msg = `Load ${response.data.input.campaignId} Transactions From Database Success!`
        commitPagination(commit, response.data.output.data)
        sendSuccessNotice(commit, msg)
        closeNotice(commit, 3000)
        commit('setLoading', { loading: false })
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Load Failed!')
        closeNotice(commit, 3000)
      })
  },
  // coupon code zone
  postCouponsToRedis ({ commit, dispatch }, { campaignId, state, data, rewardId }) {
    commit('setLoading', { loading: true })
    const file = {
      couponcode: `${data}`
    }

    return axios.postData(`coupons/${campaignId}/${state}/${rewardId}`, file)
      .then(response => {
        const msg = `Post New Coupon to ${state} Database`
        sendSuccessNotice(commit, msg)
        closeNotice(commit, 3000)
        commit('setLoading', { loading: false })

        dispatch('getCouponsFromRedis', {
          campaignId: campaignId,
          campaignState: state,
          rewardId: rewardId
        })
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Put code to Database Failed!')
        closeNotice(commit, 3000)
      })
  },
  putCouponsToRedis ({ commit, dispatch }, { campaignId, state, data, rewardId }) {
    commit('setLoading', { loading: true })
    const file = {
      filepath: `${data}`
    }

    return axios.putData(`coupons/${campaignId}/${state}/${rewardId}`, file)
      .then(response => {
        const msg = `Put ${response.data.output.totals} codes to ${state} Database`
        sendSuccessNotice(commit, msg)
        closeNotice(commit, 3000)
        commit('setLoading', { loading: false })

        dispatch('getCouponsFromRedis', {
          campaignId: campaignId,
          campaignState: state,
          rewardId: rewardId
        })
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Put code to Database Failed!')
        closeNotice(commit, 3000)
      })
  },
  searchCouponsFromRedis ({ commit }, { campaignId, campaignState, rewardId, startAt, limit }) {
    commit('setLoading', { loading: true })

    return axios.getData(`coupons/${campaignId}/${campaignState}/${rewardId}?start=${startAt}&length=${limit}`)
      .then(response => {
        commit('setListCoupons', response.data.output.data)
        commit('setLoading', { loading: false })
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Load Code Failed! Please check Connection')
        closeNotice(commit, 3000)
      })
  },
  getCouponsFromRedis ({ commit }, { campaignId, campaignState, rewardId }) {
    commit('setLoading', { loading: true })

    return axios.getData(`coupons/${campaignId}/${campaignState}/${rewardId}/totals`)
      .then(response => {
        commit('setTotalsCoupon', response.data.data)
        commit('setLoading', { loading: false })
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Load Code Failed! Please check Connection')
        closeNotice(commit, 3000)
      })
  },
  delCouponsFromRedis ({ commit }, { campaignId, campaignState, rewardId }) {
    commit('setLoading', { loading: true })

    return axios.deleteData(`coupons/${campaignId}/${campaignState}/${rewardId}/totals`)
      .then(response => {
        commit('setTotalsCoupon', 0)
        sendSuccessNotice(commit, `${response.data.data}`)
        closeNotice(commit, 3000)
        commit('setLoading', { loading: false })
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Put code to Database Failed!')
        closeNotice(commit, 3000)
      })
  },
  // verify code zone
  postOneVerfyCodeToRedis ({ commit, dispatch }, { campaignId, state, data }) {
    const body = {
      verifycode: `${data}`
    }

    return new Promise((resolve, reject) => {
      axios.postData(`verifycode/${campaignId}/${state}`, body)
        .then(response => {
          const msg = `Post code to ${state} Database`
          sendSuccessNotice(commit, msg)
          closeNotice(commit, 3000)
          commit('setLoading', { loading: false })
          resolve('done')

          dispatch('getVerifyCodeFromRedis', {
            campaignId: campaignId,
            campaignState: state
          })
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', { loading: false })
          sendErrorNotice(commit, 'Post code to Database Failed!')
          closeNotice(commit, 3000)
          reject(new Error('error'))
        })
    })
  },
  putVerifyCodeToRedis ({ commit, dispatch }, { campaignId, state, data }) {
    commit('setLoading', { loading: true })
    const file = {
      filepath: `${data}`
    }

    return axios.putData(`verifycode/${campaignId}/${state}`, file)
      .then(response => {
        const msg = `Put ${response.data.output.totals} codes to ${state} Database`
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
        sendErrorNotice(commit, 'Put code to Database Failed!')
        closeNotice(commit, 3000)
      })
  },
  searchVerifyCodeFromRedis ({ commit }, { campaignId, campaignState, data }) {
    console.log('flag search')
    commit('setLoading', { loading: true })

    return axios.getData(`verifycode/${campaignId}/${campaignState}?verifycode=${data}`)
      .then(response => {
        commit('setCheckVerifyCode', response.data.output.data)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Load Code Failed! Please check Connection')
        closeNotice(commit, 3000)
      })
  },
  getVerifyCodeFromRedis ({ commit }, { campaignId, campaignState }) {
    commit('setLoading', { loading: true })

    return axios.getData(`verifycode/${campaignId}/${campaignState}/totals`)
      .then(response => {
        commit('setTotalsVerifyCode', response.data.output.totals)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', { loading: false })
        sendErrorNotice(commit, 'Load Code Failed! Please check Connection')
        closeNotice(commit, 3000)
      })
  },
  delVerifyCodeFromRedis ({ commit }, { campaignId, campaignState }) {
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
        sendErrorNotice(commit, 'Put code to Database Failed!')
        closeNotice(commit, 3000)
      })
  },
  // REGISTER SOCKET IO
  socketRegister ({ state, commit }, { campaignState, campaignId }) {
    commit('SOCKET_CONNECT')
    commit('setCampaignSelected', campaignId)

    if (campaignState === 'test') {
      $socket.emit('register', state.textTotals, state.stateTest, campaignId)
      $socket.emit('register', state.textKeyword, state.stateTest, campaignId)
      $socket.emit('register', state.textRewards, state.stateTest, campaignId)
      $socket.emit('register', state.textSuccess, state.stateTest, campaignId)
      $socket.emit('register', state.textRewardPercent, state.stateTest, campaignId)
    }

    if (campaignState === 'production') {
      $socket.emit('register', state.textTotals, state.stateProduction, campaignId)
      $socket.emit('register', state.textKeyword, state.stateProduction, campaignId)
      $socket.emit('register', state.textRewards, state.stateProduction, campaignId)
      $socket.emit('register', state.textSuccess, state.stateProduction, campaignId)
      $socket.emit('register', state.textRewardPercent, state.stateProduction, campaignId)
    }
  },
  // DE-REGISTER SOCKET IO
  socketUnRegister ({ state, commit }, { campaignState, campaignId }) {
    if (campaignState === 'test') {
      $socket.emit('deregister', state.textTotals, state.stateTest, campaignId)
      $socket.emit('deregister', state.textKeyword, state.stateTest, campaignId)
      $socket.emit('deregister', state.textRewards, state.stateTest, campaignId)
      $socket.emit('deregister', state.textSuccess, state.stateTest, campaignId)
      $socket.emit('deregister', state.textRewardPercent, state.stateTest, campaignId)
    }

    if (campaignState === 'production') {
      $socket.emit('deregister', state.textTotals, state.stateProduction, campaignId)
      $socket.emit('deregister', state.textKeyword, state.stateProduction, campaignId)
      $socket.emit('deregister', state.textRewards, state.stateProduction, campaignId)
      $socket.emit('deregister', state.textSuccess, state.stateProduction, campaignId)
      $socket.emit('deregister', state.textRewardPercent, state.stateProduction, campaignId)
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
    if (txData !== state.flagTotals) {
      //  updated when data has changed
      commit('setFlagTotals', txData)
      commit('setFlagTimeStampTxTotals', time)
      commit('SOCKET_TRANSACTIONTOTALS', txData)
      commit('setTimestampTxTotals', time)
    }
  },
  resetTable ({ commit }) {
    commit('setItems', [])
    commit('setPagination', getDefaultPagination())
  },
  async removeLocalStorageAll ({ dispatch }, data) {
    const removeArr = []
    const campaignsArr = []

    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).substring(0, 12) === 'transactions') {
        removeArr.push(localStorage.key(i))

        const arr = localStorage.key(i).split('.')
        campaignsArr.push(arr[1])
      }
    }

    // Iterate over arr and remove the items by key
    removeArr.forEach(i => {
      removeState(i)
    })

    const uniq = [...new Set(campaignsArr)]
    uniq.forEach(value => {
      dispatch('socketUnRegister', {
        campaignState: 'production',
        campaignId: value
      })
    })
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
  closeSnackBar ({ commit }, timeout) {
    closeNotice(commit, timeout)
  }
}

function getSavedState (key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState (key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

function removeState (key) {
  window.localStorage.removeItem(key)
}

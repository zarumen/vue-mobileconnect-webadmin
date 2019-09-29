import { fireStorageApp } from '@utils/firestorage.config'
import { set } from '@state/helpers'

var storageRef = fireStorageApp.ref()

export const state = {
  couponTree: [],
  verifyCodeTree: [] 
}

export const getters = {}

export const mutations = {
  setCouponTree: set('couponTree'),
  setVerifyCodeTree: set('verifyCodeTree')
}

export const actions = {
  uploadFile ({ dispatch }, { fileUrl, path }) {

    let ref = storageRef.child(`${path}`)

    return ref.putString(fileUrl, 'data_url')
      .then(snapshot => {
        console.log('Uploaded a data_url string!', snapshot)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  deleteUploadFile ({ dispatch }, { path }) {

    let ref = storageRef.child(`${path}`)

    return ref.delete()
      .then(() => {
        console.log('Delete a file!')
        // if(path.includes('verifyCodeFile')) {
        //   dispatch('fetchVerifyCode', {
        //     campaignId: id
        //   })
        // } else {
        //   dispatch('fetchCoupons', {
        //     campaignId: id
        //   })
        // }
      })
      .catch((error) => {
        console.log(error)
      })
  },
  async fetchCoupons ({ commit }, { campaignId }) {
    
    let couponTRef = storageRef.child(`campaigns/${campaignId}/couponsFile/test/`)
    let couponPRef = storageRef.child(`campaigns/${campaignId}/couponsFile/production/`)

    try {
      var firstPage = await couponTRef.listAll()
      var addFirstPage = await couponPRef.listAll()
    } catch (error) { 
      console.log(error)
      return Promise.reject(new Error(error))
    }

    const a = []
    firstPage.items.forEach((itemRef, index) => {
      // All the items under listRef.
      console.log('item =>', itemRef)
      let result = {
        id: `test${index}`,
        type: 'test',
        name: itemRef.name,
        fullPath: itemRef.fullPath
      }
      a.push(result)
    })
    addFirstPage.items.forEach((itemRef, index) => {
      // All the items under listRef.
      console.log('item =>', itemRef)
      let result = {
        id: `production${index}`,
        type: 'production',
        name: itemRef.name,
        fullPath: itemRef.fullPath
      }
      a.push(result)
    })

    return Promise.resolve(a)
  },
  async fetchVerifyCode ({ commit }, { campaignId }) {

    let verifyCodeTRef = storageRef.child(`campaigns/${campaignId}/verifyCodeFile/test/`)
    let verifyCodePRef = storageRef.child(`campaigns/${campaignId}/verifyCodeFile/production/`)

    try {
      var test = await verifyCodeTRef.listAll()
      var production = await verifyCodePRef.listAll()
    } catch (error) { 
      console.log(error)
      return Promise.reject(new Error(error))
    }

    const arr = []
    test.items.forEach((itemRef, index) => {
      // All the items under listRef.
      console.log('item =>', itemRef)
      let result = {
        id: `test${index}`,
        type: 'test',
        name: itemRef.name,
        fullPath: itemRef.fullPath
      }
      arr.push(result)
    })
    production.items.forEach((itemRef, index) => {
      // All the items under listRef.
      console.log('item =>', itemRef)
      let result = {
        id: `production${index}`,
        type: 'production',
        name: itemRef.name,
        fullPath: itemRef.fullPath
      }
      arr.push(result)
    })
    
    return Promise.resolve(arr)
  },
}



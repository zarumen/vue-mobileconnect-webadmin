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
  uploadFile ({ commit }, { fileUrl, path }) {

    let ref = storageRef.child(`${path}`)

    return ref.putString(fileUrl, 'data_url')
      .then(snapshot => {
        console.log('Uploaded a data_url string!', snapshot)
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
    firstPage.items.forEach((itemRef) => {
      // All the items under listRef.
      console.log('item =>', itemRef)
      let result = {
        type: 'test',
        name: itemRef.name,
        fullPath: itemRef.fullPath
      }
      a.push(result)
    })
    addFirstPage.items.forEach((itemRef) => {
      // All the items under listRef.
      console.log('item =>', itemRef)
      let result = {
        type: 'production',
        name: itemRef.name,
        fullPath: itemRef.fullPath
      }
      a.push(result)
    })

    return Promise.resolve(a)

    // await couponRef.listAll().then((res) => {
    //     res.prefixes.forEach((folderRef) => {
    //       console.log('folder =>', folderRef)
    //     })
    //     res.items.forEach((itemRef) => {
    //       // All the items under listRef.
    //       console.log('item =>', itemRef)
    //     })
    //     return res
    //   }).catch((error) => {
    //     // Uh-oh, an error occurred!
    //     console.log(error)
    //     return error
    //   })
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
    test.items.forEach((itemRef) => {
      // All the items under listRef.
      console.log('item =>', itemRef)
      let result = {
        type: 'test',
        name: itemRef.name,
        fullPath: itemRef.fullPath
      }
      arr.push(result)
    })
    production.items.forEach((itemRef) => {
      // All the items under listRef.
      console.log('item =>', itemRef)
      let result = {
        type: 'production',
        name: itemRef.name,
        fullPath: itemRef.fullPath
      }
      arr.push(result)
    })
    
    return Promise.resolve(arr)
  },
}



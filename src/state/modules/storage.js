import { fireStorageApp } from '@utils/firestorage.config'

var storageRef = fireStorageApp.ref()

export const state = {}

export const getters = {}

export const mutations = {}

export const actions = {
  uploadFile ({ commit }, { campaignId, imgUrl }) {

    let ref = storageRef.child(`campaigns/${campaignId}`)

    return ref.putString(imgUrl, 'data_url')
      .then(snapshot => {
        console.log('Uploaded a data_url string!', snapshot)
    })
  }
}

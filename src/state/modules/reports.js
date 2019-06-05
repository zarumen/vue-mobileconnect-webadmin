// import firebase from '@firebase/app'
// import '@firebase/firestore'
// import { mapActions } from 'vuex'
import { set } from '@state/helpers'
import axios from "@utils/aws-api.config"
import firestoreApp from "@utils/firestore.config"

export const state = {
  campaignSelected: {},
  jobList: [],
  fileName: '',
  maxFile: 50,
  maxRow: 10000,
  exportType: 'XLSX',
  prefixFile: '',
  startAfter: '',
  downloadKey: '',
  downloadUrl: ''
}

export const getters = {

}

export const mutations = {
  setCampaignSelected: set('campaignSelected'),
  setJobList: set('jobList')
}

export const actions = {
  // ===
  // CREATE Zone
  // ===
  async createS3DownloadFileJob ({ state, dispatch }, { campaignId, fileName }) {

    let data = {
      "maxRow": state.maxRow,
      "exportType": state.exportType,
      "fileName": fileName
    }

  return  axios.postData(`jobs/${campaignId}/export`, data)
    .then(response => {
      // JSON responses are automatically parsed.
      let parsedData = response.data

      console.log('create file: ', parsedData.output.S3FileName)

      let exportJobObject = {
        'campaignId': campaignId,
        'jobsCount': 0
      }

      dispatch('saveCampaignObjectToFirestore', {
        campaignId: campaignId,
        jobObject: exportJobObject
      })

      dispatch('getFileDownloadFromS3', {
        campaignId: campaignId,
        fileName: parsedData.output.S3FileName
      })
    })
    .catch(error => {
      console.log(error)
    })
  },
  async saveCampaignObjectToFirestore ({ commit }, { campaignId, jobObject }) {

    return firestoreApp
      .collection('exportJobs')
      .doc(campaignId)
      .set(jobObject, { merge: true })
      .then(() => {
        // TODO: send Snackbar to Views
        console.log('create Object ExportsJob done!')
      })
      .catch(error => {
        console.log(error)
      })
  },
  // ===
  // READ Zone
  // ===
  getFileDownloadFromS3({ commit }, { campaignId, fileName }) {

    return axios.getData(`jobs/${campaignId}/download?downloadKey=${fileName}`)
      .then(response => {

        let data = response.data
        console.log(response.data.output.link)

        // Download file to Client
        // window.location = data.output.link
        return data.output.link
      })
      .catch(e => console.log(e))
  },
  async getCampaignExportJobsListener({ commit }, { campaignId }) {

    return firestoreApp
      .collection('exportJobs')
      .doc(campaignId)
      .collection('jobs')
      .orderBy('createTime', 'desc')
      .limit(10)
      .get()
      .then((snap) => {

        let jobList = []
        console.log(snap.size)

        snap.forEach(doc => {
          let data = {}
          data = doc.data()
          jobList.push(data)
        })

        commit('setJobList', jobList)
        return jobList
      })
      .catch(error => {
        console.log(error)
        return error
      })
  },
  // ===
  // UPDATE Zone
  // ===
  // ===
  // DELETE Zone
  // ===
}

// ===
// Private helpers
// ===

// function getserverTimestamp() {
//   return firebase.firestore.FieldValue.serverTimestamp()
// }

import { set } from '@state/helpers'
import axios from "@utils/aws-api.config"
import firestoreApp from "@utils/firestore.config"

export const state = {
  campaignSelected: '',
  jobList: [],
  fileName: '',
  maxFile: 50,
  maxRow: 100000,
  exportType: 'XLSX',
  prefixFile: '',
  startAfter: '',
  downloadKey: '',
  downloadUrl: '',
  // Coupons & Verify Code zone
  totalsVerifyCode: 0,
  totalsCoupon: 0,
  
}

export const getters = {
  getCampaignSelected: (state) => state.campaignSelected
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

      setTimeout(() => {
        // delayed function set in 3 seconds
        dispatch('getFileDownloadFromS3', {
          campaignId: campaignId,
          fileName: parsedData.output.S3FileName
        })
      }, 3000)
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
  getFileDownloadFromS3({ dispatch }, { campaignId, fileName }) {

    let key = `reports/campaigns/${campaignId}/${fileName}`

    return axios.getData(`jobs/${campaignId}/download?downloadKey=${key}`)
      .then(response => {

        let data = response.data.output.link
        dispatch('campaigns/setLoadingFromAnotherModule', false, { root: true })
        // Download file to Client
        window.location = data
        // forceFileDownload(response)
        // refresh List Report Management
        dispatch('getCampaignExportJobsListener', {
          campaignId: campaignId
        })

        return data
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
        commit('setCampaignSelected', campaignId)
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

// function forceFileDownload (response) {
//   const url = window.URL.createObjectURL(new Blob([response.data.output.link]))
//   const link = document.createElement('a')
//   link.href = url
//   // link.setAttribute('download', 'reports.zip') // or any other extension
//   document.body.appendChild(link)
//   link.click()
// }

// function to(promise) {
//   return promise.then(data => {
//      return {
//        error: null,
//        result: data
//      }
//   })
//   .catch(err => {
//     return {
//       error: err
//     }
//   })
// }

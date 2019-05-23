import firebase from '@firebase/app'
import '@firebase/firestore'
// import { mapActions } from 'vuex'
import axios from "@utils/aws-api.config"
import firestoreApp from "@utils/firestore.config"

export const state = {

  jobList: [],
  maxRow: 100000,
  type: 'XLSX',
  maxFile: 100,

}

export const getters = {

}

export const mutations = {}

export const actions = {
  // ===
  // CREATE Zone
  // ===
  async createExportJob ({ state, commit }, { campaignId, fileName }) {

    let data = {
      "maxRow": state.maxRow,
      "exportType": state.type,
      "fileName": fileName
    }

  return  axios.postData(`jobs/${campaignId}/export`, data)
    .then(response => {
      // JSON responses are automatically parsed.
      let parsedData = response.data

      let exportJobObject = {
        'fileName': parsedData.output.S3FileName,
        'type': state.type,
        'createTime': getserverTimestamp()
      }

      this.saveJobObjectToFirestore({
        campaignId: campaignId,
        jobObject: exportJobObject
      })
    })
    .catch(error => {
      console.log(error)
    })
  },
  async saveJobObjectToFirestore ({ commit }, { campaignId, jobObject }) {


    return firestoreApp
      .collection('exportJobs')
      .doc(campaignId)
      .collection('jobs')
      .add(jobObject)
      .then(() => {

      })
      .catch(error => {
        console.log(error)
      })
  },
  // ===
  // READ Zone
  // ===

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

function getserverTimestamp() {
  return firebase.firestore.FieldValue.serverTimestamp()
}

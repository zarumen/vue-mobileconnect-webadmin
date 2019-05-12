import { firebaseApp } from './firebase.config'

// firebaseApp.firestore().settings({ timestampsInSnapshots: true })

export default firebaseApp.firestore()

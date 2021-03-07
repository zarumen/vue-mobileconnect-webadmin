import { firebaseApp } from './firebase.config'

// ===
// Private helpers
// ===

const getserverTimestamp = () => {
  return firebaseApp.firestore.FieldValue.serverTimestamp()
}

export default getserverTimestamp

export const fireStoreFieldValue = firebaseApp.firestore.FieldValue

import firebase from 'firebase/app'

// ===
// Private helpers
// ===

const getserverTimestamp = () => {
  return firebase.firestore.FieldValue.serverTimestamp()
}

export default getserverTimestamp

export const fireStoreFieldValue = firebase.firestore.FieldValue

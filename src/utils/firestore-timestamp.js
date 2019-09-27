import * as firebase from 'firebase/app'
import 'firebase/firestore'

// ===
// Private helpers
// ===

const getserverTimestamp = () => {
  return firebase.firestore.FieldValue.serverTimestamp()
}

export default getserverTimestamp

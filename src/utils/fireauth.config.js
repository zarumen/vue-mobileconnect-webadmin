import { firebaseApp } from './firebase.config'

export default firebaseApp.auth()

export const getJwtToken = new Promise((resolve, reject) => {
  return firebaseApp.auth().onAuthStateChanged(async (user) => {
    let token = await user.getIdToken()
    if (user) {
      return resolve(token)
    } else {
      // No user is signed in.
      return resolve(null)
    }
  })
})

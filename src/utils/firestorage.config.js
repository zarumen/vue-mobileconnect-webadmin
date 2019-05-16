import { firebaseApp } from './firebase.config'
import '@firebase/storage'

export const fireStorageApp = firebaseApp.storage()

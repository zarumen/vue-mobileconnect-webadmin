import { firebaseApp } from './firebase.config'
import 'firebase/performance'

export const firebasePref = firebaseApp.performance()

import { doc, setDoc } from 'firebase/firestore'
import { db } from './config'

const APP_PASSWORD_DOC_ID = 'app_password'
const APP_PASSWORD = "spiski_Kati22!!!"

export const setupAppPassword = async () => {
  try {
    await setDoc(doc(db, 'config', APP_PASSWORD_DOC_ID), {
      value: APP_PASSWORD
    })
    console.log('App password has been set successfully')
  } catch (error) {
    console.error('Error setting app password:', error)
  }
} 

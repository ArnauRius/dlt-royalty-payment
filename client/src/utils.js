/* This script is used to be able to reuse some functions used frequently in the application */

import { createHash } from 'crypto'

/**
 * Checks if the input string is a valid formatted email.
 * Returns a boolean to define if the email is valid or not
 * @param email
 * @return bool
 */
const checkValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

/**
 * Returns the sha512 hashed version of the input string
 * @param str - Input to hash
 */
const hash = (str) => createHash('sha512').update(str).digest('hex')

/**
 * Checks if the input key is a valid 64 length hex string.
 * Returns a boolean to define is the key is valid or not.
 * @param key
 * @return bool
 */
const checkValidKey = (key) => key.match('^[A-Fa-f0-9]{64}$')

/**
 * Reads a provided file and returns its content, or throws an error.
 * @param file - The path to the file to read
 * @returns {Promise<any>}
 */
const readFile = (file) => {
  return new Promise((resolve, reject) => {
    if(file) {
      let fileReader = new FileReader()
      fileReader.readAsText(file, "UTF-8")
      fileReader.onload = (event) => {
        resolve(event.target.result)
      }

      fileReader.onerror = (event) => {
        reject("There was an error reading the file.")
      }
    }else{
      reject("Please, introduce a valid file.")
    }
  })
}

/**
 * Given an encrypted key, using the user account as a symmetric key, tries to decrypt it.
 * Throws an error if it can not be decrypted.
 * @param encryptedKey - The encrypted key
 * @param email - The email that will be used to decrypt the key
 * @returns {Promise<any>}
 */
const decryptKey = (encryptedKey, email) => {
  return new Promise((resolve, reject) => {
    let decryptedKey = CryptoJS.AES.decrypt(encryptedKey, email).toString(CryptoJS.enc.Utf8)
    if(decryptedKey){
      resolve(decryptedKey)
    }else{
      reject("This key does not correspond to the current account. Please, introduce the valid key for this account.")
    }
  })
}


export default {
  checkValidEmail,
  hash,
  checkValidKey,
  readFile,
  decryptKey
}

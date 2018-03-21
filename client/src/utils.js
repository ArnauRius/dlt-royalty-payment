/* This is script is used to be able to reuse some functions used frequently in the application */

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


export default {
  checkValidEmail,
  hash,
  checkValidKey
}

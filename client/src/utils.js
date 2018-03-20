/* This is script is used to be able to reuse some functions used frequently in the application */

/**
 * Checks if the input string is a valid formatted email.
 * Returns a boolean to define if the email is valid or not
 * @return bool
 */
const checkValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export default {
  checkValidEmail
}

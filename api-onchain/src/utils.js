/* This script is used to be able to reuse some functions used frequently in the application */

import { createHash } from 'crypto'

/**
 * Returns the sha512 hashed version of the input string
 * @param str - Input to hash
 */
const hash = (str) => createHash('sha512').update(str).digest('hex')


export default {
    hash,
}

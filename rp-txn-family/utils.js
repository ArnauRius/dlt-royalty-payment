/* In this file, some utilities used for the transaction family are defined */

const crypto = require('crypto')

const hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase()

module.exports = {
    hash
}
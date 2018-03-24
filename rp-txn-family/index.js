/* In this file, the configuration for the Royalty Payment Transaction Family is defined */

const crypto = require('crypto')

const FAMILY_NAME = 'royalty-payment'

const FAMILY_NAMESPACE = crypto.createHash('sha512').update(FAMILY_NAME).digest('hex').toLowerCase().substring(0, 6)

const FAMILY_VERSION = '1.0'

module.exports = {
    FAMILY_NAME,
    FAMILY_NAMESPACE,
    FAMILY_VERSION,
}
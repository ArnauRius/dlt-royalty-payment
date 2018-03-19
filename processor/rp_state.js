const crypto = require('crypto')


const _hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase()

const FAMILY = 'rp'
const NAMESPACE = _hash(FAMILY).substring(0, 6)

module.exports = {
    FAMILY,
    NAMESPACE
}
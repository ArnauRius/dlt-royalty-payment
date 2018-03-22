/* In this file, some utilities used for the processor are defined */

import crypto from 'crypto'

const hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase()

export default {
    hash
}
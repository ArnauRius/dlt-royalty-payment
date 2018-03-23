/* In this file, some constants used for the processor are defined */

import utils from './utils'

const FAMILY_NAME = 'royalty-payment'

const FAMILY_NAMESPACE = utils.hash(FAMILY_NAME).substring(0, 6)

const FAMILY_VERSION = '1.0'

const VALIDATOR_URL = 'tcp://localhost:4004'



export {
    FAMILY_NAME,
    FAMILY_NAMESPACE,
    FAMILY_VERSION,
    VALIDATOR_URL
}
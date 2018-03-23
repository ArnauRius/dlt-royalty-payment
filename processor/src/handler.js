/* In this file, the transaction handler is defined */

// Sawtooth imports
import { TransactionHandler } from 'sawtooth-sdk/processor/handler'
import { InvalidTransaction } from 'sawtooth-sdk/processor/exceptions'
import { TransactionHeader } from 'sawtooth-sdk/protobuf'

// Constants imports
import { FAMILY_NAME, FAMILY_NAMESPACE, FAMILY_VERSION } from "./constants";

// Royalty Payment Transaction Handler
class RPHandler extends TransactionHandler {
    constructor () {
        console.log('Initializing RP handler')
        super(FAMILY_NAME, [FAMILY_VERSION], [FAMILY_NAMESPACE])
    }

    apply (txn, state) {
        console.log("Initialized and calling")
    }
}

export default {
    RPHandler
}
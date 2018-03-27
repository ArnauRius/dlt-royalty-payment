/* In this file, the transaction handler is defined */

// Sawtooth imports
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
const { TransactionHeader } = require('sawtooth-sdk/protobuf')

// RP Transaction Family imports
const { FAMILY_NAME, FAMILY_NAMESPACE, FAMILY_VERSION } = require("../../rp-txn-family")
const { Payload } = require("../../rp-txn-family/models")

// Royalty Payment Transaction Handler
class RPHandler extends TransactionHandler {
    constructor () {
        console.log('Initializing RP handler')
        super(FAMILY_NAME, [FAMILY_VERSION], [FAMILY_NAMESPACE])
    }

    apply (transaction, context) {
        console.log('Transaction received:')
        console.log(Payload.deserialize(transaction.payload))
        return context.getState([], 2)
    }
}

module.exports = {
    RPHandler
}
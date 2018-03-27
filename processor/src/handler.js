/* In this file, the transaction handler is defined */

// Sawtooth imports
const {TransactionHandler} = require('sawtooth-sdk/processor/handler')
const {InvalidTransaction} = require('sawtooth-sdk/processor/exceptions')
const {TransactionHeader} = require('sawtooth-sdk/protobuf')

// Processor imports
const {State} = require('./state')

// RP Transaction Family imports
const {FAMILY_NAME, FAMILY_NAMESPACE, FAMILY_VERSION} = require("../../rp-txn-family")
const {Payload} = require("../../rp-txn-family/models")

// Royalty Payment Transaction Handler
class RPHandler extends TransactionHandler {
    constructor() {
        console.log('Initializing RP handler')
        super(FAMILY_NAME, [FAMILY_VERSION], [FAMILY_NAMESPACE])
    }

    apply(transaction, context) {
        let state = new State(context)
        let payload = Payload.deserialize(transaction.payload)
        let signer = transaction.header.signerPublicKey

        switch(payload.action) {
            case 'createArtist':
                console.log('creating artist')
                break;
            case 'createSong':
                console.log('creating a song')
                break;
            default:
                throw new InvalidTransaction('Action not handled by this Transaction Handler')
        }

        return context.getState([], 2)
    }
}

module.exports = {
    RPHandler
}
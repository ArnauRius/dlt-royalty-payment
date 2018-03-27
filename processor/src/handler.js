/* In this file, the transaction handler for the Royalty Payment Transaction Family is defined */

// Sawtooth imports
const {TransactionHandler} = require('sawtooth-sdk/processor/handler')
const {InvalidTransaction} = require('sawtooth-sdk/processor/exceptions')

// Processor imports
const {State} = require('./state')

// RP Transaction Family imports
const {FAMILY_NAME, FAMILY_NAMESPACE, FAMILY_VERSION} = require("../../rp-txn-family")
const {Payload} = require("../../rp-txn-family/models")

/**
 * Transaction Handler specific for the Royalty Payment Transaction Family
 * It will receive, handle and process all the transactions sent to this
 * transaction family.
 */
class RPHandler extends TransactionHandler {

    /**
     * Constructor for the RPHandler
     */
    constructor() {
        console.log('Initializing RP handler')
        super(FAMILY_NAME, [FAMILY_VERSION], [FAMILY_NAMESPACE])
    }

    /**
     * Main method for the Transaction Handlers. This method is where all the business logic lives.
     * Every time a transaction is sent to the RPHandler, this method will be called, and the
     * transaction will be handled and processed.
     * @param transaction - Transaction request to be processed
     * @param context - Context provided to access the current real blockchain state
     * @returns {Promise} - Promise to handle blockchain updates success or failure
     */
    apply(transaction, context) {
        let state = new State(context)
        let payload = Payload.deserialize(transaction.payload)
        let signer = transaction.header.signerPublicKey

        switch (payload.action) {
            case 'createArtist':
                console.log('Trying to create artist \'' + signer + '\'')
                return state.createArtist(signer)
                    .then(() => {
                        console.log('Artist \'' + signer + '\' created')
                    })
                    .catch((error) => {
                        console.log(error.message)
                    })
                break;
            case 'createSong':
                console.log('creating a song')
                break;
            default:
                throw new InvalidTransaction('Action not handled by this Transaction Handler')
        }

        return context.getState([], 2) //TODO: Remove
    }
}

module.exports = {
    RPHandler
}
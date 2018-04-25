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
                console.log('Trying to create song \''+ payload.data.id +'\'')
                return state.createSong(payload.data, signer)
                    .then(() => {
                        console.log('Song \'' + payload.data.id + '\' created')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                break;

            case 'updateSong':
                console.log('Trying to update song \''+ payload.data.id + '\'')
                return state.updateSong(payload.data, signer)
                    .then(() => {
                        console.log('Song \'' + payload.data.id + '\' updated')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                break;

            case 'assignSong':
                console.log('Trying to assign song \''+ payload.data +'\' to artist \'' + signer + '\'')
                return state.assignSong(signer, payload.data)
                    .then(() => {
                        console.log('Song \''+ payload.data +'\' assigned to artist \'' + signer + '\'')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                break;

            case 'increaseAmount':
                console.log('Trying to increase the amount for song \'' + payload.data.songId + '\' by: ' + payload.data.amount)
                return state.increaseAmount(payload.data.songId, payload.data.amount)
                    .then(() => {
                        console.log('Amount for song \'' + payload.data.songId + '\' increased by: ' + payload.data.amount)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                break;
            case 'resetArtistAmount':
                console.log('Trying to reset the amount for artist \'' + payload.data.artistPubKey + '\'')
                return state.resetArtistAmount(payload.data.artistPubKey)
                    .then(() => {
                        console.log('Amount for artist \'' + payload.data.artistPubKey + '\' was reseted')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            default:
                throw new InvalidTransaction('Action not handled by this Transaction Handler: ' + payload.action)
        }
    }
}

module.exports = {
    RPHandler
}
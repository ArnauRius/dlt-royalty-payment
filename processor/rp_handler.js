'use strict'

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { FAMILY, NAMESPACE } = require('./rp_state')


const InvalidTransaction = require('sawtooth-sdk/processor/exceptions')
const TransactionHeader = require('sawtooth-sdk/protobuf')

class RPHandler extends TransactionHandler {
    constructor () {
        console.log('Initializing RP handler')
        super(FAMILY, ['1.0'], [NAMESPACE])
    }

    apply (txn, state) {
        console.log("Initialized and calling")
    }

    /*apply (txn, state) {
        // Parse the transaction header and payload
        const header = TransactionHeader.decode(txn.header)
        const player = header.signerPubkey
        const { action, gameName, option } = JSON.parse(txn.payload)

        // Call the appropriate function based on the payload's action
        console.log(`Handling transaction:  ${action} > ${option}`,
            `for game > ${gameName}`,
            player ? `> ${player.slice(0, 8)}... ` : 'NO PLAYER FOUND')


        if (action === 'create') return createGame(state, gameName, player)
        if (action === 'take') return takeGame(state, gameName, player, option)
        if (action === 'delete') return deleteGame(state, gameName, player)

        return Promise.resolve().then(() => {
            throw new InvalidTransaction('Action must be "create", "take" or "delete"')
        })
    }*/
}

module.exports = {
    RPHandler
}
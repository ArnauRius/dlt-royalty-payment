/* This module is responsible of managing and building the necessary parts that Sawtooth
 * requires to be able to send transactions to the blockchain.
 * For more information on how to built a proper transaction and send updates to the blockchain:
 * https://sawtooth.hyperledger.org/docs/core/releases/latest/_autogen/sdk_submit_tutorial_js.html
 */

// Sawtooth imports
import protobuf from "sawtooth-sdk/protobuf";

// RP Transaction Family imports
import { FAMILY_NAME, FAMILY_VERSION } from "../../rp-txn-family/index"

// Other utilities imports
import $ from 'jquery'
import utils from './utils'


const SAWTOOTH_API_URL = '/sawtooth-api'

/**
 * Posts changes to the Sawtooth Blockchain.
 * This changes are sent as transactions, wrapped in batches and grouped in list of batches.
 * @param batchList - List of batches containing the desired transactions
 * @returns {Promise<any>} - Callbacks to manage post's success or failure
 */
const post = (batchList) => {
    return new Promise((resolve, reject) => {
        $.post({
            url: `${SAWTOOTH_API_URL}/batches?wait`,
            data: batchList,
            headers: {'Content-Type': 'application/octet-stream'},
            processData: false,
            success: (data) => {
                resolve(data)
            },
            error: (error) => {
                reject(error)
            }
        })
    })
}

/**
 * Gets the value stored in the blockchain at a given address
 * @param address - Address to fetch the value from the blockchain
 * @returns {Promise<any>} - Callbacks to manage get's success or failure
 */
const get = (address) => {
    return new Promise((resolve, reject) => {
        $.get({
            url: `${SAWTOOTH_API_URL}/state/${address}`,
            success: (data) => {
                resolve(data)
            },
            error: (error) =>{
                reject(error)
            }
        })
    })
}

/**
 * Creates a Sawtooth's transaction header instance
 * @param inputs - List of addresses that are needed to have read access during the transaction
 * @param outputs - List of addresses that are needed to have write access during the transaction
 * @param txSigner - Public key corresponding to whom requests the transaction
 * @param batchSigner - Public key corresponding to whom will put the transaction in a batch and send the batch
 * @param payload - Payload containing changes information
 * @returns {TransactionHeader} - Transaction Header instance
 */
const createTransactionHeader = (inputs, outputs, txSigner, batchSigner, payload) => {
    return protobuf.TransactionHeader.encode({
        familyName: FAMILY_NAME,
        familyVersion: FAMILY_VERSION,
        inputs: inputs,
        outputs: outputs,
        signerPublicKey: txSigner.getPublicKey().asHex(),
        batcherPublicKey: batchSigner.getPublicKey().asHex(),
        payloadSha512:utils.hash(payload)
    }).finish()
}

/**
 * Creates a Sawtooth's transaction instance
 * @param transactionHeader - The previously built transaction header
 * @param signer - Public key corresponding to whom requests the transaction
 * @param payload - Payload containing changes information
 * @returns {Transaction} - Transaction instance
 */
const createTransaction = (transactionHeader, signer, payload) => {
    return protobuf.Transaction.create({
        header: transactionHeader,
        headerSignature: signer.sign(transactionHeader),
        payload: payload
    })
}

/**
 * Builds a full Sawtooth transaction, by creating its header and then the transaction itself using the
 * created header
 * @param inputs - List of addresses that are needed to have read access during the transaction
 * @param outputs - List of addresses that are needed to have write access during the transaction
 * @param txSigner - Public key corresponding to whom requests the transaction
 * @param batchSigner - Public key corresponding to whom will put the transaction in a batch and send the batch
 * @param payload - Payload containing changes information
 * @returns {Transaction} - Transaction instance
 */
const buildTransaction = (inputs, outputs, txSigner, batchSigner, payload) => {
    let payloadInBytes = payload.serialize()
    let transactionHeader = createTransactionHeader(inputs, outputs, txSigner, batchSigner, payloadInBytes)
    return createTransaction(transactionHeader, txSigner, payloadInBytes)
}

/**
 * Creates a Sawtooth's batch header instance
 * @param signer - Public key corresponding to whom will built the batch
 * @param transactions - List of transactions to be grouped in the batch
 * @returns {BatchHeader} - Batch Header instance
 */
const createBatchHeader = (signer, transactions) => {
    return protobuf.BatchHeader.encode({
        signerPublicKey: signer.getPublicKey().asHex(),
        transactionIds: transactions.map((transaction) => transaction.headerSignature)
    }).finish()
}

/**
 * Creates a Sawtooth's batch instance
 * @param batchHeader - The previously built batch header
 * @param signer - Public key corresponding to whom will built the batch
 * @param transactions - List of transactions to be grouped in the batch
 * @returns {Batch} - Batch instance
 */
const createBatch = (batchHeader, signer, transactions) => {
    return protobuf.Batch.create({
        header: batchHeader,
        headerSignature: signer.sign(batchHeader),
        transactions: transactions
    })
}

/**
 * Builds a full Sawtooth batch, by creating its header and then the batch itself using the
 * created header
 * @param signer - Public key corresponding to whom will built the batch
 * @param transactions - List of transactions to be grouped in the batch
 * @returns {Batch} - Batch instance
 */
const buildBatch = (signer, transactions) => {
    let batchHeader = createBatchHeader(signer, transactions)
    return createBatch(batchHeader, signer, transactions)
}

/**
 * Builds a Sawtooth's list of batches
 * @param batchList - List of batches to be grouped in the batch list
 * @returns {BatchList} - Batch List instance
 */
const buildBatchList = (batchList) => {
    return protobuf.BatchList.encode({
        batches: batchList
    }).finish()
}

export default {
    post,
    get,
    buildTransaction,
    buildBatch,
    buildBatchList
}

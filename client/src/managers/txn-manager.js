/* This module is responsible of managing and building the necessary parts that Sawtooth
 * requires to be able to send transactions to the blockchain.
 * For more information on how to built a proper transaction and send updates to the blockchain:
 * https://sawtooth.hyperledger.org/docs/core/releases/latest/_autogen/sdk_submit_tutorial_js.html
 */

// Sawtooth imports
import protobuf from "sawtooth-sdk/protobuf";

// RP Transaction Family imports
import { FAMILY_NAME, FAMILY_VERSION } from "../../../rp-txn-family"

// Other utilities imports
import axios from 'axios'
import $ from 'jquery'
import utils from '../utils'


const SAWTOOTH_API_URL = 'http://localhost:8008'

//TODO: GET REQUEST

/**
 * Posts changes to the Sawtooth Blockchain.
 * This changes are sent as transactions, wrapped in batches and grouped in list of batches.
 * @param batchList - List of batches containing the desired transactions
 * @returns {Promise<any>} - Callbacks to manage post's success or failure
 */
const post = (batchList, callback) => {
  let a = axios.create({
    baseURL: SAWTOOTH_API_URL,
    headers: {'Content-Type': 'application/octet-stream'}
  })

  return a.post(
    '/batches',
    batchList
  )
}

/**
 * Builds the transaction header
 * @param inputs - List of addresses that are needed to have read access during the transaction
 * @param outputs - List of addresses that are needed to have write access during the transaction
 * @param txSigner - Public key corresponding to whom requests the transaction
 * @param batchSigner - Public key corresponding to whom will put the transaction in a batch and send the batch
 * @param payload - Payload containing changes information
 * @returns {TransactionHeader} - Transaction Header instance
 */
const createTransactionHeader = (inputs, outputs, txSigner, batchSigner, payload) => {
  console.log('BUILDING TRANSACTION HEADER')
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
 * Builds the transaction
 * @param transactionHeader - The previously built transaction header
 * @param signer - Public key corresponding to whom requests the transaction
 * @param payload - Payload containing changes information
 * @returns {Transaction} - Transaction instance
 */
const createTransaction = (transactionHeader, signer, payload) => {
  console.log('BUILDING TRANSACTION')
  return protobuf.Transaction.create({
    header: transactionHeader,
    headerSignature: signer.sign(transactionHeader),
    payload: payload
  })
}

/**
 * Builds the batch header
 * @param signer - Public key corresponding to whom will built the batch
 * @param transactions - List of transactions to be grouped in the batch
 * @returns {BatchHeader} - Batch Header instance
 */
const createBatchHeader = (signer, transactions) => {
  console.log('BUILDING BATCH HEADER')
  return protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((transaction) => transaction.headerSignature)
  }).finish()
}

/**
 * Builds the batch
 * @param batchHeader - The previously built batch header
 * @param signer - Public key corresponding to whom will built the batch
 * @param transactions - List of transactions to be grouped in the batch
 * @returns {Batch} - Batch instance
 */
const createBatch = (batchHeader, signer, transactions) => {
  console.log('BUILDING BATCH')
  return protobuf.Batch.create({
    header: batchHeader,
    headerSignature: signer.sign(batchHeader),
    transactions: transactions
  })
}

/**
 * Builds a list of batches
 * @param batchList - List of batches to be grouped in the batch list
 * @returns {BatchList} - Batch List instance
 */
const createBatchList = (batchList) => {
  console.log('BUILDING BATCH LIST')
  return protobuf.BatchList.encode({
    batches: batchList
  }).finish()
}

export default {
  post,
  createTransactionHeader,
  createTransaction,
  createBatchHeader,
  createBatch,
  createBatchList
}

/* Handles the configuration and manages everything related to Sawtooth */

// Sawtooth imports
import { protobuf } from 'sawtooth-sdk'

// RP Transaction Family imports
import { FAMILY_NAME, FAMILY_NAMESPACE, FAMILY_VERSION } from "../../rp-tx-family"

// Other utilities import
import request from 'request'
import utils from '../utils'


const SAWTOOTH_API_URL = 'http://localhost:8008'

const postUpdate = (batchList) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: SAWTOOTH_API_URL + '/batches',
      body: batchList,
      headers: {'Content-Type': 'application/octet-stream'},
    }, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response.body)
      }
    })
  })
}

//TODO: GET REQUEST


/**
 * This update is just used to test Client-Processor connectivity
 */
const testUpdate = () => {
  let inputs = [FAMILY_NAMESPACE]
  let outputs = [FAMILY_NAMESPACE]
  let txSigner = 'signer'
  let batchSigner = txSigner
  let payload = 'HELLO WORLD!' //TODO: SERIALIZE THE PAYLOAD USING MODELS

  let transactionHeader = createTransactionHeader(inputs, outputs, txSigner, batchSigner, payload)
  let transaction = createTransaction(transactionHeader, txSigner, payload)

  let batchHeader = createBatchHeader(batchSigner, [transaction])
  let batch = createBatch(batchHeader, batchSigner, [transaction])

  let batchList = createBatchList([batch])

  return postUpdate(batchList)
}

const createTransactionHeader = (inputs, outputs, txSigner, batchSigner, payload) => {
  return protobuf.TransactionHeader.encode({
      familyName: FAMILY_NAME,
      familyVersion: FAMILY_VERSION,
      inputs: inputs,
      outputs: outputs,
      signerPublicKey: txSigner.getPublicKey.asHex(),
      batcherPublicKey: batchSigner.getPublicKey.asHex(),
      payloadSha512:utils.hash(payload)
    }).finish()
}

const createTransaction = (transactionHeader, signer, payload) => {
  return protobuf.Transaction.create({
    header: transactionHeader,
    headerSignature: signer.sign(transactionHeader),
    payload: payload
  })
}

const createBatchHeader = (signer, transactions) => {
  return protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey.asHex(),
    transactionIds: transactions.map((transaction) => transaction.headerSignature)
  }).finish()
}

const createBatch = (batchHeader, signer, transactions) => {
  return protobuf.Batch.create({
    header: batchHeader,
    headerSignature: signer.sign(batchHeader),
    transactions: transactions
  })
}

const createBatchList = (batchList) => {
  return protobuf.BatchList.encode({
    batches: batchList
  }).finish()
}

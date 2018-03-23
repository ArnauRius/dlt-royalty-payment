
// Sawtooth imports
import {protobuf} from "sawtooth-sdk";

// RP Transaction Family imports
import { FAMILY_NAME, FAMILY_NAMESPACE, FAMILY_VERSION } from "../../rp-txn-family"

// Other utilities import
import request from 'request'
import utils from '../utils'


const SAWTOOTH_API_URL = 'http://localhost:8008'

//TODO: GET REQUEST

const post = (batchList) => {
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

export default {
  post,
  createTransactionHeader,
  createTransaction,
  createBatchHeader,
  createBatch,
  createBatchList
}

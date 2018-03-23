/* Handles the configuration and manages everything related to Sawtooth */

// Sawtooth imports
import { protobuf } from 'sawtooth-sdk'

// Request import
import request from 'request'


const SAWTOOTH_API_URL = 'http://localhost:8008'

const postUpdate = () => {
  return new Promise((resolve, reject) => {
    request.post({
      url: SAWTOOTH_API_URL + '/batches',
      body: 'batchList',
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

const createTransactionHeader = () => {
  return protobuf.TransactionHeader.encode({
      familyName: 'FAMILY NAME',
      familyVersion: 'FAMILY VERSION',
      inputs: ['inputs'],
      outputs: ['outputs'],
      signerPublicKey: 'signer.getPublicKey.asHex()',
      batcherPublicKey: 'signer.getPublicKey.asHex()',
      payloadSha512:'utils.hash(payloadInBytes)'
    }).finish()
}

const createTransaction = () => {
  return protobuf.Transaction.create({
    header: 'transactionHeader',
    headerSignature: 'signer.sign(transactionHeader)',
    payload: 'payloadInBytes'
  })
}

const createBatchHeader = () => {
  return protobuf.BatchHeader.encode({
    signerPublicKey: 'signer.getPublicKey.asHex()',
    transactionIds: 'transactions.map((transaction) => transaction.headerSignature)'
  }).finish()
}

const createBatch = () => {
  return protobuf.Batch.create({
    header: 'batchHeader',
    headerSignature: 'signer.sign(batchHeader)',
    transactions: 'transactions'
  })
}

const createBatchList = () => {
  return protobuf.BatchList.encode({
    batches: '[batches]'
  }).finish()
}

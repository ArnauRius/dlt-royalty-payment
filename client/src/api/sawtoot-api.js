/* In this module is defined the API used to communicate with the Sawtooth blockchain */

// Transaction manager import
import txn from '../managers/txn-manager'

// Royalty Payment Transaction Family Import
import { FAMILY_NAMESPACE } from "../../../rp-txn-family"

/**
 * This update is just used to test Client-Processor connectivity
 */
//TODO: Remove it, used just for client-proc connection testing
const testUpdate = (artist) => {
  let inputs = [FAMILY_NAMESPACE]
  let outputs = [FAMILY_NAMESPACE]
  let txSigner = artist.signer
  let batchSigner = txSigner
  let payload = 'fc2d50d00a8371fad6ca6af531f002edd0fb415b391a01a3f352b647c9a7d9be' //TODO: SERIALIZE THE PAYLOAD USING MODELS

  let transactionHeader = txn.createTransactionHeader(inputs, outputs, txSigner, batchSigner, payload)
  let transaction = txn.createTransaction(transactionHeader, txSigner, payload)

  let batchHeader = txn.createBatchHeader(batchSigner, [transaction])
  let batch = txn.createBatch(batchHeader, batchSigner, [transaction])

  let batchList = txn.createBatchList([batch])

  txn.post(batchList)
    .then((response ) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
}

export default {
  testUpdate
}

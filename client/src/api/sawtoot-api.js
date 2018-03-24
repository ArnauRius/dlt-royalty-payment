/* In this module is defined the API used to communicate with the Sawtooth blockchain */

// Transaction manager import
import txn from '../managers/txn-manager'


/**
 * This update is just used to test Client-Processor connectivity
 */
//TODO: Remove it, used just for client-proc connection testing
const testUpdate = (artist) => {
  let inputs = [FAMILY_NAMESPACE]
  let outputs = [FAMILY_NAMESPACE]
  let txSigner = artist.signer.getPublicKey().asHex()
  let batchSigner = txSigner
  let payload = 'HELLO WORLD!' //TODO: SERIALIZE THE PAYLOAD USING MODELS

  let transactionHeader = txn.createTransactionHeader(inputs, outputs, txSigner, batchSigner, payload)
  let transaction = txn.createTransaction(transactionHeader, txSigner, payload)

  let batchHeader = txn.createBatchHeader(batchSigner, [transaction])
  let batch = txn.createBatch(batchHeader, batchSigner, [transaction])

  let batchList = txn.createBatchList([batch])

  return txn.post(batchList)
}

export default {
  testUpdate
}

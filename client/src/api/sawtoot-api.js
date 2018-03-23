
import txn from '../managers/txn-manager'

/**
 * This update is just used to test Client-Processor connectivity
 */
const testUpdate = () => {
  let inputs = [FAMILY_NAMESPACE]
  let outputs = [FAMILY_NAMESPACE]
  let txSigner = 'signer'
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

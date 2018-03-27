/* In this module is defined the API used to communicate with the Sawtooth blockchain */

// Transaction manager import
import txn from '../managers/txn-manager'

// Royalty Payment Transaction Family Import
import { FAMILY_NAMESPACE } from "../../../rp-txn-family"
import Addresser from "../../../rp-txn-family/addresser"
import { Payload } from "../../../rp-txn-family/models"


/**
 * This update is just used to test Client-Processor connectivity
 */
//TODO: Remove it, used just for client-proc connection testing
const testUpdate = (artist) => {
  let artistAddress = Addresser.getArtistAddress(artist.signer.getPublicKey().asHex())
  let inputs = [artistAddress]
  let outputs = [artistAddress]
  let txSigner = artist.signer
  let batchSigner = txSigner
  let payload = new Payload('createArtist', Math.random()) //TODO: SERIALIZE THE DATA USING MODELS

  let transaction = txn.buildTransaction(inputs, outputs, txSigner, batchSigner, payload)
  let batch = txn.buildBatch(batchSigner, [transaction])
  let batchList = txn.buildBatchList([batch])
  return txn.post(batchList)
}

export default {
  testUpdate
}

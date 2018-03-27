/* In this module is defined the API used to communicate with the Sawtooth blockchain */

// Transaction manager import
import txn from '../managers/txn-manager'

// Royalty Payment Transaction Family Import
import Addresser from "../../../rp-txn-family/addresser"
import { Payload, Song, Royalty } from "../../../rp-txn-family/models"


/**
 * This update is just used to test Client-Processor connectivity
 */
const createArtist = (artistSigner) => {
  let artistAddress = Addresser.getArtistAddress(artistSigner.getPublicKey().asHex())
  let inputs = [artistAddress]
  let outputs = inputs
  let txSigner = artistSigner
  let batchSigner = txSigner
  let payload = new Payload('createArtist', '')

  let transaction = txn.buildTransaction(inputs, outputs, txSigner, batchSigner, payload)
  let batch = txn.buildBatch(batchSigner, [transaction])
  let batchList = txn.buildBatchList([batch])
  return txn.post(batchList)
}

const createSong = (artistSigner, id, name, royalties) => {
  let songAddress = Addresser.getSongAddress(id)
  let inputs = [songAddress]
  let outputs = inputs
  let txSigner = artistSigner
  let batchSigner = txSigner
  let song = new Song(name, 0, '', [new Royalty('a', 9.2)]) // The public key will be setted by the Transaction Proc.
  let payload = new Payload('createSong', {id: id, song: song.serialize()})

  let transaction = txn.buildTransaction(inputs, outputs, txSigner, batchSigner, payload)
  let batch = txn.buildBatch(batchSigner, [transaction])
  let batchList = txn.buildBatchList([batch])
  return txn.post(batchList)
}

export default {
  createArtist,
  createSong
}

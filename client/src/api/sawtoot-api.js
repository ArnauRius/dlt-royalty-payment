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

const createSong = (artistSigner, songId, songName, royalties) => {
  let txSigner = artistSigner
  let batchSigner = txSigner

  let songAddress = Addresser.getSongAddress(songId)
  let songInputs = [songAddress]
  let songOutputs = songInputs
  let song = new Song(songName, 0, '', [new Royalty('a', 9.2)]) // The public key will be setted by the Transaction Proc.
  let songPayload = new Payload('createSong', {id: songId, song: song.serialize()})
  let createSongTransaction = txn.buildTransaction(songInputs, songOutputs, txSigner, batchSigner, songPayload)

  let artistAddress = Addresser.getArtistAddress(artistSigner.getPublicKey().asHex())
  let artistInputs = [artistAddress]
  let artistOutputs = artistInputs
  let artistPayload = new Payload('assignSong', songId)
  let assignSongTransaction = txn.buildTransaction(artistInputs, artistOutputs, txSigner, batchSigner, artistPayload)

  let batch = txn.buildBatch(batchSigner, [createSongTransaction, assignSongTransaction])
  let batchList = txn.buildBatchList([batch])
  return txn.post(batchList)
}

export default {
  createArtist,
  createSong
}

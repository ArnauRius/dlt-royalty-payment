/* In this module is defined the API used to communicate with the Sawtooth blockchain */

// Transaction manager import
import txn from '../managers/txn-manager'

// Royalty Payment Transaction Family Import
import Addresser from "../../../rp-txn-family/addresser"
import { Payload, Song, Royalty } from "../../../rp-txn-family/models"

//TODO: Temporary for listen and download
import {generateSigner} from "../managers/signers-manager";

/**
 * Sends a transaction to the Sawtooth Blockchain to create a new artist
 * @param artistSigner - The public key of the artist to be created
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

/**
 * Sends a transaction to the Sawtooth Blockchain to create a new song
 * @param artistSigner - The public key of the artist that will create a new song
 * @param songId - The song id corresponding to the song to create
 * @param songName - The name corresponding to the song to create
 * @param royalties - A list of the Royalty instances corresponding to the song to create
 */
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

/**
 * Asks the Sawtooth Blockchain to return a certain artist's information
 * @param artistPubKey - The public key identifying the artist to receive
 */
const getArtist = (artistPubKey) => {
  let artistAddress = Addresser.getArtistAddress(artistPubKey)
  return txn.get(artistAddress)
}

/**
 * Asks the Sawtooth Blockchain to return a certain song's information
 * @param songId - The song id identifying the song to receive
 */
const getSong = (songId) => {
  let songAddress = Addresser.getSongAddress(songId)
  return txn.get(songAddress)
}

/**
 * Sends a transaction to the Sawtooth Blockchain to specify that a song has been listened and update
 * its amount generated
 * @param songId - The song id identifying the song that has been listened
 */
const listenToSong = (songId) => {
  let songAddress = Addresser.getSongAddress(songId)
  console.log(songAddress)
  let inputs = [songAddress]
  let outputs = inputs
  let txSigner = generateSigner()
  let batchSigner = txSigner
  let payload = new Payload('increaseAmount', {songId: songId, amount: 1})

  let transaction = txn.buildTransaction(inputs, outputs, txSigner, batchSigner, payload)
  let batch = txn.buildBatch(batchSigner, [transaction])
  let batchList = txn.buildBatchList([batch])
  return txn.post(batchList)
}

/**
 * Sends a transaction to the Sawtooth Blockchain to specify that a song has been downloaded and update
 * its amount generated
 * @param songId - The song id identifying the song that has been downloaded
 */
const downloadSong = (songId) => {
  let songAddress = Addresser.getSongAddress(songId)
  console.log(songAddress)
  let inputs = [songAddress]
  let outputs = inputs
  let txSigner = generateSigner()
  let batchSigner = txSigner
  let payload = new Payload('increaseAmount', {songId: songId, amount: 2})

  let transaction = txn.buildTransaction(inputs, outputs, txSigner, batchSigner, payload)
  let batch = txn.buildBatch(batchSigner, [transaction])
  let batchList = txn.buildBatchList([batch])
  return txn.post(batchList)
}

/**
 * Subscribes to a Blockchain addresses in order to receive a notification when a change happens to one of them.
 * Executes a callback function when a change in one of the provided addresses occurs.
 * IMPORTANT: It will receive a notification every time a change in the blockchain occurs. However, the 'state_changes'
 * field will be an empty list for all the non-subscribed addresses, and a list containing the changes when those occur
 * on subscribed addresses. So we will just execute the provided callback when the 'state_changes' list is not empty.
 * @param addresses - List of addresses to subscribe
 * @param callback - Callback to execute when a change occurs on the subscribed addresses
 */
const subscribeToAddresses = (addresses, callback) => {
  let ws = new WebSocket('ws:localhost:8008/subscriptions')
  ws.onopen = () => {
    ws.send(JSON.stringify({
      'action': 'subscribe',
      'address_prefixes': addresses
    }))
  }

  // It will be triggered everytime a change happens to the Blockchain. However, the "state_changes" field
  // will not be an empty list just in the cases the changes affect to the addresses that we subscribed.
  ws.onmessage = (response) => {
    if(JSON.parse(response.data)['state_changes'].length !== 0) {
      callback()
    }
  }
}

export default {
  createArtist,
  createSong,
  getArtist,
  getSong,
  listenToSong,
  downloadSong,
  subscribeToAddresses
}

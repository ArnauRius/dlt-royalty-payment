/* In this module is defined the API used to communicate with the Sawtooth blockchain */

// Transaction manager import
import txn from './txn-manager'

// Royalty Payment Transaction Family Import
import Addresser from "../../rp-txn-family/addresser"
import {Payload, Song, Royalty} from "../../rp-txn-family/models"

//TODO: Temporary for listen and download
import {generateSigner} from "./temporal-signers-manager";

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
    let song = new Song(songName, 0, '', royalties) // The public key will be setted by the Transaction Proc.
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
 * Updates the song information that can be modifyied, such as its name or its royalty list
 * @param artistSigner - The public key of the artist that will update the song
 * @param songId -  The song id corresponding to the song to update
 * @param newName - The new name for the song
 * @param newRoyalties - The new royalty list for the song
 */
const updateSongInfo  = (artistSigner, songId, newName, newRoyalties) => {
    let txSigner = artistSigner
    let batchSigner = txSigner

    let songAddress = Addresser.getSongAddress(songId)
    let songInputs = [songAddress]
    let songOutputs = songInputs
    let song = new Song(newName, 0, '', newRoyalties) // The public key and amount will not be updated.
    let songPayload = new Payload('updateSong', {id: songId, song: song.serialize()})
    let updateSongTransaction = txn.buildTransaction(songInputs, songOutputs, txSigner, batchSigner, songPayload)

    let batch = txn.buildBatch(batchSigner, [updateSongTransaction])
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
 * Resets the artist's songs earned amount to 0, as it has been already paid
 * @param artistPubKey - The artist which songs' amount needs to be reseted to 0
 * @param songIds - The songs that whose amount is going to be reseted to 0
 * @returns {Promise<any>}
 */
const resetArtistAmount = (artistPubKey, songIds) => {
    let artistAddress = Addresser.getArtistAddress(artistPubKey)
    let inputs = [artistAddress]
    songIds.forEach((songId) => {
        inputs.push(Addresser.getSongAddress(songId))
    })
    let outputs = inputs
    let txSigner = generateSigner()
    let batchSigner = txSigner
    let payload = new Payload('resetArtistAmount', {artistPubKey: artistPubKey})

    let transaction = txn.buildTransaction(inputs, outputs, txSigner, batchSigner, payload)
    let batch = txn.buildBatch(batchSigner, [transaction])
    let batchList = txn.buildBatchList([batch])
    return txn.post(batchList)
}

/**
 * Subscribes to a certain Artist instance in the blockchain and executes a provided callback when
 * a change occurs to it
 * @param artistId - Public key of the artist that is wanted to subscribe to
 * @param callback - Callback to execute when a change occurs to the subscribed artist
 */
const subscribeToArtist = (artist, callback) => {
    let artistAddress = Addresser.getArtistAddress(artist.signer.getPublicKey().asHex())
    //Checks if the provided artist is not already in the subscription list to only add it once
    if (!subscriptions.some(subscription => subscription.address === artistAddress)) {
        subscriptions.push({address: artistAddress, value: null, callback: callback})
        subscribeToAddresses(subscriptions, callback)
    }
}

/**
 * Subscribes to a certain Song instance in the blockchain and executes a provided callback when
 * a change occurs to it
 * @param songId - Song id corresponding to the song that is wanted to subscribe to
 * @param callback - Callback to execute when a change occurs to the subscribed song
 */
const subscribeToSong = (song, callback) => {
    let songAddress = Addresser.getSongAddress(song.id)
    //Checks if the provided song is not already in the subscription list to only add it once
    if (!subscriptions.some(subscription => subscription.address === songAddress)) {
        subscriptions.push({address: songAddress, value: btoa(song.serializedData), callback: callback})
        subscribeToAddresses(subscriptions, callback)
    }
}

/**
 * Subscribing list used to keep track of all instances to be subscribed. Each subscription item
 * is composed by three components:
 *  - address: Instance's address in the blockchain to listen to it
 *  - value: Current local value, to avoid calling the subscription callback when the fired "update" does not change the local value
 *  - callback: Callback to call when a valid update is received
 * @type {Array} - Array containing the subscriptions
 */
const subscriptions = []

/**
 * WebSocket instance to subscribe to Sawtooth Blockchain changes
 * @type {WebSocket}
 */
let ws = new WebSocket('ws:localhost:8008/subscriptions')

/**
 * Subscribes to a list of Sawtooth Blockchain addresses to notify of its changes
 */
const subscribeToAddresses = () => {

    ws.send(JSON.stringify({ //Unsubscribing from old subscriptions if any
        'action': 'unsubscribe'
    }))

    console.log("Subscribing to: " + subscriptions.map((subscription) => subscription.address).toString())

    ws.send(JSON.stringify({
        'action': 'subscribe',
        'address_prefixes': subscriptions.map((subscription) => subscription.address)
    }))

    ws.onmessage = (response) => {
        let state_changes = JSON.parse(response.data)['state_changes']

        //// It will be triggered everytime a change happens to the Blockchain. However, the "state_changes" field
        // will not be an empty list just in the cases the changes affect to the addresses that we subscribed to.
        if (state_changes.length !== 0) {

            //For each Blockchain change received
            state_changes.map((state_change) => {
                //Checks which to which of the subscribed addresses it corresponds to
                let subscriptionIndex = subscriptions.findIndex(subscription => subscription.address === state_change.address)
                if (subscriptionIndex !== -1) {

                    //When a subscription is asked, a "Blockchain change" is received, however, we will just want to
                    //execute the subscription callback when the changed data is different from the local storage one
                    switch (subscriptions[subscriptionIndex].value) {
                        case null: //The local value is 'null', so the 'change' corresponds to the one triggered the first time a subscription is done (not a real change)
                            subscriptions[subscriptionIndex].value = state_change.value
                            break;
                        case state_change.value: //The 'change' value is equal to the local storage one, so it is not a real change
                            break;
                        default: //A real change has been performed. Update the local 'change value' and execute the subscription callback
                            subscriptions[subscriptionIndex].value = state_change.value
                            subscriptions[subscriptionIndex].callback(state_change)
                            break;
                    }
                }
            })
        }
    }
}

export default {
    createArtist,
    createSong,
    updateSongInfo,
    getArtist,
    getSong,
    listenToSong,
    downloadSong,
    resetArtistAmount,
    subscribeToArtist,
    subscribeToSong,
}
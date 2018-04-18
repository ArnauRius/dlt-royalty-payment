/* This file models and processes the blockchain state changes */

// Sawtooth imports
const {InvalidTransaction} = require('sawtooth-sdk/processor/exceptions')

// RP Transaction Family imports
const Addresser = require('../../rp-txn-family/addresser')
const {Artist, Song, Royalty} = require('../../rp-txn-family/models')

class State {

    /**
     * Constructor for the State instance.
     * This instance models the Blockchain state at a given moment provided by a context
     * @param context - Context used by the handler to be able to access the real blockchain state
     * @param timeout - Max timeout to wait for the blockchain updates to occur
     */
    constructor(context, timeout = 500) {
        this.context = context
        this.timeout = timeout
        this.addressCache = new Map([])
    }

    /**
     * Creates a new Artist instance given his public key and saves it to the blockchain.
     * Throws an error if there is an already created artist with the provided public key.
     * @param publicKey - Artist's public key
     */
    createArtist(publicKey) {
        let address = Addresser.getArtistAddress(publicKey)
        return this.getValueFromAddress(address)
            .then(value => {
                if (value) { // If there there is already an artist with this public key
                    throw new InvalidTransaction('Artist \'' + publicKey + '\' already exists.')
                } else {
                    return this.setValueToAddress(address, new Artist([]).serialize())
                }
            })
            .catch((error) => {
                throw new InvalidTransaction(error)
            })
    }

    /**
     * Creates a new song instance and saves it to the blockchain.
     * Throws an error if there is an already created song with the provided id.
     * @param {songId, songData} - Object mapping then song Id and its serialized information
     * @param artistPubKey - Public key corresponding to the song owner
     */
    createSong(data, artistPubKey) {
        let address = Addresser.getSongAddress(data.id)
        return this.getValueFromAddress(address)
            .then(value => {
                if (value) { // If there there is already a song with this song id
                    throw new InvalidTransaction('Song \'' + data.id + '\' already exists.')
                } else {
                    let song = Song.deserialize(data.song)
                    song.pub_key = artistPubKey // Assigns the transaction signer as the song owner
                    return this.setValueToAddress(address, song.serialize())
                }
            })
            .catch((error) => {
                throw new InvalidTransaction(error)
            })
    }

    /**
     * Assigns a song instance to a current saved artist instance
     * @param artistPublicKey - The public key corresponding to the artist
     * @param songId - The song id that is wanted to assign ownership to the artist
     */
    assignSong(artistPublicKey, songId) {
        let address = Addresser.getArtistAddress(artistPublicKey)
        return this.getValueFromAddress(address)
            .then(value => {
                if (!value) {
                    throw new InvalidTransaction('Can not assign any song to non-existent artist \'' + artistPublicKey + '\'.')
                } else {
                    let artist = Artist.deserialize(value)
                    artist.songs.push(songId)
                    return this.setValueToAddress(address, artist.serialize())
                }
            })
            .catch((error) => {
                throw new InvalidTransaction(error)
            })
    }

    /**
     * Increases the amount for a given song
     * @param songId - The id of the song which the amount has to be increased
     * @param amount - The total amount to be increased
     */
    increaseAmount(songId, amount) {
        let address = Addresser.getSongAddress(songId)
        return this.getValueFromAddress(address)
            .then(value => {
                if (!value) {
                    throw new InvalidTransaction('Can update the amount to non-existent song \'' + songId + '\'.')
                } else if (value < 0) {
                    throw new InvalidTransaction('Can increase the amount of \'' + songId + '\' with a negative value ' + value + '.')
                } else {
                    let song = Song.deserialize(value)
                    song.amount += amount
                    return this.setValueToAddress(address, song.serialize())
                }
            })
            .catch((error) => {
                throw new InvalidTransaction(error)
            })
    }

    /**
     * Given an address, returns the value stored at it in the blockchain.
     * In order to avoid asking the real state (through the context) too much, it first
     * checks if the given address has been already cached. If not, then asks to the real state.
     * @param address - Address to look the value for
     * @returns {Promise} - Promise to handle value access success or failure
     */
    getValueFromAddress(address) {
        if (this.addressCache.has(address)) { // The address has been cached to avoid asking the real state
            return Promise.resolve(this.addressCache.get(address))
        } else { // The address has not been cached, ask the real state
            return this.context.getState([address], this.timeout)
                .then((addressesValues) => {
                    var value = null
                    if (addressesValues[address]) { // If there is a valid value stored in the real state
                        value = addressesValues[address].toString()
                    }
                    this.addressCache.set(address, value) // Caches the value for this address
                    return value
                })
                .catch((error) => {
                    return error
                })
        }
    }

    /**
     * Saves a given value to the blockchain, storing it in the given address.
     * It also caches this address-value pair in order to have it available in posterior
     * needs without having to ask the real state.
     * @param address - The address on which the value should be stored
     * @param value - The value to be stored and saved on the blockchain
     * @returns {Promise} - Promise to handle value saving success or failure
     */
    setValueToAddress(address, value) {
        let valueInBytes = Buffer.from(value)
        this.addressCache.set(address, valueInBytes)
        return this.context.setState({[address]: valueInBytes}, this.timeout)
    }
}

module.exports = {
    State
}
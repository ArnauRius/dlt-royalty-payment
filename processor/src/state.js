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
     * @param {id, song} - Object mapping then song Id and its serialized information
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
     * Updates the editable song information of an already existing song instance. That is, updates the
     * song name and its royalty list
     * @param {id, song} - Object mapping then song Id and its serialized updated information
     * @param artistPubKey - Public key corresponding to the one that wants to update the song info (if it is not
     * the song owner, an error will be thrown and no update will be performed)
     */
    updateSong(data, artistPubKey) {
        let address = Addresser.getSongAddress(data.id)
        return this.getValueFromAddress(address)
            .then(value => {
                if (!value) {
                    throw new InvalidTransaction('Song \'' + data.id + '\' does not exist and can not be updated.')
                } else {
                    let currentSong = Song.deserialize(value)
                    if (currentSong.pub_key !== artistPubKey) {
                        throw new InvalidTransaction('\'' + artistPubKey + '\' can not update the song \'' + data.id +
                            '\' as the owner is \'' + song.pub_key + '\'')
                    } else {
                        let updatedSong = Song.deserialize(data.song)
                        currentSong.name = updatedSong.name
                        currentSong.royalties = updatedSong.royalties
                        return this.setValueToAddress(address, currentSong.serialize())
                    }
                }
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
                    throw new InvalidTransaction('Can not update the amount to non-existent song \'' + songId + '\'.')
                } else if (value < 0) {
                    throw new InvalidTransaction('Can not increase the amount of \'' + songId + '\' with a negative value ' + value + '.')
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
     * Given an artist, takes all his songs and updates their generated amount to 0
     * @param artistPubKey - Public key corresponding to the artist to pay
     */
    payArtist(artistPubKey) {
        let artistAddress = Addresser.getArtistAddress(artistPubKey)
        return this.getValueFromAddress(artistAddress)
            .then(artistValue => {
                if (!artistValue) {
                    throw new InvalidTransaction('Can not pay a non-existing artist \'' + artistPubKey + '\'.')
                } else {
                    let artist = Artist.deserialize(artistValue)
                    artist.songs.forEach((songId) => {
                        let songAddress = Addresser.getSongAddress(songId)
                        return this.getValueFromAddress(songAddress)
                            .then(songValue => {
                                if (!songValue) {
                                    throw new InvalidTransaction('Can not pay the artist \'' + artistPubKey + '\' for non-existing song \'' + songId + '\'.')
                                } else {
                                    let song = Song.deserialize(songValue)
                                    song.amount = 0
                                    return this.setValueToAddress(songAddress, song.serialize())
                                }
                            })
                            .catch((error) => {
                                throw new InvalidTransaction(error)
                            })

                    })
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
     * @returns {Promise} - Promise to handle value savingart2@test.com success or failure
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
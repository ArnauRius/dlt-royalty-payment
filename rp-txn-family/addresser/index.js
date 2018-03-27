/* In this file, all the addressing computing is handled */

// Utils and constants imports
const utils = require('../utils')
const {FAMILY_NAMESPACE} = require("../index")
const {Subspace} = require('./subspace')

const ADDRESS_LENGTH = 70 //Specific length that Hex addresses must have

//SUB NAMESPACES
const ARTIST_SUBSPACE = new Subspace(1, 128, 2)
const SONG_SUBSPACE = new Subspace(129, 256, 2)

/**
 * Computes the address for an artist composed by the FAMILY_NAMESPACE + ARTIST_SUBSPACE + Rest of artistId hash
 * @param artistId - The artist public key
 * @returns {string} - The 70 hex chars address corresponding to the artist
 */
const getArtistAddress = (artistId) => {
    const artistHash = utils.hash(artistId)
    const nameSpace = FAMILY_NAMESPACE + ARTIST_SUBSPACE.computeNamespace(artistHash)
    return nameSpace + artistHash.substring(0, ADDRESS_LENGTH - nameSpace.length)
}

/**
 * Computes the address for a song composed by the FAMILY_NAMESPACE + SONG_SUBSPACE + Rest of songId hash
 * @param songId - The song pk
 * @returns {string} - The 70 hex chars address corresponding to the song
 */
const getSongAddress = (songId) => {
    const songHash = utils.hash(songId)
    const nameSpace = FAMILY_NAMESPACE + SONG_SUBSPACE.computeNamespace(songHash)
    return songHash + songHash.substring(0, ADDRESS_LENGTH - nameSpace.length)
}

module.exports = {
    getArtistAddress,
    getSongAddress
}

/* Stores all current artist's songs instances */

import {Song} from '../../../rp-txn-family/models'

export default {

  namespaced: true,

  state: {
    songs: [] // Dictionary containing an object with a song instance (value) for its song id (key)
  },

  getters: {

    /**
     * Returns the songs list
     * @param state
     * @returns {{}|state.songs}
     */
    songs: (state) => state.songs

  },

  mutations: {

    /**
     * Mutation to add a new song to the list
     * If song already exists, overwrites it
     * @param state
     * @param songData - {songId, songInstance}
     * @constructor
     */
    ADD_SONG: (state, songData) => {
      state.songs.push({id: songData.id, data: songData.song})
    },

    CLEAR_SONGS: (state) => {
      state.songs = []
    }
  },

  actions: {
    /**
     * Action to add a new song to the list
     * If song already exists, overwrites it
     * @param context
     * @param songData - {songId, serializedSong}
     */
    ADD_SONG: (context, songData) => {
      context.commit('ADD_SONG', {id: songData.id, song: Song.deserialize(songData.serializedData)})
    },

    CLEAR_SONGS: (context) => {
      context.commit('CLEAR_SONGS')
    }
  }
}


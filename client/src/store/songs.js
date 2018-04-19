/* Stores all current artist's songs instances */

import {Song} from '../../../rp-txn-family/models'
import api from "../api";

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
     * @param state
     * @param songData - {songId, songInstance}
     * @constructor
     */
    ADD_SONG: (state, songData) => {
      state.songs.push({id: songData.id, data: songData.song})
    },

    /**
     * Mutation to update the data of an existing song
     * @param state
     * @param songData - {songId, songInstance}
     * @constructor
     */
    UPDATE_SONG: (state, songData) => {
      let songIndex = state.songs.findIndex(song => song.id === songData.id)
      if (songIndex !== -1) {
        state.songs[songIndex].data = songData.song
      }
    },

    /**
     * Mutation to clear the list of
     * stored songs
     * @param state
     */
    CLEAR_SONGS: (state) => {
      state.songs = []
    }
  },

  actions: {
    /**
     * Action to add a new song to the list
     * If song already exists, overwrites it
     * It also subscribes to any change it may happen to it in the Blockchain
     * in order to be able to update it in real time
     * @param context
     * @param songData - {songId, serializedSong}
     */
    ADD_SONG: (context, songData) => {
      context.commit('ADD_SONG', {id: songData.id, song: Song.deserialize(songData.serializedData)})
      context.dispatch('SUBSCRIBE_TO_UPDATES', {
        song: songData,
        callback: (state_change) => context.dispatch('UPDATE_SONG', {
          id: songData.id,
          serializedData: atob(state_change.value)
        })
      })
    },

    /**
     * Action to update the data of an existing song
     * @param context
     * @param songData - {songId, serializedSong}
     */
    UPDATE_SONG: (context, songData) => {
      console.log("Updating song: " + songData.id)
      context.commit('UPDATE_SONG', {id: songData.id, song: Song.deserialize(songData.serializedData)})
    },

    /**
     * Action to clear the list of
     * stored songs
     * @param context
     */
    CLEAR_SONGS: (context) => {
      context.commit('CLEAR_SONGS')
    },

    /**
     * Action to subscribe to any change in the Blockchain related to the current song
     * @param context
     * @param subscritptionData - {songId, callback}
     */
    SUBSCRIBE_TO_UPDATES: (context, subscritptionData) => {
      api.subscribeToSong(subscritptionData.song, (state_change) => {
        console.log("Song update received '" + state_change.address + "' with changes: " + state_change.value)
        subscritptionData.callback(state_change)
      })
    },

    /**
     * Fetches a song from the Blockchain and stores it.
     * @param context
     * @param songId - The song id corresponding to the song to fetch.
     */
    FETCH_FROM_BLOCKCHAIN: (context, songId) => {
      console.log("Fetching song from blockchain: " + songId)
      api.fetchSongFromBlockchain(songId)
        .then((data) => {
          context.dispatch('ADD_SONG', {id: songId, serializedData: atob(data.data)})
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}


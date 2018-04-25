<template>
  <div>
    <h1>EXPLORE</h1>
    <table class="table table-hover">
      <thead>
      <tr>
        <th>Artist</th>
        <th>Email</th>
        <th>Earnings</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="artist in artists">
        <td>{{artist.name}}</td>
        <td>{{artist.email}}</td>
        <td>{{computeAmount(artist.key)}}</td>
        <td>
          <button class="btn btn-outline-warning mt-1"
                  type="button"
                  @click="">
            Pay
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  // Api import
  import api from '../../api'

  //RP Transaction Family import
  import {Song} from '../../../../rp-txn-family/models'

  export default {

    data() {
      return {
        artists: [],
        songs: {}
      }
    },

    methods: {

      /**
       * Fetches all the artists instances and their user instances from Firebase
       */
      fetchArtists: function () {
        api.getAllArtistsFromFirestore()
          .then((artists) => {
            artists.forEach((artistDoc) => {
              api.getUserFromFirestore(artistDoc.id)
                .then(userDoc => {
                  this.artists.push({
                    email: artistDoc.id,
                    name: userDoc.data().name,
                    key: artistDoc.data().key,
                    songs: artistDoc.data().songs
                  })
                })
            });
          })
      },

      /**
       * Fetches all the songs from firebase and their data stored on the blockchain
       */
      fetchSongs: function () {
        api.getAllSongsFromFirestore()
          .then((songs) => {
            songs.forEach((songDoc) => {
              api.getSongFromBlockchain(songDoc.id)
                .then((encodedSong) => {
                  let song = Song.deserialize(atob(encodedSong.data))
                  if(this.songs[song.pub_key]){
                    this.songs[song.pub_key].push(song)
                  }else{
                    this.songs[song.pub_key] = [song]
                  }
                })
            })
            console.log(this.songs)
          })
      },

      /**
       * Computes the total amount of all the songs of an artist
       * @param artistKey - The public key identifying the artist
       * @returns {number} - The amount of all the songs
       */
      computeAmount: function(artistKey) {
        let amount = 0
        for(let song in this.songs[artistKey]){
          amount += this.songs[artistKey][song].amount
        }
        return amount
      }
    },

    created() {
      this.fetchArtists()
      this.fetchSongs()
    }
  }
</script>

<style>

</style>

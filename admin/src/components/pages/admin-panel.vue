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
                  @click="currentArtistKey = artist.key"
                  data-toggle="modal"
                  data-target="#payArtistModal">
            Pay
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Pay Artist modal -->
    <pay-artist-modal id="payArtistModal"
                      v-bind:currentArtistKey="currentArtistKey"
                      v-bind:artistSongs="songs[currentArtistKey]"
                      v-bind:artistEarnings="earnings[currentArtistKey]">
    </pay-artist-modal>

  </div>
</template>

<script>
  // Api import
  import api from '../../api'

  // Components imports
  import PayArtistModal from '../modals/pay-artist-modal'

  //RP Transaction Family import
  import {Song} from '../../../../rp-txn-family/models'

  export default {

    components: {
      PayArtistModal
    },

    data() {
      return {
        artists: [],
        songs: {},
        earnings: {},
        currentArtistKey: undefined
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
                    this.songs[song.pub_key].push({id: songDoc.id, data: song})
                  }else{
                    this.songs[song.pub_key] = [{id: songDoc.id, data: song}]
                  }
                })
            })
          })
      },

      /**
       * Computes the total amount of all the songs of an artist
       * @param artistKey - The public key identifying the artist
       * @returns {number} - The amount of all the songs
       */
      computeAmount: function(artistKey) {
        let amount = 0
        this.songs[artistKey].forEach((song) => {
          amount += song.data.amount
        })
        this.earnings[artistKey] = amount
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

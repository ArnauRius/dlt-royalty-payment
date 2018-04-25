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
        <td>
            9.99
        </td>
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

  export default {

    data() {
      return {
        artists: [],
        songs: []
      }
    },

    methods: {

      fetchArtists: function(){
        api.getAllArtistsFromFirestore()
          .then((artists) => {
            artists.forEach((artistDoc) => {
              api.getUserFromFirestore(artistDoc.id)
                .then(userDoc => {
                  this.artists.push({email: artistDoc.id,
                    name: userDoc.data().name,
                    key: artistDoc.data().key,
                    songs: artistDoc.data().songs})
                })
            });
          })
      }
    },

    created(){
      this.fetchArtists()
    }
  }
</script>

<style>

</style>

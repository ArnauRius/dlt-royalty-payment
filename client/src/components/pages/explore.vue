<template>
  <div>
    <h1>EXPLORE</h1>
    <table class="table table-hover">
      <thead>
      <tr>
        <th>Song</th>
        <th></th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="song in songs">
        <td>{{song}}</td>
        <td>
          <button class="btn btn-outline-warning mt-1"
                  type="button">
            Listen
          </button>
        </td>
        <td>
          <button class="btn btn-outline-warning mt-1"
                  type="button">
            Download
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
        songs: []
      }
    },

    created(){
      api.getAllSongsFromFirestore()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.songs.push(doc.data().name)
          });
        })
    }
  }

</script>

<style>

</style>

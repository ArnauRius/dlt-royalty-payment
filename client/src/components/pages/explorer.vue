<template>
  <div>
    <h1 class="section">SONGS</h1>
    <table class="table table-hover">
      <tbody>
      <tr v-for="song in songs">
        <td>{{song.name}}</td>
        <td>
          <button class="btn btn-primary mt-1"
                  type="button"
                  @click="listen(song.id)">
            Listen
          </button>
        </td>
        <td>
          <button class="btn btn-dark mt-1"
                  type="button"
                  @click="download(song.id)">
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

    methods: {

      listen(songId){
        api.listenToSong(songId)
      },

      download(songId){
        api.downloadSong(songId)
      }
    },

    created(){
      api.getAllSongsFromFirestore()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.songs.push({id: doc.id, name: doc.data().name})
          });
        })
    }
  }

</script>

<style>
.section{
  display: flex;
  font-weight: 800;
  justify-content: left;
  margin-bottom: 50px;
  text-decoration: underline;
}
</style>

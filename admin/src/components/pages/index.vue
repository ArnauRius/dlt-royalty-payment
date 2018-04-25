<template>
  <div>
    <h1>EXPLORE</h1>
    <table class="table table-hover">
      <thead>
      <tr>
        <th>Song</th>
        <th>Amount</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="song in songs">
        <td>{{song.name}}</td>
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
        songs: []
      }
    },
    components: {
    },
    created(){
      debugger;
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

</style>

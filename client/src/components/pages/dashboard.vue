<template>
  <div>
    <div class="row">
      <div class="col-sm-6"><h4>Dashboard</h4></div>
      <div class="col-sm-6 text-right">
        <button class="btn btn-primary"
                type="button"
                data-toggle="modal"
                data-target="#uploadSongModal">
          Upload Song
        </button>
      </div>
    </div>
    <table class="table table-hover">
      <thead>
      <tr>
        <th>Song</th>
        <th>Revenue</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="song in songs">
        <td>{{song.id}}</td>
        <td>0</td>
        <td>
          <button class="btn btn-outline-warning mt-1"
                  type="button"
                  data-toggle="modal"
                  data-target="#uploadSongModal">
            Edit
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <upload-song-modal id="uploadSongModal"></upload-song-modal>
  </div>
</template>

<script>

  // Vuex imports
  import {mapGetters} from 'vuex'

  // Components imports
  import UploadSongModal from '../modals/upload-song-modal.vue'

  export default {
    components: {
      UploadSongModal
    },

    computed: {

      // Vuex getters
      ...mapGetters({
        'songs': 'artist/songs',
      }),
    }
  }
</script>

<style>

</style>

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
    <!--<div class="row" v-for="song in songs">
        <div class="card col-sm-6 col-md-3">
          <h5 class="card-title">{{ song.name }}</h5>
          <div class="btn btn-primary">Edit</div>

        </div>
    </div>-->
    <upload-song-modal id="uploadSongModal"></upload-song-modal>
  </div>
</template>

<script>

  // Vuex imports
  import {mapGetters} from 'vuex'
  // components
  import UploadSongModal from '../modals/upload-song-modal.vue'

  export default {
    components: {
      UploadSongModal
    },

  }
</script>

<style>

</style>

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

        <button class="btn btn-primary"
                type="button"
                @click="connectToProcessor">
          Connect to Transaction Processor
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

  //TODO: Remove, just for testinc client-proc connectivity

  export default {
    components: {
      UploadSongModal
    },

    methods: {
      connectToProcessor: function () {
        console.log('Connecting to processor')
      }
    }

  }
</script>

<style>

</style>

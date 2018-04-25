<template>
  <div>
    <div class="row">
      <div class="col-sm-6"><h4>Dashboard</h4></div>
      <div class="col-sm-6 text-right">
        <button class="btn btn-primary"
                type="button"
                @click="currentSong = undefined"
                data-toggle="modal"
                data-target="#uploadSongModal">
          Upload Song
        </button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th width="25%">Song</th>
          <th width="25%">Revenue</th>
          <th width="25%"></th>
          <th width="25%"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(song, index) in songs" :key="song.id">
          <td colspan="4">
            <table class="table no-border">
              <thead>
                <tr>
                  <td width="25%">{{song.data.name}}</td>
                  <td width="25%">{{song.data.amount}}</td>
                  <td width="25%">
                    <button class="btn btn-outline-secondary"
                            type="button"
                            @click="showRoyalties(index)">
                      Royalties
                    </button>
                  </td>
                  <td width="25%">
                    <button class="btn btn-outline-warning mt-1"
                            type="button"
                            @click="currentSong = song"
                            data-toggle="modal"
                            data-target="#uploadSongModal">
                      Edit
                    </button>
                  </td>
                </tr>
              </thead>
              <tbody class="table-sm"
                     style="border: 2px solid darkgrey;"
                     v-show="shouldShowRoyalties(index)">
                <tr>
                  <th width="25%">Account</th>
                  <th width="25%">Percentage</th>
                  <th width="25%"></th>
                  <th width="25%"></th>
                </tr>
                <tr v-for="royalty in song.data.royalties" :key="royalty.account">
                  <td width="25%">{{royalty.account}}</td>
                  <td width="25%">{{royalty.percentage}}</td>
                  <td width="25%"></td>
                  <td width="25%"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <upload-song-modal v-bind:currentSong="currentSong" id="uploadSongModal"></upload-song-modal>
  </div>
</template>

<script>

  // Vuex imports
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'

  // Components imports
  import UploadSongModal from '../modals/upload-song-modal.vue'

  export default {

    data() {
      return {
        shownRoyalties: [],
        currentSong: undefined
      }
    },

    components: {
      UploadSongModal
    },

    computed: {

      // Vuex getters
      ...mapGetters({
        'songs': 'songs/songs',
      }),
    },

    methods: {

      // Vuex actions
      ...mapActions({
        'FETCH_SONGS_DATA': 'artist/FETCH_SONGS_DATA',
        'SUBSCRIBE_TO_UPDATES': 'artist/SUBSCRIBE_TO_UPDATES',
      }),

      /**
       * Updates the list containing the indexes of the rows that need to have the royaltie's sub-list shown
       * @param songIndex - Index to add or remove from the list
       */
      showRoyalties: function(songIndex) {
        if(this.shownRoyalties.includes(songIndex)){
          this.shownRoyalties.splice(this.shownRoyalties.indexOf(songIndex), 1)
        }else{
          this.shownRoyalties.push(songIndex)
        }
      },

      /**
       * Returns if the royaltie's sub-list should be shown for a certain song row
       * @param songIndex - Index corresponding to the row
       * @returns {boolean}
       */
      shouldShowRoyalties: function(songIndex){
        return this.shownRoyalties.includes(songIndex)
      }
    },

    created() {
      this.FETCH_SONGS_DATA()
      this.SUBSCRIBE_TO_UPDATES({
        callback: (state_change) => {
          this.FETCH_SONGS_DATA()
        }
      })
    }
  }
</script>

<style scoped>

  .table{
    table-layout: fixed;
  }

  .table.no-border tr td, .table.no-border tr th {
    border-width: 0;
  }

  .table td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

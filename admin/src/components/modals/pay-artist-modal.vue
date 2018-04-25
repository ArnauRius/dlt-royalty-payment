<template>
  <div class="modal fade"
       tabindex="-1"
       role="dialog"
       aria-labelledby="Pay Artist"
       aria-hidden="true"
       @keyup.enter.stop="payArtist">

    <div class="modal-dialog modal-dialog-centered"
         role="document">

      <div class="modal-content">

        <!-- Modal's header -->
        <div class="modal-header">
          <h3>Summary</h3>
          <button type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  ref="closeButton">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <!-- Modal's body -->
        <div class="modal-body">

          <div v-if="isError"
               class="alert alert-danger"
               role="alert">
            {{ errorMessage }}
          </div>

          <div class="card border-secondary mb-3">
            <div class="card-body text-secondary">
              <table class="table table-parent-striped borderless">
                <thead>
                <tr>
                  <th width="25%" style="text-align: center">Song</th>
                  <th width="35%" style="text-align: center">Account</th>
                  <th width="20%" style="text-align: center">%</th>
                  <th width="20%" style="text-align: center">$</th>
                </tr>
                </thead>
                <tbody>
                  <tr v-for="song in artistSongs">
                    <td width="25%">{{song.data.name}}</td>
                    <td  width="75%" colspan="3">
                      <table class="table">
                        <tr v-for="royalty in song.data.royalties">
                          <td width="50%">
                            {{royalty.account}}
                          </td>
                          <td width="25%">
                            {{royalty.percentage}}
                          </td>
                          <td width="25%">
                            {{song.data.amount * royalty.percentage / 100}}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <button type="button"
                  class="btn btn-success pull-right"
                  @click="payArtist">
            Pay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  // Utils import
  import api from '../../api'

  export default {

    props: ['currentArtistKey', 'artistSongs', 'artistEarnings'],

    data() {
      return {
        isError: false,
        errorMessage: 'Some error occurred. Please, try again later.'
      }
    },

    methods: {

      /**
       * Pays an artist giving splitted by the defined royalties
       * @param artistKey
       */
      payArtist: function(){
        api.resetArtistAmount(this.currentArtistKey, this.artistSongs.map(song => song.id))
          .then(()=>{
            this.$refs.closeButton.click()
            location.reload()
          })
          .catch((error) => {
            this.showError(error)
          })
      },

      /**
       * Shows an error in a red alert
       * @param error
       */
      showError: function (error) {
        this.errorMessage = error
        this.isError = true
      }
    },

    mounted() {

      const vueInstance = this

      /**
       * Handles when modal appears
       */
      $(window).on('shown.bs.modal', function (e) {
        console.log(vueInstance.currentArtistKey)
        console.log(vueInstance.artistSongs)
        console.log(vueInstance.artistEarnings)

      })
    }
  }
</script>

<style scoped>

  .table{
    table-layout: fixed
  }

  .table-parent-striped > tbody > tr:nth-child(2n+1) > td,
  .table-parent-striped > tbody > tr:nth-child(2n+1) > th,
  .table-parent-striped > tbody > tr:nth-child(2n+1) > td > *{
    background-color: #F9F9F9;
  }

  .borderless td {
    border: none;
  }

  .table td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>

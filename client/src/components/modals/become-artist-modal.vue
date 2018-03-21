<template>
    <div class="modal fade"
         tabindex="-1"
         role="dialog"
         aria-labelledby="Become Artist"
         aria-hidden="true"
         @keyup.enter="convertToArtist">

      <div class="modal-dialog modal-dialog-centered"
           role="document">

        <div class="modal-content">

          <!-- Modal's header -->
          <div class="modal-header">
            <h3>Become an Artist</h3>
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

            <form class="modal-form">

              <!-- Prv Key input -->
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                      <span class="fa fa-key"></span>
                  </span>
                </div>
                <input type="password"
                       class="form-control"
                       placeholder="Private Key"
                       ref="prvkey">
              </div>

              <!--Become an artist button -->
              <button @click="convertToArtist"
                      type="button"
                      class="btn btn-success pull-right">
                Become an artist
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

  // Vuex imports
  import {mapActions} from 'vuex'

  export default {

    data() {
      return {
        isError: false,
        errorMessage: 'Some error occurred. Please, try again later.'
      }
    },

    methods: {

      // Vuex actions
      ...mapActions({
        'CONVERT_TO_ARTIST': 'user/CONVERT_TO_ARTIST'
      }),

      /**
       * Shows an error in a red alert
       * @param error
       */
      showError: function (error) {
        this.errorMessage = error
        this.isError = true
      },

      /**
       * Creates a new artist instance assigned to the current user
       */
      convertToArtist: function (){
        this.CONVERT_TO_ARTIST(this.$refs.prvkey.value)
          .then(() => {
            this.$refs.closeButton.click()
          })
          .catch((error) => {
            this.showError(error)
          })
      }
    }
  }
</script>

<style scoped>

</style>

<template>
    <div class="modal fade"
         tabindex="-1"
         role="dialog"
         aria-labelledby="Become Artist"
         aria-hidden="true"
         @keyup.enter="signIn">

      <div class="modal-dialog modal-dialog-centered"
           role="document">

        <div class="modal-content">

          <!-- Modal's header -->
          <div class="modal-header">
            <h3>Sign In as an Artist</h3>
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
              <button @click="signIn"
                      type="button"
                      class="btn btn-success pull-right">
                Go to dashboard
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
        'SIGN_IN_ARTIST': 'artist/SIGN_IN_ARTIST'
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
       * Checks if the introduced key is a valid one and if so, redirects the artist
       * to its dashboard
       */
      signIn: function (){
        this.SIGN_IN_ARTIST(this.$refs.prvkey.value)
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
